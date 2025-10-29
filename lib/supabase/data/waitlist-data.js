/**
 * WAITLIST DATA - Database operations for waitlist signups
 *
 * This file handles saving lead information to the Supabase waitlist table
 *
 * SECURITY NOTE:
 * This uses the PUBLIC supabase client because the waitlist form
 * is accessible to non-authenticated users. The RLS policies on the
 * waitlist table protect the data:
 * - Anyone can INSERT (sign up)
 * - Only authenticated users can SELECT (view leads)
 */

import { supabase } from "../../supabase.js";

/**
 * SAVE WAITLIST SIGNUP
 *
 * Takes signup data from the modal form and inserts it into
 * the Supabase waitlist table
 *
 * @param {Object} data - The signup data
 * @param {string} data.name - Person's name (REQUIRED)
 * @param {string|null} data.email - Email address (optional)
 * @param {string|null} data.phone - Phone number (optional)
 * @param {string|null} data.shop_name - Shop name (optional)
 * @param {string|null} data.city_state - City and state (optional)
 * @param {string|null} data.message - Free-form message (optional)
 *
 * @returns {Promise<Object>} The saved waitlist record
 * @throws {Error} If save fails
 */
export const saveWaitlistSignup = async (data) => {
  // Insert the data into the waitlist table
  const { data: savedData, error } = await supabase
    .from("waitlist")
    .insert([
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        shop_name: data.shop_name,
        city_state: data.city_state,
        message: data.message,
        // created_at is automatically set by the database
      },
    ])
    .select(); // Return the inserted row

  // Check if insert failed
  if (error) {
    console.error("Error saving waitlist signup:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error(
      `Failed to save waitlist signup: ${
        error.message || JSON.stringify(error)
      }`
    );
  }

  // Success! Log for debugging
  console.log("Waitlist signup saved:", savedData);

  return savedData[0]; // Return the saved record
};

/**
 * GET ALL WAITLIST SIGNUPS (Admin Only)
 *
 * Fetches all waitlist signups from the database
 * Only works if user is authenticated (RLS policy protects this)
 *
 * @returns {Promise<Array>} Array of waitlist signups
 * @throws {Error} If fetch fails or user not authenticated
 */
export const getAllWaitlistSignups = async () => {
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false }); // Newest first

  if (error) {
    console.error("Error fetching waitlist signups:", error);
    throw error;
  }

  return data;
};
