-- Create mid_year_reviews table
CREATE TABLE IF NOT EXISTS mid_year_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appraisal_id UUID NOT NULL REFERENCES appraisals(id) ON DELETE CASCADE,
    review_date DATE NOT NULL,
    
    -- Target reviews (JSON array)
    target_reviews JSONB NOT NULL DEFAULT '[]',
    
    -- Competency reviews (JSON array)
    competency_reviews JSONB NOT NULL DEFAULT '[]',
    
    -- Overall progress assessment
    overall_progress TEXT,
    challenges_faced TEXT,
    support_needed TEXT,
    
    -- Signatures
    appraiser_signature VARCHAR(500),
    appraisee_signature VARCHAR(500),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mid_year_reviews_appraisal_id ON mid_year_reviews(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_mid_year_reviews_review_date ON mid_year_reviews(review_date);
CREATE INDEX IF NOT EXISTS idx_mid_year_reviews_status ON mid_year_reviews(status);
