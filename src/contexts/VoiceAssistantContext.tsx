import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface VoiceAssistantContextType {
    isEnabled: boolean
    isSpeaking: boolean
    isListening: boolean
    focusMode: {
        isActive: boolean
        startTime: number | null
        duration: number // in minutes
    }
    musicType: 'intense' | 'adhd' | null
    isPlayingMusic: boolean
    musicVolume: number
    speak: (text: string) => void
    stopSpeaking: () => void
    startListening: () => void
    stopListening: () => void
    startFocusMode: (duration: number, withMusic?: boolean) => void
    endFocusMode: () => void
    toggleEnabled: () => void
    setMusicType: (type: 'intense' | 'adhd' | null) => void
    setMusicVolume: (volume: number) => void
    playBinauralBeats: () => void
    stopBinauralBeats: () => void
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined)

export const VoiceAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(true)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [focusMode, setFocusMode] = useState({
        isActive: false,
        startTime: null as number | null,
        duration: 25 // default 25 minutes (Pomodoro)
    })
    const [voicesLoaded, setVoicesLoaded] = useState(false)

    // Music state
    const [musicType, setMusicTypeState] = useState<'intense' | 'adhd' | null>(null)
    const [isPlayingMusic, setIsPlayingMusic] = useState(false)
    const [musicVolume, setMusicVolumeState] = useState(0.7)
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

    // Speech synthesis instance
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

    // Helper function to actually speak with a voice
    const speakWithVoice = useCallback((text: string, voices: SpeechSynthesisVoice[]) => {
        if (!synth) return

        const utterance = new SpeechSynthesisUtterance(text)

        // Configure voice settings
        utterance.rate = 0.85  // Slightly slower for better clarity
        utterance.pitch = 1.0
        utterance.volume = 1.0

        // Prioritize Indian English voices
        const preferredVoice =
            // First priority: Indian English voices
            voices.find(voice => voice.lang === 'en-IN') ||
            voices.find(voice => voice.name.includes('India')) ||
            voices.find(voice => voice.name.includes('Rishi')) ||
            voices.find(voice => voice.name.includes('Neel')) ||

            // Second priority: British English (closer to Indian pronunciation)
            voices.find(voice => voice.lang === 'en-GB') ||
            voices.find(voice => voice.name.includes('British')) ||
            voices.find(voice => voice.name.includes('UK')) ||

            // Third priority: Google voices (generally good quality)
            voices.find(voice => voice.name.includes('Google')) ||

            // Fourth priority: Any English voice
            voices.find(voice => voice.lang.startsWith('en')) ||

            // Fallback: First available voice
            voices[0]

        if (preferredVoice) {
            utterance.voice = preferredVoice
            utterance.lang = preferredVoice.lang
            console.log('🎤 Using voice:', preferredVoice.name, '(', preferredVoice.lang, ')')
        } else if (voices.length > 0) {
            utterance.voice = voices[0]
            utterance.lang = 'en-IN'  // Force Indian English even if voice doesn't support it
            console.log('🎤 Using default voice:', voices[0].name, 'with en-IN lang')
        }

        utterance.onstart = () => {
            console.log('🔊 Speech started:', text.substring(0, 50) + '...')
            setIsSpeaking(true)
        }
        utterance.onend = () => {
            console.log('✅ Speech ended')
            setIsSpeaking(false)
        }
        utterance.onerror = (event) => {
            console.error('❌ Speech error:', event.error)
            setIsSpeaking(false)
        }

        console.log('🎤 Speaking:', text)
        synth.speak(utterance)
    }, [synth])

    // Speak text using Web Speech API
    const speak = useCallback((text: string) => {
        if (!synth || !isEnabled) {
            console.log('Speech not available:', { synth: !!synth, isEnabled })
            return
        }

        // Cancel any ongoing speech
        synth.cancel()

        // Get voices
        let voices = synth.getVoices()

        // If no voices yet, wait for them to load
        if (voices.length === 0) {
            console.log('⏳ Waiting for voices to load...')

            // Try again after a short delay
            setTimeout(() => {
                voices = synth.getVoices()
                if (voices.length > 0) {
                    console.log(`✅ Loaded ${voices.length} voices`)
                    speakWithVoice(text, voices)
                } else {
                    console.error('❌ No voices available after waiting')
                }
            }, 100)
        } else {
            speakWithVoice(text, voices)
        }
    }, [synth, isEnabled, speakWithVoice])

    const stopSpeaking = useCallback(() => {
        if (synth) {
            synth.cancel()
            setIsSpeaking(false)
        }
    }, [synth])

    // Voice recognition (placeholder - will be enhanced with actual commands)
    const startListening = useCallback(() => {
        setIsListening(true)
        // Web Speech Recognition API would go here
        // For now, just toggle the state
        setTimeout(() => setIsListening(false), 3000)
    }, [])

    const stopListening = useCallback(() => {
        setIsListening(false)
    }, [])

    const startFocusMode = useCallback((duration: number, withMusic: boolean = false) => {
        setFocusMode({
            isActive: true,
            startTime: Date.now(),
            duration
        })

        // Simple announcement
        speak(`Starting focus mode for ${duration} minutes.`)

        // Start music if selected
        if (withMusic && musicType) {
            setTimeout(() => {
                playBinauralBeats()
            }, 2000)
        }
    }, [speak, musicType])

    const endFocusMode = useCallback(() => {
        const wasActive = focusMode.isActive
        setFocusMode({
            isActive: false,
            startTime: null,
            duration: 25
        })

        // Stop music if playing
        if (isPlayingMusic) {
            stopBinauralBeats()
        }

        // Simple announcement only if manually ended
        if (wasActive) {
            speak("Great job!")
        }
    }, [focusMode.isActive, isPlayingMusic, speak])

    const toggleEnabled = useCallback(() => {
        setIsEnabled(prev => !prev)
        if (isEnabled) {
            stopSpeaking()
        }
    }, [isEnabled, stopSpeaking])

    // Music functions
    const setMusicType = useCallback((type: 'intense' | 'adhd' | null) => {
        setMusicTypeState(type)
    }, [])

    const setMusicVolume = useCallback((volume: number) => {
        setMusicVolumeState(volume)
        if (audioElement) {
            audioElement.volume = volume
        }
    }, [audioElement])

    const playBinauralBeats = useCallback(() => {
        if (!musicType) {
            console.warn('No music type selected')
            return
        }

        // Stop any existing audio
        if (audioElement) {
            audioElement.pause()
            audioElement.currentTime = 0
        }

        // Create new audio element
        const musicFile = musicType === 'intense' ? '/audio/intense-study.mp3' : '/audio/adhd-relief.mp3'
        const audio = new Audio(musicFile)
        audio.loop = true
        audio.volume = musicVolume

        audio.onplay = () => {
            console.log('🎵 Music started:', musicType)
            setIsPlayingMusic(true)
        }

        audio.onerror = (e) => {
            console.error('❌ Music error:', e)
            console.error('Make sure the music file exists at:', musicFile)
            setIsPlayingMusic(false)
        }

        audio.onended = () => {
            console.log('🎵 Music ended')
            setIsPlayingMusic(false)
        }

        setAudioElement(audio)
        audio.play().catch(err => {
            console.error('Failed to play audio:', err)
        })
    }, [musicType, musicVolume, audioElement])

    const stopBinauralBeats = useCallback(() => {
        if (!audioElement) return

        // Fade out effect
        const fadeOut = setInterval(() => {
            if (audioElement.volume > 0.1) {
                audioElement.volume = Math.max(0, audioElement.volume - 0.1)
            } else {
                audioElement.pause()
                audioElement.currentTime = 0
                setIsPlayingMusic(false)
                setAudioElement(null)
                clearInterval(fadeOut)
            }
        }, 100)
    }, [audioElement])

    // Load voices when they become available
    useEffect(() => {
        if (synth) {
            // Load voices immediately
            const voices = synth.getVoices()
            if (voices.length > 0) {
                console.log(`✅ Voices loaded: ${voices.length} available`)
                setVoicesLoaded(true)
            }

            // Chrome loads voices asynchronously
            if (synth.onvoiceschanged !== undefined) {
                synth.onvoiceschanged = () => {
                    const newVoices = synth.getVoices()
                    console.log(`✅ Voices changed: ${newVoices.length} available`)
                    setVoicesLoaded(true)
                }
            }
        }
    }, [synth])

    const value = {
        isEnabled,
        isSpeaking,
        isListening,
        focusMode,
        musicType,
        isPlayingMusic,
        musicVolume,
        speak,
        stopSpeaking,
        startListening,
        stopListening,
        startFocusMode,
        endFocusMode,
        toggleEnabled,
        setMusicType,
        setMusicVolume,
        playBinauralBeats,
        stopBinauralBeats
    }

    return (
        <VoiceAssistantContext.Provider value={value}>
            {children}
        </VoiceAssistantContext.Provider>
    )
}

export const useVoiceAssistant = () => {
    const context = useContext(VoiceAssistantContext)
    if (context === undefined) {
        throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider')
    }
    return context
}
