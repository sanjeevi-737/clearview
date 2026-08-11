import type { Types } from "mongoose";

export type AuthPayload = {
  userId: string;
  email: string;
};

export type AuthRequestUser = {
  id: string;
  email: string;
};

export type ScrapedHeading = {
  level: number;
  text: string;
};

export type ScrapedLink = {
  text: string;
  href: string;
};

export type ScrapedNav = {
  label: string;
  links: number;
};

export type ScrapedBlock = {
  tag: string;
  text: string;
};

export type ScrapedSite = {
  url: string;
  screenshot: string | null;
  title: string;
  headings: ScrapedHeading[];
  paragraphs: string[];
  links: ScrapedLink[];
  buttons: string[];
  navigation: ScrapedNav[];
  blocks: ScrapedBlock[];
  wordCount: number;
  textLength: number;
  domDepth: number;
};

export type ReadabilityResult = {
  score: number;
  grade: string;
  metrics: {
    avgSentenceLength: number;
    headingDensity: number;
    contentDensity: number;
    navigationComplexity: number;
  };
};

export type ClutterResult = {
  score: number;
  issues: string[];
};

export type CognitiveLoadResult = {
  score: number;
  level: "low" | "medium" | "high";
};

export type HierarchyNode = {
  id: string;
  label: string;
  children?: HierarchyNode[];
};

export type StructureGraph = {
  tree: HierarchyNode;
  nodes: { id: string; label: string; parent?: string }[];
  edges: { source: string; target: string }[];
};

export type GeminiSummary = {
  text: string;
  keyInsights: string[];
  recommendations: string[];
  simplifiedContent: string;
};

export type AnalysisSummary = {
  text: string;
  keyInsights: string[];
  simplifiedContent: string;
};

export type AnalysisResult = {
  url: string;
  title: string;
  screenshot: string | null;
  summary: AnalysisSummary;
  readabilityScore: number;
  readabilityGrade: string;
  metrics: {
    avgSentenceLength: number;
    headingDensity: number;
    contentDensity: number;
    navigationComplexity: number;
  };
  clutterScore: number;
  clutterIssues: string[];
  hierarchy: StructureGraph;
  cognitiveLoad: CognitiveLoadResult;
  recommendations: string[];
  wordCount: number;
  linkCount: number;
  domDepth: number;
  demo?: boolean;
};

export type Id = Types.ObjectId | string;
