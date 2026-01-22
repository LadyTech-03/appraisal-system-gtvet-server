-- Create appraisal_periods table to control form availability
CREATE TABLE IF NOT EXISTS appraisal_periods (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(50) UNIQUE NOT NULL,
    is_available BOOLEAN DEFAULT false,
    opens_at TIMESTAMP,
    closes_at TIMESTAMP,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_appraisal_periods_section ON appraisal_periods(section_name);

-- Seed initial data - Initially only personal_info and performance_planning are available
INSERT INTO appraisal_periods (section_name, is_available, message) VALUES
('personal_info', false, 'This form is not available at this moment.'),
('performance_planning', false, 'This form is not available at this moment.'),
('mid_year_review', false, 'This form is not available at this moment.'),
('end_year_review', false, 'This form is not available at this moment.'),
('final_sections', false, 'This form is not available at this moment.')
ON CONFLICT (section_name) DO NOTHING;
