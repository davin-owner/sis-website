/**
 * SHOP DATA - Database operations for shops_tables
 * Pattern: Each function is async because database calls take time
 */

import { supabase } from "../../supabase.js";

interface Shop {
  shop_id: string;
  shop_name: string;
  owner_id: string;
  subscription_tier: string;
  subscription_status: string | null;
  polar_customer_id: string | null;
  polar_subscription_id: string | null;
  subscription_created_at: string | null;
  created_at: string;
}

export const getShopData = async (): Promise<Shop[]> => {
  // Make the database query - this is an async operation
  // Supabase returns { data, error } - destructure it
  const { data, error } = await supabase.from("shops_tables").select();

  // Check if the query failed
  if (error) {
    // Throw the error so the API route can catch it and return 500
    throw error;
  }

  // Return the data array (empty array if no shops found)
  return data || [];
};
