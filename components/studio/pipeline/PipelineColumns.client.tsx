"use client";

import React from "react";
import { Column } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import DraggableCard from "./DraggableCard.client";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Data Flow:
// 1. Receives columns and onMove from ClientPipelineBoard
// 2. Each column is a droppable target
// 3. Each client card is draggable (will add useDraggable)
// 4. No local state - parent controls all data

type ClientPipelineColumnsProps = {
  columns: Column[];
  onMove: (sourceId: string, destinationId: string, clientId: string) => void;
};

// Separate component for each droppable column
function DroppableColumn({ column }: { column: Column }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "COLUMN" },
  });

  return (
    <SortableContext
      items={column.clients.map((client) => client.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`p-6 flex-1 items-start min-h-[400px] rounded-xl transition-colors duration-300
        ${isOver ? "ring-2 shadow-[0_0_20px_rgba(13,232,205,0.4)]" : ""}`}
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderColor: isOver ? 'var(--color-accent-foreground)' : undefined
        }}
      >
        <h2 className="font-bold text-xl mb-5 text-foreground pb-3 sticky top-0 backdrop-blur-lg z-10 -mx-6 px-6" style={{ background: 'var(--color-card)' }}>
          {column.title}
        </h2>
        <div className="space-y-4 transition-all duration-300">
          {column.clients.map((client) => (
            <DraggableCard
              key={client.id}
              client={client}
              columnId={column.id}
            />
          ))}
        </div>
      </div>
    </SortableContext>
  );
}

export default function ClientPipelineColumns({
  columns,
}: ClientPipelineColumnsProps) {
  return (
    <div
      className="flex justify-between w-full gap-6 p-6 mt-16"
      id="client-pipeline-columns"
    >
      {columns.map((column) => (
        <DroppableColumn key={column.id} column={column} />
      ))}
    </div>
  );
}
