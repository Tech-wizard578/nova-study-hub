import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    profile: any | null
    signIn: (email: string, password: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signUp: (email: string, password: string, name: string, batch: string, section: string) => Promise<void>
    signOut: () => Promise<void>
    updateNickname: (nickname: string) => Promise<void>
    isAdmin: () => boolean
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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                await loadProfile(session.user.id)

                // Handle OAuth redirect after sign-in
                if (event === 'SIGNED_IN' && session.user.app_metadata.provider === 'google') {
                    // Check if user is admin and redirect accordingly
                    if (session.user.email === 'aasheerwad009@gmail.com') {
                        window.location.href = '/upload'
                    } else {
                        window.location.href = '/'
                    }
                }
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
                // Profile doesn't exist - this happens with OAuth signups
                // Get user data from auth.users table
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    console.log("Creating profile for OAuth user:", user.email)

                    // Create profile with data from OAuth provider
                    const { data: newProfile, error: insertError } = await supabase
                        .from('users')
                        .insert([
                            {
                                id: userId,
                                email: user.email,
                                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                                batch: user.user_metadata?.batch || '',
                                section: user.user_metadata?.section || '',
                                points: 0,
                                streak_days: 0,
                                role: user.email === 'aasheerwad009@gmail.com' ? 'admin' : 'student'
                            },
                        ])
                        .select()
                        .single()

                    if (insertError) {
                        console.error('Error creating OAuth user profile:', insertError)
                    } else {
                        setProfile(newProfile)
                        console.log("✅ Profile created successfully for:", user.email)
                    }
                } else {
                    console.warn("No user found in auth.users")
                }
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

    const updateNickname = async (nickname: string) => {
        if (!user) throw new Error('No user logged in')

        const { error } = await supabase
            .from('users')
            .update({ nickname })
            .eq('id', user.id)

        if (error) throw error

        // Reload profile to get updated nickname
        await loadProfile(user.id)
    }

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        })

        if (error) throw error
    }

    const isAdmin = () => {
        if (!user || !profile) return false
        // Check if user email matches admin email or if role is admin
        return user.email === 'aasheerwad009@gmail.com' || profile.role === 'admin'
    }

    const signOut = async () => {
        console.log('AuthContext: signOut called, calling supabase.auth.signOut()...');

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Sign out timeout')), 3000)
        );

        try {
            const signOutPromise = supabase.auth.signOut();
            const { error } = await Promise.race([signOutPromise, timeoutPromise]) as any;

            console.log('AuthContext: supabase.auth.signOut() completed', { error });
            if (error) {
                console.error('AuthContext: signOut error:', error);
                throw error;
            }
            console.log('AuthContext: signOut successful');
        } catch (error: any) {
            if (error.message === 'Sign out timeout') {
                console.warn('AuthContext: signOut timed out, forcing local sign out');
                // Force local sign out by clearing storage
                localStorage.clear();
                sessionStorage.clear();
            } else {
                throw error;
            }
        }
    }

    const value = {
        user,
        profile,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        updateNickname,
        isAdmin,
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
