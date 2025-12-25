-- Add nickname column to users table for voice assistant personalization
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- Add comment for documentation
COMMENT ON COLUMN users.nickname IS 'User preferred nickname for voice assistant greetings';
