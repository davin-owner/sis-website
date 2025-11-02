"use client";
// CLIENT COMPONENT - Performs calculations and dynamic styling based on props
// Uses Math.round and dynamic style calculations that benefit from client-side rendering
import Card from "@/components/shared/Card.server";

export function PipelineStats({
  flakers,
  finished,
}: {
  flakers: number;
  finished: number;
}) {
  const total = flakers + finished || 1;
  const finishedPct = Math.round((finished / total) * 100);

  return (
    <Card title="Pipeline Stats">
      <div className="flex items-center gap-6">
        <div
          className="relative size-24 rounded-full transition-transform duration-300 hover:scale-110"
          style={{
            background: `conic-gradient(var(--brand-cyan-bright) 0 ${finishedPct}%, var(--surface-muted) ${finishedPct}% 100%)`,
            boxShadow: `0 0 20px rgba(13, 232, 205, ${finishedPct / 200})`,
          }}
        >
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
            <span className="text-lg font-bold gradient-text-ink">{finishedPct}%</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-accent-foreground)' }}>{finished}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
          <div className="text-xs text-muted-foreground opacity-70">{flakers} pending</div>
        </div>
      </div>
    </Card>
  );
}
