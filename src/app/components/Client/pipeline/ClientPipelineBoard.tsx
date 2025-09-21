// src/app/components/Client/pipeline/ClientPipeBoard.tsx
"use client"; // This is crucial for using hooks like useState

import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import ClientPipelineColumns from "@components/Client/pipeline/ClientPipelineColumns";
import { Column } from "@/lib/types";
import { initialColumns } from "@/lib/mock-data";

// Define the props the component will accept
type ClientPipeBoardProps = {
  initialColumns: Column[];
};

export default function ClientPipelineBoard(props: ClientPipeBoardProps) {
  return (
    <DndContext>
      <div id="client-pipeboard">
        <ClientPipelineColumns initialColumns={initialColumns} />
      </div>
    </DndContext>
  );
}
