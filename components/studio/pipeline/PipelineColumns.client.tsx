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
        className={`bg-gray-100 dark:bg-gray-800 p-5 rounded-lg flex-1 items-start
        ${isOver ? "white-pulsing-element" : ""}`}
      >
        <h2 className="border-b-2 border-solid border-gray-300 dark:border-gray-600 font-bold text-lg mb-4 text-gray-800 dark:text-white pb-2 sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
          {column.title}
        </h2>
        <div className="space-y-3 transition-all duration-200">
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
