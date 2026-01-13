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
('personal_info', false, 'Personal Information form is not available for completion.'),
('performance_planning', false, 'Performance Planning form is not available for completion.'),
('mid_year_review', false, 'Mid-Year Review will be available in July. Please check back later.'),
('end_year_review', false, 'End of Year Review will be available at the end of the year. Please check back later.'),
('final_sections', false, 'Final Sections will be available after all reviews are completed.')
ON CONFLICT (section_name) DO NOTHING;
