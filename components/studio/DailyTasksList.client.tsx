/**
 * DAILY TASKS LIST - Interactive task management
 *
 * PURPOSE:
 * Allows users to create, check off, and delete daily tasks
 * Uses optimistic updates for instant UI feedback
 *
 * FEATURES:
 * - Add new tasks
 * - Toggle checkbox (mark complete)
 * - Delete tasks
 * - Optimistic UI updates
 */

"use client";

import { useState, useOptimistic, useTransition } from "react";
import { DailyTask } from "@/lib/database";
import {
  createDailyTaskAction,
  toggleDailyTaskAction,
  deleteDailyTaskAction,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Card from "@/components/studio/Card.server";
import { Trash2, CornerDownLeft } from 'lucide-react';

interface DailyTasksListProps {
  initialTasks: DailyTask[];
  titleName: string;
}

export default function DailyTasksList({
  initialTasks,
  titleName,
}: DailyTasksListProps) {
  const [isPending, startTransition] = useTransition();
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [error, setError] = useState("");

  // Optimistic state for instant UI updates
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (state: DailyTask[], { action, task, taskId }: { action: string; task?: DailyTask; taskId?: string }) => {
      switch (action) {
        case "add":
          return [...state, task!];
        case "toggle":
          return state.map((t) =>
            t.id === taskId ? { ...t, done: !t.done } : t
          );
        case "delete":
          return state.filter((t) => t.id !== taskId);
        default:
          return state;
      }
    }
  );

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;

    setError("");

    // Optimistic temporary task
    const tempTask: DailyTask = {
      id: `temp-${Date.now()}`,
      shop_id: "",
      created_by_user_id: "",
      label: newTaskLabel,
      done: false,
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    startTransition(async () => {
      setOptimisticTasks({ action: "add", task: tempTask });

      const result = await createDailyTaskAction(newTaskLabel);

      if (result.error) {
        setError(result.error);
      } else {
        setNewTaskLabel("");
      }
    });
  };

  const handleToggleTask = (taskId: string, currentDone: boolean) => {
    startTransition(async () => {
      setOptimisticTasks({ action: "toggle", taskId });
      const result = await toggleDailyTaskAction(taskId, currentDone);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const handleDeleteTask = (taskId: string) => {
    startTransition(async () => {
      setOptimisticTasks({ action: "delete", taskId });
      const result = await deleteDailyTaskAction(taskId);
      if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <Card title={titleName} subtitle="Track your daily progress">
      <div className="space-y-4">
        {/* Task List */}
        <ul className="space-y-2">
          {optimisticTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2 group hover:bg-accent/5 px-2 py-1 rounded transition-colors"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggleTask(task.id, task.done)}
                className="w-4 h-4 rounded border-input cursor-pointer"
              />

              {/* Task Label */}
              <span
                className={`flex-1 ${
                  task.done
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.label}
              </span>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-destructive hover:text-destructive/80 transition-opacity opacity-40 hover:opacity-100"
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}

          {optimisticTasks.length === 0 && (
            <li className="text-sm text-muted-foreground italic">
              No tasks yet. Add one below!
            </li>
          )}
        </ul>

        {/* Add New Task Form */}
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            type="text"
            value={newTaskLabel}
            onChange={(e) => setNewTaskLabel(e.target.value)}
            placeholder="Add new task..."
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !newTaskLabel.trim()}
          >
            <CornerDownLeft size={18} />
          </Button>
        </form>

        {/* Error Message */}
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    </Card>
  );
}
