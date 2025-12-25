# Local setup & Supabase integration

Follow these steps to run the project locally and connect to Supabase.

1. Create a Supabase project and database.
2. Create a Storage bucket named `materials` (public or private).
   - If you choose *public*, files are accessible via `getPublicUrl` and the frontend will work out-of-the-box.
   - If you choose *private*, you must provide a server-side endpoint (Supabase Edge Function or other) that creates signed URLs using the Service Role key. The repository includes a `getDownloadUrl` placeholder to call such an endpoint.
3. Create the required database tables and triggers. The project expects a `materials` table and a `users` table. You can use the included SQL files in the repo (if any) or create the following columns for `materials`:

   - `id` (uuid or text primary key)
   - `title` (text)
   - `category` (text)
   - `file_url` (text)
   - `file_path` (text) — optional
   - `uploaded_by` (text)
   - `downloads` (integer)
   - `views` (integer)
   - `created_at` (timestamp)

4. Copy `.env.example` to `.env.local` and fill in your Supabase project values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-anon-key
```

5. Install and run locally:

```bash
npm install
npm run dev
```

# Notes about uploads & downloads

- Uploads: the frontend uploads files to the `materials` bucket and stores `file_url` (public URL) and `file_path` (object path) in the DB when available.
- Downloads: by default the app uses the stored `file_url` (works for public buckets). For private buckets, implement a server-side function that returns a signed URL and call it from `getDownloadUrl` in `src/services/materialsService.ts`.

# Optional: Supabase Edge Function (signed URLs)

If you deploy Supabase Edge Functions, implement a simple function that accepts `{ path }` and returns a signed URL using the service_role key. Call that function from `getDownloadUrl`.

Example logic (pseudo):

```ts
// server-side (Edge Function or other secure backend)
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function handler(req) {
  const { path } = await req.json()
  const { signedURL, error } = await supabase.storage.from('materials').createSignedUrl(path, 60)
  return new Response(JSON.stringify({ signedURL }))
}
```

Then call that endpoint from `getDownloadUrl`.

## Deploying the example Edge Function included

This repo includes an example Supabase Edge Function at `supabase/functions/get-signed-url`.

1. Install the Supabase CLI and log in: https://supabase.com/docs/guides/cli
2. From the repo root run:

```bash
supabase functions deploy get-signed-url --project-ref <your-project-ref>
```

3. Configure the function's environment with your service role key (NOT in frontend):

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
```

4. After deployment, set `VITE_SUPABASE_FUNCTIONS_URL` in your frontend environment to the functions base URL (e.g. `https://<project>.functions.supabase.co`).

Note: Be careful with `SUPABASE_SERVICE_ROLE_KEY` — never commit it to source control or expose it to the browser.

# What's next

- I can implement an example Supabase Edge Function and wiring for `getDownloadUrl`.
- I can also harden auth and add tests before you deploy manually.

## Bulk uploading local files

To upload many files at once, create a folder named `upload-files` in the repo root. Put PDFs/DOCX into subfolders named by subject, for example:

```
upload-files/
   DBMS/
      dbms_notes_unit1.pdf
      er_diagrams.pdf
   DiscreteMathematics/
      sets_and_relations.pdf
   OOP_Java/
      oop_notes.pdf
```

Then run the bulk upload script (the script uses the Service Role key and will both upload files to the `materials` bucket and insert DB rows):

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
node scripts/bulk-upload.mjs upload-files
```

Notes:
- The script uploads files to the `materials` bucket and inserts a `materials` row with `title`, `category` (set to `Notes`), `file_url`, and `file_path`.
- Adjust `uploaded_by` value in the script if you want to attribute uploads to a specific user id.
You can also pass flags to the script:

```bash
# specify uploader id and category
node scripts/bulk-upload.mjs upload-files --uploaded-by=admin-user --category="DBMS"

# Or set env vars:
export UPLOADER_ID="admin-user"
export BULK_CATEGORY="DBMS"
node scripts/bulk-upload.mjs upload-files
```
