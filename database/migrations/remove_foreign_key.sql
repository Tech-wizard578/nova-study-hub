-- Remove the foreign key constraint that requires users.id to exist in auth.users
-- This is necessary because the app doesn't use Supabase Auth

ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Verify the constraint was removed
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass;
