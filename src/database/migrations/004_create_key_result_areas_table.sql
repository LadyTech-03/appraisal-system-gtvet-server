-- Create key_result_areas table
CREATE TABLE IF NOT EXISTS key_result_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appraisal_id UUID NOT NULL REFERENCES appraisals(id) ON DELETE CASCADE,
    area VARCHAR(255) NOT NULL,
    targets TEXT NOT NULL,
    resources_required TEXT,
    weight DECIMAL(5,2) DEFAULT 0.00,
    mid_year_progress TEXT,
    mid_year_remarks TEXT,
    end_year_assessment TEXT,
    end_year_score DECIMAL(5,2) DEFAULT 0.00,
    end_year_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_key_result_areas_appraisal_id ON key_result_areas(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_key_result_areas_area ON key_result_areas(area);
