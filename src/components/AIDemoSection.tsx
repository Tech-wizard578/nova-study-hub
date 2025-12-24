import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';

const AIDemoSection = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);

  const sampleText = `Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's activities. Some of this chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water. In most cases, oxygen is also released as a waste product that stores three times more chemical energy than the carbohydrates. Most plants, algae, and cyanobacteria perform photosynthesis; such organisms are called photoautotrophs.`;

  const handleSummarize = () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setSummary('');

    // Simulate AI processing with streaming effect
    setTimeout(() => {
      const summaryText = "🌱 Photosynthesis converts light energy to chemical energy in plants. This energy is stored as sugars from CO₂ and water, with oxygen released as a byproduct. Organisms that perform this process are called photoautotrophs.";
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < summaryText.length) {
          setSummary(prev => prev + summaryText[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsProcessing(false);
        }
      }, 20);
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ai-demo" className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Try It Now</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Experience the{' '}
            <span className="gradient-text">AI Magic</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See our AI summarizer in action. Paste any text and watch it transform 
            into a concise, easy-to-understand summary.
          </p>
        </div>

        {/* Demo Interface */}
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-[80px]" />

          <div className="relative grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  Input Text
                </label>
                <button
                  onClick={() => setInputText(sampleText)}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Use sample text
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your study material here..."
                  className="w-full h-64 bg-background/50 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                />
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                  {inputText.length} characters
                </div>
              </div>
              <Button
                onClick={handleSummarize}
                disabled={!inputText.trim() || isProcessing}
                variant="glow"
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Summarize with AI
                  </>
                )}
              </Button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">
                  AI Summary
                </label>
                {summary && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="relative h-64 bg-background/50 border border-border rounded-xl p-4 overflow-auto">
                {summary ? (
                  <p className="text-foreground leading-relaxed">{summary}</p>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-center">
                      Your AI-generated summary will appear here...
                    </p>
                  </div>
                )}
                
                {/* Processing indicator */}
                {isProcessing && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">AI is thinking...</span>
                  </div>
                )}
              </div>
              
              {summary && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>Reduced by ~75% • Easy to understand</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemoSection;
