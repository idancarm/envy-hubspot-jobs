ALTER TABLE services 
ADD COLUMN IF NOT EXISTS seo_title text DEFAULT '',
ADD COLUMN IF NOT EXISTS seo_description text DEFAULT '';
