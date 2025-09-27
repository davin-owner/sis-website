// SERVER COMPONENT - Renders the server-side part of the pipeline board
// This component can fetch data and pass it to the client component
import React from "react";
import ClientPipelineBoard from "../Client/pipeline/ClientPipelineBoard";
import { Column } from "@/lib/types";

// Define the props the component will accept
type ServerPipelineBoardProps = {
  initialColumns: Column[];
};

export default function ServerPipelineBoard(props: ServerPipelineBoardProps) {
  return (
    <div>
      <ClientPipelineBoard initialColumns={props.initialColumns} />
    </div>
  );
}
