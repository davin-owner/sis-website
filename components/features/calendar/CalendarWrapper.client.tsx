"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CalendarClient from "./Calendar.client";
import AppointmentModal from "./AppointmentModal.client";
import { Button } from "@/components/ui/Button";
import { Appointment, AppointmentWithDetails, ShopLeads, Worker } from "@/lib/database";
import { deleteAppointmentAction } from "@/app/content/calendar/actions";
import { Plus } from 'lucide-react';

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    clientName?: string;
    workerName?: string;
    status?: string;
    workerColor?: string;
  };
};

interface CalendarWrapperProps {
  initialEvents: CalendarEvent[];
  clients: ShopLeads[];
  workers: Worker[];
  appointments: AppointmentWithDetails[];
}

export default function CalendarWrapper({
  initialEvents,
  clients,
  workers,
  appointments,
}: CalendarWrapperProps) {
  const router = useRouter();

  // State
  const [events, setEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<string>("");
  const [prefilledTime, setPrefilledTime] = useState<string>("");

  // Handle date click (empty calendar slot)
  const handleDateClick = (info: { date: Date; dateStr: string }) => {
    const date = info.date;
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = date.toTimeString().slice(0, 5); // HH:MM

    setPrefilledDate(dateStr);
    setPrefilledTime(timeStr);
    setEditingAppointment(null);
    setShowModal(true);
  };

  // Handle event click (existing appointment)
  const handleEventClick = (info: {
    event: {
      id: string;
      title: string;
      start: Date | null;
      end: Date | null;
    };
  }) => {
    const appointment = appointments.find((apt) => apt.id === info.event.id);
    if (appointment) {
      setEditingAppointment(appointment);
      setShowModal(true);
    }
  };

  // Optimistic create
  const handleOptimisticCreate = (newAppointment: Appointment) => {
    // Find worker to get their color
    const worker = workers.find((w) => w.id === newAppointment.worker_id);
    const workerColor = worker?.color || "#0de8cd";

    const newEvent = {
      id: newAppointment.id,
      title: newAppointment.title || "Appointment",
      start: `${newAppointment.appointment_date}T${newAppointment.start_time}`,
      end: `${newAppointment.appointment_date}T${newAppointment.end_time}`,
      backgroundColor: workerColor,
      extendedProps: {
        workerColor: workerColor,
      },
    };
    setEvents([...events, newEvent]);
  };

  // Optimistic edit
  const handleOptimisticEdit = (updatedAppointment: Appointment) => {
    // Find worker to get their color
    const worker = workers.find((w) => w.id === updatedAppointment.worker_id);
    const workerColor = worker?.color || "#0de8cd";

    const updatedEvent = {
      id: updatedAppointment.id,
      title: updatedAppointment.title || "Appointment",
      start: `${updatedAppointment.appointment_date}T${updatedAppointment.start_time}`,
      end: `${updatedAppointment.appointment_date}T${updatedAppointment.end_time}`,
      backgroundColor: workerColor,
      extendedProps: {
        workerColor: workerColor,
      },
    };

    setEvents(events.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt)));
  };

  // Optimistic delete
  const handleDelete = async (appointmentId: string) => {
    // Remove from UI immediately
    setEvents(events.filter((evt) => evt.id !== appointmentId));

    try {
      await deleteAppointmentAction(appointmentId);
      // Success! UI already updated
    } catch (_error) {
      // If server fails, refresh to revert UI
      router.refresh();
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
    setPrefilledDate("");
    setPrefilledTime("");
  };

  return (
    <>
      {/* Create Appointment Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            setEditingAppointment(null);
            setPrefilledDate("");
            setPrefilledTime("");
            setShowModal(true);
          }}
        >
          <Plus size={18} className="mr-2" />
          Create Appointment
        </Button>
      </div>

      {/* Calendar */}
      <CalendarClient
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        appointment={editingAppointment}
        clients={clients}
        workers={workers}
        onOptimisticCreate={handleOptimisticCreate}
        onOptimisticEdit={handleOptimisticEdit}
        onOptimisticDelete={handleDelete}
        prefilledDate={prefilledDate}
        prefilledTime={prefilledTime}
      />
    </>
  );
}
