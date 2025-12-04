-- Add manager_id column to all appraisal tables for tracking team appraisals

-- Add manager_id to personal_info table
ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add manager_id to performance_planning table
ALTER TABLE performance_planning 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add manager_id to mid_year_review table
ALTER TABLE mid_year_review 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add manager_id to end_year_review table
ALTER TABLE end_year_review 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add manager_id to annual_appraisal table
ALTER TABLE annual_appraisal 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add manager_id to final_sections table
ALTER TABLE final_sections 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes for better query performance when filtering by manager
CREATE INDEX IF NOT EXISTS idx_personal_info_manager_id ON personal_info(manager_id);
CREATE INDEX IF NOT EXISTS idx_performance_planning_manager_id ON performance_planning(manager_id);
CREATE INDEX IF NOT EXISTS idx_mid_year_review_manager_id ON mid_year_review(manager_id);
CREATE INDEX IF NOT EXISTS idx_end_year_review_manager_id ON end_year_review(manager_id);
CREATE INDEX IF NOT EXISTS idx_annual_appraisal_manager_id ON annual_appraisal(manager_id);
CREATE INDEX IF NOT EXISTS idx_final_sections_manager_id ON final_sections(manager_id);
