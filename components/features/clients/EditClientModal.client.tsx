"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ShopLeads } from "@/lib/database";
import { updateClientAction } from "@/app/content/pipeline/actions";
import { useWorkers } from "@/lib/contexts/workers-context";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ShopLeads;
  onOptimisticEdit: (updatedClient: ShopLeads) => void;
}

export default function EditClientModal({
  isOpen,
  onClose,
  client,
  onOptimisticEdit,
}: EditClientModalProps) {
  const workers = useWorkers();
  const router = useRouter();

  // Memoize active workers filter to avoid recomputation on every render
  const activeWorkers = useMemo(
    () => workers.filter((worker) => worker.status === "active"),
    [workers]
  );

  // Form state (match your database fields!)
  // Use || "" to prevent undefined/null values (controlled vs uncontrolled input warning)
  const [name, setName] = useState(client.name || "");
  const [contactEmail, setContactEmail] = useState(client.contact_email || "");
  const [contactPhone, setContactPhone] = useState(client.contact_phone || "");
  const [notes, setNotes] = useState(client.notes || "");
  const [artists, setArtists] = useState(client.artists || "");
  const [sessionCount, setSessionCount] = useState(client.session_count || 0);
  const [depositStatus, setDepositStatus] = useState(client.deposit_status || "pending");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    // Must have email OR phone
    if (!contactEmail.trim() && !contactPhone.trim()) {
      setError("Please provide either email or phone number");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    // TODO CHANGE 6: Add the client ID to FormData!
    // The server action needs to know WHICH client to update
    formData.append("client_id", client.id.toString());

    try {
      // TODO CHANGE 7: Call updateClientAction instead of createClientAction
      const result = await updateClientAction(formData);

      // Check if server action returned an error
      if (result?.error) {
        setError(result.error);
        return;
      }

      // Success - update UI immediately (optimistic)
      const updatedClient: ShopLeads = {
        ...client,
        name,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        notes,
        artists,
        session_count: sessionCount,
        deposit_status: depositStatus,
      };

      onOptimisticEdit(updatedClient); // Update UI immediately
      onClose(); // Close modal

      // Refresh in background to sync with server
      router.refresh();
    } catch (_err) {
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
        className="surface p-8 max-w-4xl w-full border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold gradient-text-ink text-center mb-6">
            Edit Client
          </h2>

          {/* Grid Layout: 2 rows x 3 columns */}
          <div className="grid grid-cols-3 gap-6">
            {/* Row 1 - Field 1: Name */}
            <div className="space-y-2">
              <Label htmlFor="client_name">Name *</Label>
              <Input
                id="client_name"
                name="client_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Client name"
                required
              />
            </div>

            {/* Row 1 - Field 2: Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="client_contact_email">Contact Email</Label>
              <Input
                id="client_contact_email"
                name="client_contact_email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            {/* Row 1 - Field 3: Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="client_contact_phone">Contact Phone</Label>
              <Input
                id="client_contact_phone"
                name="client_contact_phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Row 2 - Field 1: Preferred Artist */}
            <div className="space-y-2">
              <Label htmlFor="client_prefered_artists">Preferred Artist</Label>
              <select
                id="client_prefered_artists"
                name="client_prefered_artists"
                value={artists}
                onChange={(e) => setArtists(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <option value="">Select an artist...</option>
                {activeWorkers.map((worker) => (
                  <option key={worker.id} value={`${worker.first_name} ${worker.last_name}`}>
                    {worker.first_name} {worker.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 2 - Field 2: Session Count */}
            <div className="space-y-2">
              <Label htmlFor="client_session_count">Session Count</Label>
              <Input
                id="client_session_count"
                name="client_session_count"
                type="number"
                value={sessionCount}
                onChange={(e) => setSessionCount(Number(e.target.value))}
                placeholder="0"
              />
            </div>

            {/* Row 2 - Field 3: Deposit Status */}
            <div className="space-y-2">
              <Label htmlFor="client_deposit_status">Deposit Status *</Label>
              <select
                id="client_deposit_status"
                name="client_deposit_status"
                value={depositStatus}
                onChange={(e) => setDepositStatus(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          {/* Notes Field - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="client_notes">Notes</Label>
            <textarea
              id="client_notes"
              name="client_notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes about client..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          {/* Buttons - Centered */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-32"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-32">
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
