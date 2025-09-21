"use client";
import React, { Component } from "react";
import { useDroppable } from "@dnd-kit/core";

const { isOver, setNodeRef } = useDroppable({ id: "client-personel-card" });

type ClientPeronelCardProps = {
  name: string;
  artist: string; // Add any props if needed in the future
};

export default function ClientPeronelCard(props: ClientPeronelCardProps) {
  return (
    <div ref={setNodeRef} className={isOver ? "ring-2 ring-blue-400" : ""}>
      <div className="bg-white dark:bg-gray-700 p-3 rounded-md shadow">
        <h1>{props.name}</h1>
        <p className="font-semibold text-gray-900 dark:text-white">
          Assigned Artist
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {props.artist}
        </p>
      </div>
    </div>
  );
}
