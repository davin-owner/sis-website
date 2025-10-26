/*
  This file will be where we create and make the data types for the 
  project for example the columns and clients for the pipeline

*/
export type ShopLeads = {
  /*
  id bigint (auto-generated)
  shop_id uuid
  name text
  contact_email text
  contact_phone text  ← Changed from integer to text in migration 03
  notes text
  perfered_artist_id text (mapped to 'artists' in code)
  session_count integer
  deposit_status text
  pipeline_stage text (default 'leads')  ← Added in migration 02
  sort_order integer (default 0)          ← Added in migration 02
  created_at timestamp
  */
  shop_id: string;
  id: number;
  name: string;
  contact_email: string;
  contact_phone: string; // Database column name
  notes: string;
  artists: string; // Maps to perfered_artist_id in database
  session_count: number;
  deposit_status: string;
  pipeline_stage: string;
  sort_order: number;
  created_at: number;
};

export type PipelineColumn = {
  /*  
  id int
  --the int id that the pipleine clinent can pass for its current stage
  title str
  desciption str
  clients []
  */
  id: string;
  title: string;
  clients: ShopLeads[];
};
