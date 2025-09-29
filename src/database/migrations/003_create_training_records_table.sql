-- Create training_records table
CREATE TABLE IF NOT EXISTS training_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    programme VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    duration_hours INTEGER,
    cost DECIMAL(10,2),
    funding_source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('planned', 'ongoing', 'completed', 'cancelled')),
    certificate_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_training_records_user_id ON training_records(user_id);
CREATE INDEX IF NOT EXISTS idx_training_records_status ON training_records(status);
CREATE INDEX IF NOT EXISTS idx_training_records_dates ON training_records(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_training_records_institution ON training_records(institution);
