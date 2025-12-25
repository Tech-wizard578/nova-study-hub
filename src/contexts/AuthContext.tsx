import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    profile: any | null
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, name: string, batch: string, section: string) => Promise<void>
    signOut: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                loadProfile(session.user.id)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                loadProfile(session.user.id)
            } else {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => {
            try {
                subscription.unsubscribe()
            } catch (e) {
                // ignore unsubscribe errors
            }
        }
    }, [])

    const loadProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .maybeSingle()

            if (error) {
                console.error("Error loading profile:", error)
                return
            }

            if (data) {
                setProfile(data)
            } else {
                console.warn("No profile found for user:", userId)
            }
        } catch (error) {
            console.error("Unexpected error loading profile:", error)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email: string, password: string, name: string, batch: string, section: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    batch,
                    section,
                },
            },
        })

        if (error) throw error

        // If sign up succeeded, the database trigger should create a profile automatically.
        // Give the trigger time to execute (it's async)
        const userId = data?.user?.id
        if (userId) {
            try {
                // Wait a bit for the trigger to execute
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Check if profile was created by trigger
                const { data: existingProfile, error: checkError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle()

                if (checkError?.code === 'PGRST116') {
                    // Trigger didn't create the profile, create it as fallback
                    // Use RLS-bypassing approach: insert via function or with proper role
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert([
                            {
                                id: userId,
                                email,
                                name,
                                batch,
                                section,
                                points: 0,
                                streak_days: 0,
                            },
                        ])

                    if (insertError) {
                        console.error('Error creating user profile fallback:', insertError)
                        throw new Error(`Failed to create user profile: ${insertError.message}`)
                    }
                } else if (checkError) {
                    console.error('Error checking profile:', checkError)
                }

                // Load profile into state
                await loadProfile(userId)
            } catch (e: any) {
                console.error('Error ensuring profile after signUp:', e)
                throw e
            }
        }
    }

    const signIn = async (email: string, password: string) => {
        console.log('AuthContext: signIn called with', email)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('AuthContext: Supabase signIn error:', error)
            throw error
        }

        // ensure we load the profile immediately
        const userId = data?.user?.id
        if (userId) {
            try {
                await loadProfile(userId)
            } catch (e) {
                console.error('Error loading profile after signIn:', e)
            }
        }
        console.log('AuthContext: Supabase signIn success')
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    const value = {
        user,
        profile,
        signIn,
        signUp,
        signOut,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
