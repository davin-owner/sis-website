import { createClient } from "@supabase/supabase-js";
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

