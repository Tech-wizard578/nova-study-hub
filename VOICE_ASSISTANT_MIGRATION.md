# Voice Assistant - Database Migration Guide

## Running the Migration

Since the database is hosted on Supabase, you'll need to run the migration through the Supabase SQL Editor:

### Steps:

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project: **nova-study-hub**

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the contents of `database/migrations/add_nickname_column.sql`
   - Paste into the SQL editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify the Migration**
   - Go to "Table Editor" → "users"
   - Confirm that the `nickname` column has been added

### Migration SQL:

```sql
-- Add nickname column to users table for voice assistant personalization
ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- Add comment for documentation
COMMENT ON COLUMN users.nickname IS 'User preferred nickname for voice assistant greetings';
```

## What This Migration Does

- Adds a `nickname` column to the `users` table
- Creates an index for better query performance
- Sets the column as optional (NULL allowed)
- Users can set their nickname through the voice assistant UI

## After Migration

Once the migration is complete, the voice assistant will be fully functional with nickname support!
