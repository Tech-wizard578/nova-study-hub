-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add default UUID generation to the id column
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Verify the change
SELECT column_name, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'id';
