import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useVoiceAssistant } from '@/contexts/VoiceAssistantContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Timer,
    Sparkles,
    X,
    Settings,
    Play,
    Pause,
    Coffee
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const VoiceAssistant = () => {
    const { user, profile } = useAuth()
    const {
        isEnabled,
        isSpeaking,
        isListening,
        focusMode,
        speak,
        stopSpeaking,
        startListening,
        startFocusMode,
        endFocusMode,
        toggleEnabled
    } = useVoiceAssistant()

    const [isExpanded, setIsExpanded] = useState(false)
    const [nickname, setNickname] = useState('')
    const [isEditingNickname, setIsEditingNickname] = useState(false)
    const [focusDuration, setFocusDuration] = useState(25)
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
    const [hasGreeted, setHasGreeted] = useState(false)

    // Get time-based greeting
    const getTimeBasedGreeting = useCallback(() => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        return 'Good evening'
    }, [])

    // Detect gender based on nickname (simple heuristic)
    const detectGender = useCallback((name: string) => {
        const lowerName = name.toLowerCase()

        // Common female name patterns/endings
        const femalePatterns = ['a', 'i', 'y', 'e']
        const femaleNames = ['priya', 'divya', 'sneha', 'anjali', 'pooja', 'kavya', 'shreya', 'nikita', 'riya', 'isha', 'neha', 'sakshi', 'tanvi', 'ananya', 'sai', 'sri', 'lakshmi', 'durga', 'sarah', 'emily', 'sophia', 'emma', 'olivia', 'ava', 'mia', 'isabella', 'charlotte', 'amelia', 'harper', 'ella']

        // Common male name patterns/endings
        const maleNames = ['raj', 'kumar', 'arun', 'vijay', 'rahul', 'amit', 'rohit', 'suresh', 'ramesh', 'kiran', 'arjun', 'vishal', 'nikhil', 'aditya', 'akash', 'akhil', 'sai', 'sri', 'krishna', 'shiva', 'john', 'james', 'michael', 'david', 'william', 'robert', 'joseph', 'thomas', 'charles', 'daniel']

        // Check exact matches first
        if (femaleNames.some(fn => lowerName.includes(fn))) return 'female'
        if (maleNames.some(mn => lowerName.includes(mn))) return 'male'

        // Check endings
        const lastChar = lowerName.slice(-1)
        if (femalePatterns.includes(lastChar) && lowerName.length > 3) return 'female'

        // Default to neutral
        return 'neutral'
    }, [])

    // Get salutation based on gender
    const getSalutation = useCallback((name: string) => {
        const gender = detectGender(name)
        if (gender === 'female') return 'ma\'am'
        if (gender === 'male') return 'sir'
        return 'friend'
    }, [detectGender])

    // Generate random greeting (4 variations)
    const getRandomGreeting = useCallback((name: string) => {
        const greetings = [
            // Variation 1: Simple welcome
            `Hello ${name}, welcome to Vignanits!`,

            // Variation 2: Playful
            `Hey ${name}, ready to hunt? Haha, just kidding!`,

            // Variation 3: Time-based with sir/ma'am
            `${getTimeBasedGreeting()}, ${getSalutation(name)}! Welcome to Vignanits!`,

            // Variation 4: Productive day
            `Hi ${name}, ready for a productive day?`
        ]

        // Randomly select one greeting
        const randomIndex = Math.floor(Math.random() * greetings.length)
        return greetings[randomIndex]
    }, [getTimeBasedGreeting, getSalutation])

    // Get user's display name from localStorage or profile
    const getDisplayName = useCallback(() => {
        // First check localStorage (for non-authenticated users)
        const storedData = localStorage.getItem('vignanits_entry')
        if (storedData) {
            try {
                const data = JSON.parse(storedData)
                if (data.nickname) return data.nickname
            } catch (e) {
                console.error('Error parsing stored data:', e)
            }
        }

        // Then check authenticated user profile
        if (nickname) return nickname
        if (profile?.nickname) return profile.nickname
        if (profile?.name) return profile.name
        if (user?.email) return user.email.split('@')[0]
        return 'friend'
    }, [nickname, profile, user])

    // Greet user when they complete the entry gate or on mount
    useEffect(() => {
        const checkForGreeting = () => {
            const storedData = localStorage.getItem('vignanits_entry')
            const shouldGreet = localStorage.getItem('vignanits_should_greet')

            if (shouldGreet === 'true' && storedData && !hasGreeted && isEnabled) {
                try {
                    const data = JSON.parse(storedData)
                    if (data.nickname) {
                        const greeting = getRandomGreeting(data.nickname)
                        setTimeout(() => {
                            speak(greeting)
                            setHasGreeted(true)
                            localStorage.removeItem('vignanits_should_greet')
                        }, 1000)
                    }
                } catch (e) {
                    console.error('Error parsing stored data:', e)
                }
            }
        }

        checkForGreeting()

        // Also check periodically in case the modal just closed
        const interval = setInterval(checkForGreeting, 500)

        return () => clearInterval(interval)
    }, [hasGreeted, isEnabled, speak, getTimeBasedGreeting])

    // Load nickname from localStorage or profile
    useEffect(() => {
        // First check localStorage (for non-authenticated users)
        const storedData = localStorage.getItem('vignanits_entry')
        if (storedData) {
            try {
                const data = JSON.parse(storedData)
                if (data.nickname) {
                    setNickname(data.nickname)
                    return
                }
            } catch (e) {
                console.error('Error parsing stored data:', e)
            }
        }

        // Then check authenticated user profile
        if (profile?.nickname) {
            setNickname(profile.nickname)
        }
    }, [profile])

    // Focus mode timer
    useEffect(() => {
        if (!focusMode.isActive || !focusMode.startTime) {
            setTimeRemaining(null)
            return
        }

        const interval = setInterval(() => {
            const elapsed = Date.now() - focusMode.startTime!
            const remaining = (focusMode.duration * 60 * 1000) - elapsed

            if (remaining <= 0) {
                setTimeRemaining(0)
                endFocusMode()
            } else {
                setTimeRemaining(remaining)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [focusMode, endFocusMode])

    // Save nickname to localStorage and/or database
    const saveNickname = async () => {
        if (!nickname.trim()) return

        try {
            // Save to localStorage for guest users
            const storedData = localStorage.getItem('vignanits_entry')
            if (storedData) {
                const data = JSON.parse(storedData)
                data.nickname = nickname.trim()
                localStorage.setItem('vignanits_entry', JSON.stringify(data))
            } else {
                // Create new entry in localStorage
                localStorage.setItem('vignanits_entry', JSON.stringify({
                    nickname: nickname.trim(),
                    lastCompleted: null,
                    hasAccess: false
                }))
            }

            // Also save to database if user is authenticated
            if (user) {
                const { error } = await supabase
                    .from('users')
                    .update({ nickname: nickname.trim() })
                    .eq('id', user.id)

                if (error) throw error
            }

            toast.success('Nickname saved!')
            setIsEditingNickname(false)
            speak(`Great! I'll call you ${nickname} from now on.`)
        } catch (error) {
            console.error('Error saving nickname:', error)
            toast.error('Failed to save nickname')
        }
    }

    // Motivational messages
    const motivationalMessages = [
        "You're doing amazing! Keep up the great work!",
        "Every minute of study brings you closer to your goals!",
        "Focus is your superpower. You've got this!",
        "Your dedication is inspiring. Stay strong!",
        "Small steps lead to big achievements. Keep going!",
        "You're building your future right now. How exciting!",
        "Your hard work will pay off. Believe in yourself!"
    ]

    const getMotivation = () => {
        const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
        speak(message)
    }

    // Manual greeting function
    const playGreeting = () => {
        const greeting = getRandomGreeting(getDisplayName())
        speak(greeting)
        setHasGreeted(true)
    }


    // Format time remaining
    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return (
        <>
            {/* Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isExpanded ? (
                    <Button
                        onClick={() => setIsExpanded(true)}
                        className="h-16 w-16 rounded-full shadow-2xl btn-glow relative overflow-hidden group"
                        variant="glow"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-75 group-hover:opacity-100 transition-opacity" />
                        {isSpeaking ? (
                            <Volume2 className="w-6 h-6 relative z-10 animate-pulse" />
                        ) : (
                            <Mic className="w-6 h-6 relative z-10" />
                        )}
                        {isSpeaking && (
                            <span className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
                        )}
                    </Button>
                ) : (
                    <Card className="glass-card w-96 shadow-2xl border-primary/30 animate-scale-in">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                Study Assistant
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsExpanded(false)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Nickname Section */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Your Nickname</Label>
                                {isEditingNickname ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            placeholder="Enter your nickname"
                                            className="flex-1"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveNickname()
                                            }}
                                        />
                                        <Button onClick={saveNickname} size="sm">
                                            Save
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                        <span className="text-sm font-medium">{getDisplayName()}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsEditingNickname(true)}
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Focus Mode */}
                            <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Timer className="w-4 h-4" />
                                        Focus Mode
                                    </Label>
                                    {focusMode.isActive && timeRemaining !== null && (
                                        <span className="text-lg font-bold text-primary">
                                            {formatTime(timeRemaining)}
                                        </span>
                                    )}
                                </div>

                                {!focusMode.isActive ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={focusDuration}
                                                onChange={(e) => setFocusDuration(Number(e.target.value))}
                                                min="1"
                                                max="120"
                                                className="w-20"
                                            />
                                            <span className="text-sm text-muted-foreground">minutes</span>
                                        </div>
                                        <Button
                                            onClick={() => startFocusMode(focusDuration)}
                                            className="w-full btn-glow"
                                            variant="glow"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Start Focus Session
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={endFocusMode}
                                        className="w-full"
                                        variant="outline"
                                    >
                                        <Pause className="w-4 h-4 mr-2" />
                                        End Session
                                    </Button>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={playGreeting}
                                    variant="outline"
                                    className="w-full"
                                    disabled={isSpeaking}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Greet Me
                                </Button>
                                <Button
                                    onClick={getMotivation}
                                    variant="outline"
                                    className="w-full"
                                    disabled={isSpeaking}
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Motivate Me
                                </Button>
                                <Button
                                    onClick={() => speak("Remember to take breaks! A 5-minute break every hour keeps your mind fresh.")}
                                    variant="outline"
                                    className="w-full col-span-2"
                                    disabled={isSpeaking}
                                >
                                    <Coffee className="w-4 h-4 mr-2" />
                                    Break Reminder
                                </Button>
                            </div>

                            {/* Voice Controls */}
                            <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-sm text-muted-foreground">Voice Assistant</span>
                                <div className="flex gap-2">
                                    {isSpeaking && (
                                        <Button
                                            onClick={stopSpeaking}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <VolumeX className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={toggleEnabled}
                                        variant="ghost"
                                        size="sm"
                                        className={isEnabled ? 'text-primary' : 'text-muted-foreground'}
                                    >
                                        {isEnabled ? (
                                            <Volume2 className="w-4 h-4" />
                                        ) : (
                                            <VolumeX className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    )
}

export default VoiceAssistant
