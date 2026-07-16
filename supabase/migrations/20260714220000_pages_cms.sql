-- Migration: Create page_contents table for general page sections CMS
CREATE TABLE IF NOT EXISTS page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,         -- e.g. 'home', 'about', 'sustainability', 'contact', 'global'
  section_key TEXT NOT NULL,       -- e.g. 'hero', 'features', 'our_story', 'impact_stats', 'faqs'
  title TEXT NOT NULL,             -- Admin display title e.g. 'Hero Section'
  content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Flexible JSON object storing badge, heading, subheading, items array, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_slug, section_key)
);

-- Indexing for fast public lookups
CREATE INDEX IF NOT EXISTS idx_page_contents_page_slug ON page_contents(page_slug) WHERE is_active = true;

-- Enable Row Level Security (RLS)
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can read active page contents (Public read access)
DO $$ BEGIN CREATE POLICY "Public read access for page_contents" ON page_contents FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policy 2: Admins (or authenticated users) can insert/update/delete
DO $$ BEGIN CREATE POLICY "Allow all operations for authenticated users on page_contents" ON page_contents FOR ALL TO authenticated USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Also allow anon/public write if local RLS allows it for other admin tables
DO $$ BEGIN CREATE POLICY "Allow write access for page_contents" ON page_contents FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Explicitly grant permissions to standard Supabase roles so access is not denied
GRANT ALL ON TABLE page_contents TO anon, authenticated, service_role;
DO $$ BEGIN GRANT ALL ON SEQUENCE page_contents_id_seq TO anon, authenticated, service_role; EXCEPTION WHEN undefined_table THEN NULL; END $$;
