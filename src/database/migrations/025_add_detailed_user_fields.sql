-- Add detailed user fields (simplified - no appraisee/appraiser duplication)
-- All users share the same personal information fields

-- Add user personal information fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS title VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS surname VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS other_title VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS other_names VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS appointment_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS grade VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS notch VARCHAR(50);

-- Migrate existing 'name' data: split into first_name and surname (simple split on first space)
UPDATE users 
SET 
  first_name = COALESCE(SPLIT_PART(name, ' ', 1), 'Unknown'),
  surname = COALESCE(NULLIF(SUBSTRING(name FROM POSITION(' ' IN name) + 1), ''), 'Unknown'),
  title = 'Mr',
  gender = 'Male',
  appointment_date = CURRENT_DATE
WHERE first_name IS NULL;

-- Drop the old name column
ALTER TABLE users DROP COLUMN IF EXISTS name;
