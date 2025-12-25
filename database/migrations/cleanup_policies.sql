-- Cleanup Duplicate RLS Policies for Materials Table
-- This script removes duplicate policies and ensures proper WITH CHECK clauses
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- Remove ALL existing policies to start fresh
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view materials" ON public.materials;
DROP POLICY IF EXISTS "Public materials are viewable" ON public.materials;
DROP POLICY IF EXISTS "Authenticated users can upload" ON public.materials;
DROP POLICY IF EXISTS "Authenticated users can upload materials" ON public.materials;
DROP POLICY IF EXISTS "Users can update own materials" ON public.materials;
DROP POLICY IF EXISTS "Users can delete own materials" ON public.materials;

-- ============================================================================
-- Create clean, properly configured policies
-- ============================================================================

-- Policy 1: Allow anyone to read/view materials (public access)
CREATE POLICY "Public materials are viewable" ON public.materials
  FOR SELECT 
  USING (true);

-- Policy 2: Allow authenticated users to upload materials (must be the uploader)
CREATE POLICY "Authenticated users can upload materials" ON public.materials
  FOR INSERT 
  WITH CHECK (auth.uid() = uploaded_by);

-- Policy 3: Allow users to update their own materials
CREATE POLICY "Users can update own materials" ON public.materials
  FOR UPDATE 
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

-- Policy 4: Allow users to delete their own materials
CREATE POLICY "Users can delete own materials" ON public.materials
  FOR DELETE 
  USING (auth.uid() = uploaded_by);

-- ============================================================================
-- Verify the policies are correct
-- ============================================================================

SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'materials'
ORDER BY cmd, policyname;

-- Expected output:
-- 4 policies total:
-- 1. "Authenticated users can upload materials" - INSERT with WITH CHECK
-- 2. "Public materials are viewable" - SELECT
-- 3. "Users can update own materials" - UPDATE with USING and WITH CHECK
-- 4. "Users can delete own materials" - DELETE with USING
