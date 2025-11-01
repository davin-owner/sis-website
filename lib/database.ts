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
  worker_id uuid (FK to shop_workers) ← Added in migration 05
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
  artists: string; // Maps to perfered_artist_id in database (legacy)
  worker_id: string | null; // New: actual FK to shop_workers
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

export type Worker = {
  /*
  id uuid
  shop_id uuid
  first_name text
  last_name text
  email text
  phone text
  status text ('active', 'inactive', 'on_leave')
  hire_date date
  hourly_rate numeric
  specialties text[]
  notes text
  color varchar(7) ← Added in migration 05
  created_at timestamptz
  updated_at timestamptz
  */
  id: string;
  shop_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: 'active' | 'inactive' | 'on_leave';
  hire_date: string | null; // YYYY-MM-DD format
  hourly_rate: number | null;
  specialties: string[] | null;
  notes: string | null;
  color: string; // Hex color for calendar
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  /*
  id uuid
  shop_id uuid
  client_id bigint (FK to shop_leads)
  worker_id uuid (FK to shop_workers)
  appointment_date date
  start_time time
  end_time time
  title text
  notes text
  location text
  status text ('scheduled', 'completed', 'cancelled', 'no-show')
  created_at timestamptz
  updated_at timestamptz
  */
  id: string;
  shop_id: string;
  client_id: number | string;
  worker_id: string | null;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  title: string | null;
  notes: string | null;
  location: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  created_at: string;
  updated_at: string;
};

// Extended appointment with related data for display
export type AppointmentWithDetails = Appointment & {
  client_name?: string;
  worker_name?: string;
  worker_color?: string;
};
