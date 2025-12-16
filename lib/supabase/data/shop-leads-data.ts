import { ShopLeads } from "@/lib/database";
import { verifyShopAccess } from "@/lib/utils/access-control";
import { SupabaseClient } from "@supabase/supabase-js";

/*
Why do we split these functions cause we want to be able to pull data from one file and no reason to rewrite the fucntion so just have this one that we can call from anywhere.

ex for the update and create function but also for the data page
*/

// Pulls data for the ShopLeads to use anywhere
export async function fetchShopLeadData(
  shopId: string,
  userId: string,
  supabase: SupabaseClient
): Promise<ShopLeads[]> {
  // 1. Validate inputs
  if (!shopId) throw new Error("shop_id is required");
  if (!userId) throw new Error("user_id is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 3. Query data (ALWAYS with shop_id filter)
  const { data, error } = await supabase
    .from("shop_leads")
    .select("*")
    .eq("shop_id", shopId); // Belt AND suspenders

  if (error) throw error;

  // 4. Return typed data
  return data as ShopLeads[];
}
// Create a shop client for the data base using data it pulls from the funciton above
export async function createShopClient(
  shopId: string,
  userId: string,
  clientData: Partial<ShopLeads>,
  supabase: SupabaseClient
): Promise<ShopLeads> {
  if (!shopId) throw new Error("shopId is requrired");
  if (!userId) throw new Error("userId is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: newClient, error: clientError } = await supabase
    .from("shop_leads")
    .insert({
      shop_id: shopId,
      name: clientData.name,
      contact_email: clientData.contact_email,
      contact_phone: clientData.contact_phone, // Fixed: use contact_phone
      notes: clientData.notes,
      perfered_artist_id: clientData.artists, // Fixed: map to correct DB column
      session_count: clientData.session_count,
      deposit_status: clientData.deposit_status,
      pipeline_stage: clientData.pipeline_stage || "leads",
      sort_order: 0,
    })
    .select()
    .single();

  if (clientError) {
    console.error('[createShopClient] Database error:', clientError);
    // Serialize Supabase error properly for server actions
    throw new Error(
      clientError.message ||
      JSON.stringify(clientError) ||
      'Failed to create client'
    );
  }

  return newClient as ShopLeads;
}

// Update clinet info cause we will them update stuff if anything changes for the clinet
export async function updateShopClient(
  shopId: string,
  userId: string,
  clientId: string,
  clientData: Partial<ShopLeads>,
  supabase: SupabaseClient
): Promise<ShopLeads> {
  if (!shopId) throw new Error("shopId is requrired");
  if (!userId) throw new Error("userId is required");
  if (!clientId) throw new Error("clientId is required");

  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  const { data: updatedClinetData, error: clientError } = await supabase
    .from("shop_leads")
    .update({
      name: clientData.name,
      contact_email: clientData.contact_email,
      contact_phone: clientData.contact_phone, // Fixed: use contact_phone
      notes: clientData.notes,
      perfered_artist_id: clientData.artists, // Fixed: map to correct DB column
      session_count: clientData.session_count,
      deposit_status: clientData.deposit_status,
    })
    .eq("id", clientId)
    .eq("shop_id", shopId)
    .select()
    .single();

  if (clientError) {
    throw clientError;
  }

  return updatedClinetData as ShopLeads;
}

//  This function will handle drag-and-drop:

export async function updateClientStage(
  clientId: string,
  shopId: string,
  userId: string,
  newStage: string, // 'leads', 'consulting', etc.
  newSortOrder: number, // UI calculates this (the midpoint)
  supabase: SupabaseClient
): Promise<ShopLeads> {
  // 1. Validate
  if (!clientId) throw new Error("clientId is required");
  if (!shopId) throw new Error("shopId is required");
  if (!userId) throw new Error("userId is required");

  // 2. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 3. Update pipeline_stage and sort_order
  const { data: updatedClient, error } = await supabase
    .from("shop_leads")
    .update({
      pipeline_stage: newStage,
      sort_order: newSortOrder,
    })
    .eq("id", clientId)
    .eq("shop_id", shopId)
    .select()
    .single();

  if (error) throw error;

  return updatedClient as ShopLeads;
}

export async function deleteShopClient(
  clientId: string,
  shopId: string,
  userId: string,
  supabase: SupabaseClient
) {
  // 1. Verify access
  const hasAccess = await verifyShopAccess(userId, shopId, supabase);
  if (!hasAccess) throw new Error("Unauthorized");

  // 2. Delete where BOTH match
  const { error } = await supabase
    .from("shop_leads")
    .delete()
    .eq("id", clientId)
    .eq("shop_id", shopId); // ← Security!

  if (error) throw error;
}
