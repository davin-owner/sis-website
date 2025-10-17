// this file will be able to get
import { createClient } from "../client";

export const getUserShops = async (userId, supabaseClient = null) => {
  const supabase = supabaseClient || createClient();
  const { data, error } = await supabase
    .from("shop_users")
    .select("shop_id, role, permissions, last_accessed_at, shops_tables(*)")
    .eq("user_id", userId)
    .order("last_accessed_at", { ascending: false });

  // Error Handeling
  if (error) {
    console.error("Error fetching Shop User Data", error);
    throw error;
  }
  if (!data || data.length === 0) {
    console.log("No Shops found for User!", userId);
    return []; // Returns empty array instead of null
  }

  // Flattening the data for easier reading and coding

  const flattendShopUser = data.map((item) => ({
    shop_id: item.shop_id,
    role: item.role,
    permissions: item.permissions,
    last_accessed_at: item.last_accessed_at,

    // Nested level data shops_tables
    shop_name: item.shops_tables.shop_name,
    shop_address: item.shops_tables.shop_addresss,
    amount_of_workers: item.shops_tables.amount_of_workers,
    created_at: item.shops_tables.created_at,
  }));

  return flattendShopUser;
};

export const getActiveShop = async (userId, shopId, supabaseClient = null) => {
  const supabase = supabaseClient || createClient();
  const { data, error } = await supabase
    .from("shop_users")
    .select("shop_id, role, permissions, last_accessed_at, shops_tables(*)")
    .eq("user_id", userId)
    .eq("shop_id", shopId)
    .single();

  // Check if error exists AND if its code equals "PGRST116"
  if (error && error.code === "PGRST116") {
    console.log("User does not have access to shop:", shopId);
    return null; // Return null to indicate "no access"
  } else if (error) {
    console.error("Error fetching active shop:", error);
    throw error;
  }

  // Just create a new object directly (NO .map())
  const flattenedData = {
    shop_id: data.shop_id,
    role: data.role,
    permissions: data.permissions,
    last_accessed_at: data.last_accessed_at,
    shop_name: data.shops_tables.shop_name,
    shop_address: data.shops_tables.shop_address,
    amount_of_workers: data.shops_tables.amount_of_workers,
    created_at: data.shops_tables.created_at,
  };

  return flattenedData;
};

/**
 * Create a new shop AND give the user owner access
 *
 * This function does TWO database operations:
 * 1. Create the shop in shops_tables
 * 2. Add user to shop_users as owner
 *
 * If step 2 fails, we rollback step 1 (delete the shop)
 */
export const createShopWithOwner = async (userId, shopData, supabaseClient = null) => {
  const supabase = supabaseClient || createClient();

  // ===================================================================
  // STEP 1: Create the shop in shops_tables
  // ===================================================================
  const { data: newShop, error: shopError } = await supabase
    .from("shops_tables")
    .insert({
      shop_name: shopData.shop_name,           // User provides this
      shop_address: shopData.shop_address,     // User provides this
      amount_of_workers: shopData.amount_of_workers || 1,  // Default to 1 if not provided
      shop_owner: userId,                      // Set the owner (for backwards compatibility)
    })
    .select()   // Return the newly created shop
    .single();  // We only inserted one row, so expect one result

  // Check if shop creation failed
  if (shopError) {
    console.error("Error creating shop:", shopError);
    throw shopError;  // Stop here, don't continue to step 2
  }

  console.log("Shop created successfully:", newShop.shop_name);

  // ===================================================================
  // STEP 2: Add user to shop_users (give them owner access)
  // ===================================================================
  const { error: junctionError } = await supabase
    .from("shop_users")
    .insert({
      user_id: userId,                  // The user creating the shop
      shop_id: newShop.shop_id,         // The shop we just created (from step 1)
      role: "owner",                    // Their role
      permissions: {                    // Full permissions for owner
        can_edit_settings: true,
        can_manage_workers: true,
        can_manage_leads: true,
        can_view_reports: true,
        can_delete_shop: true,
      },
      last_accessed_at: new Date().toISOString(),  // Set to now
    });

  // ===================================================================
  // ERROR HANDLING: If step 2 failed, rollback step 1
  // ===================================================================
  if (junctionError) {
    console.error("Error adding user to shop_users:", junctionError);

    // ROLLBACK: Delete the shop we just created
    console.log("Rolling back: Deleting shop", newShop.shop_id);
    await supabase
      .from("shops_tables")
      .delete()
      .eq("shop_id", newShop.shop_id);

    throw junctionError;  // Throw the error so caller knows it failed
  }

  console.log("User added to shop_users successfully");

  // ===================================================================
  // SUCCESS: Return the newly created shop
  // ===================================================================
  return newShop;
};
