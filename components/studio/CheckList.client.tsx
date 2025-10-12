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
          <li key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/5 transition-colors duration-200">
            <input
              type="checkbox"
              defaultChecked={i.done}
              className="size-5 rounded accent-accent cursor-pointer transition-transform duration-200 hover:scale-110"
            />
            <span className="text-foreground text-sm font-medium">{i.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
