ALTER TABLE services 
ADD COLUMN IF NOT EXISTS pricing_model text DEFAULT 'fixed',
ADD COLUMN IF NOT EXISTS monthly_price numeric DEFAULT 0;
