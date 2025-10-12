// SERVER COMPONENT - Pipeline page that renders static content on the server
// Displays pipeline management and lead tracking interface
import React from "react";
import PipelineBoard from "@/components/layout/PipelineBoard.server";
import { initialColumns } from "@/lib/mock-data";

// SERVER COMPONENT - Fetches data and passes it to the client
export default async function PipelinePage() {
  // Later, this will be: const data = await supabase.from(...)
  return (
    <div className="min-h-dvh app-canvas">
      <div className="page-container">
        <h1 className="text-4xl font-bold gradient-text-ink mb-8">
          Client Pipeline
        </h1>
        <PipelineBoard initialColumns={initialColumns} />
      </div>
    </div>
  );
}
