-- Add manager approval status and related fields to appraisals table

ALTER TABLE appraisals 
ADD COLUMN IF NOT EXISTS manager_status VARCHAR(50) DEFAULT 'pending' CHECK (manager_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS manager_comments TEXT,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id);

-- Create index for manager status queries
CREATE INDEX IF NOT EXISTS idx_appraisals_manager_status ON appraisals(manager_status);
CREATE INDEX IF NOT EXISTS idx_appraisals_reviewed_by ON appraisals(reviewed_by);
