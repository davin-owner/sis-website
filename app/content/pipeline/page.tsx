// SERVER COMPONENT - Pipeline page that renders static content on the server
// Displays pipeline management and lead tracking interface
import React from "react";
import PipelineBoard from "@/components/layout/PipelineBoard.server";
import { getPipelineData } from "@/lib/supabase/data/pipeline-data";
import { initialColumns } from "@/lib/mock/mock-data";
import { getActiveShopIdFallback } from "@/lib/utils/active-shop";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
// SERVER COMPONENT - Fetches data and passes it to the client
export default async function PipelinePage() {
  // Later, this will be: const data = await supabase.from(...)
  // you need to pass the initial columns data from the server comp to the client comp
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const shopId = await getActiveShopIdFallback(user.id, supabase);
  if (!shopId) {
    redirect("/onbaording");
  }

  const formatedColumns = await getPipelineData(shopId, user.id, supabase);

  return (
    <div className="page-container--wide min-h-dvh">
      <h1 className="text-4xl font-bold gradient-text-ink mb-8">
        Client Pipeline
      </h1>

      <PipelineBoard initialColumns={formatedColumns} />
    </div>
  );
}
