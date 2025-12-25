-- Add explanation column to questions table for daily aptitude questions
-- Run this in your Supabase SQL Editor

-- Add explanation column if it doesn't exist
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS explanation text;

-- Add comment to document the column
COMMENT ON COLUMN public.questions.explanation IS 'Explanation for the correct answer';

-- Verify the change
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'questions'
  AND column_name = 'explanation';
