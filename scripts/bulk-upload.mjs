import fs from 'fs/promises'
import path from 'path'
import mime from 'mime'
import { createClient } from '@supabase/supabase-js'

// Usage: node scripts/bulk-upload.mjs <rootDir>
// Root directory should contain subfolders named after subjects, e.g.
// upload-files/DBMS/*.pdf
// upload-files/DiscreteMath/*.pdf

// CLI args: [rootDir] [--uploaded-by=ID] [--category=Category]
const rawArgs = process.argv.slice(2)
let rootDir = './upload-files'
let uploadedBy = process.env.UPLOADER_ID || 'bulk-upload-script'
let defaultCategory = process.env.BULK_CATEGORY || 'Notes'

for (const a of rawArgs) {
  if (a.startsWith('--uploaded-by=')) uploadedBy = a.split('=')[1]
  else if (a.startsWith('--category=')) defaultCategory = a.split('=')[1]
  else if (!a.startsWith('--')) rootDir = a
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.')
  console.error('Set these before running the script. Example:')
  console.error('  export SUPABASE_URL="https://xyz.supabase.co"')
  console.error('  export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const allowedExt = ['.pdf', '.docx', '.doc', '.ppt', '.pptx', '.txt']

async function uploadFile(filePath, destPath) {
  const buf = await fs.readFile(filePath)
  const contentType = mime.getType(filePath) || 'application/octet-stream'
  const { error } = await supabase.storage.from('materials').upload(destPath, buf, { contentType })
  if (error) throw error
  const { data } = supabase.storage.from('materials').getPublicUrl(destPath)
  return data.publicUrl
}

async function run() {
  try {
    const entries = await fs.readdir(rootDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const subject = entry.name
      const subjectDir = path.join(rootDir, subject)
      const files = await fs.readdir(subjectDir)
      for (const file of files) {
        const ext = path.extname(file).toLowerCase()
        if (!allowedExt.includes(ext)) continue
        const localPath = path.join(subjectDir, file)
        const destName = `${Date.now()}_${Math.random().toString(36).slice(2,8)}_${file.replace(/\s+/g, '_')}`
        const destPath = destName
        console.log(`Uploading ${localPath} -> ${destPath} (subject: ${subject})`)
        try {
          const publicUrl = await uploadFile(localPath, destPath)
          // Insert DB row
          const title = path.basename(file, ext)
          const category = defaultCategory
          const { data, error } = await supabase.from('materials').insert([
            {
              title,
              category,
              file_url: publicUrl,
              file_path: destPath,
              uploaded_by: uploadedBy,
            },
          ]).select().single()

          if (error) {
            console.error('DB insert error for', file, error)
          } else {
            console.log('Inserted material id:', data?.id)
          }
        } catch (e) {
          console.error('Failed to upload or insert for', file, e)
        }
      }
    }
    console.log('Done')
  } catch (e) {
    console.error('Script failed:', e)
    process.exit(1)
  }
}

run()
