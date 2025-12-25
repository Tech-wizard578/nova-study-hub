-- Fix RLS Policies for Users Table
-- Run this in your Supabase SQL Editor

-- First, drop the existing policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Recreate policies with correct permissions

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own data during signup
-- This policy allows authenticated users to create their profile
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Optional: Allow users to delete their own data
CREATE POLICY "Users can delete own data" ON public.users
  FOR DELETE USING (auth.uid() = id);
