/**
 * REMINDERS LIST - Goals and reminders tracker
 *
 * PURPOSE:
 * Allows users to create and manage reminders, goals, and urgent items
 *
 * FEATURES:
 * - Add new reminders/goals/urgent items
 * - Toggle complete status
 * - Delete reminders
 * - Type categorization (reminder/goal/urgent)
 * - Optimistic UI updates
 */

"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Reminder } from "@/lib/database";
import {
  createReminderAction,
  toggleReminderCompleteAction,
  deleteReminderAction,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Card from "@/components/studio/Card.server";
import { Trash2, CornerDownLeft, Check, Bell, Target, AlertCircle } from 'lucide-react';

interface RemindersListProps {
  initialReminders: Reminder[];
}

export default function RemindersList({
  initialReminders,
}: RemindersListProps) {
  const [isPending, startTransition] = useTransition();
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [selectedType, setSelectedType] = useState<
    "reminder" | "goal" | "urgent"
  >("reminder");
  const [error, setError] = useState("");

  // Optimistic state
  const [optimisticReminders, setOptimisticReminders] = useOptimistic(
    initialReminders,
    (state: Reminder[], { action, reminder, reminderId }: { action: string; reminder?: Reminder; reminderId?: string }) => {
      switch (action) {
        case "add":
          return [reminder!, ...state];
        case "toggle":
          return state.map((r) =>
            r.id === reminderId ? { ...r, is_completed: !r.is_completed } : r
          );
        case "delete":
          return state.filter((r) => r.id !== reminderId);
        default:
          return state;
      }
    }
  );

  // Calculate counts by type
  const counts = optimisticReminders.reduce(
    (acc, reminder) => {
      if (!reminder.is_completed) {
        if (reminder.type === "urgent") acc.urgent++;
        else if (reminder.type === "goal") acc.goals++;
        else acc.reminders++;
      }
      return acc;
    },
    { reminders: 0, goals: 0, urgent: 0 }
  );

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;

    setError("");

    // Optimistic temporary reminder
    const tempReminder: Reminder = {
      id: `temp-${Date.now()}`,
      shop_id: "",
      created_by_user_id: "",
      title: newReminderTitle,
      description: null,
      type: selectedType,
      due_date: null,
      is_completed: false,
      completed_at: null,
      priority: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    startTransition(async () => {
      setOptimisticReminders({ action: "add", reminder: tempReminder });

      const result = await createReminderAction(newReminderTitle, selectedType);

      if (result.error) {
        setError(result.error);
      } else {
        setNewReminderTitle("");
      }
    });
  };

  const handleToggleReminder = (
    reminderId: string,
    currentCompleted: boolean
  ) => {
    startTransition(async () => {
      setOptimisticReminders({ action: "toggle", reminderId });
      const result = await toggleReminderCompleteAction(
        reminderId,
        currentCompleted
      );
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const handleDeleteReminder = (reminderId: string) => {
    startTransition(async () => {
      setOptimisticReminders({ action: "delete", reminderId });
      const result = await deleteReminderAction(reminderId);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle size={16} />;
      case "goal":
        return <Target size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "text-destructive";
      case "goal":
        return "text-accent";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card title="Reminders & Goals">
      <div className="space-y-4">
        {/* Count Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="surface-elevated p-2 rounded">
            <div className="text-xl font-bold text-foreground">
              {counts.goals}
            </div>
            <div className="text-xs text-muted-foreground">Goals</div>
          </div>
          <div className="surface-elevated p-2 rounded">
            <div className="text-xl font-bold text-foreground">
              {counts.reminders}
            </div>
            <div className="text-xs text-muted-foreground">Reminders</div>
          </div>
          <div className="surface-elevated p-2 rounded">
            <div className="text-xl font-bold text-destructive">
              {counts.urgent}
            </div>
            <div className="text-xs text-muted-foreground">Urgent</div>
          </div>
        </div>

        {/* Reminders List */}
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {optimisticReminders
            .filter((r) => !r.is_completed)
            .map((reminder) => (
              <li
                key={reminder.id}
                className="flex items-center gap-2 group hover:bg-accent/5 px-2 py-1 rounded transition-colors"
              >
                {/* Type Icon */}
                <span className={`${getTypeColor(reminder.type)}`}>
                  {getTypeIcon(reminder.type)}
                </span>

                {/* Title */}
                <span className="flex-1 text-sm text-foreground">
                  {reminder.title}
                </span>

                {/* Complete Button */}
                <button
                  onClick={() =>
                    handleToggleReminder(reminder.id, reminder.is_completed)
                  }
                  className="opacity-40 hover:opacity-100 text-accent hover:text-accent/80 transition-opacity"
                  aria-label="Mark complete"
                  title="Mark complete"
                >
                  <Check size={16} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteReminder(reminder.id)}
                  className="opacity-40 hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity"
                  aria-label="Delete reminder"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}

          {optimisticReminders.filter((r) => !r.is_completed).length === 0 && (
            <li className="text-sm text-muted-foreground italic text-center py-4">
              No active reminders
            </li>
          )}
        </ul>

        {/* Add New Reminder Form */}
        <form onSubmit={handleAddReminder} className="space-y-2">
          {/* Type Selector */}
          <div className="flex gap-2">
            {(["goal", "reminder", "urgent"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`flex-1 px-3 py-1 text-xs rounded transition-colors ${
                  selectedType === type
                    ? "surface-elevated text-accent border border-accent"
                    : "surface border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Input and Add Button */}
          <div className="flex gap-2">
            <Input
              type="text"
              value={newReminderTitle}
              onChange={(e) => setNewReminderTitle(e.target.value)}
              placeholder={`Add new ${selectedType}...`}
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isPending || !newReminderTitle.trim()}
            >
              <CornerDownLeft size={18} />
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </Card>
  );
}
