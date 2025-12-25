-- Updated trigger with error handling
-- Run this in your Supabase SQL Editor

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved function with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_batch TEXT;
  user_section TEXT;
BEGIN
  -- Extract metadata with better null handling
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', '');
  user_batch := COALESCE(NEW.raw_user_meta_data->>'batch', '');
  user_section := COALESCE(NEW.raw_user_meta_data->>'section', '');
  
  -- Log the attempt (optional, for debugging)
  RAISE NOTICE 'Creating profile for user: % (%, %, %)', NEW.id, user_name, user_batch, user_section;
  
  -- Insert the user profile
  INSERT INTO public.users (id, email, name, batch, section, points, streak_days)
  VALUES (
    NEW.id,
    NEW.email,
    user_name,
    user_batch,
    user_section,
    0,
    0
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth signup
    RAISE WARNING 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.users TO postgres, anon, authenticated, service_role;
