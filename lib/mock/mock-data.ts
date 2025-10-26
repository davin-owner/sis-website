// src/lib/mock-data.ts
import { Column } from "./types";

export const initialColumns: Column[] = [
  {
    id: "leads",
    title: "Leads",
    clients: [
      { id: "1", name: "John Doe", contact: "john@example.com" },
      { id: "2", name: "Jane Smith", contact: "jane@example.com" },
    ],
  },
  {
    id: "consulting",
    title: "Consulting",
    clients: [
      {
        id: "3",
        name: "Peter Jones",
        contact: "peter@example.com",
        artist: "Jules",
      },
    ],
  },

  {
    id: "apts-made",
    title: "Apts Made",
    clients: [{ id: "4", name: "Lucy Brown", contact: "test@gmail.cm" }],
  },
  {
    id: "inking",
    title: "Inking",
    clients: [{ id: "6", name: "Lucy Brown", contact: "" }],
  },

  {
    id: "follow-ups",
    title: "Follow Ups",
    clients: [{ id: "5", name: "Lucy Brown", contact: "test@gmail.cm" }],
  },
];
