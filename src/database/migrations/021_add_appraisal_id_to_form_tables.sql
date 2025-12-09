-- Add appraisal_id foreign key to all form tables for real-time sync

-- Personal Info
ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS appraisal_id UUID REFERENCES appraisals(id) ON DELETE CASCADE;

-- Performance Planning
ALTER TABLE performance_planning 
ADD COLUMN IF NOT EXISTS appraisal_id UUID REFERENCES appraisals(id) ON DELETE CASCADE;

-- Mid-Year Review
ALTER TABLE mid_year_review 
ADD COLUMN IF NOT EXISTS appraisal_id UUID REFERENCES appraisals(id) ON DELETE CASCADE;

-- End-Year Review
ALTER TABLE end_year_review 
ADD COLUMN IF NOT EXISTS appraisal_id UUID REFERENCES appraisals(id) ON DELETE CASCADE;

-- Annual Appraisal
ALTER TABLE annual_appraisal 
ADD COLUMN IF NOT EXISTS appraisal_id UUID REFERENCES appraisals(id) ON DELETE CASCADE;

-- Final Sections
ALTER TABLE final_sections 
ADD COLUMN IF NOT EXISTS appraisal_id UUID REFERENCES appraisals(id) ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_personal_info_appraisal ON personal_info(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_performance_planning_appraisal ON performance_planning(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_mid_year_review_appraisal ON mid_year_review(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_end_year_review_appraisal ON end_year_review(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_annual_appraisal_appraisal ON annual_appraisal(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_final_sections_appraisal ON final_sections(appraisal_id);
