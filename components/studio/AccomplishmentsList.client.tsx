/**
 * ACCOMPLISHMENTS LIST - Daily achievements tracker
 *
 * PURPOSE:
 * Allows users to track what they've accomplished today
 * NOTE: Currently manual entry, designed for future automation
 *
 * FUTURE AUTOMATION SOURCES:
 * - Pipeline moves (client goes to "completed")
 * - Appointments completed
 * - New clients added
 * - Deposits received
 * etc.
 *
 * FEATURES:
 * - Add accomplishments manually
 * - Delete accomplishments
 * - Optimistic UI updates
 */

"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Accomplishment } from "@/lib/database";
import {
  createAccomplishmentAction,
  deleteAccomplishmentAction,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Card from "@/components/studio/Card.server";
import { Trash2, CornerDownLeft, Zap } from 'lucide-react';

interface AccomplishmentsListProps {
  initialAccomplishments: Accomplishment[];
}

export default function AccomplishmentsList({
  initialAccomplishments,
}: AccomplishmentsListProps) {
  const [isPending, startTransition] = useTransition();
  const [newAccomplishment, setNewAccomplishment] = useState("");
  const [error, setError] = useState("");

  // Optimistic state
  const [optimisticAccomplishments, setOptimisticAccomplishments] =
    useOptimistic(
      initialAccomplishments,
      (state: Accomplishment[], { action, accomplishment, accomplishmentId }: { action: string; accomplishment?: Accomplishment; accomplishmentId?: string }) => {
        switch (action) {
          case "add":
            return [accomplishment!, ...state];
          case "delete":
            return state.filter((a) => a.id !== accomplishmentId);
          default:
            return state;
        }
      }
    );

  const handleAddAccomplishment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccomplishment.trim()) return;

    setError("");

    // Optimistic temporary accomplishment
    const tempAccomplishment: Accomplishment = {
      id: `temp-${Date.now()}`,
      shop_id: "",
      created_by_user_id: "",
      description: newAccomplishment,
      accomplishment_date: new Date().toISOString().split("T")[0],
      is_automated: false,
      automation_source: null,
      created_at: new Date().toISOString(),
    };

    startTransition(async () => {
      setOptimisticAccomplishments({
        action: "add",
        accomplishment: tempAccomplishment,
      });

      const result = await createAccomplishmentAction(newAccomplishment);

      if (result.error) {
        setError(result.error);
      } else {
        setNewAccomplishment("");
      }
    });
  };

  const handleDeleteAccomplishment = (accomplishmentId: string) => {
    startTransition(async () => {
      setOptimisticAccomplishments({ action: "delete", accomplishmentId });
      const result = await deleteAccomplishmentAction(accomplishmentId);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <Card
      title="Today's Accomplishments"
      subtitle="What you've completed"
    >
      <div className="space-y-4">
        {/* Accomplishments List */}
        <ul className="space-y-2">
          {optimisticAccomplishments.map((accomplishment) => (
            <li
              key={accomplishment.id}
              className="flex items-start gap-2 group hover:bg-accent/5 px-2 py-1 rounded transition-colors"
            >
              {/* Bullet Point */}
              <span className="text-accent mt-0.5">•</span>

              {/* Description */}
              <span className="flex-1 text-foreground">
                {accomplishment.description}
              </span>

              {/* Automated Indicator (for future) */}
              {accomplishment.is_automated && (
                <span
                  className="text-xs text-muted-foreground bg-accent/10 px-2 py-0.5 rounded"
                  title={`Auto-tracked from: ${accomplishment.automation_source}`}
                >
                  <Zap size={14} />
                </span>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteAccomplishment(accomplishment.id)}
                className="opacity-40 hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity"
                aria-label="Delete accomplishment"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}

          {optimisticAccomplishments.length === 0 && (
            <li className="text-sm text-muted-foreground italic">
              No accomplishments yet today. Add one below!
            </li>
          )}
        </ul>

        {/* Add New Accomplishment Form */}
        <form onSubmit={handleAddAccomplishment} className="flex gap-2">
          <Input
            type="text"
            value={newAccomplishment}
            onChange={(e) => setNewAccomplishment(e.target.value)}
            placeholder="What did you accomplish?"
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !newAccomplishment.trim()}
          >
            <CornerDownLeft size={18} />
          </Button>
        </form>

        {/* Note about future automation */}
        <p className="text-xs text-muted-foreground italic">
          💡 Future: This will auto-track completed appointments, pipeline
          moves, and more
        </p>

        {/* Error Message */}
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    </Card>
  );
}
