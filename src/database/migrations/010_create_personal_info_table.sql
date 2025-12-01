-- Create personal_info table
CREATE TABLE IF NOT EXISTS personal_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Period of Report
    period_from DATE NOT NULL,
    period_to DATE NOT NULL,
    
    -- Personal Details
    title VARCHAR(50) NOT NULL,
    other_title VARCHAR(100),
    surname VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    other_names VARCHAR(255),
    gender VARCHAR(20) NOT NULL,
    
    -- Job Information
    present_job_title VARCHAR(255) NOT NULL,
    grade_salary VARCHAR(100) NOT NULL,
    division VARCHAR(255) NOT NULL,
    date_of_appointment DATE NOT NULL,
    
    -- Training Records (JSON array)
    training_records JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personal_info_user_id ON personal_info(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_info_period ON personal_info(period_from, period_to);
CREATE INDEX IF NOT EXISTS idx_personal_info_created_at ON personal_info(created_at);

-- Create composite index for user and period
CREATE INDEX IF NOT EXISTS idx_personal_info_user_period ON personal_info(user_id, period_from, period_to);
