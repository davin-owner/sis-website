"use client";
// CLIENT COMPONENT - Uses interactive checkboxes that require client-side state
// Handles user interactions for marking tasks as complete/incomplete
import Card from "@/components/studio/Card.server";

export function ClientCheckList({
  items,
  titleName,
}: {
  items: { label: string; done?: boolean }[];
  titleName: string;
}) {
  return (
    <Card title={titleName}>
      <ul className="space-y-3">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked={i.done}
              className="size-4 rounded"
            />
            <span className="text-foreground">{i.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
