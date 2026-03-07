# Supabase Setup for Cross-Device Sync

## 1. Create Supabase Table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on app_state"
  ON app_state
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_app_state_key ON app_state(key);
```

## 2. Add Environment Variables

In Vercel (Settings → Environment Variables), add:

- `SUPABASE_URL`: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `SUPABASE_KEY`: Your Supabase anon/public key

Both can be found in Supabase → Settings → API

## 3. Deploy

Push to GitHub and Vercel will auto-deploy with the new serverless function.

## How It Works

- **Frontend**: Loads from localStorage cache immediately for fast UX
- **Background sync**: Fetches latest state from Supabase API on page load
- **Saves**: Writes to localStorage instantly + debounced save to Supabase API
- **Cross-device**: All devices sync to the same Supabase record

State is stored as a single JSONB document with key `coltrane-med-state`.
