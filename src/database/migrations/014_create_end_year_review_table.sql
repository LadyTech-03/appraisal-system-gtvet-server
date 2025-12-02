-- Create end_year_review table
CREATE TABLE IF NOT EXISTS end_year_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    targets JSONB NOT NULL DEFAULT '[]',
    calculations JSONB,
    appraisee_signature_url VARCHAR(500),
    appraisee_date DATE,
    appraiser_signature_url VARCHAR(500),
    appraiser_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_end_year_review_user_id ON end_year_review(user_id);
