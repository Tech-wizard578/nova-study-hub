import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Trophy, Flame, Loader2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { getDailyQuestion, submitAnswer, getUserStats, getTopUsers } from '@/services/questionsService';
import { useAuth } from '@/contexts/AuthContext';
import type { AptitudeQuestion } from '@/services/aiService';
import confetti from 'canvas-confetti';

const DailyQuestionSection = () => {
    const { user } = useAuth();
    const [question, setQuestion] = useState<AptitudeQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [userStats, setUserStats] = useState({ points: 0, streak: 0, rank: null as number | null });
    const [topUsers, setTopUsers] = useState<any[]>([]);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        loadQuestion();
        if (user) {
            loadUserStats();
            loadLeaderboard();
        }
    }, [user]);

    const loadQuestion = async () => {
        try {
            setLoading(true);
            const dailyQuestion = await getDailyQuestion();
            setQuestion(dailyQuestion);
        } catch (error) {
            console.error('Failed to load question:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserStats = async () => {
        if (!user) return;
        const stats = await getUserStats(user.id);
        setUserStats(stats);
    };

    const loadLeaderboard = async () => {
        const leaders = await getTopUsers(5);
        setTopUsers(leaders);
    };

    const handleSubmit = async () => {
        if (!selectedAnswer || !question || submitted) return;

        setSubmitted(true);

        const result = await submitAnswer(
            '', // questionId not needed for now
            selectedAnswer,
            question.correct_answer,
            question.difficulty,
            user?.id
        );

        setIsCorrect(result.isCorrect);
        setPointsEarned(result.pointsEarned);

        if (result.isCorrect) {
            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Reload stats if user is logged in
            if (user) {
                setTimeout(() => loadUserStats(), 500);
            }
        } else {
            // Trigger shake animation
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'text-green-500';
            case 'medium':
                return 'text-yellow-500';
            case 'hard':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getDifficultyBadge = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'hard':
                return 'bg-red-500/20 text-red-500 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <section className="relative py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px]">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading today's challenge...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!question) {
        return (
            <section className="relative py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px]">
                        <Brain className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold mb-2">No question available</h3>
                        <p className="text-muted-foreground text-center">
                            Check back later for today's challenge!
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-16 px-4 bg-gradient-to-b from-background to-background/50">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
                        <Brain className="w-4 h-4 text-accent" />
                        <span className="text-sm text-muted-foreground">Daily Challenge</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                        Test Your{' '}
                        <span className="gradient-text">Aptitude</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Challenge yourself with a new aptitude question every day. Earn points and climb the leaderboard!
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Question Card */}
                    <div className="lg:col-span-2">
                        <div className={`glass-card p-8 card-3d ${shake ? 'animate-shake' : ''}`}>
                            {/* Question Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary">
                                        {question.subject}
                                    </span>
                                    <span className={`text-sm px-3 py-1 rounded-full border ${getDifficultyBadge(question.difficulty)}`}>
                                        {question.difficulty.toUpperCase()}
                                    </span>
                                </div>
                                {!submitted && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Sparkles className="w-4 h-4" />
                                        <span>+{question.difficulty === 'easy' ? 5 : question.difficulty === 'medium' ? 10 : 15} points</span>
                                    </div>
                                )}
                            </div>

                            {/* Question Text */}
                            <h3 className="text-xl font-bold mb-6 leading-relaxed">
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

                            {/* Submit Button */}
                            {!submitted ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!selectedAnswer}
                                    className="w-full btn-glow"
                                    size="lg"
                                >
                                    Submit Answer
                                </Button>
                            ) : (
                                <div className={`p-6 rounded-xl text-center ${isCorrect
                                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30'
                                        : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/30'
                                    }`}>
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        {isCorrect ? (
                                            <>
                                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                                                <h3 className="text-2xl font-bold text-green-500">Correct!</h3>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-8 h-8 text-red-500" />
                                                <h3 className="text-2xl font-bold text-red-500">Incorrect</h3>
                                            </>
                                        )}
                                    </div>
                                    {isCorrect && user && (
                                        <p className="text-sm text-muted-foreground">
                                            You earned <span className="font-bold text-primary">+{pointsEarned} points</span>!
                                        </p>
                                    )}
                                    {!user && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Sign in to earn points and track your progress!
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Stats & Leaderboard */}
                    <div className="space-y-6">
                        {/* User Stats (if logged in) */}
                        {user && (
                            <div className="glass-card p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-primary" />
                                    Your Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-card/30">
                                        <span className="text-sm text-muted-foreground">Points</span>
                                        <span className="font-bold text-primary">{userStats.points}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-card/30">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Flame className="w-4 h-4 text-orange-500" />
                                            Streak
                                        </span>
                                        <span className="font-bold text-orange-500">{userStats.streak} days</span>
                                    </div>
                                    {userStats.rank && (
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-card/30">
                                            <span className="text-sm text-muted-foreground">Rank</span>
                                            <span className="font-bold text-accent">#{userStats.rank}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Leaderboard */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Top Performers
                            </h3>
                            <div className="space-y-2">
                                {topUsers.map((topUser, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-card/30 hover:bg-card/50 transition-colors"
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                                index === 1 ? 'bg-gray-400/20 text-gray-400' :
                                                    index === 2 ? 'bg-orange-500/20 text-orange-500' :
                                                        'bg-primary/20 text-primary'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{topUser.name || 'Anonymous'}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {topUser.points} pts • {topUser.streak_days} day streak
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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
        </section>
    );
};

export default DailyQuestionSection;
