-- Create annual_appraisal table
CREATE TABLE IF NOT EXISTS annual_appraisal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    core_competencies JSONB NOT NULL DEFAULT '[]',
    non_core_competencies JSONB NOT NULL DEFAULT '[]',
    performance_assessment_score DECIMAL(5,2),
    core_competencies_average DECIMAL(5,2),
    non_core_competencies_average DECIMAL(5,2),
    overall_total DECIMAL(5,2),
    overall_score_percentage DECIMAL(5,2),
    appraisee_signature_url VARCHAR(500),
    appraisee_date DATE,
    appraiser_signature_url VARCHAR(500),
    appraiser_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_annual_appraisal_user_id ON annual_appraisal(user_id);
