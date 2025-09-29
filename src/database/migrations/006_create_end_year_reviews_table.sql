-- Create end_year_reviews table
CREATE TABLE IF NOT EXISTS end_year_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appraisal_id UUID NOT NULL REFERENCES appraisals(id) ON DELETE CASCADE,
    review_date DATE NOT NULL,
    
    -- Target assessments (JSON array)
    target_assessments JSONB NOT NULL DEFAULT '[]',
    
    -- Competency assessments (JSON array)
    competency_assessments JSONB NOT NULL DEFAULT '[]',
    
    -- Performance scores
    total_score DECIMAL(5,2) DEFAULT 0.00,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    weighted_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Overall assessment
    overall_performance TEXT,
    strengths TEXT,
    areas_for_improvement TEXT,
    development_recommendations TEXT,
    
    -- Signatures
    appraiser_signature VARCHAR(500),
    appraisee_signature VARCHAR(500),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_end_year_reviews_appraisal_id ON end_year_reviews(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_end_year_reviews_review_date ON end_year_reviews(review_date);
CREATE INDEX IF NOT EXISTS idx_end_year_reviews_status ON end_year_reviews(status);
CREATE INDEX IF NOT EXISTS idx_end_year_reviews_scores ON end_year_reviews(total_score, average_score, weighted_score);
