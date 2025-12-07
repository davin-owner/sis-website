import { createClient } from "@/lib/supabase/server";
import { getUserSafe } from "@/lib/auth/get-user-safe";

export default async function DebugAuthPage() {
  try {
    const supabase = await createClient();

    // Test 1: Can we create a client?
    const hasClient = !!supabase;

    // Test 2: Can we get user safely?
    let userResult = null;
    let userError = null;
    try {
      userResult = await getUserSafe(supabase);
    } catch (e) {
      userError = e instanceof Error ? e.message : String(e);
    }

    // Test 3: Can we query the database?
    let dbTest = null;
    let dbError = null;
    try {
      const { data, error } = await supabase
        .from('shops_tables')
        .select('shop_id, shop_name')
        .limit(1);
      dbTest = { hasData: !!data, count: data?.length || 0, error: error?.message };
    } catch (e) {
      dbError = e instanceof Error ? e.message : String(e);
    }

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
        <h1>🔍 Auth & Database Debug</h1>

        <h2>✓ Test 1: Supabase Client</h2>
        <pre>{JSON.stringify({ hasClient }, null, 2)}</pre>

        <h2>✓ Test 2: User Auth</h2>
        <pre>{JSON.stringify({
          hasUser: !!userResult,
          userId: userResult?.id || null,
          userEmail: userResult?.email || null,
          userError,
        }, null, 2)}</pre>

        <h2>✓ Test 3: Database Access</h2>
        <pre>{JSON.stringify({ dbTest, dbError }, null, 2)}</pre>

        <h2>✓ Environment</h2>
        <pre>{JSON.stringify({
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        }, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace', color: 'red' }}>
        <h1>❌ Critical Error</h1>
        <pre>{error instanceof Error ? error.message : String(error)}</pre>
        <pre>{error instanceof Error ? error.stack : ''}</pre>
      </div>
    );
  }
}
