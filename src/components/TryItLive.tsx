import { useState } from 'react';
import { X, Sparkles, FileText, Zap, Brain, Send, Loader2, CheckCircle2, Copy, Download, Code, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { questionBank } from '@/data/questionBank';
import { callOpenRouterWithRotation } from '@/utils/apiKeyRotation';

interface TryItLiveProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'summarize' | 'quiz' | 'voice' | 'code';
}

const TryItLive = ({ isOpen, onClose, defaultTab = 'code' }: TryItLiveProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const [activeTab, setActiveTab] = useState<'summarize' | 'quiz' | 'voice' | 'code'>(defaultTab);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<string>('');
    const [quizQuestion, setQuizQuestion] = useState<any>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    // Code compiler state
    const [codeLanguage, setCodeLanguage] = useState<'python' | 'java' | 'c'>('python');
    const [code, setCode] = useState('');
    const [codeOutput, setCodeOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const sampleText = `Artificial Intelligence (AI) is transforming education by providing personalized learning experiences. AI-powered systems can analyze student performance, identify knowledge gaps, and adapt content to individual learning styles. Machine learning algorithms help create intelligent tutoring systems that offer real-time feedback and support. Natural language processing enables automated essay grading and content summarization. As AI continues to evolve, it promises to make education more accessible, efficient, and tailored to each student's unique needs.`;

    const codeTemplates = {
        python: `# Python Hello World
print("Hello, World!")
print("Welcome to Vignanits Code Sandbox!")

# Try some Python code
for i in range(5):
    print(f"Count: {i}")`,
        java: `// Java Hello World
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Welcome to Vignanits Code Sandbox!");
        
        // Try some Java code
        for (int i = 0; i < 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,
        c: `// C Hello World
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Welcome to Vignanits Code Sandbox!\\n");
    
    // Try some C code
    for (int i = 0; i < 5; i++) {
        printf("Count: %d\\n", i);
    }
    
    return 0;
}`
    };

    const handleRunCode = async () => {
        if (!code.trim()) {
            toast.error('Please write some code first!');
            return;
        }

        setIsRunning(true);
        setCodeOutput('Compiling and running your code...\n');

        try {
            // Map our language names to Piston runtime names
            const languageMap = {
                python: { language: 'python', version: '3.10.0' },
                java: { language: 'java', version: '15.0.2' },
                c: { language: 'c', version: '10.2.0' }
            };

            const runtime = languageMap[codeLanguage];

            // Call Piston API
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language: runtime.language,
                    version: runtime.version,
                    files: [
                        {
                            name: codeLanguage === 'python' ? 'main.py' : codeLanguage === 'java' ? 'Main.java' : 'main.c',
                            content: code
                        }
                    ]
                })
            });

            const result = await response.json();

            if (result.run) {
                let output = '';

                if (result.compile) {
                    output += '=== Compilation ===\n';
                    if (result.compile.stdout) output += result.compile.stdout + '\n';
                    if (result.compile.stderr) output += 'Errors:\n' + result.compile.stderr + '\n';
                    output += '\n';
                }

                output += '=== Execution ===\n';
                if (result.run.stdout) {
                    output += result.run.stdout;
                }
                if (result.run.stderr) {
                    output += '\nErrors:\n' + result.run.stderr;
                }
                if (!result.run.stdout && !result.run.stderr) {
                    output += '(No output)';
                }

                output += `\n\nExit code: ${result.run.code}`;

                setCodeOutput(output);

                if (result.run.code === 0) {
                    toast.success('Code executed successfully!');
                } else {
                    toast.error('Code execution failed. Check output for errors.');
                }
            } else {
                setCodeOutput('Error: Failed to execute code\n' + JSON.stringify(result, null, 2));
                toast.error('Execution failed');
            }
        } catch (error) {
            console.error('Execution error:', error);
            setCodeOutput(`Error: ${error instanceof Error ? error.message : 'Failed to execute code'}\n\nPlease check your internet connection and try again.`);
            toast.error('Failed to connect to compiler service');
        } finally {
            setIsRunning(false);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const handleSummarize = async () => {
        if (!inputText.trim()) {
            toast.error('Please enter some text to summarize');
            return;
        }

        setIsProcessing(true);
        setResult('');

        try {
            const apiKeysString = import.meta.env.VITE_OPENROUTER_API_KEY;

            if (!apiKeysString) {
                // Fallback to a simple extractive summary if no API key
                const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
                const summary = sentences.length > 3
                    ? sentences.slice(0, 3).join('. ') + '.'
                    : inputText;
                setResult(summary);
                setIsProcessing(false);
                toast.success('Summary generated!');
                return;
            }

            // Call OpenRouter API with automatic key rotation
            const result = await callOpenRouterWithRotation(
                apiKeysString,
                'google/gemini-2.0-flash-exp:free',
                [{
                    role: 'user',
                    content: `Please provide a concise summary of the following text in 2-3 sentences. Focus on the main points and key information:\n\n${inputText}`
                }],
                {
                    temperature: 0.7,
                    max_tokens: 200
                }
            );

            if (result.success && result.data) {
                const summary = result.data.choices?.[0]?.message?.content?.trim();

                if (summary && summary !== 'undefined') {
                    setResult(summary);
                    toast.success('Summary generated!');
                } else {
                    throw new Error('No summary generated');
                }
            } else {
                throw result.error || new Error('Failed to generate summary');
            }
        } catch (error: any) {
            console.error('Summarization error:', error);

            // Check if it's a rate limit error (429 status code)
            if (error?.status === 429 || error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate limit')) {
                toast.error('All API keys rate limited. Please wait a moment.', {
                    description: 'All available API keys have hit their rate limits.'
                });
                setResult('⚠️ All API keys are rate limited. Please wait 1-2 minutes before trying again.');
            } else {
                toast.error('Failed to generate summary. Please try again.');
                setResult('');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateQuiz = () => {
        setIsProcessing(true);
        setQuizQuestion(null);
        setSelectedAnswer(null);

        // Simulate processing delay
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * questionBank.length);
            const randomQuestion = questionBank[randomIndex];

            // Find the index of the correct answer
            const correctIndex = randomQuestion.options.findIndex(
                option => option === randomQuestion.correct_answer
            );

            const quiz = {
                question: randomQuestion.question,
                options: randomQuestion.options,
                correctAnswer: correctIndex !== -1 ? correctIndex : 0,
                explanation: randomQuestion.explanation,
                subject: randomQuestion.subject,
                difficulty: randomQuestion.difficulty
            };
            setQuizQuestion(quiz);
            setIsProcessing(false);
            toast.success('Quiz generated!');
        }, 1500);
    };

    const handleAnswerSelect = (index: number) => {
        setSelectedAnswer(index);
        const isCorrect = index === quizQuestion.correctAnswer;

        setTimeout(() => {
            if (isCorrect) {
                toast.success('🎉 Correct! Well done!');
            } else {
                toast.error('Not quite. Try again!');
            }
        }, 300);
    };

    const handleVoiceCommand = (command: string) => {
        toast.success(`🎤 Voice command: "${command}"`, {
            description: 'Voice assistant is listening...',
        });

        setTimeout(() => {
            toast.info('Voice assistant feature available in full app!');
        }, 1500);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        toast.success('Copied to clipboard!');
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[60] flex items-center justify-center ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                onClick={handleClose}
            />

            {/* Main Content */}
            <div className="relative w-full max-w-6xl mx-4 h-[85vh] flex flex-col">
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="glass-card px-4 py-2">
                            <span className="text-sm font-medium">Try It Live - Interactive Sandbox</span>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="relative z-10 flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'code'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            : 'glass-card text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Code className="w-4 h-4 inline mr-2" />
                        Code Compiler
                    </button>
                    <button
                        onClick={() => setActiveTab('summarize')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'summarize'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'glass-card text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <FileText className="w-4 h-4 inline mr-2" />
                        AI Summarizer
                    </button>
                    <button
                        onClick={() => setActiveTab('quiz')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'quiz'
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                            : 'glass-card text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Zap className="w-4 h-4 inline mr-2" />
                        Quiz Generator
                    </button>
                    <button
                        onClick={() => setActiveTab('voice')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'voice'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                            : 'glass-card text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Brain className="w-4 h-4 inline mr-2" />
                        Voice Assistant
                    </button>
                </div>

                {/* Content Area */}
                <div className="relative flex-1 glass-card rounded-2xl p-6 md:p-8 overflow-hidden">
                    {/* Code Compiler Tab */}
                    {activeTab === 'code' && (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold">Code Compiler</h3>
                                <div className="flex gap-2">
                                    {(['python', 'java', 'c'] as const).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setCodeLanguage(lang);
                                                setCode(codeTemplates[lang]);
                                                setCodeOutput('');
                                            }}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${codeLanguage === lang
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                : 'bg-background/50 text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {lang.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 flex-1">
                                {/* Code Editor */}
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium">Code Editor</label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setCode(codeTemplates[codeLanguage])}
                                        >
                                            Load Template
                                        </Button>
                                    </div>
                                    <textarea
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder={`Write your ${codeLanguage.toUpperCase()} code here...`}
                                        className="flex-1 p-4 bg-background/50 border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                                        spellCheck={false}
                                    />
                                    <Button
                                        onClick={handleRunCode}
                                        disabled={isRunning}
                                        className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                                    >
                                        {isRunning ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Running...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Run Code
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Output Console */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-2">Output Console</label>
                                    <div className="flex-1 p-4 bg-black/50 border border-green-500/20 rounded-xl font-mono text-sm overflow-auto">
                                        {codeOutput ? (
                                            <pre className="text-green-400 whitespace-pre-wrap">{codeOutput}</pre>
                                        ) : (
                                            <p className="text-muted-foreground italic">Output will appear here after running your code...</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Summarizer Tab */}
                    {activeTab === 'summarize' && (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold">AI Text Summarizer</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setInputText(sampleText)}
                                    className="text-sm"
                                >
                                    Load Sample Text
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 flex-1">
                                {/* Input */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium mb-2">Input Text</label>
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Paste your text here to get an AI-generated summary..."
                                        className="flex-1 p-4 bg-background/50 border border-white/10 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <Button
                                        onClick={handleSummarize}
                                        disabled={isProcessing}
                                        className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                Generate Summary
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Output */}
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium">AI Summary</label>
                                        {result && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={copyToClipboard}
                                            >
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex-1 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                                        {result ? (
                                            <p className="text-foreground leading-relaxed">{result}</p>
                                        ) : (
                                            <p className="text-muted-foreground italic">Your AI-generated summary will appear here...</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quiz Generator Tab */}
                    {activeTab === 'quiz' && (
                        <div className="h-full flex flex-col">
                            <h3 className="text-2xl font-bold mb-4">Smart Quiz Generator</h3>

                            <div className="flex-1 flex flex-col items-center justify-center">
                                {!quizQuestion ? (
                                    <div className="text-center max-w-md">
                                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                                            <Zap className="w-12 h-12 text-white" />
                                        </div>
                                        <h4 className="text-xl font-semibold mb-3">Generate AI Quiz</h4>
                                        <p className="text-muted-foreground mb-6">
                                            Click below to generate a quiz question based on the sample text about AI in education.
                                        </p>
                                        <Button
                                            onClick={handleGenerateQuiz}
                                            disabled={isProcessing}
                                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generate Quiz
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-2xl">
                                        <div className="glass-card p-6 rounded-xl mb-6">
                                            <div className="flex gap-2 mb-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                    {quizQuestion.subject}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${quizQuestion.difficulty === 'easy'
                                                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                                    : quizQuestion.difficulty === 'medium'
                                                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                                                    }`}>
                                                    {quizQuestion.difficulty.charAt(0).toUpperCase() + quizQuestion.difficulty.slice(1)}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-semibold mb-4">{quizQuestion.question}</h4>
                                            <div className="space-y-3">
                                                {quizQuestion.options.map((option: string, index: number) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleAnswerSelect(index)}
                                                        disabled={selectedAnswer !== null}
                                                        className={`w-full p-4 rounded-lg text-left transition-all ${selectedAnswer === null
                                                            ? 'bg-background/50 hover:bg-background/80 border border-white/10'
                                                            : selectedAnswer === index
                                                                ? index === quizQuestion.correctAnswer
                                                                    ? 'bg-green-500/20 border-2 border-green-500'
                                                                    : 'bg-red-500/20 border-2 border-red-500'
                                                                : index === quizQuestion.correctAnswer
                                                                    ? 'bg-green-500/20 border-2 border-green-500'
                                                                    : 'bg-background/30 border border-white/10'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{option}</span>
                                                            {selectedAnswer !== null && index === quizQuestion.correctAnswer && (
                                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedAnswer !== null && (
                                            <div className="glass-card p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-slide-in-right">
                                                <p className="text-sm text-blue-300">
                                                    <strong>Explanation:</strong> {quizQuestion.explanation}
                                                </p>
                                            </div>
                                        )}

                                        <Button
                                            onClick={handleGenerateQuiz}
                                            variant="ghost"
                                            className="mt-4 w-full"
                                        >
                                            Generate Another Question
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Voice Assistant Tab */}
                    {activeTab === 'voice' && (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="text-center max-w-md">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <Brain className="w-16 h-16 text-white" />
                                </div>
                                <h4 className="text-2xl font-semibold mb-3">Voice Assistant Demo</h4>
                                <p className="text-muted-foreground mb-8">
                                    Try these voice commands to see how the assistant responds:
                                </p>

                                <div className="space-y-3">
                                    {[
                                        'Help me focus',
                                        'Motivate me',
                                        'Start a quiz',
                                        'Summarize this document'
                                    ].map((command, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleVoiceCommand(command)}
                                            className="w-full p-4 glass-card rounded-xl hover:bg-white/10 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">"{command}"</span>
                                                <Send className="w-4 h-4 text-cyan-500 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <p className="text-xs text-muted-foreground mt-6">
                                    Full voice recognition available in the complete application
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default TryItLive;
