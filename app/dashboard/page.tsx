"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Sparkles,
  Loader2,
  ArrowLeft,
  LogOut,
  Zap,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoginForm from "@/components/dashboard/login-form";
import AnalysisReport from "@/components/dashboard/analysis-report";
import AnalysisSkeleton from "@/components/dashboard/analysis-skeleton";
import { apiAnalyze, apiDemo } from "@/lib/api";
import { SAMPLE_ANALYSIS } from "@/lib/sample-analysis";
import type { Analysis, ReportSource } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = [
  "Connecting to website",
  "Scraping page content",
  "Building structure map",
  "Scoring readability & clutter",
  "Generating AI summary",
  "Finalizing report",
];

const TOKEN_KEY = "clearview_token";
const EMAIL_KEY = "clearview_email";

export default function DashboardPage() {
  const [token, setToken] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  const [url, setUrl] = React.useState("https://example.com");
  const [status, setStatus] = React.useState<
    "login" | "idle" | "running" | "done" | "failed"
  >("login");
  const [analysis, setAnalysis] = React.useState<Analysis | null>(null);
  const [source, setSource] = React.useState<ReportSource>("live");
  const [notice, setNotice] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [loadingDemo, setLoadingDemo] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      setEmail(window.localStorage.getItem(EMAIL_KEY));
      setStatus("idle");
    }
  }, []);

  React.useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 0.9 + Math.random() * 1.1, 96));
    }, 120);
    return () => clearInterval(id);
  }, [status]);

  const handleAuthed = (newToken: string, authedEmail: string) => {
    window.localStorage.setItem(TOKEN_KEY, newToken);
    window.localStorage.setItem(EMAIL_KEY, authedEmail);
    setToken(newToken);
    setEmail(authedEmail);
    setStatus("idle");
  };

  const handleLogout = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setEmail(null);
    setAnalysis(null);
    setSource("live");
    setNotice(null);
    setStatus("login");
  };

  const applyAnalysis = (result: Analysis, src: ReportSource) => {
    setAnalysis(result);
    setSource(src);
    setProgress(100);
    setStatus("done");
  };

  const runAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || status === "running") return;
    setProgress(0);
    setStatus("running");
    setAnalysis(null);
    setNotice(null);
    try {
      const result = await apiAnalyze(token, url.trim());
      applyAnalysis(result, "live");
    } catch (err) {
      try {
        const fallback = await apiDemo();
        setNotice(
          `Live analysis failed (${err instanceof Error ? err.message : "error"}) — showing the seeded demo report instead.`
        );
        applyAnalysis(fallback, "demo");
      } catch {
        setNotice(
          "Live analysis is unavailable right now. Showing bundled sample data instead."
        );
        applyAnalysis(SAMPLE_ANALYSIS, "sample");
      }
    }
  };

  const loadDemo = async () => {
    if (loadingDemo) return;
    setLoadingDemo(true);
    setStatus("running");
    setAnalysis(null);
    setNotice(null);
    try {
      const fallback = await apiDemo();
      setNotice(null);
      applyAnalysis(fallback, "demo");
    } catch {
      setNotice("No demo report on the server yet — showing bundled sample data.");
      applyAnalysis(SAMPLE_ANALYSIS, "sample");
    } finally {
      setLoadingDemo(false);
    }
  };

  const stepIndex = Math.min(
    Math.floor(progress / (100 / STEPS.length)),
    STEPS.length - 1
  );

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute right-[-10%] top-[10%] h-[380px] w-[380px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="bg-grid absolute inset-0 mask-fade-y opacity-50" />
      </div>

      <header className="relative z-10 border-b border-white/[0.06] bg-[#050816]/70 backdrop-blur-xl">
        <div className="section-shell flex h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Back to ClearView AI home">
            <Logo />
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-tight text-white">
                ClearView
              </span>
              <span className="text-[10px] font-medium tracking-[0.22em] text-indigo-400">
                AI
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
            {token ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="hidden sm:flex">
                  {email ?? "Signed in"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 text-slate-300"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </Button>
              </div>
            ) : (
              <Link
                href="/"
                className="rounded-lg px-3.5 py-2 text-sm text-slate-300 transition-colors hover:text-white"
              >
                Back to site
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="section-shell relative z-10 mt-10">
        {!token ? (
          <LoginForm onAuthed={handleAuthed} />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Analyze any website in{" "}
                <span className="text-gradient">seconds</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                Paste a URL to get readability, clutter, cognitive load, structure
                map, AI summary, and a clean reading view — all in one report.
              </p>
            </div>

            <form
              onSubmit={runAnalyze}
              className="mx-auto max-w-2xl overflow-hidden rounded-2xl border p-1.5 backdrop-blur-xl transition-colors"
              style={
                status === "running"
                  ? {
                      borderColor: "rgba(99,102,241,0.5)",
                      boxShadow: "0 0 40px rgba(99,102,241,0.25)",
                    }
                  : { borderColor: "rgba(255,255,255,0.1)" }
              }
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <Globe className="h-4 w-4 shrink-0 text-slate-500" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://any-website.com"
                    aria-label="Website URL to analyze"
                    className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    disabled={status === "running"}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "running"}
                  className="h-11 shrink-0 gap-2 px-6"
                >
                  {status === "running" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Website
                    </>
                  )}
                </Button>
              </div>
              {status === "running" && (
                <div className="px-1 pb-2 pt-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                      {STEPS[stepIndex]}
                    </span>
                    <span className="font-mono text-indigo-300">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut", duration: 0.2 }}
                    />
                  </div>
                </div>
              )}
            </form>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="glass"
                size="sm"
                onClick={loadDemo}
                disabled={loadingDemo || status === "running"}
                className="gap-2"
              >
                <Zap className="h-4 w-4 text-amber-300" />
                {loadingDemo ? "Loading demo…" : "Load demo report instantly"}
              </Button>
              <Link
                href="/#dashboard"
                className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-300"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                See the sample dashboard preview
              </Link>
            </div>

            {notice && (
              <div className="mx-auto flex max-w-2xl items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-sm text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {notice}
              </div>
            )}

            {status === "running" && (
              <div className={cn("mx-auto max-w-5xl")}>
                <AnalysisSkeleton />
              </div>
            )}

            {status === "done" && analysis && (
              <div className={cn("mx-auto max-w-5xl")}>
                <AnalysisReport
                  analysis={analysis}
                  source={source}
                  token={token}
                />
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatus("idle");
                      setAnalysis(null);
                      setNotice(null);
                    }}
                  >
                    Analyze another website
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
