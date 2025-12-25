-- Fix RLS Policies for Users Table to Allow Profile Creation During Signup
-- Run this in your Supabase SQL Editor

-- First, check current RLS status
-- SELECT * FROM information_schema.table_privileges WHERE table_name='users';

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can delete own data" ON public.users;

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to read their own profile
CREATE POLICY "Users can read own data" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Allow authenticated users to insert their own profile (during signup)
CREATE POLICY "Users can insert own data" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policy 3: Allow authenticated users to update their own profile
CREATE POLICY "Users can update own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Policy 4: Allow authenticated users to delete their own profile
CREATE POLICY "Users can delete own data" 
ON public.users 
FOR DELETE 
USING (auth.uid() = id);

-- Policy 5: Allow service_role to manage all users (for backend operations)
-- This is needed for database triggers and admin operations
CREATE POLICY "Service role can manage all users" 
ON public.users 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- Verify the changes
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename='users';
-- SELECT policyname, permissive, cmd FROM pg_policies WHERE tablename='users';
