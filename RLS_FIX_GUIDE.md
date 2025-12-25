# Database Setup and RLS Policies Fix

## Issue
Users are getting a foreign key constraint error when trying to upload materials:
```
insert or update on table "materials" violates foreign key constraint "materials_uploaded_by_fkey"
```

This occurs because the user profile is not being created in the `users` table during signup.

## Root Cause
The database trigger that automatically creates user profiles when auth users are created might not have been properly installed, or RLS policies are preventing the profile creation.

## Solution

### Step 1: Ensure the Database Trigger is Created
Run the SQL from `database/migrations/create_user_trigger_v2.sql` in your Supabase SQL Editor:
1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy all content from `database/migrations/create_user_trigger_v2.sql`
5. Run it

This creates a trigger that automatically creates a user profile whenever a new auth user signs up.

### Step 2: Fix RLS Policies for Users Table
Run the SQL from `database/migrations/fix_users_rls.sql` in your Supabase SQL Editor:
1. Click "New Query"
2. Copy all content from `database/migrations/fix_users_rls.sql`
3. Run it

This ensures:
- Authenticated users can read their own profile
- Authenticated users can insert their own profile during signup
- Authenticated users can update/delete their own profile
- Service role can manage all users (for triggers)

### Step 3: Fix RLS Policies for Materials Table
Run the SQL from `database/migrations/fix_materials_rls.sql` in your Supabase SQL Editor:
1. Click "New Query"
2. Copy all content from `database/migrations/fix_materials_rls.sql`
3. Run it

This ensures:
- Anyone can read materials
- Authenticated users can only insert/update/delete materials they uploaded

### Step 4: Verify Everything Works
1. Test signup with a new account
2. Try uploading a material
3. Check if the material appears in the dashboard

## Testing Checklist

After running the SQL scripts:
- [ ] Test user signup - verify a new user profile is created
- [ ] Check Supabase > Users table - see if new user has a record
- [ ] Test material upload - verify it creates a record in materials table
- [ ] Test viewing uploaded materials - verify they appear in the dashboard

## Debugging

If you still encounter errors:

### Check if user profile was created:
```sql
SELECT id, email, name FROM public.users LIMIT 10;
```

### Check materials table structure:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name='materials' 
ORDER BY ordinal_position;
```

### Check current RLS policies:
```sql
SELECT policyname, permissive, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename='users' OR tablename='materials';
```

## Files Referenced
- `database/migrations/create_user_trigger_v2.sql` - Database trigger for automatic profile creation
- `database/migrations/fix_users_rls.sql` - RLS policies for users table
- `database/migrations/fix_materials_rls.sql` - RLS policies for materials table
- `src/contexts/AuthContext.tsx` - Frontend signup logic with fallback profile creation
