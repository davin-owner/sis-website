"use client";

import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { Client } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";

// Data Flow:
// 1. Receives client data and columnId from ClientPipelineColumns
// 2. Sets up draggable context for the card
// 3. Returns styled card with drag handlers attached

type DraggableClientCardProps = {
  client: Client;
  columnId: string;
};

export default function DraggableClientCard({
  client,
  columnId,
}: DraggableClientCardProps) {
  // Set up draggable for this client card
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: client.id,
      data: { type: "CLIENT", client, columnId },
      // Include columnId in the data for context during drag events
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        transition,
      }
    : undefined;

    

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-card border border-border p-3 rounded-md shadow cursor-grab touch-none"
    >
      <p className="font-semibold text-card-foreground">
        {client.name}
      </p>
      <p className="text-sm text-muted-foreground">
        {client.contact}
      </p>
      {client.artist && (
        <p className="text-xs text-muted-foreground mt-1">Artist: {client.artist}</p>
      )}
    </div>
  );
}
