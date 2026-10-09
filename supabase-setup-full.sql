-- ============================================================
-- FULL DATABASE SETUP - Portfolio Azam
-- Jalankan di: https://supabase.com/dashboard/project/vrxoivwzdipbmecavgcj/sql/new
-- ============================================================

-- 1. my_project
CREATE TABLE IF NOT EXISTS my_project (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  link_preview TEXT,
  code_url TEXT,
  category TEXT DEFAULT 'project' CHECK (category IN ('project', 'template', 'components', 'design')),
  tech_stacks TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  image_fit TEXT DEFAULT 'cover',
  image_height INTEGER DEFAULT 130,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. my_certificate
CREATE TABLE IF NOT EXISTS my_certificate (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  course_url TEXT,
  category TEXT DEFAULT 'certificate' CHECK (category IN ('certificate', 'badge')),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. my_blogs
CREATE TABLE IF NOT EXISTS my_blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  thumbnail TEXT,
  reading_time INTEGER DEFAULT 2,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. animes
CREATE TABLE IF NOT EXISTS animes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  genres TEXT[] DEFAULT '{}',
  episodes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Ongoing' CHECK (status IN ('Ongoing', 'Completed', 'Upcoming')),
  synopsis TEXT,
  cover_image TEXT,
  embed_url TEXT,
  rating NUMERIC(3,1) DEFAULT 0,
  studio TEXT,
  release_year INTEGER,
  season TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. anime_story
CREATE TABLE IF NOT EXISTS anime_story (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  hastag TEXT[] DEFAULT '{}',
  category TEXT,
  upload_date DATE DEFAULT CURRENT_DATE,
  video_url TEXT NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. my_quotes
CREATE TABLE IF NOT EXISTS my_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT DEFAULT 'other' CHECK (category IN ('motivation', 'life', 'love', 'wisdom', 'funny', 'other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. my_audios
CREATE TABLE IF NOT EXISTS my_audios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  category TEXT DEFAULT 'quote_random' CHECK (category IN ('sound_efect', 'quote_random', 'arabic', 'islamic', 'jawa', 'india')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  uid TEXT,
  is_owner BOOLEAN DEFAULT false,
  reply_to JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. profile
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  role TEXT,
  bio TEXT,
  photo_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_title TEXT,
  site_name TEXT,
  site_description TEXT,
  site_url TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. skill_categories
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'ri-code-s-slash-line',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. education
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  logo_url TEXT,
  role TEXT NOT NULL,
  role_icon TEXT DEFAULT '🎓',
  status TEXT DEFAULT 'Present',
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  logo_size INTEGER DEFAULT 56,
  logo_fit TEXT DEFAULT 'contain',
  logo_bg TEXT DEFAULT 'white',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. experience
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  icon_type TEXT DEFAULT 'remix',
  icon_value TEXT DEFAULT 'ri-briefcase-4-line',
  icon_bg TEXT DEFAULT '#f3f4f6',
  icon_color TEXT DEFAULT '#374151',
  tags TEXT[] DEFAULT '{}',
  tag_color TEXT DEFAULT 'gray',
  is_wide BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  logo_size INTEGER DEFAULT 40,
  logo_fit TEXT DEFAULT 'contain',
  logo_bg TEXT DEFAULT '#f3f4f6',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 15. my_resume
CREATE TABLE IF NOT EXISTS my_resume (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  pdf_url TEXT,
  icon_type TEXT DEFAULT 'code',
  color_theme TEXT DEFAULT 'blue',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_my_project_category ON my_project(category);
CREATE INDEX IF NOT EXISTS idx_my_project_featured ON my_project(featured);
CREATE INDEX IF NOT EXISTS idx_my_project_is_pinned ON my_project(is_pinned);
CREATE INDEX IF NOT EXISTS idx_my_certificate_category ON my_certificate(category);
CREATE INDEX IF NOT EXISTS idx_my_blogs_slug ON my_blogs(slug);
CREATE INDEX IF NOT EXISTS idx_my_blogs_status ON my_blogs(status);
CREATE INDEX IF NOT EXISTS idx_my_quotes_status ON my_quotes(status);
CREATE INDEX IF NOT EXISTS idx_my_audios_category ON my_audios(category);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_education_sort_order ON education(sort_order);
CREATE INDEX IF NOT EXISTS idx_experience_sort_order ON experience(sort_order);
CREATE INDEX IF NOT EXISTS idx_my_resume_sort_order ON my_resume(sort_order);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE my_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_certificate ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE animes ENABLE ROW LEVEL SECURITY;
ALTER TABLE anime_story ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_resume ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ
CREATE POLICY "Public read my_project" ON my_project FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read my_certificate" ON my_certificate FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read my_blogs" ON my_blogs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read animes" ON animes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read anime_story" ON anime_story FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read my_quotes" ON my_quotes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read my_audios" ON my_audios FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read chat_messages" ON chat_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read profile" ON profile FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read skill_categories" ON skill_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read education" ON education FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read my_resume" ON my_resume FOR SELECT TO anon, authenticated USING (true);

-- AUTHENTICATED WRITE
CREATE POLICY "Auth write my_project" ON my_project FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write my_certificate" ON my_certificate FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write my_blogs" ON my_blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write animes" ON animes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write anime_story" ON anime_story FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write my_quotes" ON my_quotes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write my_audios" ON my_audios FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write chat_messages" ON chat_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write profile" ON profile FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write site_settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write skill_categories" ON skill_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write skills" ON skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write education" ON education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write experience" ON experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth write my_resume" ON my_resume FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read storage" ON storage.objects FOR SELECT TO public USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Auth upload storage" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Auth update storage" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Auth delete storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets');

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- ============================================================
-- SELESAI! Buat akun admin di Authentication > Users > Add User
-- ============================================================
