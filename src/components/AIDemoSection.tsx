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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const MAX_FILES = 3;

  const sampleText = `Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organism's activities. Some of this chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water. In most cases, oxygen is also released as a waste product that stores three times more chemical energy than the carbohydrates. Most plants, algae, and cyanobacteria perform photosynthesis; such organisms are called photoautotrophs.`;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (uploadedFiles.length + files.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files at a time.`);
      return;
    }

    // Validate each file
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

    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error('Some files have unsupported types. Please upload PDF, DOCX, or audio files.');
      return;
    }

    // Validate file sizes (30MB for documents)
    const maxSize = 30 * 1024 * 1024; // 30MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error('Some files are too large. Maximum size is 30MB per file.');
      return;
    }

    setUploadedFiles(prev => [...prev, ...files]);
    setInputText(''); // Clear text input when files are uploaded

    if (files.length === 1) {
      toast.success(`File "${files[0].name}" uploaded successfully!`);
    } else {
      toast.success(`${files.length} files uploaded successfully!`);
    }

    // Reset the input so the same file can be uploaded again if removed
    event.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSummarize = async () => {
    if (!inputText.trim() && uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setSummary('');

    try {
      let summaryText: string;

      if (uploadedFiles.length > 0) {
        // Summarize multiple files
        const summaries = await Promise.all(
          uploadedFiles.map(async (file, index) => {
            const fileSummary = await summarizeFile(file);
            if (uploadedFiles.length > 1) {
              return `**File ${index + 1}: ${file.name}**\n\n${fileSummary}`;
            }
            return fileSummary;
          })
        );
        summaryText = summaries.join('\n\n---\n\n');
      } else {
        // Summarize text
        summaryText = await summarizeText(inputText);
      }

      // Ensure summaryText is valid before animating
      if (!summaryText || summaryText === 'undefined') {
        throw new Error('Invalid summary response');
      }

      // Animate the streaming effect
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < summaryText.length) {
          setSummary(summaryText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsProcessing(false);
        }
      }, 20);
    } catch (error: any) {
      console.error('AI Error:', error);

      // Check if it's a rate limit error
      if (error?.status === 429 || error?.message?.includes('429')) {
        toast.error('Rate limit reached. Please wait a moment and try again.');
        setSummary('⚠️ Rate limit reached. The free tier has limited requests. Please try again in a few moments.');
      } else {
        toast.error('Failed to generate summary. Please try again.');
        setSummary('');
      }
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
                  {uploadedFiles.length > 0 ? `Uploaded Files (${uploadedFiles.length}/${MAX_FILES})` : 'Input Text'}
                </label>
                {uploadedFiles.length === 0 && (
                  <button
                    onClick={() => setInputText(sampleText)}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Use sample text
                  </button>
                )}
              </div>

              {/* File Previews (shown when files are uploaded) */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-background/50 border border-border rounded-xl">
                      {file.type.startsWith('audio/') ? (
                        <Music className="w-8 h-8 text-primary flex-shrink-0" />
                      ) : (
                        <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="flex-shrink-0 p-1 hover:bg-destructive/10 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))}

                  {/* Upload more files button */}
                  {uploadedFiles.length < MAX_FILES && (
                    <label
                      htmlFor="file-upload-more"
                      className="flex items-center justify-center gap-2 p-4 bg-background/30 border border-dashed border-border hover:border-primary/50 rounded-xl cursor-pointer transition-colors group"
                    >
                      <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Upload more files ({MAX_FILES - uploadedFiles.length} remaining)
                      </span>
                      <input
                        id="file-upload-more"
                        type="file"
                        accept=".pdf,.docx,.doc,.mp3,.wav,.m4a,.flac"
                        onChange={handleFileUpload}
                        multiple
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Text Input with Upload Icon */}
              {uploadedFiles.length === 0 && (
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
                      title={`Upload up to ${MAX_FILES} PDF, DOCX, or Audio files (max 30MB each)`}
                    >
                      <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        Upload Files
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.docx,.doc,.mp3,.wav,.m4a,.flac"
                        onChange={handleFileUpload}
                        multiple
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
                disabled={(!inputText.trim() && uploadedFiles.length === 0) || isProcessing}
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
