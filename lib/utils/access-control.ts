//This file is going to be for access control and how we verfiy shops

import { SupabaseClient } from "@supabase/supabase-js";

//  verifyShopAccess() will the main function that we can call in the project
/*
they must have a user id thats authed 
they must have a valid shop id that matches 
and must be a supabaseClient
*/

// Better: Explicit validation
export async function verifyShopAccess(
  userId: string,
  shopId: string,
  supabase: SupabaseClient
): Promise<boolean> {
  // Guard clause
  if (!userId || !shopId) {
    return false; // Or throw error?
  }

  const { data, error } = await supabase
    .from("shop_users")
    .select("shop_id")
    .eq("user_id", userId)
    .eq("shop_id", shopId)
    .single();

  return !!data && !error;
}
