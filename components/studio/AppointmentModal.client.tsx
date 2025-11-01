"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  createAppointmentAction,
  updateAppointmentAction,
  deleteAppointmentAction,
} from "@/app/content/calendar/actions";
import { Appointment, ShopLeads, Worker } from "@/lib/database";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null; // If provided, we're editing
  clients?: ShopLeads[];
  workers?: Worker[];
  onOptimisticCreate?: (newAppointment: Appointment) => void;
  onOptimisticEdit?: (updatedAppointment: Appointment) => void;
  onOptimisticDelete?: (appointmentId: string) => void;
  prefilledDate?: string; // YYYY-MM-DD
  prefilledTime?: string; // HH:MM
  preselectedClientId?: string; // Pre-select a client (from pipeline)
}

export default function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  clients = [],
  workers = [],
  onOptimisticCreate,
  onOptimisticEdit,
  onOptimisticDelete,
  prefilledDate,
  prefilledTime,
  preselectedClientId,
}: AppointmentModalProps) {
  const router = useRouter();
  const isEditMode = !!appointment;

  // Form state
  const [clientId, setClientId] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<
    "scheduled" | "completed" | "cancelled" | "no-show"
  >("scheduled");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing or prefilling
  useEffect(() => {
    if (appointment) {
      // Edit mode - populate from appointment
      setClientId(appointment.client_id.toString());
      setWorkerId(appointment.worker_id || "");
      setAppointmentDate(appointment.appointment_date);
      setStartTime(appointment.start_time);
      setEndTime(appointment.end_time);
      setTitle(appointment.title || "");
      setNotes(appointment.notes || "");
      setLocation(appointment.location || "");
      setStatus(appointment.status);
    } else {
      // Create mode - use prefilled values or defaults
      setClientId(preselectedClientId || "");
      setWorkerId("");
      setAppointmentDate(prefilledDate || "");
      setStartTime(prefilledTime || "");
      setEndTime("");
      setTitle("");
      setNotes("");
      setLocation("");
      setStatus("scheduled");
    }
  }, [appointment, prefilledDate, prefilledTime, preselectedClientId]);

  const handleDelete = async () => {
    if (!appointment) return;

    setIsSubmitting(true);
    try {
      // Optimistic delete
      if (onOptimisticDelete) {
        onOptimisticDelete(appointment.id);
      }

      await deleteAppointmentAction(appointment.id);

      // Close modal and refresh
      onClose();
      router.refresh();
    } catch (err) {
      setError("Failed to delete appointment");
      router.refresh(); // Revert optimistic update
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!clientId) {
      setError("Please select a client");
      return;
    }

    if (!appointmentDate) {
      setError("Date is required");
      return;
    }

    if (!startTime || !endTime) {
      setError("Start and end times are required");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (isEditMode) {
        // Edit existing appointment
        formData.append("appointment_id", appointment.id);
        const result = await updateAppointmentAction(formData);

        if (result?.error) {
          setError(result.error);
          return;
        }

        // Optimistic update
        if (onOptimisticEdit) {
          onOptimisticEdit({
            ...appointment,
            client_id: parseInt(clientId, 10),
            worker_id: workerId || null,
            appointment_date: appointmentDate,
            start_time: startTime,
            end_time: endTime,
            title: title || null,
            notes: notes || null,
            location: location || null,
            status,
          });
        }
      } else {
        // Create new appointment
        const result = await createAppointmentAction(formData);

        if (result?.error) {
          setError(result.error);
          return;
        }

        // Optimistic create
        if (result?.appointment && onOptimisticCreate) {
          onOptimisticCreate(result.appointment);
        }
      }

      // Close modal and refresh
      onClose();
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="surface p-8 max-w-4xl w-full border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold gradient-text-ink text-center mb-6">
            {isEditMode ? "Edit Appointment" : "Create Appointment"}
          </h2>

          {/* Grid Layout: 2 columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Client Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="client_id">Client *</Label>
              <select
                id="client_id"
                name="client_id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <option value="">Select a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Worker Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="worker_id">Artist</Label>
              <select
                id="worker_id"
                name="worker_id"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <option value="">No artist assigned</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.first_name} {worker.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="appointment_date">Date *</Label>
              <Input
                id="appointment_date"
                name="appointment_date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                name="start_time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                name="end_time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as
                      | "scheduled"
                      | "completed"
                      | "cancelled"
                      | "no-show"
                  )
                }
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            {/* Title - Span 2 columns */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tattoo Session, Consultation, etc."
              />
            </div>

            {/* Location */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Studio location or room"
              />
            </div>
          </div>

          {/* Notes Field - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about the appointment..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-32"
            >
              Cancel
            </Button>
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="w-32"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-32">
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                ? "Save"
                : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
