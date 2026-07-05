-- ============================================================
-- SELAH KIDS — Tablas e RLS
-- ============================================================

-- 1. kids_stories
CREATE TABLE IF NOT EXISTS kids_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  cover_image_url TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false,
  nodes JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. kids_progress
CREATE TABLE IF NOT EXISTS kids_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES kids_stories(id) ON DELETE CASCADE,
  current_node TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- 3. RLS
ALTER TABLE kids_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kids_progress ENABLE ROW LEVEL SECURITY;

-- kids_stories: lectura pública (el frontend controla premium)
CREATE POLICY "Kids stories public read"
  ON kids_stories FOR SELECT
  USING (true);

-- kids_progress: cada usuario solo ve/edita su propio progreso
CREATE POLICY "Users read own kids progress"
  ON kids_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own kids progress"
  ON kids_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own kids progress"
  ON kids_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own kids progress"
  ON kids_progress FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Índices
CREATE INDEX IF NOT EXISTS idx_kids_progress_user ON kids_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_kids_progress_story ON kids_progress(story_id);
CREATE INDEX IF NOT EXISTS idx_kids_stories_slug ON kids_stories(slug);
