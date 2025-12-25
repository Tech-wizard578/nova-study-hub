-- Sync missing user profiles
-- This script creates user profiles for all auth users that don't have a corresponding entry in public.users
-- Run this in your Supabase SQL Editor

-- First, let's see which auth users are missing profiles
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'name' as name,
  au.raw_user_meta_data->>'batch' as batch,
  au.raw_user_meta_data->>'section' as section,
  pu.id as profile_exists
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Now insert all missing profiles with their auth data
INSERT INTO public.users (id, email, name, batch, section, points, streak_days)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', ''),
  COALESCE(au.raw_user_meta_data->>'batch', ''),
  COALESCE(au.raw_user_meta_data->>'section', ''),
  0,
  0
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the sync was successful
SELECT COUNT(*) as total_users FROM public.users;
SELECT COUNT(*) as total_auth_users FROM auth.users;
