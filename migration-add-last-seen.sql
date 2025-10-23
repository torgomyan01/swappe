-- Add last_seen column to users table
ALTER TABLE users ADD COLUMN last_seen DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to have current timestamp as last_seen
UPDATE users SET last_seen = NOW() WHERE last_seen IS NULL;
