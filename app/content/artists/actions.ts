"use server";
// SERVER ACTIONS for Workers/Artists management

import { createClient } from "@/lib/supabase/server";
import { getUserSafe } from "@/lib/auth/get-user-safe";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { redirect } from "next/navigation";
import {
  createShopWorker,
  updateShopWorker,
  deleteShopWorker,
} from "@/lib/supabase/data/workers-data";
import { Worker } from "@/lib/database";
import { revalidatePath } from "next/cache";

export async function createWorkerAction(
  formData: Partial<Worker>
): Promise<{ success: boolean; worker?: Worker; error?: string }> {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const user = await getUserSafe(supabase);

    if (!user) {
      redirect("/auth/login");
    }

    // 2. Get shop
    const shopId = await getActiveShopIdFallback(user.id, supabase);
    if (!shopId) {
      redirect("/onboarding");
    }

    // 3. Create worker
    const newWorker = await createShopWorker(
      shopId,
      user.id,
      formData,
      supabase
    );

    // 4. Revalidate
    revalidatePath("/content/artists");
    revalidatePath("/content/calendar");

    return { success: true, worker: newWorker };
  } catch (error) {
    console.error("Error creating worker:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create worker",
    };
  }
}

export async function updateWorkerAction(
  workerId: string,
  formData: Partial<Worker>
): Promise<{ success: boolean; worker?: Worker; error?: string }> {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const user = await getUserSafe(supabase);

    if (!user) {
      redirect("/auth/login");
    }

    // 2. Get shop
    const shopId = await getActiveShopIdFallback(user.id, supabase);
    if (!shopId) {
      redirect("/onboarding");
    }

    // 3. Update worker
    const updatedWorker = await updateShopWorker(
      shopId,
      user.id,
      workerId,
      formData,
      supabase
    );

    // 4. Revalidate
    revalidatePath("/content/artists");
    revalidatePath("/content/calendar");

    return { success: true, worker: updatedWorker };
  } catch (error) {
    console.error("Error updating worker:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update worker",
    };
  }
}

export async function deleteWorkerAction(
  workerId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const user = await getUserSafe(supabase);

    if (!user) {
      redirect("/auth/login");
    }

    // 2. Get shop
    const shopId = await getActiveShopIdFallback(user.id, supabase);
    if (!shopId) {
      redirect("/onboarding");
    }

    // 3. Delete worker
    await deleteShopWorker(workerId, shopId, user.id, supabase);

    // 4. Revalidate
    revalidatePath("/content/artists");
    revalidatePath("/content/calendar");

    return { success: true };
  } catch (error) {
    console.error("Error deleting worker:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete worker",
    };
  }
}
