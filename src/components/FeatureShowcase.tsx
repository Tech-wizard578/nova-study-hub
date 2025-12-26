import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, Brain, Zap, Users, TrendingUp, BookOpen, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FeatureShowcaseProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeatureShowcase = ({ isOpen, onClose }: FeatureShowcaseProps) => {
    const [currentFeature, setCurrentFeature] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const [flippedCard, setFlippedCard] = useState<number | null>(null);

    const features = [
        {
            id: 1,
            title: 'AI-Powered Summaries',
            icon: Brain,
            color: 'from-purple-500 to-pink-500',
            shortDesc: 'Intelligent document summarization',
            longDesc: 'Our advanced AI analyzes your study materials and creates concise, comprehensive summaries that capture all key points.',
            benefits: ['Save 70% reading time', 'Focus on key concepts', 'Multiple summary lengths'],
            demo: 'Upload any document and get instant AI-generated summaries',
        },
        {
            id: 2,
            title: 'Smart Quizzes',
            icon: Zap,
            color: 'from-yellow-500 to-orange-500',
            shortDesc: 'Adaptive learning assessments',
            longDesc: 'AI-generated quizzes that adapt to your knowledge level, helping you identify and strengthen weak areas.',
            benefits: ['Personalized difficulty', 'Instant feedback', 'Progress tracking'],
            demo: 'Take quizzes that adapt to your performance in real-time',
        },
        {
            id: 3,
            title: 'Voice Assistant',
            icon: Sparkles,
            color: 'from-cyan-500 to-blue-500',
            shortDesc: 'Your personal study coach',
            longDesc: 'Voice-activated assistant that helps you study, provides motivation, and enhances focus with binaural beats.',
            benefits: ['Hands-free control', 'Focus mode music', 'Motivational support'],
            demo: 'Ask questions, get help, and stay motivated with voice commands',
        },
        {
            id: 4,
            title: 'Study Materials Library',
            icon: BookOpen,
            color: 'from-green-500 to-emerald-500',
            shortDesc: 'Curated learning resources',
            longDesc: 'Access 1M+ verified study materials organized by subject, difficulty, and topic.',
            benefits: ['Expert verified', 'Easy search', 'Download offline'],
            demo: 'Browse and download materials from our extensive library',
        },
        {
            id: 5,
            title: 'Progress Tracking',
            icon: TrendingUp,
            color: 'from-orange-500 to-red-500',
            shortDesc: 'Monitor your growth',
            longDesc: 'Track study streaks, earn achievements, and visualize your learning journey with detailed analytics.',
            benefits: ['Daily streaks', 'Achievement badges', 'Performance insights'],
            demo: 'View your stats, streaks, and compete on leaderboards',
        },
        {
            id: 6,
            title: 'Learning Community',
            icon: Users,
            color: 'from-pink-500 to-purple-500',
            shortDesc: 'Connect with 50K+ learners',
            longDesc: 'Join study groups, share knowledge, and collaborate with students worldwide.',
            benefits: ['Study groups', 'Peer support', 'Knowledge sharing'],
            demo: 'Connect with fellow students and grow together',
        },
    ];

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const nextFeature = () => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setFlippedCard(null);
    };

    const prevFeature = () => {
        setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
        setFlippedCard(null);
    };

    const handleCardClick = (index: number) => {
        setFlippedCard(flippedCard === index ? null : index);
    };

    const handleTryFeature = (title: string) => {
        toast.success(`🚀 ${title}`, {
            description: 'This feature is available in the full application!',
            duration: 3000,
        });
    };

    if (!isOpen) return null;

    const currentFeatureData = features[currentFeature];
    const Icon = currentFeatureData.icon;

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                onClick={handleClose}
            />

            {/* Main Content */}
            <div className="relative w-full max-w-7xl mx-4 h-[85vh] flex flex-col">
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="glass-card px-4 py-2">
                            <span className="text-sm font-medium">Feature Showcase</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {currentFeature + 1} / {features.length}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Feature Display */}
                <div className="relative flex-1 glass-card rounded-2xl p-8 md:p-12 overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-10">
                        <div className={`absolute inset-0 bg-gradient-to-br ${currentFeatureData.color} animate-gradient-shift`} />
                    </div>

                    {/* Content Grid */}
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 h-full">
                        {/* Left: Feature Info */}
                        <div className="flex flex-col justify-center">
                            <div className={`inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br ${currentFeatureData.color} items-center justify-center mb-6 animate-scale-in shadow-2xl`}>
                                <Icon className="w-10 h-10 text-white" />
                            </div>

                            <h2 className="font-display text-4xl md:text-5xl font-bold mb-3 animate-slide-in-right">
                                {currentFeatureData.title}
                            </h2>

                            <p className={`text-xl font-semibold bg-gradient-to-r ${currentFeatureData.color} bg-clip-text text-transparent mb-4`}>
                                {currentFeatureData.shortDesc}
                            </p>

                            <p className="text-lg text-muted-foreground mb-8">
                                {currentFeatureData.longDesc}
                            </p>

                            {/* Benefits */}
                            <div className="space-y-3 mb-8">
                                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Key Benefits</h3>
                                {currentFeatureData.benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 animate-slide-in-right"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <CheckCircle2 className={`w-5 h-5 bg-gradient-to-r ${currentFeatureData.color} bg-clip-text text-transparent`} />
                                        <span className="text-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <Button
                                onClick={() => handleTryFeature(currentFeatureData.title)}
                                className={`group bg-gradient-to-r ${currentFeatureData.color} hover:opacity-90 transition-opacity`}
                            >
                                Try This Feature
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>

                        {/* Right: Interactive Feature Cards */}
                        <div className="flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                {features.map((feature, index) => {
                                    const FeatureIcon = feature.icon;
                                    const isFlipped = flippedCard === index;
                                    const isCurrent = index === currentFeature;

                                    return (
                                        <div
                                            key={feature.id}
                                            onClick={() => handleCardClick(index)}
                                            className={`relative h-40 cursor-pointer transition-all duration-500 ${isCurrent ? 'scale-110 z-10' : 'scale-100 opacity-70 hover:opacity-100'
                                                }`}
                                            style={{ perspective: '1000px' }}
                                        >
                                            <div
                                                className={`relative w-full h-full transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''
                                                    }`}
                                                style={{ transformStyle: 'preserve-3d' }}
                                            >
                                                {/* Front */}
                                                <div
                                                    className={`absolute inset-0 glass-card rounded-xl p-4 flex flex-col items-center justify-center border-2 ${isCurrent ? `border-gradient-to-r ${feature.color}` : 'border-white/10'
                                                        }`}
                                                    style={{ backfaceVisibility: 'hidden' }}
                                                >
                                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2`}>
                                                        <FeatureIcon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h4 className="text-sm font-semibold text-center">{feature.title}</h4>
                                                </div>

                                                {/* Back */}
                                                <div
                                                    className={`absolute inset-0 glass-card rounded-xl p-4 flex items-center justify-center bg-gradient-to-br ${feature.color}`}
                                                    style={{
                                                        backfaceVisibility: 'hidden',
                                                        transform: 'rotateY(180deg)'
                                                    }}
                                                >
                                                    <p className="text-xs text-white text-center font-medium">
                                                        {feature.demo}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="relative z-10 flex items-center justify-between mt-6">
                    <Button
                        variant="ghost"
                        onClick={prevFeature}
                        className="glass-card"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Previous
                    </Button>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {features.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentFeature(index);
                                    setFlippedCard(null);
                                }}
                                className={`transition-all duration-300 rounded-full ${index === currentFeature
                                        ? 'w-8 h-2 bg-gradient-to-r ' + currentFeatureData.color
                                        : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        onClick={currentFeature === features.length - 1 ? handleClose : nextFeature}
                        className="glass-card"
                    >
                        {currentFeature === features.length - 1 ? 'Finish' : 'Next'}
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FeatureShowcase;
