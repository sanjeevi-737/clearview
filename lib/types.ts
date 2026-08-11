export type StructureNode = {
  id: string;
  label: string;
  parent?: string;
};

export type StructureEdge = {
  source: string;
  target: string;
};

export type StructureGraph = {
  tree: { id: string; label: string; children?: StructureNode[] };
  nodes: StructureNode[];
  edges: StructureEdge[];
};

export type Analysis = {
  _id: string;
  url: string;
  title: string;
  screenshot: string | null;
  summary: {
    text: string;
    keyInsights: string[];
    simplifiedContent: string;
  };
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
  hierarchy: StructureGraph | null;
  cognitiveLoad: { score: number; level: "low" | "medium" | "high" };
  recommendations: string[];
  wordCount: number;
  linkCount: number;
  domDepth: number;
  demo?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReportSource = "live" | "demo" | "sample";
