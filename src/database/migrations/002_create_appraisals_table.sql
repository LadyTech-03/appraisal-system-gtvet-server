-- Create appraisals table
CREATE TABLE IF NOT EXISTS appraisals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appraiser_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'closed')),
    
    -- Employee Information (JSON)
    employee_info JSONB NOT NULL,
    
    -- Appraiser Information (JSON)
    appraiser_info JSONB NOT NULL,
    
    -- Training received during previous year (JSON array)
    training_received JSONB DEFAULT '[]',
    
    -- Key Result Areas (JSON array)
    key_result_areas JSONB DEFAULT '[]',
    
    -- Mid-Year Review (JSON)
    mid_year_review JSONB,
    
    -- End-of-Year Review (JSON)
    end_of_year_review JSONB NOT NULL,
    
    -- Core Competencies (JSON)
    core_competencies JSONB NOT NULL,
    
    -- Non-Core Competencies (JSON)
    non_core_competencies JSONB NOT NULL,
    
    -- Overall Assessment (JSON)
    overall_assessment JSONB NOT NULL,
    
    -- Comments and Development
    appraiser_comments TEXT,
    training_development_plan TEXT,
    assessment_decision VARCHAR(50),
    appraisee_comments TEXT,
    
    -- HOD Information
    hod_comments TEXT,
    hod_name VARCHAR(255),
    hod_signature VARCHAR(500),
    hod_date DATE,
    
    -- Signatures and dates
    appraiser_signature VARCHAR(500),
    appraiser_signature_date DATE,
    appraisee_signature VARCHAR(500),
    appraisee_signature_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appraisals_employee_id ON appraisals(employee_id);
CREATE INDEX IF NOT EXISTS idx_appraisals_appraiser_id ON appraisals(appraiser_id);
CREATE INDEX IF NOT EXISTS idx_appraisals_status ON appraisals(status);
CREATE INDEX IF NOT EXISTS idx_appraisals_period ON appraisals(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_appraisals_created_at ON appraisals(created_at);

-- Create composite index for employee and period
CREATE INDEX IF NOT EXISTS idx_appraisals_employee_period ON appraisals(employee_id, period_start, period_end);
