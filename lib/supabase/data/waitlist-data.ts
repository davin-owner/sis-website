/**
 * WAITLIST DATA - Database operations for waitlist signups
 *
 * This file handles saving lead information to the Supabase waitlist table
 *
 * SECURITY NOTE:
 * This uses the PUBLIC supabase client because the waitlist form
 * is accessible to non-authenticated users (client component).
 * The RLS policies on the waitlist table protect the data:
 * - Anyone can INSERT (sign up)
 * - Only authenticated users can SELECT (view leads)
 */

import { createBrowserClient } from "@supabase/ssr";

// Create a client-side Supabase client for public access
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

/**
 * SAVE WAITLIST SIGNUP
 *
 * Takes signup data from the modal form and inserts it into
 * the Supabase waitlist table
 *
 * @param data - The signup data
 * @param data.name - Person's name (REQUIRED)
 * @param data.email - Email address (optional)
 * @param data.phone - Phone number (optional)
 * @param data.shop_name - Shop name (optional)
 * @param data.city_state - City and state (optional)
 * @param data.message - Free-form message (optional)
 *
 * @returns The saved waitlist record
 * @throws Error if save fails
 */
export const saveWaitlistSignup = async (data: {
  name: string;
  email: string | null;
  phone: string | null;
  shop_name: string | null;
  city_state: string | null;
  message: string | null;
}) => {
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
    throw new Error(
      `Failed to save waitlist signup: ${
        error.message || JSON.stringify(error)
      }`
    );
  }

  // Success! Return the saved record
  return savedData[0];
};

/**
 * GET ALL WAITLIST SIGNUPS (Admin Only)
 *
 * Fetches all waitlist signups from the database
 * Only works if user is authenticated (RLS policy protects this)
 *
 * @returns Array of waitlist signups
 * @throws Error if fetch fails or user not authenticated
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
