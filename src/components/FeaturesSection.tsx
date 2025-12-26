import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  FileText,
  HelpCircle,
  Puzzle,
  MessageSquare,
  Code,
  ArrowRight
} from 'lucide-react';
import TryItLive from './TryItLive';

const features = [
  {
    icon: Sparkles,
    title: 'AI Summarizer',
    description: 'Transform lengthy documents into concise, actionable summaries in seconds with our advanced AI.',
    color: 'from-primary to-primary/50',
    bgGlow: 'bg-primary/20',
  },
  {
    icon: FileText,
    title: 'Study Materials',
    description: 'Access thousands of curated PDFs, notes, and resources shared by top-performing students.',
    color: 'from-secondary to-secondary/50',
    bgGlow: 'bg-secondary/20',
  },
  {
    icon: HelpCircle,
    title: 'Question Banks',
    description: 'Practice with AI-generated questions tailored to your curriculum and learning pace.',
    color: 'from-accent to-accent/50',
    bgGlow: 'bg-accent/20',
  },
  {
    icon: Puzzle,
    title: 'Aptitude Quiz',
    description: 'Challenge yourself with our extensive question bank covering various aptitude topics.',
    color: 'from-primary via-accent to-secondary',
    bgGlow: 'bg-primary/20',
  },
  {
    icon: MessageSquare,
    title: 'Discussion Forum',
    description: 'Connect with peers, ask questions, and share knowledge in our vibrant community.',
    color: 'from-secondary to-primary',
    bgGlow: 'bg-secondary/20',
  },
  {
    icon: Code,
    title: 'Code Compiler',
    description: 'Write, compile, and run code in multiple languages with our interactive sandbox environment.',
    color: 'from-accent to-primary',
    bgGlow: 'bg-accent/20',
  },
];

const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  return (
    <section id="features" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Powerful Features</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Excel</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with proven study techniques to
            supercharge your learning experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card */}
              <div
                className={`glass-card p-8 h-full transition-all duration-500 card-3d ${hoveredIndex === index ? 'border-primary/50' : ''
                  }`}
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl ${feature.bgGlow} blur-xl opacity-0 transition-opacity duration-500 ${hoveredIndex === index ? 'opacity-50' : ''
                    }`}
                />

                {/* Icon */}
                <div
                  className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 transition-transform duration-300 ${hoveredIndex === index ? 'scale-110 rotate-3' : ''
                    }`}
                >
                  <feature.icon className="w-full h-full text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold mb-3 relative">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6 relative">
                  {feature.description}
                </p>

                {/* CTA */}
                <Button
                  variant="ghost"
                  className={`group/btn p-0 h-auto font-semibold transition-all duration-300 ${hoveredIndex === index ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  onClick={() => {
                    if (feature.title === 'Code Compiler' || feature.title === 'Aptitude Quiz' || feature.title === 'AI Summarizer') {
                      setActiveFeature(feature.title);
                    }
                  }}
                >
                  Explore
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Try It Live Modal */}
      {activeFeature && (
        <TryItLive
          isOpen={!!activeFeature}
          onClose={() => setActiveFeature(null)}
          defaultTab={
            activeFeature === 'Aptitude Quiz' ? 'quiz' :
              activeFeature === 'AI Summarizer' ? 'summarize' :
                'code'
          }
        />
      )}
    </section>
  );
};

export default FeaturesSection;
