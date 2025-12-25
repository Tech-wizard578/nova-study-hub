-- Storage Setup for Nova Study Hub
-- This script sets up the materials table to support file uploads via Supabase Storage
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- STEP 1: Create Storage Bucket (MUST BE DONE VIA SUPABASE DASHBOARD)
-- ============================================================================
-- 
-- Before running this SQL script, you MUST create the storage bucket manually:
-- 
-- 1. Go to your Supabase Dashboard → Storage
-- 2. Click "New bucket"
-- 3. Bucket name: materials
-- 4. Set to "Public" (so files can be downloaded via public URLs)
-- 5. Click "Create bucket"
-- 
-- After creating the bucket, configure the storage policies:
-- 
-- 6. Click on the "materials" bucket
-- 7. Go to "Policies" tab
-- 8. Click "New Policy"
-- 9. Create the following policies:
--
--    Policy 1: Allow Authenticated Uploads
--    - Name: "Allow authenticated users to upload"
--    - Allowed operation: INSERT
--    - Target roles: authenticated
--    - Policy definition: true
--    - Click "Review" then "Save policy"
--
--    Policy 2: Allow Public Downloads
--    - Name: "Allow public downloads"
--    - Allowed operation: SELECT
--    - Target roles: public
--    - Policy definition: true
--    - Click "Review" then "Save policy"
--
--    Policy 3: Allow Users to Delete Their Own Files (Optional)
--    - Name: "Allow users to delete own files"
--    - Allowed operation: DELETE
--    - Target roles: authenticated
--    - Policy definition: (bucket_id = 'materials'::text)
--    - Click "Review" then "Save policy"
--

-- ============================================================================
-- STEP 2: Add file_path Column to Materials Table
-- ============================================================================

-- Add file_path column to store the storage path separately from the public URL
-- This allows for future flexibility (e.g., switching to private buckets with signed URLs)
ALTER TABLE public.materials 
ADD COLUMN IF NOT EXISTS file_path text;

-- Add a comment to document the column
COMMENT ON COLUMN public.materials.file_path IS 'Storage path in Supabase Storage bucket (e.g., "abc123.pdf")';

-- ============================================================================
-- STEP 3: Update RLS Policies for Materials Table (if needed)
-- ============================================================================

-- Verify existing policies are correct
-- These should already exist from SUPABASE_SETUP.md, but we'll recreate them to be safe

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public materials are viewable" ON public.materials;
DROP POLICY IF EXISTS "Authenticated users can upload materials" ON public.materials;
DROP POLICY IF EXISTS "Users can update own materials" ON public.materials;
DROP POLICY IF EXISTS "Users can delete own materials" ON public.materials;

-- Allow anyone to read materials (public access)
CREATE POLICY "Public materials are viewable" ON public.materials
  FOR SELECT USING (true);

-- Allow authenticated users to upload materials (must be the uploader)
CREATE POLICY "Authenticated users can upload materials" ON public.materials
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Allow users to update their own materials
CREATE POLICY "Users can update own materials" ON public.materials
  FOR UPDATE USING (auth.uid() = uploaded_by);

-- Allow users to delete their own materials (optional)
CREATE POLICY "Users can delete own materials" ON public.materials
  FOR DELETE USING (auth.uid() = uploaded_by);

-- ============================================================================
-- STEP 4: Verify Setup
-- ============================================================================

-- Check if file_path column was added successfully
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'materials'
  AND column_name = 'file_path';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'materials';

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- After running this script:
-- 1. Verify the storage bucket "materials" exists in Supabase Dashboard
-- 2. Verify the storage policies are configured correctly
-- 3. Test file upload from the application
-- 4. Check that both file_url and file_path are populated in the materials table
--
