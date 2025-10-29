/**
 * SHOP DATA - Database operations for shops_tables
 * Pattern: Each function is async because database calls take time
 */

import { supabase } from "../../supabase.js";
export const getShopData = async () => {
  // Make the database query - this is an async operation
  // Supabase returns { data, error } - destructure it
  const { data, error } = await supabase.from("shops_tables").select();

  // Check if the query failed
  if (error) {
    console.error("Error fetching shop data:", error);
    // Throw the error so the API route can catch it and return 500
    throw error;
  }

  // Log success for debugging
  // Fetched Data successfully or if it has no data
  if (!data || data.length === 0) {
    console.log("No Shops found!");
    return data;
  } else console.log("Shop Data fetch successfully:", data);

  // Return the data array
  return data;
};
