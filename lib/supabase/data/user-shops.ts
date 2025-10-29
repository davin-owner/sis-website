// this file will be able to get
import { createClient } from "../client";
import { SupabaseClient } from "@supabase/supabase-js";
import { verifyShopAccess } from "@/lib/utils/access-control";

export async function getActiveShop(
  userId: string,
  shopId: string,
  supabase: SupabaseClient
) {
  // 1. Validate inputs
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: relationShipData, error: relationShipError } = await supabase
    .from("shop_users")
    .select("shop_id, role, permissions, last_accessed_at")
    .eq("user_id", userId)
    .eq("shop_id", shopId)
    .single();

  const { data: shopData, error } = await supabase
    .from("shops_tables")
    .select("*")
    .eq("shop_id", shopId)
    .single();

  // Check if error exists AND if its code equals "PGRST116"
  if (
    (relationShipError || error) &&
    (relationShipError?.code || error?.code) === "PGRST116"
  ) {
    return null; // Return null to indicate "no access"
  } else if (relationShipError || error) {
    throw relationShipError || error;
  }

  // Just create a new object directly (NO .map())
  const flattenedData = {
    shop_id: relationShipData.shop_id,
    role: relationShipData.role,
    permissions: relationShipData.permissions,
    last_accessed_at: relationShipData.last_accessed_at,
    shop_name: shopData.shop_name,
    shop_address: shopData.shop_address,
    amount_of_workers: shopData.amount_of_workers,
    created_at: shopData.created_at,
  };

  return flattenedData;
}

/**
 * Create a new shop AND give the user owner access
 *
 * This function does TWO database operations:
 * 1. Create the shop in shops_tables
 * 2. Add user to shop_users as owner
 *
 * If step 2 fails, we rollback step 1 (delete the shop)
 */
export async function createShopWithOwner(
  userId: string,
  shopData: { shop_name: string; shop_address: string; amount_of_workers?: number },
  supabase: SupabaseClient
) {
  // ===================================================================
  // STEP 1: Create the shop in shops_tables
  // ===================================================================
  const { data: newShop, error: shopError } = await supabase
    .from("shops_tables")
    .insert({
      shop_name: shopData.shop_name, // User provides this
      shop_address: shopData.shop_address, // User provides this
      amount_of_workers: shopData.amount_of_workers || 1, // Default to 1 if not provided
      shop_owner: userId, // Set the owner (for backwards compatibility)
    })
    .select() // Return the newly created shop
    .single(); // We only inserted one row, so expect one result

  // Check if shop creation failed
  if (shopError) {
    throw shopError; // Stop here, don't continue to step 2
  }

  // ===================================================================
  // STEP 2: Add user to shop_users (give them owner access)
  // ===================================================================
  const { error: junctionError } = await supabase.from("shop_users").insert({
    user_id: userId, // The user creating the shop
    shop_id: newShop.shop_id, // The shop we just created (from step 1)
    role: "owner", // Their role
    permissions: {
      // Full permissions for owner
      can_edit_settings: true,
      can_manage_workers: true,
      can_manage_leads: true,
      can_view_reports: true,
      can_delete_shop: true,
    },
    last_accessed_at: new Date().toISOString(), // Set to now
  });

  // ===================================================================
  // ERROR HANDLING: If step 2 failed, rollback step 1
  // ===================================================================
  if (junctionError) {
    // ROLLBACK: Delete the shop we just created
    await supabase.from("shops_tables").delete().eq("shop_id", newShop.shop_id);

    throw junctionError; // Throw the error so caller knows it failed
  }

  // ===================================================================
  // SUCCESS: Return the newly created shop
  // ===================================================================
  return newShop;
}
