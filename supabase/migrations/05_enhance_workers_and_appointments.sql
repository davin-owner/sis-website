-- Enhance existing shop_workers table and create appointments system
-- Working with existing schema (shop_workers already exists)

-- 1. Add color field to existing shop_workers table for calendar visualization
ALTER TABLE shop_workers
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#0DE8CD';

-- 2. Add worker_id to shop_leads for artist assignment
ALTER TABLE shop_leads
ADD COLUMN IF NOT EXISTS worker_id UUID REFERENCES shop_workers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_shop_leads_worker_id ON shop_leads(worker_id);

-- 3. Create proper appointments table (replaces the basic shop_appointments)
DROP TABLE IF EXISTS shop_appointments;

CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES shops_tables(shop_id) ON DELETE CASCADE,
  client_id BIGINT NOT NULL REFERENCES shop_leads(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES shop_workers(id) ON DELETE SET NULL,

  -- Appointment timing
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Details
  title VARCHAR(255),
  notes TEXT,
  location VARCHAR(255), -- Room/station number

  -- Status
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_appointments_shop_id ON appointments(shop_id);
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_worker_id ON appointments(worker_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date_worker ON appointments(appointment_date, worker_id);

-- Update trigger
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at();

-- Constraint: end_time must be after start_time
ALTER TABLE appointments
ADD CONSTRAINT check_appointment_times CHECK (end_time > start_time);

-- Comment
COMMENT ON TABLE appointments IS 'Client appointments with workers/artists';
