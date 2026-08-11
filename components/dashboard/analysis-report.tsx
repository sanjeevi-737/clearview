"use client";

import * as React from "react";
import {
  Sparkles,
  AlertTriangle,
  Gauge,
  BookOpenText,
  Code2,
  Copy,
  Check,
  Download,
  ExternalLink,
  ArrowLeftRight,
  FileJson2,
} from "lucide-react";
import type { Analysis, ReportSource } from "@/lib/types";
import { downloadPdf } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/dashboard/score-ring";
import AnalysisStructure from "@/components/dashboard/analysis-structure";
import { cn } from "@/lib/utils";

const SOURCE_LABEL: Record<ReportSource, string> = {
  live: "Live analysis",
  demo: "Demo report",
  sample: "Sample data",
};

const SCORE_CONFIG = {
  readability: {
    label: "Readability Score",
    color: "#6366F1",
    hint: "Higher is better",
  },
  clutter: {
    label: "Clutter Score",
    color: "#06B6D4",
    hint: "Lower is better",
  },
  cognitive: {
    label: "Cognitive Load",
    color: "#F59E0B",
    hint: "Lower is better",
  },
} as const;

function readabilitySubtitle(score: number): string {
  const grade =
    score >= 90 ? "Excellent" : score >= 80 ? "Good" : score >= 70 ? "Fair" : "Needs work";
  return `${grade} (${score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F"})`;
}

function clutterSubtitle(score: number): string {
  return score <= 25 ? "Low noise" : score <= 50 ? "Moderate noise" : "Heavy noise";
}

function cognitiveSubtitle(level: string): string {
  return level === "low" ? "Easy to process" : level === "medium" ? "Moderate effort" : "High effort";
}

function SimplifiedContent({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const blocks: React.ReactNode[] = [];
  let key = 0;
  let list: string[] = [];

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`ul-${key++}`} className="mt-2 space-y-1.5">
        {list.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-200">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
            {item}
          </li>
        ))}
      </ul>
    );
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      list.push(listMatch[1]);
      continue;
    }
    flushList();
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = Math.min(heading[1].length, 4);
      const tag = `h${level}` as const;
      blocks.push(
        <React.Fragment key={`h-${key++}`}>
          {React.createElement(
            tag,
            { className: "mt-5 text-white first:mt-0 font-semibold leading-snug " + (level === 1 ? "text-xl" : level === 2 ? "text-lg" : "text-base") },
            heading[2]
          )}
        </React.Fragment>
      );
      continue;
    }
    blocks.push(
      <p key={`p-${key++}`} className="mt-2 text-sm leading-relaxed text-slate-200">
        {line}
      </p>
    );
  }
  flushList();

  return <div className="space-y-0">{blocks}</div>;
}

function MetricGrid({ analysis }: { analysis: Analysis }) {
  const metrics = [
    {
      label: "Avg sentence length",
      value: `${analysis.metrics.avgSentenceLength ?? 0} words`,
    },
    {
      label: "Heading density",
      value: `${analysis.metrics.headingDensity ?? 0}%`,
    },
    {
      label: "Content density",
      value: `${analysis.metrics.contentDensity ?? 0}`,
    },
    {
      label: "Navigation complexity",
      value: `${analysis.metrics.navigationComplexity ?? 0} links`,
    },
    { label: "DOM depth", value: `${analysis.domDepth ?? 0}` },
    { label: "Word count", value: analysis.wordCount?.toLocaleString() ?? "0" },
    { label: "Total links", value: `${analysis.linkCount ?? 0}` },
    { label: "Clutter issues", value: `${analysis.clutterIssues?.length ?? 0}` },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5"
        >
          <p className="text-sm font-semibold tabular-nums text-white">
            {metric.value}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
            {metric.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function PageSkeleton({
  title,
  analysis,
}: {
  title: string;
  analysis: Analysis;
}) {
  const headings = analysis.summary.simplifiedContent
    .split("\n")
    .filter((l) => /^#{2,}\s/.test(l))
    .slice(0, 4)
    .map((l) => l.replace(/^#{2,}\s+/, ""));

  return (
    <div className="space-y-4">
      <div className="h-3 w-1/3 rounded-full bg-white/10" />
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2 w-full rounded-full bg-white/[0.07]" />
        ))}
      </div>
      {headings.length > 0 && (
        <div className="space-y-2 pt-1">
          {headings.map((h, i) => (
            <div key={i} className="h-3 w-2/3 rounded-full bg-white/10" style={{ width: `${88 - i * 12}%` }} />
          ))}
        </div>
      )}
      <p className="pt-1 text-[11px] text-slate-500">
        {title} · {analysis.wordCount?.toLocaleString() ?? 0} words ·{" "}
        {analysis.linkCount ?? 0} links
      </p>
    </div>
  );
}

export default function AnalysisReport({
  analysis,
  source,
  token,
}: {
  analysis: Analysis;
  source: ReportSource;
  token: string | null;
}) {
  const [copied, setCopied] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const canExportPdf = Boolean(token) && source !== "sample";

  const handleExport = async () => {
    if (!token || source === "sample") return;
    setExporting(true);
    setExportError(null);
    try {
      await downloadPdf(token, analysis._id);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const cognitive = analysis.cognitiveLoad ?? { score: 0, level: "medium" };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070B1D]/70 shadow-card-lg backdrop-blur-2xl">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3 sm:px-5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/30 px-3 py-1.5 text-xs text-slate-400">
          <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
          <span className="max-w-[180px] truncate sm:max-w-[320px]">
            {analysis.url}
          </span>
        </div>
        <Badge
          variant={source === "live" ? "success" : source === "demo" ? "default" : "outline"}
          className="ml-auto"
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              source === "sample" ? "bg-slate-400" : "bg-emerald-400"
            )}
          />
          {SOURCE_LABEL[source]}
        </Badge>
        <button
          type="button"
          onClick={handleExport}
          disabled={!canExportPdf || exporting}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          title={canExportPdf ? "Download PDF report" : "Available after a live analysis"}
        >
          <Download className="h-3.5 w-3.5" />
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>

      {exportError && (
        <div className="border-b border-red-400/20 bg-red-400/10 px-5 py-2.5 text-sm text-red-300">
          {exportError}
        </div>
      )}

      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-white">{analysis.title || "Untitled page"}</h2>
          <p className="text-sm text-slate-400">Report for {analysis.url}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <ScoreRing
              value={analysis.readabilityScore ?? 0}
              label={SCORE_CONFIG.readability.label}
              color={SCORE_CONFIG.readability.color}
              subtitle={readabilitySubtitle(analysis.readabilityScore ?? 0)}
              hint={SCORE_CONFIG.readability.hint}
            />
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <ScoreRing
              value={analysis.clutterScore ?? 0}
              label={SCORE_CONFIG.clutter.label}
              color={SCORE_CONFIG.clutter.color}
              subtitle={clutterSubtitle(analysis.clutterScore ?? 0)}
              hint={SCORE_CONFIG.clutter.hint}
            />
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <ScoreRing
              value={cognitive.score}
              label={SCORE_CONFIG.cognitive.label}
              color={SCORE_CONFIG.cognitive.color}
              subtitle={cognitiveSubtitle(cognitive.level)}
              hint={SCORE_CONFIG.cognitive.hint}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-medium uppercase tracking-widest">
                AI Summary
              </span>
              <Badge variant="default" className="ml-auto">
                {analysis.summary.keyInsights?.length ?? 0} insights
              </Badge>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
              {analysis.summary.text || "No summary generated for this page."}
            </p>
            <div className="mt-4 space-y-2">
              {analysis.summary.keyInsights?.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-indigo-400/30 bg-indigo-400/10 text-[11px] font-semibold tabular-nums text-indigo-300">
                    {i + 1}
                  </span>
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
            <div className="flex items-center gap-2 text-slate-300">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Recommendations
              </span>
              <Badge variant="destructive" className="ml-auto">
                {analysis.recommendations?.length ?? 0}
              </Badge>
            </div>
            <ul className="mt-3 flex-1 space-y-2.5">
              {analysis.recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-amber-400/30 bg-amber-400/10 text-[11px] font-semibold tabular-nums text-amber-300">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-slate-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {analysis.clutterIssues?.length > 0 && (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 text-slate-300">
              <AlertTriangle className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Clutter Issues
              </span>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {analysis.clutterIssues.map((issue, i) => (
                <li
                  key={i}
                  className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
                >
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between px-1 pb-2 pt-1">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Gauge className="h-4 w-4 text-violet-400" />
              Structure Map
            </span>
            <span className="text-[11px] text-slate-500">drag · zoom · click nodes</span>
          </div>
          <AnalysisStructure structure={analysis.hierarchy} />
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="flex items-center gap-2 px-1 pb-3 pt-1 text-slate-300">
            <ArrowLeftRight className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium uppercase tracking-widest">
              Current vs Simplified
            </span>
            <Badge variant="accent" className="ml-auto">
              Reader mode
            </Badge>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col rounded-xl border border-white/[0.07] bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Current website
              </p>
              <div className="mt-3 flex-1">
                {analysis.screenshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={analysis.screenshot}
                    alt={`Screenshot of ${analysis.url}`}
                    className="w-full rounded-lg border border-white/10"
                  />
                ) : (
                  <PageSkeleton title={analysis.title} analysis={analysis} />
                )}
              </div>
            </div>
            <div className="flex flex-col rounded-xl border border-white/[0.07] bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-widest text-emerald-400">
                Simplified view
              </p>
              <div className="mt-3 flex-1 overflow-y-auto rounded-lg bg-[#0A0F24]/60 p-4">
                {analysis.summary.simplifiedContent ? (
                  <SimplifiedContent markdown={analysis.summary.simplifiedContent} />
                ) : (
                  <p className="text-sm text-slate-400">
                    No simplified content generated for this page.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 text-slate-300">
              <BookOpenText className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Clean Read Verdict
              </span>
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
              {analysis.summary.text || "No verdict available."}
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Generated from {analysis.wordCount?.toLocaleString() ?? 0} words across{" "}
              {analysis.domDepth ?? 0} DOM levels.
            </p>
          </div>

          <div className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 text-slate-300">
              <Code2 className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Developer Insights
              </span>
              <button
                type="button"
                onClick={copyJson}
                className="ml-auto flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-xs text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>
            <div className="mt-3">
              <MetricGrid analysis={analysis} />
            </div>
            <pre className="mt-3 flex-1 overflow-x-auto rounded-lg border border-white/[0.06] bg-black/30 p-3 text-[11px] leading-relaxed text-slate-400">
              <code className="flex items-center gap-1.5 font-mono">
                <FileJson2 className="h-3 w-3 text-slate-500" />
                {JSON.stringify(
                  {
                    readability: {
                      score: analysis.readabilityScore,
                      grade: analysis.readabilityGrade,
                    },
                    clutter: {
                      score: analysis.clutterScore,
                      issues: analysis.clutterIssues?.length ?? 0,
                    },
                    cognitiveLoad: analysis.cognitiveLoad,
                    structure: analysis.hierarchy
                      ? {
                          nodes: analysis.hierarchy.nodes.length,
                          edges: analysis.hierarchy.edges.length,
                        }
                      : null,
                  },
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
