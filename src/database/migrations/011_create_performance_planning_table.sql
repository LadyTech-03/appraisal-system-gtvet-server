-- Create performance_planning table
CREATE TABLE IF NOT EXISTS performance_planning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_result_areas JSONB NOT NULL DEFAULT '[]',
    appraisee_signature_url VARCHAR(500),
    appraiser_signature_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_performance_planning_user_id ON performance_planning(user_id);
