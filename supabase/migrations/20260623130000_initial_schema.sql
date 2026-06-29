-- Ecoji Supabase Schema (PostgreSQL)
-- Paste this script into your Supabase SQL Editor and run it.

-- 1. ENUMS
DO $$ BEGIN CREATE TYPE product_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('ADMIN', 'EDITOR'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE placement_type AS ENUM ('HOMEPAGE_FEATURED', 'HERO_SECTION', 'NEW_ARRIVALS', 'BEST_SELLERS'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE font_provider AS ENUM ('GOOGLE_FONTS', 'CUSTOM'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABLES

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  short_description TEXT,
  full_description TEXT,
  benefits TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}'::jsonb,
  ingredients_materials TEXT[] DEFAULT '{}',
  usage_instructions TEXT[] DEFAULT '{}',
  maintenance_instructions TEXT[] DEFAULT '{}',
  sustainability_impact TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT '{}',
  status product_status DEFAULT 'DRAFT',
  display_order INTEGER DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product FAQs
CREATE TABLE product_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Related
CREATE TABLE product_related (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  related_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, related_product_id)
);

-- Product Placements
CREATE TABLE product_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  placement_type placement_type NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  image_type TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate Links
CREATE TABLE affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Themes
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  colors JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonts
CREATE TABLE fonts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider font_provider DEFAULT 'GOOGLE_FONTS',
  font_family TEXT NOT NULL,
  available_weights TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  value TEXT NOT NULL,
  url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure only one row
  site_name TEXT NOT NULL DEFAULT 'Ecoji',
  meta_title TEXT DEFAULT 'Ecoji | Sustainable Living',
  meta_description TEXT DEFAULT 'Discover our premium eco-friendly products.',
  site_logo_url TEXT,
  favicon_url TEXT,
  default_theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,
  default_font_id UUID REFERENCES fonts(id) ON DELETE SET NULL,
  products_per_page_default INTEGER DEFAULT 10,
  contact_email TEXT,
  contact_phone TEXT,
  maintenance_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics (Future Proofing)
CREATE TABLE product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  device_type TEXT,
  browser TEXT,
  operating_system TEXT,
  referrer TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  device_type TEXT,
  browser TEXT,
  operating_system TEXT,
  referrer TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE qr_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  device_type TEXT,
  browser TEXT,
  operating_system TEXT,
  referrer TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_product_faqs_updated_at BEFORE UPDATE ON product_faqs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_product_related_updated_at BEFORE UPDATE ON product_related FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_product_placements_updated_at BEFORE UPDATE ON product_placements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_product_images_updated_at BEFORE UPDATE ON product_images FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_affiliate_links_updated_at BEFORE UPDATE ON affiliate_links FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_themes_updated_at BEFORE UPDATE ON themes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_fonts_updated_at BEFORE UPDATE ON fonts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- 4. ROW LEVEL SECURITY (RLS)

-- Enable RLS on all main tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fonts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies (Safe to read by anyone)
CREATE POLICY "Public profiles are viewable by everyone." ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Published products are viewable by everyone." ON products FOR SELECT USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY "Product FAQs are viewable by everyone." ON product_faqs FOR SELECT USING (true);
CREATE POLICY "Product Images are viewable by everyone." ON product_images FOR SELECT USING (true);
CREATE POLICY "Affiliate links are viewable by everyone." ON affiliate_links FOR SELECT USING (is_active = true);
CREATE POLICY "Themes are viewable by everyone." ON themes FOR SELECT USING (is_active = true);
CREATE POLICY "Fonts are viewable by everyone." ON fonts FOR SELECT USING (is_active = true);
CREATE POLICY "Contacts are viewable by everyone." ON contacts FOR SELECT USING (is_active = true);
CREATE POLICY "Site Settings are viewable by everyone." ON site_settings FOR SELECT USING (true);

-- Admin Write Access Policies
-- (For simplicity in this initial setup, we assume authenticated users are admins)
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage product FAQs" ON product_faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage product images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage affiliate links" ON affiliate_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage themes" ON themes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage fonts" ON fonts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- 5. INITIAL DATA (Site Settings)
INSERT INTO site_settings (id, site_name) VALUES (1, 'Ecoji') ON CONFLICT (id) DO NOTHING;

-- 6. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public Access Assets" ON storage.objects FOR SELECT USING (bucket_id = 'assets');
CREATE POLICY "Auth Insert" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
