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

interface WaitlistSignup {
  name: string;
  email?: string | null;
  phone?: string | null;
  shop_name?: string | null;
  city_state?: string | null;
  message?: string | null;
}

interface WaitlistRecord extends WaitlistSignup {
  id: string;
  created_at: string;
}

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
export const saveWaitlistSignup = async (data: WaitlistSignup): Promise<WaitlistRecord> => {
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
    throw new Error(
      `Failed to save waitlist signup: ${
        error.message || JSON.stringify(error)
      }`
    );
  }

  if (!savedData || savedData.length === 0) {
    throw new Error('No data returned from waitlist signup');
  }

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
export const getAllWaitlistSignups = async (): Promise<WaitlistRecord[]> => {
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false }); // Newest first

  if (error) {
    throw error;
  }

  return data || [];
};
