"use client";
// CLIENT COMPONENT - Performs calculations and dynamic styling based on props
// Uses Math.round and dynamic style calculations that benefit from client-side rendering
import Card from "@/components/studio/Card.server";

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
      <div className="flex items-center gap-4">
        <div
          className="relative size-20 rounded-full"
          style={{
            background: `conic-gradient(var(--neon-purple) 0 ${finishedPct}%, rgba(0,0,0,0.08) ${finishedPct}% 100%)`,
          }}
        />
        <div>
          <div className="text-2xl font-bold text-foreground">{finishedPct}%</div>
          <div className="text-sm text-muted-foreground">Finished</div>
        </div>
      </div>
    </Card>
  );
}
