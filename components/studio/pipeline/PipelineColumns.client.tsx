"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import DraggableCard from "./DraggableCard.client";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PipelineColumn, ShopLeads } from "@/lib/database";
import { Button } from "@/components/ui/Button";
import AddClientModal from "@/components/studio/AddClientModal.client";
import EditClientModal from "../EditClientModal.client";

// Data Flow:
// 1. Receives columns and onMove from ClientPipelineBoard
// 2. Each column is a droppable target
// 3. Each client card is draggable (will add useDraggable)
// 4. No local state - parent controls all data

type ClientPipelineColumnsProps = {
  columns: PipelineColumn[];
  onOptimisticDelete: (clientId: number) => void;
  onOptimisticAdd: (newClient: ShopLeads) => void;
  onOptimisticEdit: (updatedClient: ShopLeads) => void;
};

// Separate component for each droppable column
function DroppableColumn({
  column,
  onOptimisticDelete,
  onOptimisticEdit,
}: {
  column: PipelineColumn;
  onOptimisticDelete: (clientId: number) => void;
  onOptimisticEdit: (updatedClient: ShopLeads) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "COLUMN" },
  });

  return (
    <SortableContext
      items={column.clients.map((client) => client.id.toString())}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`p-6 flex-1 items-start min-h-[400px] rounded-xl transition-colors duration-300
        ${isOver ? "ring-2 shadow-[0_0_20px_rgba(13,232,205,0.4)]" : ""}`}
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderColor: isOver ? "var(--color-accent-foreground)" : undefined,
        }}
      >
        <h2 className="font-bold text-2xl text-center mb-5 text-foreground pb-3 sticky top-0 backdrop-blur-lg z-10 -mx-6 px-6">
          {column.title}
        </h2>
        <div className="space-y-4 transition-all duration-300">
          {column.clients.map((client) => (
            <DraggableCard
              key={client.id}
              client={client}
              columnId={column.id}
              onOptimisticDelete={onOptimisticDelete}
              onOptimisticEdit={onOptimisticEdit}
            />
          ))}
        </div>
      </div>
    </SortableContext>
  );
}

export default function ClientPipelineColumns({
  columns,
  onOptimisticDelete,
  onOptimisticAdd,
  onOptimisticEdit,
}: ClientPipelineColumnsProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onOptimisticAdd={onOptimisticAdd}
      />

      <div>
        <div className="float-end">
          <Button
            className=" text-xl p-2 mr-2"
            size={"lg"}
            onClick={() => setShowAddModal(true)}
          >
            Create Client
          </Button>
        </div>
        <div
          className="flex justify-between w-full gap-10 p-2 mt-26"
          id="client-pipeline-columns"
        >
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              column={column}
              onOptimisticDelete={onOptimisticDelete}
              onOptimisticEdit={onOptimisticEdit}
            />
          ))}
        </div>
      </div>
    </>
  );
}
