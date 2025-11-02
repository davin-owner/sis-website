"use client";
// CLIENT COMPONENT - Artists/Workers management interface
// Displays workers list and handles CRUD operations

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Worker } from "@/lib/database";
import { Button } from "@/components/ui/Button";
import AddWorkerModal from "@/components/features/workers/AddWorkerModal.client";
import EditWorkerModal from "@/components/features/workers/EditWorkerModal.client";
import { UserCircle2, Mail, Smartphone } from 'lucide-react';

interface ArtistsPageClientProps {
  initialWorkers: Worker[];
  shopId: string;
}

export default function ArtistsPageClient({
  initialWorkers,
  shopId,
}: ArtistsPageClientProps) {
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "true";

  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  // Auto-open add modal if coming from onboarding
  useEffect(() => {
    if (isOnboarding && workers.length === 0) {
      setIsAddModalOpen(true);
    }
  }, [isOnboarding, workers.length]);

  // Callback when worker is added
  const handleWorkerAdded = (newWorker: Worker) => {
    setWorkers([...workers, newWorker]);
    setIsAddModalOpen(false);
  };

  // Callback when worker is updated
  const handleWorkerUpdated = (updatedWorker: Worker) => {
    setWorkers(
      workers.map((w) => (w.id === updatedWorker.id ? updatedWorker : w))
    );
    setEditingWorker(null);
  };

  // Callback when worker is deleted
  const handleWorkerDeleted = (workerId: string) => {
    setWorkers(workers.filter((w) => w.id !== workerId));
    setEditingWorker(null);
  };

  // Sort workers: active first, then by name
  // Memoized to avoid O(n log n) sort on every render
  const sortedWorkers = useMemo(() => {
    return [...workers].sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      return `${a.first_name} ${a.last_name}`.localeCompare(
        `${b.first_name} ${b.last_name}`
      );
    });
  }, [workers]);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <p className="text-foreground">
          Manage your shop&apos;s artists and workers
        </p>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <UserCircle2 size={18} className="mr-2" />
          Add Artist
        </Button>
      </div>

      {/* Workers Grid */}
      {sortedWorkers.length === 0 ? (
        <div className="surface-elevated rounded-xl p-12 text-center">
          <UserCircle2 size={60} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No artists yet</h3>
          <p className="text-muted-foreground mb-6">
            Add your first artist to start managing appointments
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserCircle2 size={18} className="mr-2" />
            Add Artist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedWorkers.map((worker) => (
            <div
              key={worker.id}
              className="surface-elevated rounded-xl p-6 space-y-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setEditingWorker(worker)}
            >
              {/* Header with color badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: worker.color }}
                  >
                    {worker.first_name[0]}
                    {worker.last_name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {worker.first_name} {worker.last_name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        worker.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : worker.status === "on_leave"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {worker.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                {worker.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={16} />
                    <span className="truncate">{worker.email}</span>
                  </div>
                )}
                {worker.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Smartphone size={16} />
                    <span>{worker.phone}</span>
                  </div>
                )}
              </div>

              {/* Specialties */}
              {worker.specialties && worker.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {worker.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent-foreground"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}

              {/* Hire Date */}
              {worker.hire_date && (
                <div className="text-xs text-muted-foreground">
                  Hired: {new Date(worker.hire_date).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddWorkerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onWorkerAdded={handleWorkerAdded}
        shopId={shopId}
      />

      {/* Edit Modal */}
      {editingWorker && (
        <EditWorkerModal
          isOpen={!!editingWorker}
          onClose={() => setEditingWorker(null)}
          onWorkerUpdated={handleWorkerUpdated}
          onWorkerDeleted={handleWorkerDeleted}
          worker={editingWorker}
          shopId={shopId}
        />
      )}
    </div>
  );
}
