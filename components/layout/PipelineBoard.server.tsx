/**
 * PIPELINE BOARD (.server) - Server-Side Pipeline Data Provider
 *
 * This server component handles data fetching and passes initial pipeline data
 * to the client-side PipelineBoard.client component for interactive management.
 *
 * Responsibilities:
 * - Fetch pipeline data from Supabase (future implementation)
 * - Pass initial columns and client data to client component
 * - Handle server-side authentication and data validation
 * - Render static SEO-friendly content
 */
import React from "react";
import PipelineBoard from "@/components/studio/pipeline/PipelineBoard.client";
import { Column } from "@/lib/types";

// Define the props the component will accept
type PipelineBoardProps = {
  initialColumns: Column[];
};

export default function PipelineBoard(props: PipelineBoardProps) {
  return (
    <div>
      <PipelineBoard initialColumns={props.initialColumns} />
    </div>
  );
}
