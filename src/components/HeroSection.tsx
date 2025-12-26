import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Brain, GraduationCap, Zap, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import DemoTheater from './DemoTheater';
import QuickTour from './QuickTour';
import FeatureShowcase from './FeatureShowcase';
import TryItLive from './TryItLive';
import GuidedTour from './GuidedTour';

const HeroSection = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [showDemoTheater, setShowDemoTheater] = useState(false);
  const [showQuickTour, setShowQuickTour] = useState(false);
  const [showFeatureShowcase, setShowFeatureShowcase] = useState(false);
  const [showTryItLive, setShowTryItLive] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);

  const handleStartLearning = () => {
    // Add click animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

    // Smooth scroll to study materials section
    const materialsSection = document.getElementById('materials');
    if (materialsSection) {
      materialsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Show motivational toast with emoji
    toast.success('🚀 Let\'s begin your learning journey!', {
      description: 'Explore our curated study materials below',
      duration: 3000,
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Floating 3D Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Book */}
        <div className="absolute top-1/4 left-[10%] floating">
          <div className="glass-card p-4 transform rotate-12">
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Brain */}
        <div className="absolute top-1/3 right-[15%] floating-delayed">
          <div className="glass-card p-4 transform -rotate-6">
            <Brain className="w-14 h-14 text-secondary" />
          </div>
        </div>

        {/* Graduation Cap */}
        <div className="absolute bottom-1/3 left-[20%] floating-slow">
          <div className="glass-card p-4 transform rotate-3">
            <GraduationCap className="w-10 h-10 text-accent" />
          </div>
        </div>

        {/* Lightning */}
        <div className="absolute top-1/2 right-[10%] floating">
          <div className="glass-card p-3 transform -rotate-12">
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-primary/20 rounded-full animate-spin-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-secondary/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 animate-slide-up">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm text-muted-foreground">Powered by Advanced AI</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Your{' '}
          <span className="gradient-text text-glow">AI-Powered</span>
          <br />
          Vignan Universe
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Transform the way you learn with intelligent summaries, personalized quizzes,
          and a vibrant community of learners. Level up your knowledge today.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button
            variant="hero"
            size="xl"
            className={`group relative overflow-hidden ${isClicked ? 'scale-95' : ''} transition-transform duration-200`}
            onClick={handleStartLearning}
          >
            {/* Ripple effect on click */}
            {isClicked && (
              <span className="absolute inset-0 animate-ping bg-primary/30 rounded-lg" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              Start Learning
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
          <Button
            variant="glass"
            size="xl"
            onClick={() => setShowDemoTheater(true)}
            className="group"
          >
            <Play className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {[
            { value: '50K+', label: 'Active Students' },
            { value: '1M+', label: 'Study Materials' },
            { value: '99%', label: 'Success Rate' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Demo Theater Modal */}
      {showDemoTheater && (
        <DemoTheater
          isOpen={showDemoTheater}
          onClose={() => setShowDemoTheater(false)}
          onLaunchQuickTour={() => {
            setShowDemoTheater(false);
            setTimeout(() => setShowGuidedTour(true), 600);
          }}
          onLaunchFeatureShowcase={() => {
            setShowDemoTheater(false);
            setTimeout(() => setShowFeatureShowcase(true), 600);
          }}
          onLaunchTryItLive={() => {
            setShowDemoTheater(false);
            setTimeout(() => setShowTryItLive(true), 600);
          }}
        />
      )}

      {/* Quick Tour Modal */}
      {showQuickTour && (
        <QuickTour
          isOpen={showQuickTour}
          onClose={() => setShowQuickTour(false)}
        />
      )}

      {/* Feature Showcase Modal */}
      {showFeatureShowcase && (
        <FeatureShowcase
          isOpen={showFeatureShowcase}
          onClose={() => setShowFeatureShowcase(false)}
        />
      )}

      {/* Try It Live Modal */}
      {showTryItLive && (
        <TryItLive
          isOpen={showTryItLive}
          onClose={() => setShowTryItLive(false)}
        />
      )}

      {/* Guided Tour */}
      {showGuidedTour && (
        <GuidedTour
          isOpen={showGuidedTour}
          onClose={() => setShowGuidedTour(false)}
        />
      )}
    </section>
  );
};

export default HeroSection;
