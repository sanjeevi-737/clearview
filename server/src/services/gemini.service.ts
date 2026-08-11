import type { ScrapedSite, GeminiSummary } from "../types/index.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { truncate } from "../utils/sanitize.js";

const MODEL = env.GEMINI_MODEL;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const GEMINI_TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

function buildPrompt(site: ScrapedSite): string {
  const sample = {
    url: site.url,
    title: site.title,
    headings: site.headings.slice(0, 12),
    paragraphs: site.paragraphs.slice(0, 6),
    linkCount: site.links.length,
    buttonCount: site.buttons.length,
    navigation: site.navigation.slice(0, 6),
  };
  return `You are ClearView AI, a website analysis engine. Analyze this scraped website data and respond with STRICT JSON only (no markdown fences, no prose):

${JSON.stringify(sample)}

Guidelines for high-quality recommendations:
- Recognize intentionally minimal websites (e.g., placeholder, documentation, or landing pages) and do NOT recommend unnecessary pages, sections, or features for them.
- Prioritize concrete, specific improvements to accessibility, readability, and content hierarchy.
- Suggest UX improvements only when they are genuinely justified by the data (missing calls-to-action, broken structure, overload, etc.).
- Do not invent content that is not supported by the scraped data.

Return exactly this shape:
{
  "summary": "2-3 sentence plain-language overview of the site: what it is, who it is for, what it asks visitors to do.",
  "keyInsights": ["3-5 short observations about structure, content quality, or UX"],
  "recommendations": ["3-5 actionable, specific improvements"],
  "simplifiedContent": "A concise markdown rewrite of the page content with ads/navigation stripped"
}`;
}

function extractJson(raw: string): Record<string, unknown> {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in Gemini response");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.filter((v): v is string => typeof v === "string").slice(0, 6);
}

async function callGemini(prompt: string): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

    try {
      const res = await fetch(`${ENDPOINT}?key=${env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: controller.signal,
      });

      if (res.ok) {
        const data = (await res.json()) as GeminiResponse;
        const text = data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("");
        if (!text) {
          throw new Error("Gemini returned no content");
        }
        return text;
      }

      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable) {
        throw new Error(`Gemini API responded with ${res.status}`);
      }
      lastError = new Error(`Gemini API responded with ${res.status}`);
    } catch (err) {
      lastError =
        err instanceof Error && err.name === "AbortError"
          ? new Error("Gemini request timed out")
          : err instanceof Error
            ? err
            : new Error(String(err));
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < MAX_ATTEMPTS) {
      const delayMs = 1000 * 2 ** (attempt - 1);
      logger.warn(`Gemini attempt ${attempt} failed — retrying in ${delayMs}ms`, {
        error: lastError.message,
      });
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    throw lastError ?? new Error("Gemini request failed");
  }

  throw lastError ?? new Error("Gemini request failed");
}

function heuristicSummary(site: ScrapedSite): GeminiSummary {
  const topHeadings = site.headings
    .slice(0, 3)
    .map((h) => h.text)
    .join(", ");

  const text =
    `"${site.title || new URL(site.url).hostname}" is a ${site.headings.length}-section website with ` +
    `about ${site.wordCount} words across ${site.paragraphs.length} paragraphs. ` +
    (site.buttons.length > 0
      ? `It features ${site.buttons.length} interactive calls-to-action. `
      : "") +
    (site.links.length > 0
      ? `A total of ${site.links.length} links were detected.`
      : "The page exposes no outbound links.");

  const keyInsights = [
    topHeadings
      ? `Key sections: ${topHeadings}.`
      : "No clear section headings were detected.",
    `Content volume is ${site.wordCount < 200 ? "light" : site.wordCount < 800 ? "moderate" : "heavy"} at ~${site.wordCount} words.`,
    `Navigation complexity is ${site.navigation.reduce((a, n) => a + n.links, 0) > 15 ? "high" : "manageable"} with ${site.navigation.length} menu(s).`,
  ].filter((i): i is string => Boolean(i));

  const recommendations: string[] = [];
  if (site.headings.filter((h) => h.level === 1).length === 0) {
    recommendations.push("Add a single h1 heading to anchor the page structure.");
  }
  if (site.links.length > 80) {
    recommendations.push(`Reduce ${site.links.length} links to a focused set for clarity.`);
  }
  if (site.buttons.length > 8) {
    recommendations.push("Consolidate calls-to-action to avoid competing buttons.");
  }
  recommendations.push(
    site.wordCount < 150
      ? "Expand on-page content to communicate value in depth."
      : "Keep paragraphs short (under 3 sentences) to improve scannability."
  );

  const simplifiedContent =
    `# ${site.title || new URL(site.url).hostname}\n\n` +
    site.headings
      .slice(0, 10)
      .map((h) => `${"#".repeat(Math.min(h.level, 6))} ${h.text}`)
      .join("\n\n") +
    "\n\n" +
    site.paragraphs
      .slice(0, 8)
      .map((p) => `- ${truncate(p, 160)}`)
      .join("\n");

  return {
    text: text.slice(0, 500),
    keyInsights: keyInsights.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    simplifiedContent: simplifiedContent.slice(0, 3000),
  };
}

export async function generateSummary(site: ScrapedSite): Promise<GeminiSummary> {
  if (!env.GEMINI_API_KEY) {
    logger.warn("GEMINI_API_KEY missing — using heuristic summary fallback");
    return heuristicSummary(site);
  }

  try {
    const raw = await callGemini(buildPrompt(site));
    const parsed = extractJson(raw) as Record<string, unknown>;

    const summary = {
      text: truncate(
        typeof parsed.summary === "string" ? parsed.summary : "",
        700
      ),
      keyInsights: asStringArray(parsed.keyInsights, []),
      recommendations: asStringArray(parsed.recommendations, []),
      simplifiedContent: truncate(
        typeof parsed.simplifiedContent === "string"
          ? parsed.simplifiedContent
          : "",
        3000
      ),
    };

    if (!summary.text) {
      throw new Error("Gemini response missing summary text");
    }
    return summary;
  } catch (err) {
    logger.error("Gemini summary failed — using heuristic fallback", {
      error: err instanceof Error ? err.message : String(err),
    });
    return heuristicSummary(site);
  }
}
