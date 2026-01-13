-- Add password change tracking fields for OTP-based first login
-- When a user is created, they get a temporary password (OTP) and must change it on first login

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_change_required BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_password VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_password_created_at TIMESTAMP;

-- Set existing users to not require password change (they already have passwords)
UPDATE users SET password_change_required = false WHERE password_change_required IS NULL;

-- Create index for faster lookup of users requiring password change
CREATE INDEX IF NOT EXISTS idx_users_password_change_required ON users(password_change_required) WHERE password_change_required = true;
