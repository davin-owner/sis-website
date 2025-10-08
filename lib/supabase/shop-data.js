/**
 * SHOP DATA - Database operations for shops_tables
 *
 * This file contains all CRUD (Create, Read, Update, Delete) operations
 * for the shops_tables table in Supabase.
 *
 * Pattern: Each function is async because database calls take time
 */

import { supabase } from "../supabase.js";

/**
 * GET SHOP DATA
 * Fetches all shops from the shops_tables table
 *
 * @returns {Promise<Array>} Array of shop objects from database
 * @throws {Error} If database query fails
 */
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
  console.log("Shop data fetched successfully:", data);

  // Return the data array
  return data;
};
