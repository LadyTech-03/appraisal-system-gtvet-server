-- Update appraisal status from 'draft' to 'in-progress'

-- First, update existing 'draft' records to 'in-progress'
UPDATE appraisals SET status = 'in-progress' WHERE status = 'draft';

-- Drop the old constraint (the constraint name might vary)
ALTER TABLE appraisals DROP CONSTRAINT IF EXISTS appraisals_status_check;
ALTER TABLE appraisals DROP CONSTRAINT IF EXISTS appraisals_status_check1;

-- Add new constraint with 'in-progress' instead of 'draft'
ALTER TABLE appraisals ADD CONSTRAINT appraisals_status_check 
  CHECK (status IN ('in-progress', 'submitted', 'reviewed', 'closed'));
