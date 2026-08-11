import type React from "react";

function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/[0.06] ${className ?? ""}`}
      style={style}
    />
  );
}

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
          >
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-16 w-full" style={{}} />
          <Skeleton className="mt-2 h-16 w-full" />
          <div className="mt-4 space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-3 w-3/4" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
          <Skeleton className="h-4 w-40" />
          <div className="mt-4 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Skeleton className="h-[420px] w-full rounded-xl" />
    </div>
  );
}
