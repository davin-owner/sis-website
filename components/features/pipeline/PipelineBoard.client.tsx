/**
 * PIPELINE BOARD (.client) - Interactive Drag & Drop Pipeline Management
 *
 * This is the main interactive component for managing client sales pipeline.
 * It provides drag-and-drop functionality for moving clients between pipeline stages.
 *
 * Data Flow:
 * 1. Receives initialColumns from PipelineBoard.server (server component)
 * 2. Manages local state for columns and clients using React useState
 * 3. Handles drag events to update pipeline state
 * 4. Uses navbar context for responsive layout adjustments
 *
 * Features:
 * - Drag & drop clients between pipeline columns
 * - Visual feedback during drag operations
 * - Collision detection and validation
 * - Responsive layout based on navbar state
 * - Real-time state updates
 *
 * Libraries Used:
 * - @dnd-kit/core: Drag and drop functionality
 * - @dnd-kit/sortable: Sortable items within columns
 *
 * Future Enhancements:
 * - Persistence to Supabase database
 * - Real-time collaboration
 * - Client details editing
 * - Pipeline stage customization
 */
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
import PipelineColumns from "@/components/features/pipeline/PipelineColumns.client";
import DraggableCard from "./DraggableCard.client";
import { arrayMove } from "@dnd-kit/sortable";
import { PipelineColumn, ShopLeads } from "@/lib/database";
import { updateClientStageAction } from "@/app/content/pipeline/actions";

// Data Flow:
// 1. Receives initialColumns and workers from ServerPipelineBoard
// 2. Manages state of columns and clients
// 3. Handles drag end events to update state
// 4. Passes columns, workers, and move handler to ClientPipelineColumns
type ClientPipeBoardProps = {
  initialColumns: PipelineColumn[];
};

export default function ClientPipelineBoard({
  initialColumns,
}: ClientPipeBoardProps) {
  // State for managing columns and the currently dragged client
  const [columns, setColumns] = useState<PipelineColumn[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Optimistic update: Remove client from UI immediately
  const handleOptimisticDelete = (clientId: number) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        clients: col.clients.filter((client) => client.id !== clientId),
      }))
    );
  };

  // Optimistic update: Add new client to UI immediately
  const handleOptimisticAdd = (newClient: ShopLeads) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        // Add to the "leads" column (first column)
        if (col.id === "leads") {
          return {
            ...col,
            clients: [...col.clients, newClient],
          };
        }
        return col;
      })
    );
  };

  // Optimistic update: Update client in UI immediately
  const handleOptimisticEdit = (updatedClient: ShopLeads) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        clients: col.clients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        ),
      }))
    );
  };

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
  const findClientById = (id: string): ShopLeads | undefined => {
    for (const column of columns) {
      const client = column.clients.find((c) => c.id.toString() === id);
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
  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the source and destination columns
    const activeColumn = columns.find((col) =>
      col.clients.some((client) => client.id.toString() === activeId)
    );
    const overColumn = columns.find(
      (col) =>
        col.clients.some((client) => client.id.toString() === overId) ||
        col.id === overId
    );

    if (!activeColumn || !overColumn) return;
    let newSortOrder: number;
    // Handle sorting within the same column
    if (activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.clients.findIndex(
        (client) => client.id.toString() === activeId
      );
      const newIndex = activeColumn.clients.findIndex(
        (client) => client.id.toString() === overId
      );
      newSortOrder = newIndex;

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

      // Call server action to update sort order
      try {
        await updateClientStageAction(
          activeId.toString(),
          overColumn.id,
          newSortOrder
        );
      } catch (_error) {
        // Silently fail - UI already updated optimistically
      }
      return; // Exit early after handling same column
    }
    // Handle moving between columns
    else {
      newSortOrder = overColumn.clients.length;
      setColumns((prevColumns) => {
        const sourceColIndex = prevColumns.indexOf(activeColumn);
        const destColIndex = prevColumns.indexOf(overColumn);

        const clientToMove = activeColumn.clients.find(
          (client) => client.id.toString() === activeId
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
            (client) => client.id.toString() !== activeId
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

    // Call server action AFTER state update (outside setColumns)
    try {
      await updateClientStageAction(
        activeId.toString(),
        overColumn.id,
        newSortOrder
      );
      // Success! Data saved to database
    } catch (_error) {
      // TODO: Show error toast to user instead of console logging
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div
        className="flex mt-0 justify-center items-start w-full gap-6 p-6"
        id="client-pipeline-columns"
      >
        <PipelineColumns
          columns={columns}
          onOptimisticDelete={handleOptimisticDelete}
          onOptimisticAdd={handleOptimisticAdd}
          onOptimisticEdit={handleOptimisticEdit}
        />
      </div>

      {/* DragOverlay shows a preview of the dragged item */}
      <DragOverlay>
        {activeId ? (
          <div className="opacity-80">
            <DraggableCard
              client={findClientById(activeId) || columns[0].clients[0]}
              columnId=""
              onOptimisticDelete={() => {}} // Dummy function for preview
              onOptimisticEdit={() => {}} // Dummy function for preview
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
