/**
 * DATA LAYER: Daily Tasks
 *
 * CRUD operations for dashboard daily tasks
 * All operations include:
 * - Input validation
 * - Access control via verifyShopAccess
 * - shop_id filter for RLS security
 */

import { DailyTask } from "@/lib/database";
import { verifyShopAccess } from "@/lib/utils/access-control";
import { SupabaseClient } from "@supabase/supabase-js";

// Get all daily tasks for a shop
export async function getShopDailyTasks(
  shopId: string,
  userId: string,
  supabase: SupabaseClient
): Promise<DailyTask[]> {
  // 1. Validate inputs
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 3. Query data (ALWAYS with shop_id filter)
  const { data, error } = await supabase
    .from("daily_tasks")
    .select("*")
    .eq("shop_id", shopId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  // 4. Return typed data
  return data as DailyTask[];
}

// Create a new daily task
export async function createDailyTask(
  shopId: string,
  userId: string,
  taskData: Partial<DailyTask>,
  supabase: SupabaseClient
): Promise<DailyTask> {
  if (!shopId) throw new Error("shopId is required");
  if (!userId) throw new Error("userId is required");
  if (!taskData.label) throw new Error("Task label is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: newTask, error: taskError } = await supabase
    .from("daily_tasks")
    .insert({
      shop_id: shopId,
      created_by_user_id: userId,
      label: taskData.label,
      done: taskData.done || false,
      sort_order: taskData.sort_order || 0,
    })
    .select()
    .single();

  if (taskError) throw taskError;

  return newTask as DailyTask;
}

// Update a daily task
export async function updateDailyTask(
  shopId: string,
  userId: string,
  taskId: string,
  taskData: Partial<DailyTask>,
  supabase: SupabaseClient
): Promise<DailyTask> {
  if (!shopId) throw new Error("shopId is required");
  if (!userId) throw new Error("userId is required");
  if (!taskId) throw new Error("taskId is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: updatedTask, error: taskError } = await supabase
    .from("daily_tasks")
    .update({
      label: taskData.label,
      done: taskData.done,
      sort_order: taskData.sort_order,
    })
    .eq("id", taskId)
    .eq("shop_id", shopId)
    .select()
    .single();

  if (taskError) throw taskError;

  return updatedTask as DailyTask;
}

// Delete a daily task
export async function deleteDailyTask(
  taskId: string,
  shopId: string,
  userId: string,
  supabase: SupabaseClient
) {
  // 1. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 2. Delete where BOTH match
  const { error } = await supabase
    .from("daily_tasks")
    .delete()
    .eq("id", taskId)
    .eq("shop_id", shopId); // ← Security!

  if (error) throw error;
}

// Toggle task done status (convenience function)
export async function toggleDailyTaskDone(
  taskId: string,
  shopId: string,
  userId: string,
  currentDoneStatus: boolean,
  supabase: SupabaseClient
): Promise<DailyTask> {
  return updateDailyTask(
    shopId,
    userId,
    taskId,
    { done: !currentDoneStatus },
    supabase
  );
}
