// src/lib/types.ts
export type Client = {
  id: string;
  name: string;
  contact: string;
  artist?: string; // Optional field for assigned artist;
};

export type Column = {
  id: string; // e.g., 'leads', 'consulting'
  title: string;
  clients: Client[];
};
