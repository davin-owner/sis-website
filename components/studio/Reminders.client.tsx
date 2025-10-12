"use client";
// CLIENT COMPONENT - Displays dynamic data that may need real-time updates
// Could be enhanced with interactive features like clicking to view details
import Card from "@/components/studio/Card.server";

export function Reminders({
  data,
}: {
  data: { emails: number; sms: number; urgent: number };
}) {
  return (
    <Card title="Reminders">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="surface-muted p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-accent-foreground)' }}>{data.emails}</div>
          <div className="text-xs text-muted-foreground mt-1">Emails</div>
        </div>
        <div className="surface-muted p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-accent-foreground)' }}>{data.sms}</div>
          <div className="text-xs text-muted-foreground mt-1">SMS</div>
        </div>
        <div className="surface-muted p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer border-2 border-color-error/30">
          <div className="text-2xl font-bold text-color-error">{data.urgent}</div>
          <div className="text-xs text-muted-foreground mt-1">Urgent</div>
        </div>
      </div>
    </Card>
  );
}
