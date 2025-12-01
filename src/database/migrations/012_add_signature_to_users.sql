-- Add signature_url column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS signature_url VARCHAR(500);
