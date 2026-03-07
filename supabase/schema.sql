-- Supabase table for app state persistence
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

-- Allow all operations (since this is a private app behind auth)
CREATE POLICY "Allow all operations on app_state"
  ON app_state
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_state_key ON app_state(key);
