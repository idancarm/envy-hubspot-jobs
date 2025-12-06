-- Add missing columns to services table to support new features
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS youtube_video_id text,
ADD COLUMN IF NOT EXISTS screenshots jsonb;

-- Ensure RLS policies allow update (already set to 'true' for all in initial schema, so should be fine)
-- But verify strict mode isn't on.
