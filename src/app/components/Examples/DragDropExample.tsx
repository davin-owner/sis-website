"use client";
import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";

// Define our types
type Box = {
  id: string;
  content: string;
  zone: string;
};

type DraggableBoxProps = {
  id: string;
  content: string;
};

type DroppableZoneProps = {
  id: string;
  boxes: Box[];
};

// Simple mock data
const initialData = {
  boxes: [
    { id: "box-1", content: "Box 1", zone: "left" },
    { id: "box-2", content: "Box 2", zone: "left" },
  ],
  zones: ["left", "right"],
};

// A draggable box component
function DraggableBox({ id, content }: DraggableBoxProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { content },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-4 mb-2 rounded shadow cursor-move"
    >
      {content}
    </div>
  );
}

// A droppable zone component
function DroppableZone({ id, boxes }: DroppableZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-lg w-48 min-h-[200px] ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <h3 className="mb-4 font-bold">{id} Zone</h3>
      {boxes.map((box) => (
        <DraggableBox key={box.id} id={box.id} content={box.content} />
      ))}
    </div>
  );
}

// Main example component
export default function DragDropExample() {
  const [boxes, setBoxes] = useState(initialData.boxes);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over) {
      console.log(`Moved ${active.id} to ${over.id}`);

      // Update the box's zone
      setBoxes((currentBoxes) =>
        currentBoxes.map((box) =>
          box.id === active.id ? { ...box, zone: over.id.toString() } : box
        )
      );
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Drag & Drop Example</h2>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-8">
          {initialData.zones.map((zone) => (
            <DroppableZone
              key={zone}
              id={zone}
              boxes={boxes.filter((box) => box.zone === zone)}
            />
          ))}
        </div>
      </DndContext>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-bold mb-2">Current State:</h3>
        <pre>{JSON.stringify(boxes, null, 2)}</pre>
      </div>
    </div>
  );
}
