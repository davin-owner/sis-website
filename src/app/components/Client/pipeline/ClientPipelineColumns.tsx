"use client";
import React, { useState } from "react";
import { Column } from "@/lib/types";

type ClientPipelineColumnsProps = {
  initialColumns: Column[];
};

interface ColumnType {
  id: string;
  title: string;
  clients: Client[];
}

interface Client {
  id: string;
  name: string;
  contact: string;
}
export default function ClientPipelineColumns({
  initialColumns,
}: ClientPipelineColumnsProps) {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  return (
    <div className="flex flex-1 gap-4" id="client-pipeline-columns">
      {columns.map((column: ColumnType) => (
        <div
          key={column.id}
          className={`bg-gray-100 dark:bg-gray-800 p-5 rounded-lg w-80`}
        >
          <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
            {column.title}
          </h2>
          <div className="space-y-3">
            {column.clients.map((client: Client) => (
              <div
                key={client.id}
                className="bg-white dark:bg-gray-700 p-3 rounded-md shadow"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  {client.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {client.contact}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
