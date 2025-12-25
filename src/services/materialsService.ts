
import { supabase } from '@/lib/supabase'

export const getMaterials = async () => {
    const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching materials:', error)
        return []
    }

    return data
}

export const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(filePath, file)

    if (uploadError) {
        throw uploadError
    }

    const { data } = supabase.storage.from('materials').getPublicUrl(filePath)
    // Return both path and public URL — project may use private buckets and signed URLs instead.
    return { path: filePath, publicUrl: data.publicUrl }
}

export const createMaterial = async (material: {
    title: string
    category: string
    file_url: string
    file_path?: string
    uploaded_by: string
}) => {
    // Validate that uploaded_by is provided
    if (!material.uploaded_by) {
        throw new Error('User ID is required to upload material. Please ensure you are logged in.')
    }

    const row: any = {
        title: material.title,
        category: material.category,
        file_url: material.file_url,
        uploaded_by: material.uploaded_by,
        downloads: 0,
        views: 0,
    }

    if (material.file_path) row.file_path = material.file_path

    const { data, error } = await supabase.from('materials').insert([row]).select().maybeSingle()

    if (error) {
        if (error.code === '23503') {
            // Foreign key constraint violation
            throw new Error(`User profile not found. Please try logging out and logging back in. (User ID: ${material.uploaded_by})`)
        }
        throw error
    }

    return data
}

export const incrementDownloads = async (materialId: string) => {
    // Read current downloads then update to avoid relying on SQL expressions client-side
    const { data: current, error: selErr } = await supabase.from('materials').select('downloads').eq('id', materialId).maybeSingle()
    if (selErr) {
        console.error('Failed to read downloads count:', selErr)
        throw selErr
    }

    const next = (current?.downloads || 0) + 1
    const { data, error } = await supabase.from('materials').update({ downloads: next }).eq('id', materialId)
    if (error) {
        console.error('Failed to increment downloads:', error)
        throw error
    }
    return data
}

export const incrementViews = async (materialId: string) => {
    const { data: current, error: selErr } = await supabase.from('materials').select('views').eq('id', materialId).maybeSingle()
    if (selErr) {
        console.error('Failed to read views count:', selErr)
        throw selErr
    }

    const next = (current?.views || 0) + 1
    const { data, error } = await supabase.from('materials').update({ views: next }).eq('id', materialId)
    if (error) {
        console.error('Failed to increment views:', error)
        throw error
    }

    return data
}

// Placeholder: If you host a server-side function that creates signed URLs (using service_role key),
// call it from the client to retrieve a signed URL for private buckets. For now, return publicUrl.
export const getDownloadUrl = async (filePath: string, publicUrl?: string) => {
    // If publicUrl is provided, prefer it for immediate access (public buckets)
    if (publicUrl) return publicUrl

    // Otherwise, try calling a Supabase Edge Function to create a signed URL.
    const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
    if (!functionsUrl) {
        throw new Error('VITE_SUPABASE_FUNCTIONS_URL not configured. Use public buckets or configure an Edge Function for signed URLs.')
    }

    try {
        const resp = await fetch(`${functionsUrl}/get-signed-url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: filePath })
        })

        if (!resp.ok) {
            const errText = await resp.text()
            throw new Error(`Signed URL provider responded with ${resp.status}: ${errText}`)
        }

        const json = await resp.json()
        return json.signedUrl || json.signedURL || json.signed_url
    } catch (e) {
        console.error('Error fetching signed URL:', e)
        throw e
    }
}

// Subscribe to realtime changes on `materials` table.
// `callback` will be called with the realtime payload whenever an INSERT/UPDATE/DELETE occurs.
// Returns the Supabase realtime channel — call `.unsubscribe()` on it during cleanup.
export const subscribeToMaterials = (callback: (payload: any) => void) => {
    const channel = supabase
        .channel('public:materials')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'materials' }, (payload) => {
            try {
                callback(payload)
            } catch (e) {
                console.error('Error in materials realtime callback:', e)
            }
        })
        .subscribe()

    return channel
}
