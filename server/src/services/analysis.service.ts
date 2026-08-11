import { scrapeWebsite } from "./scraper.service.js";
import { evaluateReadability, evaluateCognitiveLoad } from "./readability.service.js";
import { evaluateClutter } from "./clutter.service.js";
import { buildStructure } from "./structure.service.js";
import { generateSummary } from "./gemini.service.js";
import { analysisRepository } from "../repositories/analysis.repository.js";
import { cacheService } from "./cache.service.js";
import { assertPublicHttpUrl } from "../utils/sanitize.js";
import type { AnalysisResult, ScrapedSite, StructureGraph } from "../types/index.js";

function toResult(
  url: string,
  site: ScrapedSite,
  readability: ReturnType<typeof evaluateReadability>,
  clutter: ReturnType<typeof evaluateClutter>,
  structure: ReturnType<typeof buildStructure>,
  summary: Awaited<ReturnType<typeof generateSummary>>,
  demo: boolean
): AnalysisResult {
  return {
    url,
    title: site.title,
    screenshot: site.screenshot,
    summary: {
      text: summary.text,
      keyInsights: summary.keyInsights,
      simplifiedContent: summary.simplifiedContent,
    },
    readabilityScore: readability.score,
    readabilityGrade: readability.grade,
    metrics: readability.metrics,
    clutterScore: clutter.score,
    clutterIssues: clutter.issues,
    hierarchy: structure,
    cognitiveLoad: evaluateCognitiveLoad(readability.score, clutter.score),
    recommendations: summary.recommendations,
    wordCount: site.wordCount,
    linkCount: site.links.length,
    domDepth: site.domDepth,
    demo,
  };
}

export type AnalyzeOptions = {
  demo?: boolean;
  skipCache?: boolean;
};

export type ApiAnalysis = Omit<AnalysisResult, "hierarchy"> & {
  hierarchy: StructureGraph | null;
  _id: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export type AnalyzeOutcome = {
  analysis: ApiAnalysis;
  fromCache: boolean;
};

export const analysisService = {
  async analyze(
    userId: string,
    rawUrl: string,
    options: AnalyzeOptions = {}
  ): Promise<AnalyzeOutcome> {
    const url = await assertPublicHttpUrl(rawUrl);

    if (!options.skipCache) {
      const cached = cacheService.getCachedAnalysis<ApiAnalysis>(userId, url);
      if (cached) {
        return { analysis: cached, fromCache: true };
      }
      const recent = await analysisRepository.findRecentByUrl(userId, url);
      if (recent) {
        cacheService.setCachedAnalysis(userId, url, recent);
        return { analysis: recent, fromCache: true };
      }
    }

    const site = await scrapeWebsite(url);

    const [readability, clutter, structure, summary] = await Promise.all([
      evaluateReadability(site),
      evaluateClutter(site),
      buildStructure(site),
      generateSummary(site),
    ]);

    const result = toResult(
      url,
      site,
      readability,
      clutter,
      structure,
      summary,
      Boolean(options.demo)
    );
    const created = await analysisRepository.create(userId, result);
    const api: ApiAnalysis = {
      ...result,
      hierarchy: created.hierarchy,
      _id: created._id,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
    cacheService.setCachedAnalysis(userId, url, api);
    return { analysis: api, fromCache: false };
  },

  async ensureDemoReport(userId: string, url: string): Promise<AnalyzeOutcome> {
    const normalized = url.trim().toLowerCase();
    const existing = await analysisRepository.findRecentByUrl(userId, normalized);
    if (existing) {
      if (!existing.demo) {
        await analysisRepository.markAsDemo(String(existing._id));
        existing.demo = true;
      }
      return { analysis: existing, fromCache: true };
    }
    return this.analyze(userId, normalized, { demo: true, skipCache: true });
  },

  async history(userId: string, page: number, limit: number) {
    return analysisRepository.findByUserPaginated(userId, page, limit);
  },

  async getById(userId: string, analysisId: string) {
    const analysis = await analysisRepository.findOwnedById(analysisId, userId);
    if (!analysis) {
      return null;
    }
    return analysis;
  },

  async remove(userId: string, analysisId: string) {
    const deleted = await analysisRepository.deleteOwnedById(analysisId, userId);
    return deleted;
  },
};
