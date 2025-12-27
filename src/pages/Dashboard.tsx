
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getMaterials, subscribeToMaterials } from '@/services/materialsService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Download, Upload, TrendingUp, Zap, FileText, Sparkles, LogOut } from 'lucide-react'
import { downloadFile } from '@/utils/downloadHelper'
import VoiceAssistant from '@/components/VoiceAssistant'

const Dashboard = () => {
    const { user, profile, loading, signOut } = useAuth()
    const navigate = useNavigate()
    const [materials, setMaterials] = useState<any[]>([])
    const [stats, setStats] = useState({
        totalMaterials: 0,
        totalDownloads: 0,
        streakDays: 0,
        points: 0,
    })

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        }
    }, [user, loading, navigate])

    useEffect(() => {
        if (user) {
            loadDashboardData()
        }
    }, [user])

    useEffect(() => {
        if (!user) return

        // Subscribe to realtime materials updates and refresh dashboard when they occur
        const channel = subscribeToMaterials((payload) => {
            // Payload shapes can vary; normalize gracefully
            try {
                const event = payload.eventType || payload.event || payload.type
                const record = payload.new || payload.record || payload.new_record || payload.data

                if (!event) return

                // For simplicity, reload dashboard data to keep stats consistent
                loadDashboardData()
            } catch (e) {
                console.error('Realtime materials handler error:', e)
            }
        })

        return () => {
            try {
                channel.unsubscribe()
            } catch (e) {
                // fallback: ignore
            }
        }
    }, [user])

    const loadDashboardData = async () => {
        try {
            const materialsData = await getMaterials()
            setMaterials(materialsData.slice(0, 5))

            setStats({
                totalMaterials: materialsData.length,
                totalDownloads: materialsData.reduce((sum: number, m: any) => sum + (m.downloads || 0), 0),
                streakDays: profile?.streak_days || 0,
                points: profile?.points || 0,
            })
        } catch (error) {
            console.error('Failed to load dashboard:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-primary/30" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="particle bg-primary/20" style={{ left: '10%', width: '4px', height: '4px', animationDelay: '0s' }} />
                <div className="particle bg-secondary/20" style={{ left: '20%', width: '6px', height: '6px', animationDelay: '2s' }} />
                <div className="particle bg-accent/20" style={{ left: '30%', width: '3px', height: '3px', animationDelay: '4s' }} />
                <div className="particle bg-primary/20" style={{ left: '40%', width: '5px', height: '5px', animationDelay: '1s' }} />
                <div className="particle bg-secondary/20" style={{ left: '50%', width: '4px', height: '4px', animationDelay: '3s' }} />
                <div className="particle bg-accent/20" style={{ left: '60%', width: '6px', height: '6px', animationDelay: '5s' }} />
                <div className="particle bg-primary/20" style={{ left: '70%', width: '3px', height: '3px', animationDelay: '2.5s' }} />
                <div className="particle bg-secondary/20" style={{ left: '80%', width: '5px', height: '5px', animationDelay: '1.5s' }} />
                <div className="particle bg-accent/20" style={{ left: '90%', width: '4px', height: '4px', animationDelay: '3.5s' }} />
            </div>

            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50 animate-fade-in-up">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-display font-bold gradient-text">
                                Welcome back, {profile?.name || user?.email?.split('@')[0]}!
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Signed In</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    as {user?.email}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="glow" onClick={() => navigate('/upload')} className="btn-glow">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Material
                        </Button>
                        <Button
                            variant="outline"
                            onClick={async () => {
                                try {
                                    await signOut()
                                    navigate('/login')
                                } catch (error) {
                                    console.error('Sign out failed:', error)
                                }
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 relative z-10">
                {/* Stats Grid with Staggered Animations */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card
                        className="glass-card border-primary/20 card-3d hover:scale-105 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                            <Zap className="w-4 h-4 text-primary pulse-glow" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold gradient-text">{stats.points}</div>
                            <p className="text-xs text-muted-foreground mt-1">Keep learning!</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="glass-card border-secondary/20 card-3d hover:scale-105 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Streak Days</CardTitle>
                            <TrendingUp className="w-4 h-4 text-secondary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-secondary">{stats.streakDays}</div>
                            <p className="text-xs text-muted-foreground mt-1">Day streak 🔥</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="glass-card border-accent/20 card-3d hover:scale-105 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: '0.3s' }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
                            <BookOpen className="w-4 h-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-accent">{stats.totalMaterials}</div>
                            <p className="text-xs text-muted-foreground mt-1">Available resources</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="glass-card border-primary/20 card-3d hover:scale-105 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: '0.4s' }}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                            <Download className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold gradient-text">{stats.totalDownloads}</div>
                            <p className="text-xs text-muted-foreground mt-1">Global downloads</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Materials */}
                <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Recent Materials
                    </h2>

                    {materials.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {materials.map((material, index) => (
                                <Card
                                    key={material.id}
                                    className="glass-card hover:border-primary/50 card-3d hover:scale-105 transition-all duration-300 cursor-pointer group animate-scale-in"
                                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                                    onClick={() => navigate(`/materials/${material.id}`)}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{material.title}</CardTitle>
                                        <CardDescription>{material.category}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>{new Date(material.created_at).toLocaleDateString()}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 text-primary">
                                                    <Download className="w-3 h-3" />
                                                    {material.downloads}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={async (e) => {
                                                        e.stopPropagation()
                                                        try {
                                                            // Increment downloads then download file
                                                            await import('@/services/materialsService').then(async (mod) => {
                                                                const { incrementDownloads, getDownloadUrl } = mod
                                                                await incrementDownloads(material.id)
                                                                const url = await getDownloadUrl(material.file_path, material.file_url)

                                                                // Extract file extension from the URL or file_path
                                                                const fileExt = material.file_path?.split('.').pop() || 'pdf'
                                                                const filename = `${material.title}.${fileExt}`

                                                                // Download the file using the helper
                                                                await downloadFile(url, filename)
                                                            })
                                                        } catch (err) {
                                                            console.error('Download failed:', err)
                                                        }
                                                    }}
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass-card rounded-xl border-dashed border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                            <div className="relative inline-block mb-4">
                                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto floating" />
                                <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No materials yet</h3>
                            <p className="text-muted-foreground mb-4">Be the first to share study resources!</p>
                            <Button onClick={() => navigate('/upload')} className="btn-glow">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Material
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Voice Assistant */}
            <VoiceAssistant />
        </div>
    )
}

export default Dashboard
