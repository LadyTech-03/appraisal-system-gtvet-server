-- Add lock columns to appraisals table for form locking mechanism
-- Each form section can be independently locked once both signatures are collected

ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS personal_info_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS performance_planning_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS mid_year_review_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS end_year_review_locked BOOLEAN DEFAULT FALSE;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS final_sections_locked BOOLEAN DEFAULT FALSE;

-- Optional: Add timestamps for when forms were locked (for audit trail)
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS personal_info_locked_at TIMESTAMP;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS performance_planning_locked_at TIMESTAMP;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS mid_year_review_locked_at TIMESTAMP;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS end_year_review_locked_at TIMESTAMP;
ALTER TABLE appraisals ADD COLUMN IF NOT EXISTS final_sections_locked_at TIMESTAMP;
