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
    console.log("[createWorkerAction] Step 1: Getting user...");
    const user = await getUserSafe(supabase);

    if (!user) {
      console.error("[createWorkerAction] No user found, redirecting to login");
      redirect("/auth/login");
    }

    console.log("[createWorkerAction] Step 2: User authenticated:", user.id);

    // 2. Get shop
    const shopId = await getActiveShopIdFallback(user.id, supabase);
    if (!shopId) {
      console.error("[createWorkerAction] No shop found, redirecting to onboarding");
      redirect("/onboarding");
    }

    console.log("[createWorkerAction] Step 3: Shop ID:", shopId);
    console.log("[createWorkerAction] Step 4: Worker data:", formData);

    // 3. Create worker
    const newWorker = await createShopWorker(
      shopId,
      user.id,
      formData,
      supabase
    );

    console.log("[createWorkerAction] Step 5: Worker created successfully:", newWorker.id);

    // 4. Revalidate
    revalidatePath("/content/artists");
    revalidatePath("/content/calendar");

    return { success: true, worker: newWorker };
  } catch (error) {
    console.error("[createWorkerAction] ERROR:", error);
    console.error("[createWorkerAction] Error type:", typeof error);
    console.error("[createWorkerAction] Error details:", error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error);
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
