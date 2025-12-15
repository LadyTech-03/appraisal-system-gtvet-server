-- Add HOD comment fields to appraisals table
ALTER TABLE appraisals 
ADD COLUMN IF NOT EXISTS hod_comments TEXT,
ADD COLUMN IF NOT EXISTS hod_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS hod_signature VARCHAR(500),
ADD COLUMN IF NOT EXISTS hod_date DATE;
