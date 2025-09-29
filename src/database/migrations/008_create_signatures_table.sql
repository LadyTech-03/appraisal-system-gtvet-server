-- Create signatures table
CREATE TABLE IF NOT EXISTS signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appraisal_id UUID NOT NULL REFERENCES appraisals(id) ON DELETE CASCADE,
    signatory_type VARCHAR(50) NOT NULL CHECK (signatory_type IN ('appraiser', 'appraisee', 'hod', 'hr')),
    signatory_id UUID REFERENCES users(id),
    signature_data TEXT NOT NULL, -- Base64 encoded signature
    signature_file_url VARCHAR(500), -- URL to signature file
    signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_signatures_appraisal_id ON signatures(appraisal_id);
CREATE INDEX IF NOT EXISTS idx_signatures_signatory_type ON signatures(signatory_type);
CREATE INDEX IF NOT EXISTS idx_signatures_signatory_id ON signatures(signatory_id);
CREATE INDEX IF NOT EXISTS idx_signatures_signed_at ON signatures(signed_at);
