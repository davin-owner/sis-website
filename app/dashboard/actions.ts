"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { revalidatePath } from "next/cache";
import {
  createDailyTask,
  updateDailyTask,
  deleteDailyTask,
} from "@/lib/supabase/data/dashboard-tasks-data";
import {
  createAccomplishment,
  deleteAccomplishment,
} from "@/lib/supabase/data/dashboard-accomplishments-data";
import {
  createReminder,
  updateReminder,
  deleteReminder,
} from "@/lib/supabase/data/dashboard-reminders-data";
import { DailyTask, Accomplishment, Reminder } from "@/lib/database";

// ========================================
// DAILY TASKS ACTIONS
// ========================================

export async function createDailyTaskAction(label: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    const newTask = await createDailyTask(
      shopId,
      user.id,
      { label, done: false },
      supabase
    );
    revalidatePath("/dashboard");
    return { success: true, task: newTask };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.error_description || String(error);
    console.error("Create daily task error:", errorMessage, error);
    return { error: errorMessage };
  }
}

export async function toggleDailyTaskAction(taskId: string, currentDone: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    await updateDailyTask(
      shopId,
      user.id,
      taskId,
      { done: !currentDone },
      supabase
    );
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.error_description || String(error);
    console.error("Toggle daily task error:", errorMessage, error);
    return { error: errorMessage };
  }
}

export async function deleteDailyTaskAction(taskId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    await deleteDailyTask(taskId, shopId, user.id, supabase);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.error_description || String(error);
    console.error("Delete daily task error:", errorMessage, error);
    return { error: errorMessage };
  }
}

// ========================================
// ACCOMPLISHMENTS ACTIONS
// ========================================

export async function createAccomplishmentAction(description: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    const newAccomplishment = await createAccomplishment(
      shopId,
      user.id,
      { description },
      supabase
    );
    revalidatePath("/dashboard");
    return { success: true, accomplishment: newAccomplishment };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.error_description || String(error);
    console.error("Create accomplishment error:", errorMessage, error);
    return { error: errorMessage };
  }
}

export async function deleteAccomplishmentAction(accomplishmentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    await deleteAccomplishment(accomplishmentId, shopId, user.id, supabase);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.error_description || String(error);
    console.error("Delete accomplishment error:", errorMessage, error);
    return { error: errorMessage };
  }
}

// ========================================
// REMINDERS/GOALS ACTIONS
// ========================================

export async function createReminderAction(
  title: string,
  type: "reminder" | "goal" | "urgent"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    const newReminder = await createReminder(
      shopId,
      user.id,
      { title, type },
      supabase
    );
    revalidatePath("/dashboard");
    return { success: true, reminder: newReminder };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.error_description || String(error);
    console.error("Create reminder error:", errorMessage, error);
    return { error: errorMessage };
  }
}

export async function toggleReminderCompleteAction(
  reminderId: string,
  currentCompleted: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    await updateReminder(
      shopId,
      user.id,
      reminderId,
      { is_completed: !currentCompleted },
      supabase
    );
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.error_description || String(error);
    console.error("Toggle reminder complete error:", errorMessage, error);
    return { error: errorMessage };
  }
}

export async function deleteReminderAction(reminderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not Authenticated");

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) throw Error("No Shops Found Under User!");

  try {
    await deleteReminder(reminderId, shopId, user.id, supabase);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.error_description || String(error);
    console.error("Delete reminder error:", errorMessage, error);
    return { error: errorMessage };
  }
}
