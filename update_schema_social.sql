ALTER TABLE ui_settings 
ADD COLUMN IF NOT EXISTS og_image_url text DEFAULT '';
