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
    speak: (text: string) => void
    stopSpeaking: () => void
    startListening: () => void
    stopListening: () => void
    startFocusMode: (duration: number) => void
    endFocusMode: () => void
    toggleEnabled: () => void
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

    // Speech synthesis instance
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

    // Helper function to actually speak with a voice
    const speakWithVoice = useCallback((text: string, voices: SpeechSynthesisVoice[]) => {
        if (!synth) return

        const utterance = new SpeechSynthesisUtterance(text)

        // Configure voice settings
        utterance.rate = 0.9
        utterance.pitch = 1.0
        utterance.volume = 1.0

        // Try to use a pleasant voice
        const preferredVoice = voices.find(voice =>
            voice.name.includes('Google') ||
            voice.name.includes('Female') ||
            voice.name.includes('Samantha') ||
            voice.lang.startsWith('en')
        )

        if (preferredVoice) {
            utterance.voice = preferredVoice
            console.log('Using voice:', preferredVoice.name)
        } else if (voices.length > 0) {
            utterance.voice = voices[0]
            console.log('Using default voice:', voices[0].name)
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

    const startFocusMode = useCallback((duration: number) => {
        setFocusMode({
            isActive: true,
            startTime: Date.now(),
            duration
        })
        speak(`Starting focus mode for ${duration} minutes. Let's concentrate on your studies!`)
    }, [speak])

    const endFocusMode = useCallback(() => {
        const wasActive = focusMode.isActive
        setFocusMode({
            isActive: false,
            startTime: null,
            duration: 25
        })
        if (wasActive) {
            speak("Great job! You've completed your focus session. Time for a well-deserved break!")
        }
    }, [focusMode.isActive, speak])

    const toggleEnabled = useCallback(() => {
        setIsEnabled(prev => !prev)
        if (isEnabled) {
            stopSpeaking()
        }
    }, [isEnabled, stopSpeaking])

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
        speak,
        stopSpeaking,
        startListening,
        stopListening,
        startFocusMode,
        endFocusMode,
        toggleEnabled
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
