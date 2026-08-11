import {
  Schema,
  model,
  type HydratedDocument,
  type Types,
} from "mongoose";
import type {
  CognitiveLoadResult,
  StructureGraph,
} from "../types/index.js";

const summarySchema = new Schema(
  {
    text: { type: String, default: "" },
    keyInsights: { type: [String], default: [] },
    simplifiedContent: { type: String, default: "" },
  },
  { _id: false }
);

const cognitiveLoadSchema = new Schema(
  {
    score: { type: Number, default: 0 },
    level: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { _id: false }
);

const metricsSchema = new Schema(
  {
    avgSentenceLength: { type: Number, default: 0 },
    headingDensity: { type: Number, default: 0 },
    contentDensity: { type: Number, default: 0 },
    navigationComplexity: { type: Number, default: 0 },
  },
  { _id: false }
);

export interface AnalysisDoc {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  url: string;
  title: string;
  screenshot: string | null;
  summary: { text: string; keyInsights: string[]; simplifiedContent: string };
  readabilityScore: number;
  readabilityGrade: string;
  clutterScore: number;
  clutterIssues: string[];
  hierarchy: StructureGraph | null;
  cognitiveLoad: CognitiveLoadResult;
  recommendations: string[];
  metrics: {
    avgSentenceLength: number;
    headingDensity: number;
    contentDensity: number;
    navigationComplexity: number;
  };
  wordCount: number;
  linkCount: number;
  domDepth: number;
  demo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<AnalysisDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    url: { type: String, required: true, trim: true },
    title: { type: String, default: "" },
    screenshot: { type: String, default: null },
    summary: { type: summarySchema, default: () => ({}) },
    readabilityScore: { type: Number, default: 0 },
    readabilityGrade: { type: String, default: "F" },
    clutterScore: { type: Number, default: 0 },
    clutterIssues: { type: [String], default: [] },
    hierarchy: { type: Schema.Types.Mixed, default: null },
    cognitiveLoad: {
      type: cognitiveLoadSchema,
      default: () => ({ score: 0, level: "medium" }),
    },
    recommendations: { type: [String], default: [] },
    metrics: { type: metricsSchema, default: () => ({}) },
    wordCount: { type: Number, default: 0 },
    linkCount: { type: Number, default: 0 },
    domDepth: { type: Number, default: 0 },
    demo: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type AnalysisDocument = HydratedDocument<AnalysisDoc>;
export type AnalysisLean = AnalysisDoc;
export type HistoryAnalysis = Omit<AnalysisLean, "screenshot">;

export const Analysis = model("Analysis", analysisSchema);
