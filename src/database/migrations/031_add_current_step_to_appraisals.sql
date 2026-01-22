-- Add current_step column to track user's progress through appraisal forms
-- Valid values: 'personal-info', 'performance-planning', 'mid-year-review', 'end-year-review', 'final-sections'

ALTER TABLE appraisals 
ADD COLUMN IF NOT EXISTS current_step VARCHAR(50) DEFAULT 'personal-info';

-- Add a check constraint to validate step values
ALTER TABLE appraisals
ADD CONSTRAINT valid_current_step 
CHECK (current_step IN ('personal-info', 'performance-planning', 'mid-year-review', 'end-year-review', 'final-sections'));
