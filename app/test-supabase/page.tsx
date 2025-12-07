/**
 * Test page to debug Supabase connection issues
 */

import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
  try {
    // Try to create Supabase client
    const supabase = await createClient();

    // Try to get user (this might fail in Edge Runtime)
    let authResult: { user: unknown; error: unknown } = { user: null, error: null };
    try {
      const { data, error } = await supabase.auth.getUser();
      authResult = { user: data.user, error };
    } catch (authError) {
      authResult.error = authError as Error;
    }

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>Supabase Connection Test</h1>

        <h2>Environment Variables:</h2>
        <pre>{JSON.stringify({
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        }, null, 2)}</pre>

        <h2>Supabase Client:</h2>
        <pre>Created successfully: {supabase ? 'YES' : 'NO'}</pre>

        <h2>Auth Check:</h2>
        <pre>{JSON.stringify({
          hasUser: !!authResult.user,
          hasError: !!authResult.error,
          errorMessage: authResult.error?.toString(),
        }, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace', color: 'red' }}>
        <h1>ERROR!</h1>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
        <pre>{error instanceof Error ? error.stack : ''}</pre>
      </div>
    );
  }
}
