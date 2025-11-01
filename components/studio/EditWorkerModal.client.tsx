"use client";
// CLIENT COMPONENT - Edit Worker Modal

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  updateWorkerAction,
  deleteWorkerAction,
} from "@/app/content/artists/actions";
import { Worker } from "@/lib/database";

interface EditWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkerUpdated: (worker: Worker) => void;
  onWorkerDeleted: (workerId: string) => void;
  worker: Worker;
  shopId: string;
}

const SPECIALTY_OPTIONS = [
  "Realism",
  "Traditional",
  "Japanese",
  "Black & Grey",
  "Color",
  "Watercolor",
  "Geometric",
  "Tribal",
  "Portrait",
  "Cover-up",
];

export default function EditWorkerModal({
  isOpen,
  onClose,
  onWorkerUpdated,
  onWorkerDeleted,
  worker,
}: EditWorkerModalProps) {
  const [firstName, setFirstName] = useState(worker.first_name);
  const [lastName, setLastName] = useState(worker.last_name);
  const [email, setEmail] = useState(worker.email || "");
  const [phone, setPhone] = useState(worker.phone || "");
  const [status, setStatus] = useState<"active" | "inactive" | "on_leave">(
    worker.status
  );
  const [hireDate, setHireDate] = useState(worker.hire_date || "");
  const [hourlyRate, setHourlyRate] = useState(
    worker.hourly_rate?.toString() || ""
  );
  const [notes, setNotes] = useState(worker.notes || "");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    worker.specialties || []
  );
  const [color, setColor] = useState(worker.color);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateWorkerAction(worker.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        status,
        hire_date: hireDate || null,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        specialties: selectedSpecialties.length > 0 ? selectedSpecialties : null,
        notes: notes.trim() || null,
        color,
      });

      if (result.success && result.worker) {
        onWorkerUpdated(result.worker);
      } else {
        setError(result.error || "Failed to update worker");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const result = await deleteWorkerAction(worker.id);

      if (result.success) {
        onWorkerDeleted(worker.id);
      } else {
        setError(result.error || "Failed to delete worker");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="surface p-8 max-w-2xl w-full border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold gradient-text-ink text-center mb-6">
          <i className="fi fi-ts-circle-user mr-2"></i>
          Edit Artist
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Contact Fields */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Status and Hire Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "active" | "inactive" | "on_leave")
              }
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>

          <div>
            <Label htmlFor="hireDate">Hire Date</Label>
            <Input
              id="hireDate"
              type="date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
            />
          </div>
        </div>

        {/* Hourly Rate */}
        <div>
          <Label htmlFor="hourlyRate">Hourly Rate ($/hr)</Label>
          <Input
            id="hourlyRate"
            type="number"
            step="0.01"
            min="0"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="50.00"
          />
        </div>

        {/* Color Picker */}
        <div>
          <Label htmlFor="color">Calendar Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-20 h-10 cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">
              Used to identify this artist on the calendar
            </span>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <Label>Specialties</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {SPECIALTY_OPTIONS.map((specialty) => (
              <button
                key={specialty}
                type="button"
                onClick={() => toggleSpecialty(specialty)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedSpecialties.includes(specialty)
                    ? "bg-primary text-white"
                    : "bg-accent/20 text-accent-foreground hover:bg-accent/30"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional information..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Are you sure you want to delete this artist? This action cannot be
              undone.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSubmitting || showDeleteConfirm}
          >
            Delete
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
}
