// src/app/components/Client/pipeline/ClientPipeBoard.tsx
"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
  PointerSensor,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import ClientPipelineColumns from "@/components/Client/pipeline/ClientPipelineColumns";
import DraggableClientCard from "./DraggableClientCard";
import { Column, Client } from "@/lib/types";
import { useNavbar } from "@/lib/contexts/navbar-context";
import {
  arrayMove,
} from "@dnd-kit/sortable";

// Data Flow:
// 1. Receives initialColumns from ServerPipelineBoard
// 2. Manages state of columns and clients
// 3. Handles drag end events to update state
// 4. Passes columns and move handler to ClientPipelineColumns
type ClientPipeBoardProps = {
  initialColumns: Column[];
};

export default function ClientPipelineBoard({
  initialColumns,
}: ClientPipeBoardProps) {
  const { isExpanded: isNavbarExpanded } = useNavbar();
  // State for managing columns and the currently dragged client
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure drag sensors with custom activation constraints
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        // Require minimum drag distance to prevent accidental drags
        distance: 5,
      },
    }),
    useSensor(PointerSensor)
  );

  // Helper function to find a client by ID across all columns
  const findClientById = (id: string): Client | undefined => {
    for (const column of columns) {
      const client = column.clients.find((c) => c.id === id);
      if (client) return client;
    }
    return undefined;
  };

  // Handle drag end event to update columns state

  // Handle the start of dragging - sets the active item
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
  }

  // Handle the end of dragging - updates column state
  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the source and destination columns
    const activeColumn = columns.find((col) =>
      col.clients.some((client) => client.id === activeId)
    );
    const overColumn = columns.find(
      (col) =>
        col.clients.some((client) => client.id === overId) || col.id === overId
    );

    if (!activeColumn || !overColumn) return;

    // Handle sorting within the same column
    if (activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.clients.findIndex(
        (client) => client.id === activeId
      );
      const newIndex = activeColumn.clients.findIndex(
        (client) => client.id === overId
      );

      if (oldIndex === newIndex) return;

      setColumns(
        columns.map((col) => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              clients: arrayMove(col.clients, oldIndex, newIndex),
            };
          }
          return col;
        })
      );
    }
    // Handle moving between columns
    else {
      setColumns((prevColumns) => {
        const sourceColIndex = prevColumns.indexOf(activeColumn);
        const destColIndex = prevColumns.indexOf(overColumn);

        const clientToMove = activeColumn.clients.find(
          (client) => client.id === activeId
        );

        if (!clientToMove) return prevColumns;

        // Check for duplicates in destination column
        if (
          overColumn.clients.some((client) => client.id === clientToMove.id)
        ) {
          return prevColumns;
        }

        const newColumns = [...prevColumns];
        // Remove from source
        newColumns[sourceColIndex] = {
          ...activeColumn,
          clients: activeColumn.clients.filter(
            (client) => client.id !== activeId
          ),
        };
        // Add to destination
        newColumns[destColIndex] = {
          ...overColumn,
          clients: [...overColumn.clients, clientToMove],
        };

        return newColumns;
      });
    }
  }

  const handleMove = () => {
    // Logic to move a client from one column to another
    // Update the state accordingly
  };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div
        className={`flex justify-between items-start w-full gap-6 p-6 mt-16 ${
          isNavbarExpanded ? "ml-64" : "ml-20"
        }`}
        id="client-pipeline-columns"
      >
        <ClientPipelineColumns columns={columns} onMove={handleMove} />
      </div>

      {/* DragOverlay shows a preview of the dragged item */}
      <DragOverlay>
        {activeId ? (
          <div className="opacity-80">
            <DraggableClientCard
              client={findClientById(activeId) || columns[0].clients[0]}
              columnId=""
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
