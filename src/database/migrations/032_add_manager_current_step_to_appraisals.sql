-- Add manager_current_step column to track manager's progress through appraisal review
-- Valid values: 'personal-info', 'performance-planning', 'mid-year-review', 'end-year-review', 'final-sections'

ALTER TABLE appraisals 
ADD COLUMN IF NOT EXISTS manager_current_step VARCHAR(50) DEFAULT 'personal-info';

-- Add a check constraint to validate step values
ALTER TABLE appraisals
ADD CONSTRAINT valid_manager_current_step 
CHECK (manager_current_step IN ('personal-info', 'performance-planning', 'mid-year-review', 'end-year-review', 'final-sections'));
