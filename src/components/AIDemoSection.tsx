import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Copy, Check, Upload, X, FileText, Music } from 'lucide-react';
import { summarizeText, summarizeFile } from '@/services/aiService';
import { toast } from 'sonner';

const AIDemoSection = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const sampleText = `Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's activities. Some of this chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water. In most cases, oxygen is also released as a waste product that stores three times more chemical energy than the carbohydrates. Most plants, algae, and cyanobacteria perform photosynthesis; such organisms are called photoautotrophs.`;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'audio/mpeg',
      'audio/wav',
      'audio/mp4',
      'audio/x-m4a',
      'audio/flac'
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Unsupported file type. Please upload PDF, DOCX, or audio files.');
      return;
    }

    // Validate file size (30MB for documents, ~10 minutes for audio)
    const maxSize = 30 * 1024 * 1024; // 30MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 30MB.');
      return;
    }

    setUploadedFile(file);
    setInputText(''); // Clear text input when file is uploaded
    toast.success(`File "${file.name}" uploaded successfully!`);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSummarize = async () => {
    if (!inputText.trim() && !uploadedFile) return;

    setIsProcessing(true);
    setSummary('');

    try {
      let summaryText: string;

      if (uploadedFile) {
        // Summarize file
        summaryText = await summarizeFile(uploadedFile);
      } else {
        // Summarize text
        summaryText = await summarizeText(inputText);
      }

      // Animate the streaming effect
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
    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Failed to generate summary. Please try again.');
      setIsProcessing(false);
    }
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
                  {uploadedFile ? 'Uploaded File' : 'Input Text'}
                </label>
                {!uploadedFile && (
                  <button
                    onClick={() => setInputText(sampleText)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Use sample text
                  </button>
                )}
              </div>

              {/* File Preview (shown when file is uploaded) */}
              {uploadedFile && (
                <div className="flex items-center gap-3 p-4 bg-background/50 border border-border rounded-xl">
                  {uploadedFile.type.startsWith('audio/') ? (
                    <Music className="w-8 h-8 text-primary flex-shrink-0" />
                  ) : (
                    <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="flex-shrink-0 p-1 hover:bg-destructive/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              )}

              {/* Text Input with Upload Icon */}
              {!uploadedFile && (
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your study material here..."
                    className="w-full h-96 bg-background/50 border border-border rounded-xl p-4 pb-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <label
                      htmlFor="file-upload"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/80 border border-border hover:border-primary/50 cursor-pointer transition-colors group"
                      title="Upload PDF, DOCX, or Audio file (max 30MB)"
                    >
                      <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        Upload File
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.docx,.doc,.mp3,.wav,.m4a,.flac"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="text-xs text-muted-foreground">
                      {inputText.length} characters
                    </div>
                  </div>
                </div>
              )}
              <Button
                onClick={handleSummarize}
                disabled={(!inputText.trim() && !uploadedFile) || isProcessing}
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
              <div className="relative h-96 bg-background/50 border border-border rounded-xl p-4 overflow-auto">
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
