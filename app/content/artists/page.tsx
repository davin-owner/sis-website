// SERVER COMPONENT - Artists/Workers management page
// Fetches worker data and passes to client component

import { createClient } from "@/lib/supabase/server";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { redirect } from "next/navigation";
import { getShopWorkerData } from "@/lib/supabase/data/workers-data";
import ArtistsPageClient from "@/components/studio/ArtistsPage.client";

export default async function ArtistsPage() {
  // 1. Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Get shop
  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) {
    redirect("/onboarding");
  }

  // 3. Fetch workers
  const workers = await getShopWorkerData(shopId, user.id, supabase);

  return (
    <main className="min-h-screen app-canvas">
      <div className="page-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold gradient-text-ink">
            Artists & Workers
          </h1>
        </div>
        <ArtistsPageClient initialWorkers={workers} shopId={shopId} />
      </div>
    </main>
  );
}
