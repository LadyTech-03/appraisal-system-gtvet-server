-- Add appraiser information fields to personal_info table

ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS appraiser_title VARCHAR(50),
ADD COLUMN IF NOT EXISTS appraiser_other_title VARCHAR(100),
ADD COLUMN IF NOT EXISTS appraiser_surname VARCHAR(255),
ADD COLUMN IF NOT EXISTS appraiser_first_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS appraiser_other_names VARCHAR(255),
ADD COLUMN IF NOT EXISTS appraiser_position VARCHAR(255);

