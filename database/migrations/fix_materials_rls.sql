-- Fix RLS Policies for Materials Table
-- Run this in your Supabase SQL Editor

-- First, check current RLS status
-- SELECT * FROM information_schema.table_privileges WHERE table_name='materials';

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Materials are publicly readable" ON public.materials;
DROP POLICY IF EXISTS "Users can insert materials" ON public.materials;
DROP POLICY IF EXISTS "Users can update own materials" ON public.materials;
DROP POLICY IF EXISTS "Users can delete own materials" ON public.materials;

-- Ensure RLS is enabled
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to read materials (public list)
CREATE POLICY "Materials are publicly readable" 
ON public.materials 
FOR SELECT 
USING (true);

-- Policy 2: Allow authenticated users to insert materials
-- They can only insert if they are the uploader (uploaded_by = auth.uid())
CREATE POLICY "Users can insert own materials" 
ON public.materials 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

-- Policy 3: Allow users to update their own materials
CREATE POLICY "Users can update own materials" 
ON public.materials 
FOR UPDATE 
USING (auth.uid() = uploaded_by);

-- Policy 4: Allow users to delete their own materials
CREATE POLICY "Users can delete own materials" 
ON public.materials 
FOR DELETE 
USING (auth.uid() = uploaded_by);

-- Policy 5: Allow service_role to manage all materials (for backend operations)
CREATE POLICY "Service role can manage all materials" 
ON public.materials 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materials TO authenticated;
GRANT SELECT ON public.materials TO anon;

-- Verify the changes
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename='materials';
-- SELECT policyname, permissive, cmd FROM pg_policies WHERE tablename='materials';
