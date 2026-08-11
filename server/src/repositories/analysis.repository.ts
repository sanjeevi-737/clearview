import { Types } from "mongoose";
import {
  Analysis,
  type AnalysisLean,
  type HistoryAnalysis,
} from "../models/analysis.model.js";
import type { AnalysisResult } from "../types/index.js";

export const analysisRepository = {
  async create(
    userId: string,
    result: AnalysisResult
  ): Promise<AnalysisLean> {
    const doc = await Analysis.create({
      userId: new Types.ObjectId(userId),
      url: result.url,
      title: result.title,
      screenshot: result.screenshot,
      summary: result.summary,
      readabilityScore: result.readabilityScore,
      readabilityGrade: result.readabilityGrade,
      clutterScore: result.clutterScore,
      clutterIssues: result.clutterIssues,
      hierarchy: result.hierarchy,
      cognitiveLoad: result.cognitiveLoad,
      recommendations: result.recommendations,
      metrics: result.metrics,
      wordCount: result.wordCount,
      linkCount: result.linkCount,
      domDepth: result.domDepth,
      demo: result.demo,
    });
    return doc.toObject();
  },

  async findRecentByUrl(
    userId: string,
    url: string
  ): Promise<AnalysisLean | null> {
    const doc = await Analysis.findOne({
      userId: new Types.ObjectId(userId),
      url: url.toLowerCase(),
    }).sort({ createdAt: -1 });
    return doc ? doc.toObject() : null;
  },

  async markAsDemo(id: string): Promise<void> {
    await Analysis.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { demo: true } }
    );
  },

  async findDemoReport(): Promise<AnalysisLean | null> {
    const doc = await Analysis.findOne({ demo: true }).sort({
      createdAt: -1,
    });
    return doc ? doc.toObject() : null;
  },

  async findOwnedById(
    id: string,
    userId: string
  ): Promise<AnalysisLean | null> {
    const doc = await Analysis.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    return doc ? doc.toObject() : null;
  },

  async findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ items: HistoryAnalysis[]; total: number }> {
    const filter = { userId: new Types.ObjectId(userId) };
    const [items, total] = await Promise.all([
      Analysis.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-screenshot")
        .lean<HistoryAnalysis[]>(),
      Analysis.countDocuments(filter),
    ]);
    return { items, total };
  },

  async deleteOwnedById(id: string, userId: string): Promise<boolean> {
    const res = await Analysis.deleteOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    return res.deletedCount === 1;
  },
};
