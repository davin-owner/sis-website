/*
  This file will be where we create and make the data types for the
  project for example the columns and clients for the pipeline

*/

export type SubscriptionTier = 'free' | 'basics' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing';

export type Shop = {
  /*
  Combined type from shops_tables + shop_users relationship
  Used in settings and shop management
  */
  shop_id: string;
  shop_name: string;
  shop_address: string;
  amount_of_workers: number;
  created_at: string;
  role?: string; // From shop_users junction table
  permissions?: Record<string, boolean>; // From shop_users junction table
  last_accessed_at?: string; // From shop_users junction table
  // Subscription fields (added in migration 12)
  subscription_tier: SubscriptionTier;
  polar_customer_id: string | null;
  polar_subscription_id: string | null;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  subscription_created_at: string | null;
};

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

export type DailyTask = {
  /*
  id uuid
  shop_id uuid
  created_by_user_id uuid
  label text
  done boolean
  sort_order integer
  created_at timestamptz
  updated_at timestamptz
  */
  id: string;
  shop_id: string;
  created_by_user_id: string;
  label: string;
  done: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Accomplishment = {
  /*
  id uuid
  shop_id uuid
  created_by_user_id uuid
  description text
  accomplishment_date date
  is_automated boolean
  automation_source text
  created_at timestamptz
  */
  id: string;
  shop_id: string;
  created_by_user_id: string;
  description: string;
  accomplishment_date: string; // YYYY-MM-DD
  is_automated: boolean;
  automation_source: string | null;
  created_at: string;
};

export type Reminder = {
  /*
  id uuid
  shop_id uuid
  created_by_user_id uuid
  title text
  description text
  type text ('reminder', 'goal', 'urgent')
  due_date date
  is_completed boolean
  completed_at timestamptz
  priority integer
  created_at timestamptz
  updated_at timestamptz
  */
  id: string;
  shop_id: string;
  created_by_user_id: string;
  title: string;
  description: string | null;
  type: 'reminder' | 'goal' | 'urgent';
  due_date: string | null; // YYYY-MM-DD
  is_completed: boolean;
  completed_at: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
};

export type ShopUsage = {
  /*
  id uuid
  shop_id uuid
  month date (first of month)
  appointments_created int
  sms_sent int
  emails_sent int
  created_at timestamptz
  updated_at timestamptz
  */
  id: string;
  shop_id: string;
  month: string; // YYYY-MM-DD (first of month)
  appointments_created: number;
  sms_sent: number;
  emails_sent: number;
  created_at: string;
  updated_at: string;
};
