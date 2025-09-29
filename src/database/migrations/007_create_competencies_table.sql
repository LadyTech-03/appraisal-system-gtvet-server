-- Create competencies table
CREATE TABLE IF NOT EXISTS competencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appraisal_id UUID NOT NULL REFERENCES appraisals(id) ON DELETE CASCADE,
    competency_type VARCHAR(50) NOT NULL CHECK (competency_type IN ('core', 'non_core')),
    competency_name VARCHAR(255) NOT NULL,
    description TEXT,
    weight DECIMAL(5,2) DEFAULT 0.00,
    mid_year_score DECIMAL(5,2) DEFAULT 0.00,
    end_year_score DECIMAL(5,2) DEFAULT 0.00,
    mid_year_comments TEXT,
    end_year_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_competencies_appraisal_id ON competencies(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_competencies_type ON competencies(competency_type);
CREATE INDEX IF NOT EXISTS idx_competencies_name ON competencies(competency_name);
