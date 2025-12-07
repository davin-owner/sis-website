/**
 * Safe wrapper for Supabase getUser() that handles Edge Runtime compatibility
 *
 * Supabase's auth.getUser() can fail in Edge Runtime due to Node.js API usage.
 * This wrapper catches those errors and returns null instead of throwing.
 */

import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserSafe(supabase: SupabaseClient) {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // AuthSessionMissingError is expected when user is not logged in
    // This is NOT an error - just return null
    if (error) {
      const errorMessage = error.message || String(error);
      if (errorMessage.includes('Auth session missing')) {
        // User is not logged in - this is normal
        return null;
      }
      console.error('Supabase auth error:', error);
      return null;
    }

    return user;
  } catch (error) {
    // Handle any unexpected errors (Edge Runtime issues, etc.)
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('Auth session missing')) {
      // User is not logged in - this is normal
      return null;
    }
    console.error('Auth check failed:', error);
    return null;
  }
}
