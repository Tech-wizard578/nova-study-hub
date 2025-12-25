import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Sparkles, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { getDailyQuestion, submitAnswer, getRandomQuestion } from '@/services/questionsService';
import type { AptitudeQuestion } from '@/services/aiService';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

type ModalStep = 'nickname' | 'question' | 'success' | 'closed';

const EntryGateModal = () => {
    const [step, setStep] = useState<ModalStep>('nickname');
    const [nickname, setNickname] = useState('');
    const [question, setQuestion] = useState<AptitudeQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        // Allow forcing the entry modal via URL during testing: ?forceEntry=true
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const forceEntry = params?.get('forceEntry') === 'true';

        // Check if user has already completed the challenge today (skip if forced)
        if (!forceEntry) {
            const storedData = localStorage.getItem('vignanits_entry');
            if (storedData) {
                try {
                    const data = JSON.parse(storedData);
                    const today = new Date().toDateString();

                    // If user completed challenge today, skip modal
                    if (data.lastCompleted === today && data.hasAccess) {
                        setStep('closed');
                        return;
                    }
                } catch (error) {
                    console.error('Error parsing stored data:', error);
                }
            }
        }

        // Load the daily question
        loadQuestion();
    }, []);

    const loadQuestion = async () => {
        const randomQuestion = await getRandomQuestion();
        setQuestion(randomQuestion);
    };

    const handleNicknameSubmit = () => {
        if (nickname.trim().length < 2) {
            alert('Please enter a valid nickname (at least 2 characters)');
            return;
        }

        // Save nickname to localStorage immediately
        localStorage.setItem('vignanits_entry', JSON.stringify({
            nickname: nickname.trim(),
            lastCompleted: null,
            hasAccess: false
        }));

        // Set flag to trigger voice greeting after question is answered
        localStorage.setItem('vignanits_should_greet', 'true');

        setStep('question');
    };

    const handleAnswerSubmit = async () => {
        if (!selectedAnswer || !question) return;

        setSubmitted(true);
        const correct = selectedAnswer === question.correct_answer;
        setIsCorrect(correct);

        if (correct) {
            // Calculate points based on difficulty
            const points = question.difficulty === 'easy' ? 5 : question.difficulty === 'medium' ? 10 : 15;

            // Trigger confetti
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#2eaadc', '#6e44ff', '#00d1ff', '#ffd700']
            });

            // Save to database
            try {
                // Check if user already exists
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('id, points, streak_days')
                    .eq('name', nickname)
                    .maybeSingle();

                if (existingUser) {
                    // Update existing user
                    const newPoints = (existingUser.points || 0) + points;
                    const newStreak = (existingUser.streak_days || 0) + 1;

                    await supabase
                        .from('users')
                        .update({
                            points: newPoints,
                            streak_days: newStreak
                        })
                        .eq('id', existingUser.id);
                } else {
                    // Create new user
                    await supabase
                        .from('users')
                        .insert([{
                            name: nickname,
                            email: `${nickname.toLowerCase().replace(/\s+/g, '')}@vignanits.temp`,
                            points: points,
                            streak_days: 1
                        }]);
                }
            } catch (error) {
                console.error('Error saving to database:', error);
            }

            // Save to localStorage
            const data = {
                nickname,
                lastCompleted: new Date().toDateString(),
                hasAccess: true,
                points
            };
            localStorage.setItem('vignanits_entry', JSON.stringify(data));

            // Show success screen
            setTimeout(() => setStep('success'), 1500);
        } else {
            // Trigger shake animation
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const handleEnterWebsite = () => {
        setStep('closed');
    };

    const handleRetry = () => {
        setSelectedAnswer(null);
        setSubmitted(false);
        setIsCorrect(null);
    };

    if (step === 'closed') {
        return null; // Modal is hidden
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className={`relative max-w-2xl w-full mx-4 ${shake ? 'animate-shake' : ''}`}>
                {/* Nickname Input Step */}
                {step === 'nickname' && (
                    <div className="glass-card p-8 md:p-12 text-center">
                        <div className="mb-8">
                            <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
                            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                                Welcome to <span className="gradient-text">Vignanits</span>!
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Before you enter, tell us your nickname
                            </p>
                        </div>

                        <div className="max-w-md mx-auto space-y-6">
                            <Input
                                type="text"
                                placeholder="Enter your nickname..."
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleNicknameSubmit()}
                                className="text-center text-lg py-6"
                                autoFocus
                            />
                            <Button
                                onClick={handleNicknameSubmit}
                                className="w-full btn-glow"
                                size="lg"
                            >
                                Continue →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Question Step */}
                {step === 'question' && question && (
                    <div className="glass-card p-8 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
                                <Trophy className="w-4 h-4 text-accent" />
                                <span className="text-sm text-muted-foreground">Daily Challenge for {nickname}</span>
                            </div>
                            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                                Answer to <span className="gradient-text">Enter</span>
                            </h2>
                            <p className="text-muted-foreground">
                                Get it right to access Vignanits!
                            </p>
                        </div>

                        {/* Question Details */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary">
                                {question.subject}
                            </span>
                            <span className={`text-sm px-3 py-1 rounded-full border ${question.difficulty === 'easy' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                                question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                                    'bg-red-500/20 text-red-500 border-red-500/30'
                                }`}>
                                {question.difficulty.toUpperCase()}
                            </span>
                        </div>

                        {/* Question Text */}
                        <h3 className="text-xl font-bold mb-6 leading-relaxed text-center">
                            {question.question}
                        </h3>

                        {/* Options */}
                        <div className="space-y-3 mb-6">
                            {question.options.map((option, index) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrectOption = submitted && option === question.correct_answer;
                                const isWrongSelection = submitted && isSelected && !isCorrect;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => !submitted && setSelectedAnswer(option)}
                                        disabled={submitted}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${submitted
                                            ? isCorrectOption
                                                ? 'border-green-500 bg-green-500/10 text-green-500'
                                                : isWrongSelection
                                                    ? 'border-red-500 bg-red-500/10 text-red-500'
                                                    : 'border-white/10 bg-card/30 opacity-50'
                                            : isSelected
                                                ? 'border-primary bg-primary/10 scale-[1.02]'
                                                : 'border-white/10 bg-card/30 hover:border-primary/50 hover:bg-card/50'
                                            } ${!submitted ? 'cursor-pointer' : 'cursor-default'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{option}</span>
                                            {submitted && isCorrectOption && (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            )}
                                            {submitted && isWrongSelection && (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation (shown after submission) */}
                        {submitted && question.explanation && (
                            <div className={`p-4 rounded-xl border-2 mb-6 ${isCorrect
                                ? 'border-green-500/30 bg-green-500/5'
                                : 'border-blue-500/30 bg-blue-500/5'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <Brain className={`w-5 h-5 mt-0.5 ${isCorrect ? 'text-green-500' : 'text-blue-500'}`} />
                                    <div>
                                        <h4 className="font-semibold mb-1">Explanation</h4>
                                        <p className="text-sm text-muted-foreground">{question.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit/Retry Button */}
                        {!submitted ? (
                            <Button
                                onClick={handleAnswerSubmit}
                                disabled={!selectedAnswer}
                                className="w-full btn-glow"
                                size="lg"
                            >
                                Submit Answer
                            </Button>
                        ) : isCorrect ? (
                            <div className="text-center">
                                <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30">
                                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                    <h3 className="text-2xl font-bold text-green-500 mb-2">Correct!</h3>
                                    <p className="text-muted-foreground">Preparing your entry...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="p-6 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/30 text-center">
                                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                    <h3 className="text-2xl font-bold text-red-500 mb-2">Incorrect</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Don't worry! Try again or come back tomorrow for a new question.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleRetry}
                                    variant="outline"
                                    className="w-full"
                                    size="lg"
                                >
                                    Try Again
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Success Step */}
                {step === 'success' && (
                    <div className="glass-card p-8 md:p-12 text-center">
                        <div className="mb-8">
                            <div className="relative inline-block mb-6">
                                <Trophy className="w-24 h-24 text-yellow-500 animate-bounce" />
                                <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
                            </div>
                            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                                🎉 Congratulations, <span className="gradient-text">{nickname}</span>! 🎉
                            </h1>
                            <p className="text-xl text-muted-foreground mb-2">
                                You answered correctly!
                            </p>
                            <p className="text-lg text-muted-foreground">
                                Welcome to Vignanits - Your AI-Powered Study Universe
                            </p>
                        </div>

                        <Button
                            onClick={handleEnterWebsite}
                            className="btn-glow px-8"
                            size="lg"
                        >
                            Enter Website →
                        </Button>
                    </div>
                )}
            </div>

            {/* Custom CSS for shake animation */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default EntryGateModal;
