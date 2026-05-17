-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_date ON analytics((created_at::date));

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can read analytics" ON analytics;
CREATE POLICY "Admin can read analytics" ON analytics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own analytics" ON analytics;
CREATE POLICY "Users can insert own analytics" ON analytics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Location columns for profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
