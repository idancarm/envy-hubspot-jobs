-- Add color_theme column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS color_theme text DEFAULT 'primary';
