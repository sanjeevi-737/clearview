import type { Analysis, StructureGraph } from "./types";

const hierarchy: StructureGraph = {
  tree: {
    id: "root",
    label: "acme.io",
    children: [
      { id: "nav", label: "Navigation" },
      { id: "hero", label: "Hero" },
      { id: "features", label: "Features" },
      { id: "pricing", label: "Pricing" },
      { id: "blog", label: "Blog" },
      { id: "about", label: "About" },
      { id: "contact", label: "Contact" },
    ],
  },
  nodes: [
    { id: "root", label: "acme.io" },
    { id: "nav", label: "Navigation", parent: "root" },
    { id: "hero", label: "Hero", parent: "root" },
    { id: "features", label: "Features", parent: "root" },
    { id: "pricing", label: "Pricing", parent: "nav" },
    { id: "blog", label: "Blog", parent: "root" },
    { id: "about", label: "About", parent: "blog" },
    { id: "contact", label: "Contact", parent: "nav" },
  ],
  edges: [
    { source: "root", target: "nav" },
    { source: "root", target: "hero" },
    { source: "root", target: "features" },
    { source: "root", target: "blog" },
    { source: "nav", target: "pricing" },
    { source: "nav", target: "contact" },
    { source: "blog", target: "about" },
  ],
};

export const SAMPLE_ANALYSIS: Analysis = {
  _id: "sample-acme-io",
  url: "https://acme.io",
  title: "Acme — Focused Marketing Site",
  screenshot: null,
  summary: {
    text: "Acme is a focused marketing site with a clear value proposition and a predictable 8-page navigation. The hero CTA converts well and content is scannable. The main friction is discovery: pricing sits two clicks deep in the nav, and the hero carousel adds motion without measurable value.",
    keyInsights: [
      "Clear value proposition in the first screen.",
      "Predictable 8-page navigation keeps orientation low.",
      "Pricing is reachable but not surfaced in the primary nav.",
      "Hero carousel cycles 4 slides with minimal interaction.",
      "Blog content ranks well but lacks internal links back to product pages.",
    ],
    simplifiedContent:
      "# Acme\n\nShip boring tools that make teams faster.\n\n## Why Acme\n\nAcme replaces five scattered tools with one opinionated workspace: docs, tasks, and handoffs in a single place.\n\n## Features\n\n- Shared docs with a built-in review loop\n- Tasks that sync with your calendar\n- One-click handoffs between teams\n\n## Pricing\n\n- Starter: free for 5 seats\n- Pro: $12 per seat/month\n- Scale: contact sales\n\n## About\n\nFounded in 2021 by a team of three who were tired of context switching.",
  },
  readabilityScore: 92,
  readabilityGrade: "A",
  metrics: {
    avgSentenceLength: 14.2,
    headingDensity: 0.9,
    contentDensity: 61.4,
    navigationComplexity: 8,
  },
  clutterScore: 24,
  clutterIssues: [
    "14 third-party tracking scripts detected (6 would be enough).",
    "Hero carousel rotates content without user interaction.",
    "Two sticky banners compete for attention above the fold.",
  ],
  hierarchy,
  cognitiveLoad: { score: 84, level: "high" },
  recommendations: [
    "Move the pricing link into the primary navigation to cut two clicks of discovery friction.",
    "Replace the auto-rotating hero carousel with a single static headline.",
    "Consolidate tracking scripts from 14 to 6 to reduce layout shift and privacy surface.",
    "Shorten average sentence length from 14 to 11 words for better skimming.",
  ],
  wordCount: 1284,
  linkCount: 14,
  domDepth: 6,
  demo: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
