"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CalendarClient from "./Calendar.client";
import AppointmentModal from "./AppointmentModal.client";
import { Button } from "@/components/ui/Button";
import {
  Appointment,
  AppointmentWithDetails,
  ShopLeads,
  Worker,
} from "@/lib/database";
import { deleteAppointmentAction, updateAppointmentDateTimeAction } from "@/app/content/calendar/actions";
import { Plus } from "lucide-react";

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
  appointments: initialAppointments,
}: CalendarWrapperProps) {
  const router = useRouter();

  // State
  const [events, setEvents] = useState(initialEvents);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<string>("");
  const [prefilledTime, setPrefilledTime] = useState<string>("");

  // Handle date click (empty calendar slot)
  const handleDateClick = (info: { date: Date; dateStr: string; view: { type: string } }) => {
    const date = info.date;
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = date.toTimeString().slice(0, 5); // HH:MM
    const isMonthView = info.view.type === "dayGridMonth";

    // Always pre-fill date
    setPrefilledDate(dateStr);

    // Only pre-fill time for day/week views (not month view)
    if (!isMonthView) {
      setPrefilledTime(timeStr);
    } else {
      setPrefilledTime("");
    }

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

  // Handle event drag & drop (reschedule appointment)
  const handleEventDrop = async (info: {
    event: {
      id: string;
      start: Date | null;
      end: Date | null;
    };
  }) => {
    if (!info.event.start || !info.event.end) return;

    const newDate = info.event.start.toISOString().split("T")[0]; // YYYY-MM-DD
    const newStartTime = info.event.start.toTimeString().slice(0, 5); // HH:MM
    const newEndTime = info.event.end.toTimeString().slice(0, 5); // HH:MM

    // Update events state optimistically
    const updatedEvents = events.map((evt) => {
      if (evt.id === info.event.id) {
        return {
          ...evt,
          start: `${newDate}T${newStartTime}`,
          end: `${newDate}T${newEndTime}`,
        };
      }
      return evt;
    });
    setEvents(updatedEvents);

    // Also update appointments state so modal shows correct data
    const updatedAppointments = appointments.map((apt) => {
      if (apt.id === info.event.id) {
        return {
          ...apt,
          appointment_date: newDate,
          start_time: newStartTime,
          end_time: newEndTime,
        };
      }
      return apt;
    });
    setAppointments(updatedAppointments);

    // Update database
    try {
      await updateAppointmentDateTimeAction(
        info.event.id,
        newDate,
        newStartTime,
        newEndTime
      );
      // Success! UI already updated
    } catch {
      // If server fails, refresh to revert UI
      router.refresh();
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

    // Also add to appointments array
    const client = clients.find((c) => c.id === newAppointment.client_id);
    const appointmentWithDetails: AppointmentWithDetails = {
      ...newAppointment,
      client_name: client ? client.name : "Unknown",
      worker_name: worker ? `${worker.first_name} ${worker.last_name}` : undefined,
    };
    setAppointments([...appointments, appointmentWithDetails]);
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

    setEvents(
      events.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt))
    );

    // Also update appointments array
    const client = clients.find((c) => c.id === updatedAppointment.client_id);
    const appointmentWithDetails: AppointmentWithDetails = {
      ...updatedAppointment,
      client_name: client ? client.name : "Unknown",
      worker_name: worker ? `${worker.first_name} ${worker.last_name}` : undefined,
    };
    setAppointments(
      appointments.map((apt) => (apt.id === updatedAppointment.id ? appointmentWithDetails : apt))
    );
  };

  // Optimistic delete
  const handleDelete = async (appointmentId: string) => {
    // Remove from UI immediately
    setEvents(events.filter((evt) => evt.id !== appointmentId));
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId));

    try {
      await deleteAppointmentAction(appointmentId);
      // Success! UI already updated
    } catch {
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
        onEventDrop={handleEventDrop}
      />

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        appointment={editingAppointment}
        clients={clients}
        onOptimisticCreate={handleOptimisticCreate}
        onOptimisticEdit={handleOptimisticEdit}
        onOptimisticDelete={handleDelete}
        prefilledDate={prefilledDate}
        prefilledTime={prefilledTime}
      />
    </>
  );
}
