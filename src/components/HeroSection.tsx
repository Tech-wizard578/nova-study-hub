import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Brain, GraduationCap, Zap } from 'lucide-react';

const HeroSection = () => {
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
          <Button variant="hero" size="xl" className="group">
            Start Learning Free
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="glass" size="xl">
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
    </section>
  );
};

export default HeroSection;
