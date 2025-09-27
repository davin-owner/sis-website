// components/ClientCard.tsx
"use client";

export type Client = {
  id: string;
  name: string;
  contact: string;
  artist?: string;
  nextAction?: string; // e.g., date text
  session?: number;
  notes?: string;
};

export default function ClientCard({
  c,
  onOpen,
}: {
  c: Client;
  onOpen?: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onOpen?.(c.id)}
      className="w-full text-left rounded-lg bg-white border p-3 shadow-sm hover:shadow-md transition"
    >
      <div className="font-semibold">{c.name}</div>
      <div className="text-sm text-gray-600">{c.contact}</div>
      {c.artist && <div className="text-sm">🎨 {c.artist}</div>}
      {c.nextAction && (
        <div className="text-xs text-gray-500">Next: {c.nextAction}</div>
      )}
      {c.notes && (
        <div className="text-xs text-gray-500 line-clamp-2">{c.notes}</div>
      )}
    </button>
  );
}
