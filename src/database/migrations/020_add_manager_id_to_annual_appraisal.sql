-- Add manager_id to annual_appraisal table to track which manager filled it out

ALTER TABLE annual_appraisal 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for manager_id lookups
CREATE INDEX IF NOT EXISTS idx_annual_appraisal_manager_id ON annual_appraisal(manager_id);

-- Create composite index for user_id and manager_id queries
CREATE INDEX IF NOT EXISTS idx_annual_appraisal_user_manager ON annual_appraisal(user_id, manager_id);
