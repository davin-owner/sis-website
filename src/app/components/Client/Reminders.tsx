"use client";
// CLIENT COMPONENT - Displays dynamic data that may need real-time updates
// Could be enhanced with interactive features like clicking to view details
import Card from "../CardComponent";

export function Reminders({ data }: { data: { emails: number; sms: number; urgent: number } }) {
  return (
    <Card title="Reminders">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="surface-muted p-3 rounded-xl">
          <div className="text-2xl font-bold">{data.emails}</div>
          <div className="text-sm text-gray-600">Emails</div>
        </div>
        <div className="surface-muted p-3 rounded-xl">
          <div className="text-2xl font-bold">{data.sms}</div>
          <div className="text-sm text-gray-600">SMS</div>
        </div>
        <div className="surface-muted p-3 rounded-xl">
          <div className="text-2xl font-bold">{data.urgent}</div>
          <div className="text-sm text-gray-600">Urgent</div>
        </div>
      </div>
    </Card>
  );
}
