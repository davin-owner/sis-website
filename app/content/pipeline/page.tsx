// SERVER COMPONENT - Pipeline page that renders static content on the server
// Displays pipeline management and lead tracking interface
import React from "react";
import PipelineBoard from "@/components/layout/PipelineBoard.server";
import { getPipelineData } from "@/lib/supabase/data/pipeline-data";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { getShopWorkerData } from "@/lib/supabase/data/workers-data";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserSafe } from "@/lib/auth/get-user-safe";
import { WorkersProvider } from "@/lib/contexts/workers-context";

// SERVER COMPONENT - Fetches data and passes it to the client
export default async function PipelinePage() {
  const supabase = await createClient();
  const user = await getUserSafe(supabase);

  if (!user) {
    redirect("/auth/login");
  }

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) {
    redirect("/onboarding");
  }

  // Fetch both pipeline data and workers in parallel for faster loading
  const [formatedColumns, workers] = await Promise.all([
    getPipelineData(shopId, user.id, supabase),
    getShopWorkerData(shopId, user.id, supabase),
  ]);

  return (
    <WorkersProvider workers={workers}>
      <div className="page-container--wide min-h-dvh">
        <h1 className="text-4xl font-bold gradient-text-ink mb-8">
          Client Pipeline
        </h1>

        <PipelineBoard initialColumns={formatedColumns} />
      </div>
    </WorkersProvider>
  );
}
