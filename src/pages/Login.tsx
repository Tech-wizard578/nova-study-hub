
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Sparkles, Mail, Lock } from 'lucide-react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const { signIn, signInWithGoogle } = useAuth()
    const navigate = useNavigate()
    const { user, loading: authLoading } = useAuth()

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/dashboard')
        }
    }, [user, authLoading, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await signIn(email, password)
            toast.success('Welcome back!')

            // Redirect admin to upload page, students to dashboard
            if (email === 'aasheerwad009@gmail.com') {
                navigate('/upload')
            } else {
                navigate('/dashboard')
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true)
        try {
            await signInWithGoogle()
            // Redirect will be handled by Supabase OAuth
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in with Google')
            setGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="w-full max-w-md relative z-50 glass-card p-8 rounded-2xl animate-fade-in border border-border/50 bg-card/50 backdrop-blur-xl">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Vignanits
                    </span>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to continue learning</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@vignan.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || googleLoading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                {/* Google Sign-In Button */}
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading || googleLoading}
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                </Button>

                <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
