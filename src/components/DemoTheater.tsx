import { useState } from 'react';
import { X, Zap, Target, Gamepad2, TrendingUp, Popcorn, Film, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DemoTheaterProps {
    isOpen: boolean;
    onClose: () => void;
    onLaunchQuickTour: () => void;
    onLaunchFeatureShowcase: () => void;
    onLaunchTryItLive: () => void;
}

const DemoTheater = ({ isOpen, onClose, onLaunchQuickTour, onLaunchFeatureShowcase, onLaunchTryItLive }: DemoTheaterProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 500);
    };

    const demoOptions = [
        {
            id: 'quick-tour',
            title: 'Quick Tour',
            description: '2-minute overview of key features',
            icon: Zap,
            color: 'from-yellow-500 to-orange-500',
        },
        {
            id: 'feature-showcase',
            title: 'Feature Showcase',
            description: 'Interactive walkthrough of all features',
            icon: Target,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            id: 'try-live',
            title: 'Try It Live',
            description: 'Hands-on sandbox experience with code compiler',
            icon: Gamepad2,
            color: 'from-purple-500 to-pink-500',
        },
    ];

    const handleDemoClick = (id: string, title: string) => {
        setSelectedDemo(id);

        if (id === 'quick-tour') {
            // Launch Quick Tour via parent callback
            onLaunchQuickTour();
        } else if (id === 'feature-showcase') {
            // Launch Feature Showcase via parent callback
            onLaunchFeatureShowcase();
        } else if (id === 'try-live') {
            // Launch Try It Live via parent callback
            onLaunchTryItLive();
        } else {
            // Other demos - show coming soon
            toast.success(`🎬 Loading ${title}...`, {
                description: 'Get ready for an amazing experience!',
                duration: 2000,
            });

            setTimeout(() => {
                toast.info('🚀 Demo feature coming soon!', {
                    description: 'We\'re working on bringing you the best demo experience.',
                    duration: 3000,
                });
                setSelectedDemo(null);
            }, 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={handleClose}
            />

            {/* Floating decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <Popcorn className="absolute top-20 left-10 w-8 h-8 text-yellow-400/30 animate-bounce" style={{ animationDelay: '0s' }} />
                <Film className="absolute top-40 right-20 w-10 h-10 text-purple-400/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <Sparkles className="absolute bottom-32 left-20 w-6 h-6 text-pink-400/30 animate-bounce" style={{ animationDelay: '1s' }} />
                <Popcorn className="absolute bottom-20 right-32 w-7 h-7 text-orange-400/30 animate-bounce" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Theater Content */}
            <div className={`relative w-full max-w-5xl mx-4 ${isClosing ? 'animate-curtain-close' : 'animate-curtain-open'}`}>
                {/* Curtain effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none rounded-2xl" />

                {/* Main content */}
                <div className="relative glass-card p-8 md:p-12 rounded-2xl border-2 border-primary/20">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group"
                    >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-4">
                            <Film className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-sm text-muted-foreground">Interactive Demo Theater</span>
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                            Choose Your{' '}
                            <span className="gradient-text">Experience</span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Select a demo to explore Nova Study Hub's amazing features
                        </p>
                    </div>

                    {/* Demo options grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {demoOptions.map((option, index) => {
                            const Icon = option.icon;
                            const isSelected = selectedDemo === option.id;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleDemoClick(option.id, option.title)}
                                    disabled={selectedDemo !== null}
                                    className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${option.id === 'try-live' ? 'md:col-span-2' : ''
                                        } ${isSelected
                                            ? 'border-primary bg-primary/10 scale-105'
                                            : 'border-white/10 bg-card/60 hover:border-primary/50 hover:bg-card/80 hover:scale-105'
                                        } ${selectedDemo && !isSelected ? 'opacity-50' : ''}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Gradient background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-xl`} />

                                    {/* Content */}
                                    <div className="relative">
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {option.title}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {option.description}
                                        </p>

                                        {/* Loading indicator */}
                                        {isSelected && (
                                            <div className="mt-4 flex items-center gap-2 text-primary">
                                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm">Loading...</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${option.color} blur-xl opacity-20`} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Press <kbd className="px-2 py-1 rounded bg-white/10 text-xs">ESC</kbd> to close
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoTheater;
