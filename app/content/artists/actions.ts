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
  console.log("[createWorkerAction] START - Form data:", formData);

  try {
    // 1. Auth check
    console.log("[createWorkerAction] Step 1: Creating Supabase client");
    const supabase = await createClient();
    console.log("[createWorkerAction] Step 2: Getting user");
    const user = await getUserSafe(supabase);

    if (!user) {
      console.log("[createWorkerAction] ERROR: No user found");
      redirect("/auth/login");
    }

    console.log("[createWorkerAction] Step 3: User authenticated:", user.id);

    // 2. Get shop
    console.log("[createWorkerAction] Step 4: Getting shop ID for user:", user.id);
    const shopId = await getActiveShopIdFallback(user.id, supabase);
    if (!shopId) {
      console.log("[createWorkerAction] ERROR: No shop found for user");
      redirect("/onboarding");
    }

    console.log("[createWorkerAction] Step 5: Shop ID:", shopId);

    // 3. Create worker
    console.log("[createWorkerAction] Step 6: Calling createShopWorker");
    const newWorker = await createShopWorker(
      shopId,
      user.id,
      formData,
      supabase
    );

    console.log("[createWorkerAction] Step 7: Worker created:", newWorker);

    // 4. Revalidate
    revalidatePath("/content/artists");
    revalidatePath("/content/calendar");

    console.log("[createWorkerAction] SUCCESS");
    return { success: true, worker: newWorker };
  } catch (error) {
    console.error("[createWorkerAction] CAUGHT ERROR:", error);
    console.error("[createWorkerAction] Error type:", typeof error);
    console.error("[createWorkerAction] Error instanceof Error:", error instanceof Error);
    if (error instanceof Error) {
      console.error("[createWorkerAction] Error.name:", error.name);
      console.error("[createWorkerAction] Error.message:", error.message);
      console.error("[createWorkerAction] Error.stack:", error.stack);
    }

    // Better error serialization for Supabase errors
    let errorMessage = "Failed to create worker";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      // Handle Supabase error objects
      if ("message" in error) {
        errorMessage = String(error.message);
      } else {
        errorMessage = JSON.stringify(error);
      }
    } else {
      errorMessage = String(error);
    }

    return {
      success: false,
      error: errorMessage,
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
