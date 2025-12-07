-- Add sort_order column
ALTER TABLE services ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Update existing rows to have a sensible default order based on ID if they are all 0
-- (This ensures we don't have collisions initially)
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1 as rn
  FROM services
)
UPDATE services
SET sort_order = numbered.rn
FROM numbered
WHERE services.id = numbered.id AND services.sort_order = 0;
