-- Add annual_appraisal JSONB column to appraisals table

ALTER TABLE appraisals 
ADD COLUMN IF NOT EXISTS annual_appraisal JSONB;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_appraisals_annual_appraisal ON appraisals USING GIN (annual_appraisal);
