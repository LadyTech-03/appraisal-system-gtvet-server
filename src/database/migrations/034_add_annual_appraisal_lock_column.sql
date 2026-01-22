-- Add annual_appraisal lock columns to appraisals table
-- This is locked when assessment_decision, appraiser_comments, career_development_comments, and appraisee_comments are all present

ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS annual_appraisal_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS annual_appraisal_locked_at TIMESTAMP;
