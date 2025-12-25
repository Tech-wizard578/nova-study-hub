# Supabase Setup Guide

To run this project, you need to set up your Supabase tables and storage bucket. Run the following SQL in your Supabase SQL Editor.

## 1. Create Tables

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  batch text,
  section text,
  points integer default 0,
  streak_days integer default 0,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Materials Table
create table public.materials (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text not null,
  file_url text not null,
  uploaded_by uuid references public.users(id),
  downloads integer default 0,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Basic)
alter table public.users enable row level security;
alter table public.materials enable row level security;

-- Allow anyone to read materials
create policy "Public materials are viewable" on public.materials
  for select using (true);

-- Allow authenticated users to upload materials
create policy "Authenticated users can upload materials" on public.materials
  for insert with check (auth.uid() = uploaded_by);
  
-- Allow users to read their own data
create policy "Users can read own data" on public.users
  for select using (auth.uid() = id);

-- Allow users to insert their own data (for sign up)
create policy "Users can insert own data" on public.users
  for insert with check (auth.uid() = id);

-- Allow users to update their own data
create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

-- Allow users to delete their own data
create policy "Users can delete own data" on public.users
  for delete using (auth.uid() = id);

```

## 2. Create User Profile Trigger

This trigger automatically creates a user profile in the `users` table when a new auth user is created.

```sql
-- Create a function that will be triggered
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, batch, section)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'batch', ''),
    COALESCE(NEW.raw_user_meta_data->>'section', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 3. Storage Setup

**IMPORTANT**: Before your application can upload and download files, you must set up the Supabase storage bucket.

### Create Storage Bucket

1.  Go to **Storage** in your Supabase Dashboard.
2.  Click **"New bucket"**.
3.  Bucket name: `materials`
4.  Set to **Public** (this allows files to be downloaded via public URLs).
5.  Click **"Create bucket"**.

### Configure Storage Policies

After creating the bucket, you need to add policies to control access:

1.  Click on the **"materials"** bucket.
2.  Go to the **"Policies"** tab.
3.  Click **"New Policy"**.

**Policy 1: Allow Authenticated Uploads**
- Name: `Allow authenticated users to upload`
- Allowed operation: **INSERT**
- Target roles: **authenticated**
- Policy definition: `true`
- Click **"Review"** then **"Save policy"**

**Policy 2: Allow Public Downloads**
- Name: `Allow public downloads`
- Allowed operation: **SELECT**
- Target roles: **public**
- Policy definition: `true`
- Click **"Review"** then **"Save policy"**

**Policy 3: Allow Users to Delete Their Own Files** (Optional)
- Name: `Allow users to delete own files`
- Allowed operation: **DELETE**
- Target roles: **authenticated**
- Policy definition: `(bucket_id = 'materials'::text)`
- Click **"Review"** then **"Save policy"**

### Add file_path Column

After setting up the storage bucket, run the `setup_storage.sql` script in your Supabase SQL Editor:

```bash
# The script is located at: database/migrations/setup_storage.sql
```

This script will:
- Add a `file_path` column to the `materials` table
- Update RLS policies for the materials table
- Provide verification queries to ensure everything is set up correctly
