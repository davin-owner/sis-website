/**
 * DATA LAYER: Accomplishments
 *
 * CRUD operations for dashboard accomplishments
 * NOTE: Currently manual entry, but designed for future automation
 *
 * Future automation sources could include:
 * - 'pipeline_move': When client moves to completed stage
 * - 'appointment_completed': When appointment is marked complete
 * - 'client_added': When new client is added
 * - etc.
 */

import { Accomplishment } from "@/lib/database";
import { verifyShopAccess } from "@/lib/utils/access-control";
import { SupabaseClient } from "@supabase/supabase-js";

// Get accomplishments for a shop (optionally filtered by date)
export async function getShopAccomplishments(
  shopId: string,
  userId: string,
  supabase: SupabaseClient,
  date?: string // YYYY-MM-DD format, defaults to today
): Promise<Accomplishment[]> {
  // 1. Validate inputs
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 3. Build query
  let query = supabase
    .from("accomplishments")
    .select("*")
    .eq("shop_id", shopId);

  // Filter by date if provided
  if (date) {
    query = query.eq("accomplishment_date", date);
  } else {
    // Default to today
    const today = new Date().toISOString().split("T")[0];
    query = query.eq("accomplishment_date", today);
  }

  // Order by creation time (most recent first)
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error;

  // 4. Return typed data
  return data as Accomplishment[];
}

// Create a new accomplishment
export async function createAccomplishment(
  shopId: string,
  userId: string,
  accomplishmentData: Partial<Accomplishment>,
  supabase: SupabaseClient
): Promise<Accomplishment> {
  if (!shopId) throw new Error("shopId is required");
  if (!userId) throw new Error("userId is required");
  if (!accomplishmentData.description)
    throw new Error("Accomplishment description is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // Default to today if no date provided
  const today = new Date().toISOString().split("T")[0];

  const { data: newAccomplishment, error: accomplishmentError } =
    await supabase
      .from("accomplishments")
      .insert({
        shop_id: shopId,
        created_by_user_id: userId,
        description: accomplishmentData.description,
        accomplishment_date: accomplishmentData.accomplishment_date || today,
        is_automated: accomplishmentData.is_automated || false,
        automation_source: accomplishmentData.automation_source || null,
      })
      .select()
      .single();

  if (accomplishmentError) throw accomplishmentError;

  return newAccomplishment as Accomplishment;
}

// Delete an accomplishment
export async function deleteAccomplishment(
  accomplishmentId: string,
  shopId: string,
  userId: string,
  supabase: SupabaseClient
) {
  // 1. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 2. Delete where BOTH match
  const { error } = await supabase
    .from("accomplishments")
    .delete()
    .eq("id", accomplishmentId)
    .eq("shop_id", shopId); // ← Security!

  if (error) throw error;
}

// Get accomplishments for a date range (for future reporting/analytics)
export async function getAccomplishmentsInRange(
  shopId: string,
  userId: string,
  startDate: string,
  endDate: string,
  supabase: SupabaseClient
): Promise<Accomplishment[]> {
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("accomplishments")
    .select("*")
    .eq("shop_id", shopId)
    .gte("accomplishment_date", startDate)
    .lte("accomplishment_date", endDate)
    .order("accomplishment_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Accomplishment[];
}
