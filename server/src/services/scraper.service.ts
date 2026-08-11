import puppeteer, { type Browser, type Page } from "puppeteer";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { existsSync } from "node:fs";
import type {
  ScrapedSite,
  ScrapedHeading,
  ScrapedLink,
  ScrapedNav,
  ScrapedBlock,
} from "../types/index.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeUrl, cleanText, truncate } from "../utils/sanitize.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const NAVIGATION_TIMEOUT_MS = 30_000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

async function launchBrowser(): Promise<Browser> {
  const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  };
  const configuredPath = env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [configuredPath, "/usr/bin/chromium"].filter(
    (p): p is string => typeof p === "string" && existsSync(p)
  );
  if (candidates.length > 0) {
    launchOptions.executablePath = candidates[0];
  }
  try {
    return await puppeteer.launch(launchOptions);
  } catch (err) {
    logger.error("Puppeteer failed to launch", {
      error: err instanceof Error ? err.message : String(err),
    });
    throw new ApiError(
      503,
      "Analysis engine unavailable: browser could not be started. Run `npx puppeteer browsers install chrome` or set PUPPETEER_EXECUTABLE_PATH in .env."
    );
  }
}

async function captureScreenshot(page: Page): Promise<string | null> {
  try {
    const shot = await page.screenshot({
      type: "jpeg",
      quality: 60,
      fullPage: true,
    });
    let base64 = Buffer.from(shot).toString("base64");
    if (base64.length > 4_000_000) {
      const small = await page.screenshot({ type: "jpeg", quality: 50 });
      base64 = Buffer.from(small).toString("base64");
    }
    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    logger.warn("Screenshot capture failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

function computeDomDepth($: cheerio.CheerioAPI, element: AnyNode): number {
  let max = 0;
  for (const child of $(element).children().toArray()) {
    max = Math.max(max, computeDomDepth($, child));
  }
  return max + 1;
}

function parseHtml(html: string, url: string): Omit<ScrapedSite, "screenshot"> {
  const $ = cheerio.load(html);
  const host = new URL(url).hostname;

  const title = truncate(cleanText($("title").first().text()), 200) || host;

  const headings: ScrapedHeading[] = [];
  $("h1,h2,h3,h4,h5,h6").each((_, el) => {
    const text = cleanText($(el).text());
    if (text) {
      headings.push({
        level: Number(($(el).prop("tagName") as string).slice(1)),
        text: text.slice(0, 200),
      });
    }
  });
  headings.splice(60);

  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    const text = cleanText($(el).text());
    if (text) paragraphs.push(text.slice(0, 400));
  });
  paragraphs.splice(30);

  const links: ScrapedLink[] = [];
  const seenHrefs = new Set<string>();
  $("a[href]").each((_, el) => {
    if (links.length >= 300) return false;
    const href = $(el).attr("href");
    if (!href) return;
    const absolute = new URL(href, url).href;
    if (!/^https?:$/.test(new URL(absolute).protocol)) return;
    if (seenHrefs.has(absolute)) return;
    seenHrefs.add(absolute);
    const text = truncate(cleanText($(el).text()), 80) || absolute;
    links.push({ text, href: truncate(absolute, 300) });
  });

  const buttons: string[] = [];
  $("button, input[type='submit'], input[type='button'], [role='button']").each(
    (_, el) => {
      if (buttons.length >= 100) return false;
      const text = truncate(cleanText($(el).text()) || $(el).attr("value") || "", 80);
      if (text) buttons.push(text);
    }
  );

  const navigation: ScrapedNav[] = [];
  $("nav").each((_, el) => {
    if (navigation.length >= 10) return false;
    const label = cleanText(
      $(el).attr("aria-label") ||
        $(el).find("h1,h2,h3,h4,h5,h6").first().text() ||
        "Menu"
    );
    const linksCount = $(el).find("a[href]").length;
    navigation.push({ label: truncate(label, 60), links: linksCount });
  });

  const blocks: ScrapedBlock[] = [];
  $("h2,h3,h4,p,li,blockquote,pre,code").each((_, el) => {
    if (blocks.length >= 300) return false;
    const text = cleanText($(el).text());
    if (text.length < 12) return;
    blocks.push({
      tag: ($(el).prop("tagName") as string).toLowerCase(),
      text: text.slice(0, 300),
    });
  });

  const bodyText = cleanText($("body").text());
  const bodyElement = $("body").get(0);
  const domDepth = bodyElement ? computeDomDepth($, bodyElement) : 1;

  return {
    url,
    title,
    headings,
    paragraphs,
    links,
    buttons,
    navigation,
    blocks,
    wordCount: bodyText.split(/\s+/).filter(Boolean).length,
    textLength: bodyText.length,
    domDepth,
  };
}

export async function scrapeWebsite(rawUrl: string): Promise<ScrapedSite> {
  const url = sanitizeUrl(rawUrl);
  let browser: Browser | null = null;

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(USER_AGENT);

    let response;
    try {
      response = await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: NAVIGATION_TIMEOUT_MS,
      });
    } catch {
      throw new ApiError(422, `Unable to load URL: ${url}`);
    }

    if (!response) {
      throw new ApiError(422, `No response received from ${url}`);
    }
    const status = response.status();
    if (status >= 400) {
      throw new ApiError(422, `URL responded with HTTP ${status}`);
    }

    const screenshot = await captureScreenshot(page);
    const html = await page.content();
    await page.close();

    return { ...parseHtml(html, url), screenshot };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    logger.error("Scrape failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    throw new ApiError(500, "Failed to scrape the website");
  } finally {
    if (browser) {
      await browser.close().catch(() => undefined);
    }
  }
}
