-- Run this in Supabase SQL Editor to check trigger status

-- Check if the function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check if the trigger exists
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Check recent users table to see if any profiles exist
SELECT * FROM public.users ORDER BY created_at DESC LIMIT 5;

-- Check auth.users to see recent signups
SELECT id, email, created_at, raw_user_meta_data 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
