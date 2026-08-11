"use client";

import * as React from "react";
import { Sparkles, Loader2, KeyRound, LogIn, User } from "lucide-react";
import { DEMO_CREDENTIALS, apiLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LoginForm({
  onAuthed,
}: {
  onAuthed: (token: string, email: string) => void;
}) {
  const [email, setEmail] = React.useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = React.useState(DEMO_CREDENTIALS.password);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await apiLogin(email.trim(), password);
      onAuthed(token, email.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/[0.08] bg-[#070B1D]/70 p-8 shadow-card-lg backdrop-blur-2xl">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/10">
          <KeyRound className="h-5 w-5 text-indigo-300" />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-white">Sign in</h2>
        <p className="mt-1 text-sm text-slate-400">
          Sign in to analyze any website and download reports.
        </p>
        <Badge variant="success" className="mt-3">
          Demo account pre-filled below
        </Badge>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3">
          <User className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3">
          <KeyRound className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign in
            </>
          )}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          Sign-in uses a seeded demo account — no setup required.
        </p>
      </form>
    </div>
  );
}
