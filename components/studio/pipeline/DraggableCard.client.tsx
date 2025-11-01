"use client";

import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";

import { useSortable } from "@dnd-kit/sortable";
import { ShopLeads } from "@/lib/database";
import { Button } from "@/components/ui/Button";
import EditClientModal from "../EditClientModal.client";
import AppointmentModal from "../AppointmentModal.client";
import { deleteClientAction } from "@/app/content/pipeline/actions";
import { GripHorizontal, Calendar } from 'lucide-react';

// Data Flow:
// 1. Receives client data and columnId from ClientPipelineColumns
// 2. Sets up draggable context for the card
// 3. Returns styled card with drag handlers attached

type DraggableClientCardProps = {
  client: ShopLeads;
  columnId: string;
  onOptimisticDelete: (clientId: number) => void;
  onOptimisticEdit: (updatedClient: ShopLeads) => void;
};

export default function DraggableClientCard({
  client,
  columnId,
  onOptimisticDelete,
  onOptimisticEdit,
}: DraggableClientCardProps) {
  const router = useRouter();

  // Set up draggable for this client card
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: client.id.toString(),
      data: { type: "CLIENT", client, columnId },
      // Include columnId in the data for context during drag events
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        transition,
      }
    : undefined;
  const [showEditModal, setEditModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleDelete = async () => {
    // OPTIMISTIC UPDATE: Remove from UI immediately
    onOptimisticDelete(client.id);

    // Then save to database in background
    try {
      await deleteClientAction(client.id.toString());
      // Success! UI already updated
    } catch (error) {
      // If server fails, refresh to revert UI
      router.refresh();
    }
  };
  return (
    <>
      <EditClientModal
        isOpen={showEditModal}
        onClose={() => setEditModal(false)}
        client={client}
        onOptimisticEdit={onOptimisticEdit}
      />
      <AppointmentModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        preselectedClientId={client.id.toString()}
      />
      {/* OUTER DIV: Sets up the drag context but NOT draggable itself */}
      <div
        ref={setNodeRef}
        style={style}
        className="surface p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      >
        {/* DRAG HANDLE: Only this section is draggable */}
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing pb-3 mb-3 border-b border-border/30"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-foreground">{client.name}</p>
            <GripHorizontal size={20} className="text-muted-foreground" />
          </div>
        </div>

        {/* CONTENT AREA: Not draggable, buttons work here! */}
        <div className="space-y-1 mb-3">
          {/* Contact: Email preferred, fallback to phone */}
          <p className="text-sm text-muted-foreground">
            {client.contact_email || client.contact_phone || "No contact"}
          </p>

          {/* Artist */}
          {client.artists && (
            <p className="text-xs text-muted-foreground">
              Artist: {client.artists}
            </p>
          )}

          {/* Deposit Status */}
          <p className="text-xs text-muted-foreground capitalize">
            Deposit: {client.deposit_status}
          </p>
        </div>

        {/* BUTTONS: Fully clickable now! */}
        <div className="space-y-2 pt-2">
          {/* Schedule Appointment Button - Primary Action */}
          <Button
            className="w-full"
            variant={"default"}
            size={"sm"}
            onClick={() => setShowScheduleModal(true)}
          >
            <Calendar size={16} className="mr-2" />
            Schedule
          </Button>

          {/* Edit and Delete - Secondary Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant={"outline"}
              size={"sm"}
              onClick={() => setEditModal(true)}
            >
              Edit
            </Button>
            <Button
              className="flex-1"
              variant={"destructive"}
              size={"sm"}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
