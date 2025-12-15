-- Create final_sections table
CREATE TABLE IF NOT EXISTS final_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appraiser_comments TEXT,
    appraiser_signature_url VARCHAR(500),
    appraiser_date DATE,
    career_development_comments TEXT,
    assessment_decision VARCHAR(100),
    appraisee_comments TEXT,
    appraisee_signature_url VARCHAR(500),
    appraisee_date DATE,
    hod_comments TEXT,
    hod_name VARCHAR(255),
    hod_signature_url VARCHAR(500),
    hod_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_final_sections_user_id ON final_sections(user_id);
