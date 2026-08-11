import type {
  ScrapedSite,
  ReadabilityResult,
  CognitiveLoadResult,
} from "../types/index.js";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

function countSentences(text: string): number {
  const matches = text.match(/[.!?…]+(\s|$)/g);
  return Math.max(matches ? matches.length : 1, 1);
}

export function gradeFor(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function evaluateReadability(site: ScrapedSite): ReadabilityResult {
  const totalWords = Math.max(site.wordCount, 1);
  const bodyText = site.paragraphs.join(" ");

  const sentences = Math.max(countSentences(bodyText), 1);
  const avgSentenceLength = bodyText.trim() ? totalWords / sentences : 0;

  const headingDensity = (site.headings.length / totalWords) * 100;
  const contentDensity = Math.min(
    totalWords / Math.max(site.textLength, 1) * 1000,
    100
  );
  const navigationComplexity = Math.max(
    site.navigation.reduce((acc, nav) => acc + nav.links, 0),
    site.links.length > 0 ? 1 : 0
  );

  const sentenceScore = clamp(100 - Math.abs(avgSentenceLength - 15) * 4, 0, 100);
  const headingScore = clamp(
    100 - Math.abs(headingDensity - 0.8) * 60,
    0,
    100
  );
  const contentScore = clamp(contentDensity, 0, 100);
  const navScore = clamp(100 - Math.max(navigationComplexity - 8, 0) * 3, 0, 100);

  const score = Math.round(
    sentenceScore * 0.35 +
      headingScore * 0.25 +
      contentScore * 0.25 +
      navScore * 0.15
  );

  return {
    score: clamp(score, 0, 100),
    grade: gradeFor(clamp(score, 0, 100)),
    metrics: {
      avgSentenceLength: Number(avgSentenceLength.toFixed(1)),
      headingDensity: Number(headingDensity.toFixed(2)),
      contentDensity: Number(contentDensity.toFixed(1)),
      navigationComplexity,
    },
  };
}

export function evaluateCognitiveLoad(
  readabilityScore: number,
  clutterScore: number
): CognitiveLoadResult {
  const score = Math.round(
    readabilityScore * 0.5 + (100 - clutterScore) * 0.5
  );
  const level =
    score < 45 ? "low" : score <= 70 ? "medium" : "high";
  return { score: clamp(score, 0, 100), level };
}
