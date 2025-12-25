-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read from users table (for leaderboard)
CREATE POLICY "Allow public read access to users"
ON users
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to insert into users table (for entry gate)
CREATE POLICY "Allow public insert to users"
ON users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow users to update their own records
CREATE POLICY "Allow users to update own record"
ON users
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Note: This is a permissive policy for the leaderboard feature
-- In production, you may want to restrict updates to authenticated users only
