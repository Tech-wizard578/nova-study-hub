import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, CheckCircle2, Sparkles, Zap, Users, BookOpen, Trophy, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuickTourProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuickTour = ({ isOpen, onClose }: QuickTourProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [completedSlides, setCompletedSlides] = useState<number[]>([]);

    const slides = [
        {
            id: 1,
            title: 'Welcome to Vignanits',
            subtitle: 'Your AI-Powered Learning Companion',
            description: 'Transform your study experience with intelligent tools designed to help you learn faster and retain more.',
            icon: Sparkles,
            color: 'from-purple-500 via-pink-500 to-red-500',
            features: ['AI-Powered Summaries', 'Smart Quizzes', 'Progress Tracking'],
            visual: 'gradient-orb'
        },
        {
            id: 2,
            title: 'Intelligent Study Materials',
            subtitle: 'Access Curated Resources',
            description: 'Browse through thousands of verified study materials, organized by subject and difficulty level.',
            icon: BookOpen,
            color: 'from-blue-500 via-cyan-500 to-teal-500',
            features: ['1M+ Materials', 'Expert Verified', 'Easy Search'],
            visual: 'floating-cards'
        },
        {
            id: 3,
            title: 'AI Voice Assistant',
            subtitle: 'Your Personal Study Coach',
            description: 'Get instant help, motivation, and focus mode with binaural beats to enhance your concentration.',
            icon: Brain,
            color: 'from-green-500 via-emerald-500 to-cyan-500',
            features: ['Voice Commands', 'Focus Mode', 'Motivational Support'],
            visual: 'wave-pattern'
        },
        {
            id: 4,
            title: 'Track Your Progress',
            subtitle: 'Level Up Your Learning',
            description: 'Monitor your study streaks, earn achievements, and compete on leaderboards with fellow students.',
            icon: Trophy,
            color: 'from-yellow-500 via-orange-500 to-red-500',
            features: ['Daily Streaks', 'Achievements', 'Leaderboards'],
            visual: 'stats-chart'
        },
        {
            id: 5,
            title: 'Join the Community',
            subtitle: '50K+ Active Learners',
            description: 'Connect with students worldwide, share knowledge, and grow together in your learning journey.',
            icon: Users,
            color: 'from-pink-500 via-purple-500 to-indigo-500',
            features: ['Study Groups', 'Peer Support', 'Knowledge Sharing'],
            visual: 'network-nodes'
        },
    ];

    // Auto-play functionality
    useEffect(() => {
        if (!isPlaying || !isOpen) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => {
                const next = (prev + 1) % slides.length;
                if (next === 0) {
                    setIsPlaying(false);
                    toast.success('🎉 Tour Complete!', {
                        description: 'You\'ve explored all features. Ready to start learning?',
                    });
                }
                return next;
            });
        }, 4000);

        return () => clearInterval(timer);
    }, [isPlaying, isOpen, slides.length]);

    // Mark slide as completed
    useEffect(() => {
        if (!completedSlides.includes(currentSlide)) {
            setCompletedSlides([...completedSlides, currentSlide]);
        }
    }, [currentSlide]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsPlaying(false);
    };

    if (!isOpen) return null;

    const currentSlideData = slides[currentSlide];
    const Icon = currentSlideData.icon;
    const progress = ((currentSlide + 1) / slides.length) * 100;

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                onClick={handleClose}
            />

            {/* Main Content */}
            <div className="relative w-full max-w-6xl mx-4 h-[80vh] flex flex-col">
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="glass-card px-4 py-2">
                            <span className="text-sm font-medium">Quick Tour</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {currentSlide + 1} / {slides.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="glass-card"
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <button
                            onClick={handleClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                    <div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentSlideData.color} transition-all duration-500 rounded-full`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Slide Content */}
                <div className="relative flex-1 glass-card rounded-2xl p-8 md:p-12 overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.color} animate-gradient-shift`} />
                        {currentSlideData.visual === 'gradient-orb' && (
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br ${currentSlideData.color} rounded-full blur-3xl animate-pulse`} />
                        )}
                        {currentSlideData.visual === 'floating-cards' && (
                            <>
                                <div className="absolute top-20 left-20 w-32 h-40 glass-card animate-float" style={{ animationDelay: '0s' }} />
                                <div className="absolute top-40 right-32 w-28 h-36 glass-card animate-float" style={{ animationDelay: '0.5s' }} />
                                <div className="absolute bottom-32 left-40 w-24 h-32 glass-card animate-float" style={{ animationDelay: '1s' }} />
                            </>
                        )}
                        {currentSlideData.visual === 'wave-pattern' && (
                            <div className="absolute inset-0">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`absolute inset-0 border-2 border-white/10 rounded-full animate-ping`}
                                        style={{
                                            animationDelay: `${i * 0.5}s`,
                                            animationDuration: '3s'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 h-full">
                        {/* Left: Icon & Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className={`inline-flex w-24 h-24 rounded-2xl bg-gradient-to-br ${currentSlideData.color} items-center justify-center mb-6 animate-scale-in shadow-2xl`}>
                                <Icon className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 animate-slide-in-right">
                                {currentSlideData.title}
                            </h2>

                            <p className={`text-xl font-semibold bg-gradient-to-r ${currentSlideData.color} bg-clip-text text-transparent mb-4`}>
                                {currentSlideData.subtitle}
                            </p>

                            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                                {currentSlideData.description}
                            </p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-3">
                                {currentSlideData.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="glass-card px-4 py-2 rounded-full text-sm font-medium animate-slide-in-right"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <CheckCircle2 className="w-4 h-4 inline mr-2 text-green-400" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Visual Element */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className={`relative w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br ${currentSlideData.color} p-1 animate-scale-in overflow-hidden`}>
                                <div className="w-full h-full rounded-xl bg-background/90 backdrop-blur-xl flex items-center justify-center relative overflow-hidden">
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute inset-0 bg-grid" />
                                    </div>

                                    {/* Main icon with glow */}
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.color} blur-3xl opacity-50 animate-pulse`} />
                                        <Icon className={`relative w-48 h-48 text-foreground opacity-80`} />
                                    </div>

                                    {/* Floating mini icons */}
                                    <div className="absolute inset-0">
                                        <div className="absolute top-8 left-8 animate-float">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${currentSlideData.color} flex items-center justify-center`}>
                                                <Sparkles className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute top-12 right-12 animate-float" style={{ animationDelay: '0.5s' }}>
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentSlideData.color} flex items-center justify-center`}>
                                                <Zap className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-16 left-16 animate-float" style={{ animationDelay: '1s' }}>
                                            <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${currentSlideData.color} flex items-center justify-center`}>
                                                <CheckCircle2 className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-12 right-8 animate-float" style={{ animationDelay: '1.5s' }}>
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentSlideData.color} flex items-center justify-center`}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative circles */}
                                    <div className={`absolute top-1/4 right-1/4 w-32 h-32 rounded-full border-2 border-gradient-to-br ${currentSlideData.color} opacity-20 animate-spin-slow`} />
                                    <div className={`absolute bottom-1/4 left-1/4 w-24 h-24 rounded-full border-2 border-gradient-to-br ${currentSlideData.color} opacity-20 animate-spin-slow`} style={{ animationDirection: 'reverse' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="relative z-10 flex items-center justify-between mt-6">
                    <Button
                        variant="ghost"
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="glass-card"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Previous
                    </Button>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 rounded-full ${index === currentSlide
                                    ? 'w-8 h-2 bg-gradient-to-r ' + currentSlideData.color
                                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        onClick={currentSlide === slides.length - 1 ? handleClose : nextSlide}
                        className="glass-card"
                    >
                        {currentSlide === slides.length - 1 ? 'Finish' : 'Next'}
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuickTour;
