import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GuidedTourProps {
    isOpen: boolean;
    onClose: () => void;
}

interface TourStep {
    id: string;
    title: string;
    description: string;
    targetSelector: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

const GuidedTour = ({ isOpen, onClose }: GuidedTourProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
    const [spotlightStyle, setSpotlightStyle] = useState<any>({});
    const [isAnimating, setIsAnimating] = useState(false);

    const tourSteps: TourStep[] = [
        {
            id: 'voice-assistant',
            title: '🎤 AI Voice Assistant',
            description: 'Your personal study companion! Click the mic button to get instant help, motivation, and focus music. Ask questions, get summaries, or start a quiz - all hands-free with voice commands!',
            targetSelector: '[data-tour="voice-assistant"]',
            position: 'top',
        },
        {
            id: 'study-materials',
            title: '📚 Study Materials Library',
            description: 'Access 1M+ verified study materials! Browse by subject, download PDFs, and get AI-generated summaries. Everything you need to excel in your studies is right here.',
            targetSelector: '[data-tour="study-materials"]',
            position: 'top',
        },
    ];

    const updateSpotlight = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const padding = 20;

        setSpotlightStyle({
            top: rect.top - padding + window.scrollY,
            left: rect.left - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
        });
    };

    useEffect(() => {
        if (!isOpen) return;

        const step = tourSteps[currentStep];
        console.log('Looking for element:', step.targetSelector, 'Step:', currentStep + 1, 'of', tourSteps.length);

        // Try to find element with retries
        let attempts = 0;
        const maxAttempts = 5;

        const findElement = () => {
            attempts++;
            const element = document.querySelector(step.targetSelector) as HTMLElement;
            console.log(`Attempt ${attempts}: Element found:`, !!element, element);

            if (element) {
                setIsAnimating(true);

                // Smooth scroll to element
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });

                // Wait for scroll to complete
                setTimeout(() => {
                    setTargetElement(element);
                    updateSpotlight(element);
                    setIsAnimating(false);
                    console.log('Element highlighted successfully');
                }, 800);
            } else if (attempts < maxAttempts) {
                // Retry after a delay
                console.log(`Element not found, retrying in 300ms... (attempt ${attempts}/${maxAttempts})`);
                setTimeout(findElement, 300);
            } else {
                // Element not found after all retries - close tour
                console.error(`Tour element not found after ${maxAttempts} attempts: ${step.targetSelector} - Closing tour`);
                toast.error(`Cannot find feature on this page`, {
                    description: 'Closing tour...',
                    duration: 2000,
                });

                // Close tour
                setTimeout(() => {
                    onClose();
                }, 500);
            }
        };

        // Start finding element after initial delay
        setTimeout(findElement, 300);
    }, [currentStep, isOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (targetElement) {
                updateSpotlight(targetElement);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [targetElement]);

    const handleNext = () => {
        console.log('handleNext called, currentStep:', currentStep, 'total steps:', tourSteps.length);
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log('Last step reached, calling handleComplete');
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        toast.success('🎉 Tour Complete!', {
            description: 'You\'re all set! Start exploring Vignanits now.',
            duration: 4000,
        });
        onClose();
    };

    const handleSkip = () => {
        onClose();
    };

    if (!isOpen) return null;

    const step = tourSteps[currentStep];
    const progress = ((currentStep + 1) / tourSteps.length) * 100;

    return (
        <div className="fixed inset-0 z-[70]">
            {/* Dark overlay - reduced opacity for better visibility */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500" />

            {/* Spotlight */}
            {targetElement && (
                <div
                    className="absolute transition-all duration-700 ease-out pointer-events-none"
                    style={{
                        top: `${spotlightStyle.top}px`,
                        left: `${spotlightStyle.left}px`,
                        width: `${spotlightStyle.width}px`,
                        height: `${spotlightStyle.height}px`,
                    }}
                >
                    {/* Spotlight glow */}
                    <div className="absolute inset-0 rounded-2xl bg-white/5 animate-pulse" />
                    <div className="absolute inset-0 rounded-2xl border-4 border-primary shadow-[0_0_30px_rgba(139,92,246,0.5)] animate-pulse" />

                    {/* Corner decorations */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
                </div>
            )}

            {/* Explanation Card */}
            {targetElement && (
                <div
                    className="absolute z-10 animate-slide-in-right"
                    style={{
                        top: step.position === 'bottom'
                            ? `${spotlightStyle.top + spotlightStyle.height + 20}px`
                            : `${spotlightStyle.top - 200}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        maxWidth: '500px',
                        width: '90%',
                    }}
                >
                    <div className="glass-card p-6 rounded-2xl border-2 border-primary/30 shadow-2xl">
                        {/* Progress bar */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">
                                    Step {currentStep + 1} of {tourSteps.length}
                                </span>
                                <button
                                    onClick={handleSkip}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Skip Tour
                                </button>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                                {step.title}
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between gap-4">
                            <Button
                                variant="ghost"
                                onClick={handlePrevious}
                                disabled={currentStep === 0 || isAnimating}
                                className="flex-1"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            <div className="flex gap-1">
                                {tourSteps.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                            ? 'bg-primary w-6'
                                            : index < currentStep
                                                ? 'bg-primary/50'
                                                : 'bg-white/20'
                                            }`}
                                    />
                                ))}
                            </div>

                            <Button
                                onClick={handleNext}
                                disabled={isAnimating}
                                className="flex-1 bg-gradient-to-r from-primary to-secondary"
                            >
                                {currentStep === tourSteps.length - 1 ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Finish
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Close button */}
            <button
                onClick={handleSkip}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/20 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default GuidedTour;
