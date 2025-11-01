/* 
the data file that will call the database funtions from here so we can 
pass this to the pages and call the functions
*/

import { Worker } from "@/lib/database";
import { verifyShopAccess } from "@/lib/utils/access-control";
import { SupabaseClient } from "@supabase/supabase-js";

// create a shop worker
export async function getShopWorkerData(
  shopId: string,
  userId: string,
  supabase: SupabaseClient
): Promise<Worker[]> {
  // 1. Validate inputs
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 3. Query data (ALWAYS with shop_id filter)
  const { data, error } = await supabase
    .from("shop_workers")
    .select("*")
    .eq("shop_id", shopId); // Belt AND suspenders

  if (error) throw error;

  // 4. Return typed data
  return data as Worker[];
}




// Create a shop worker for the data base using data it pulls from the funciton above
export async function createShopWorker(
  shopId: string,
  userId: string,
  workerData: Partial<Worker>,
  supabase: SupabaseClient
): Promise<Worker> {
  if (!shopId) throw new Error("shopId is requrired");
  if (!userId) throw new Error("userId is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: newWorker, error: workerError } = await supabase
    .from("shop_workers")
    .insert({
      shop_id: shopId,
      first_name: workerData.first_name,
      last_name: workerData.last_name,
      email: workerData.email,
      phone: workerData.phone,
      status: workerData.status,
      hire_date: workerData.hire_date,
      hourly_rate: workerData.hourly_rate,
      specialties: workerData.specialties,
      notes: workerData.notes,
      color: workerData.color,
    })
    .select()
    .single();

  if (workerError) {
    throw workerError;
  }

  return newWorker as Worker;
}



// Update clinet info cause we will them update stuff if anything changes for the clinet
export async function updateShopWorker(
  shopId: string,
  userId: string,
  workerId: string,
  workerData: Partial<Worker>,
  supabase: SupabaseClient
): Promise<Worker> {
  if (!shopId) throw new Error("shopId is requrired");
  if (!userId) throw new Error("userId is required");
  if (!workerId) throw new Error("workerId is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: updatedWorkerData, error: workerError } = await supabase
    .from("shop_workers")
    .update({
      first_name: workerData.first_name,
      last_name: workerData.last_name,
      email: workerData.email,
      phone: workerData.phone,
      status: workerData.status,
      hire_date: workerData.hire_date,
      hourly_rate: workerData.hourly_rate,
      specialties: workerData.specialties,
      notes: workerData.notes,
      color: workerData.color,
    })
    .eq("id", workerId)
    .eq("shop_id", shopId)
    .select()
    .single();

  if (workerError) {
    throw workerError;
  }

  return updatedWorkerData as Worker;
}






// delete a worker from shops
export async function deleteShopWorker(
  workerId: string,
  shopId: string,
  userId: string,
  supabase: SupabaseClient
) {
  // 1. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 2. Delete where BOTH match
  const { error } = await supabase
    .from("shop_workers")
    .delete()
    .eq("id", workerId)
    .eq("shop_id", shopId); // ← Security!

  if (error) throw error;
}
