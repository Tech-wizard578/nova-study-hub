import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Runtime checks to give clearer errors during development
if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY')
    throw new Error('Missing Supabase env vars. Create .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
}

// Helpful logs for local debugging (will print only in dev)
try {
    console.log('Supabase URL:', supabaseUrl)
    console.log('Supabase publishable key present:', Boolean(supabaseKey))
} catch (e) {
    // ignore in environments where console is restricted
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    },
})

// Database types
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string
                    batch: string
                    section: string
                    points: number
                    streak_days: number
                    avatar_url: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['users']['Insert']>
            }
            materials: {
                Row: {
                    id: string
                    title: string
                    category: string
                    file_url: string
                    file_path: string | null
                    uploaded_by: string
                    downloads: number
                    views: number
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['materials']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['materials']['Insert']>
            }
            questions: {
                Row: {
                    id: string
                    subject: string
                    question: string
                    options: string[]
                    correct_answer: string
                    difficulty: 'easy' | 'medium' | 'hard'
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['questions']['Insert']>
            }
            comments: {
                Row: {
                    id: string
                    user_id: string
                    material_id: string
                    content: string
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['comments']['Insert']>
            }
            puzzles: {
                Row: {
                    id: string
                    puzzle_data: any
                    date: string
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['puzzles']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['puzzles']['Insert']>
            }
        }
    }
}
