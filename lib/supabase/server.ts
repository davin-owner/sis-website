import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookiesStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookiesStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookiesStore.set(name, value, options);
            });
          } catch (_error) {
            // Ignore cookie errors in server components where cookies can't be modified
            // This happens when reading auth state in pages (which is fine)
          }
        },
      },
    }
  );
};
