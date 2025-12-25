import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

// Supabase Edge Function: create signed URL for private storage objects
// Requires the following environment variables to be set in the function environment:
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in function environment')
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '')

serve(async (req) => {
  try {
    const body = await req.json()
    const path = body?.path
    const expires = body?.expires || 60 // seconds

    if (!path) {
      return new Response(JSON.stringify({ error: 'Missing `path` in request body' }), { status: 400 })
    }

    const { data, error } = await supabase.storage.from('materials').createSignedUrl(path, expires)
    if (error) {
      console.error('createSignedUrl error:', error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ signedUrl: data.signedUrl }), { status: 200 })
  } catch (e) {
    console.error('Unexpected error in get-signed-url function:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
})
