"use client";

import React, { createContext, useContext } from "react";
import { Worker } from "@/lib/database";

interface WorkersContextType {
  workers: Worker[];
}

const WorkersContext = createContext<WorkersContextType | undefined>(undefined);

export function WorkersProvider({
  children,
  workers,
}: {
  children: React.ReactNode;
  workers: Worker[];
}) {
  return (
    <WorkersContext.Provider value={{ workers }}>
      {children}
    </WorkersContext.Provider>
  );
}

export function useWorkers() {
  const context = useContext(WorkersContext);
  if (context === undefined) {
    throw new Error("useWorkers must be used within a WorkersProvider");
  }
  return context.workers;
}
