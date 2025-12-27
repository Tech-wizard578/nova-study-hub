import OpenAI from 'openai';
import { extractTextFromPDF, isPDF } from '@/utils/pdfExtractor';
import { callOpenRouterWithRotation } from '@/utils/apiKeyRotation';
import { callHybridAI, analyzeImageHybrid } from '@/utils/hybridAiProvider';

// For functions that don't use rotation yet, use the first API key
const apiKeysString = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const firstApiKey = apiKeysString.split(',')[0]?.trim() || "";

// Configure OpenAI client for OpenRouter (used by image/quiz functions)
const openai = new OpenAI({
    apiKey: firstApiKey,
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
        "HTTP-Referer": window.location.origin,
        "X-Title": "Nova Study Hub",
    }
});

// Default model - using Gemini Flash via OpenRouter for cost-effectiveness and multimodal support
// Using paid tier for better rate limits (very affordable at $0.075 per 1M tokens)
const DEFAULT_MODEL = "google/gemini-flash-1.5";

export async function summarizeText(text: string): Promise<string> {
    try {
        // Use hybrid AI provider (Gemini primary, OpenRouter fallback)
        const result = await callHybridAI(
            [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes text concisely. Always provide a clear, complete summary without any disclaimers or refusals."
                },
                {
                    role: "user",
                    content: `Summarize the following text in 3-4 concise sentences. Focus on the key points:\n\n${text}`
                }
            ],
            {
                temperature: 0.7,
                maxTokens: 500
            }
        );

        if (result.success && result.content) {
            const summary = result.content.trim();

            if (!summary) {
                throw new Error("Empty response from AI");
            }

            return summary;
        } else {
            throw result.error || new Error("Failed to generate summary");
        }
    } catch (error: any) {
        console.error("Error summarizing text:", error);

        // Provide specific error messages
        if (error?.status === 429 || error?.message?.includes('rate limit')) {
            throw new Error("All API providers rate limited. Please try again in a moment.");
        } else if (error?.status === 401) {
            throw new Error("API authentication failed. Please check your API keys.");
        } else if (error?.message) {
            throw error;
        } else {
            throw new Error("Failed to generate summary. Please try again.");
        }
    }
}

export async function summarizeFile(file: File): Promise<string> {
    try {
        // Handle PDF files
        if (isPDF(file)) {
            console.log('Extracting text from PDF...');
            const pdfText = await extractTextFromPDF(file);

            if (!pdfText || pdfText.trim().length === 0) {
                throw new Error('No text could be extracted from the PDF. The file may be image-based or empty.');
            }

            console.log(`Extracted ${pdfText.length} characters from PDF`);
            return summarizeText(pdfText);
        }

        // Handle image files
        if (file.type.startsWith('image/')) {
            // Convert image to base64
            const base64Image = await fileToBase64(file);

            // Use hybrid AI provider for image analysis
            const result = await analyzeImageHybrid(
                base64Image,
                "Please analyze this image and provide a concise summary of what it contains in 3-4 sentences."
            );

            if (result.success && result.content) {
                return result.content;
            } else {
                throw result.error || new Error("Failed to analyze image");
            }
        }

        // Handle text files
        if (file.type === 'text/plain' || file.type === 'application/json') {
            const text = await file.text();
            return summarizeText(text);
        }

        // Unsupported file type
        throw new Error(`Unsupported file type: ${file.type}. Supported formats: PDF, images (JPG, PNG), and text files.`);
    } catch (error) {
        console.error("Error summarizing file:", error);
        throw error;
    }
}

// Helper function to convert File to base64 data URL
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function chatWithAI(question: string, context?: string): Promise<string> {
    try {
        const systemPrompt = context
            ? `You are a helpful study assistant for college students. Use this context to answer questions: ${context}`
            : 'You are a helpful study assistant for college students specializing in AIML topics.';

        // Use hybrid AI provider (Gemini primary, OpenRouter fallback)
        const result = await callHybridAI(
            [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: question
                }
            ],
            {
                temperature: 0.7,
                maxTokens: 1024
            }
        );

        if (result.success && result.content) {
            return result.content;
        } else {
            throw result.error || new Error("Failed to generate response");
        }
    } catch (error: any) {
        console.error("Error chatting with AI:", error);

        // Provide specific error messages
        if (error?.status === 429 || error?.message?.includes('rate limit')) {
            throw new Error("All API providers rate limited. Please try again in a moment.");
        } else if (error?.message) {
            throw error;
        } else {
            throw new Error("Failed to chat with AI. Please try again.");
        }
    }
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

export async function generateQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Promise<QuizQuestion[]> {
    try {
        const prompt = `Generate ${count} ${difficulty} multiple-choice questions about ${topic}. 
      Return ONLY a JSON array with this format:
      [
        {
          "question": "Question text?",
          "options": ["A", "B", "C", "D"],
          "correct_answer": "A",
          "explanation": "Why A is correct"
        }
      ]
      Do not include markdown formatting like \`\`\`json. Just the raw JSON array.`;

        const response = await openai.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a quiz generator. Always respond with valid JSON only, no markdown."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.8,
        });

        const text = response.choices[0]?.message?.content || "[]";

        // Cleanup potential markdown if the model ignores the instruction
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating questions:", error);
        return [];
    }
}

export interface AptitudeQuestion {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    subject: string;
}

export async function generateDailyAptitudeQuestion(): Promise<AptitudeQuestion | null> {
    try {
        const topics = [
            'Logical Reasoning',
            'Quantitative Aptitude',
            'Verbal Ability',
            'Data Interpretation',
            'Pattern Recognition',
            'Problem Solving'
        ];

        const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];

        // Randomly select topic and difficulty
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

        const prompt = `Generate a challenging ${difficulty} aptitude question about ${topic} suitable for college students preparing for placements.

Return ONLY a JSON object with this exact format (no markdown, no code blocks):
{
  "question": "Clear, concise question text",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correct_answer": "Option X text (must match one of the options exactly)",
  "explanation": "Brief explanation of why this is the correct answer",
  "difficulty": "${difficulty}",
  "subject": "${topic}"
}

Requirements:
- Question should be clear and unambiguous
- All 4 options should be plausible
- Correct answer must be one of the 4 options
- Explanation should be concise (1-2 sentences)
- Focus on practical, placement-relevant questions`;

        const response = await openai.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an aptitude question generator. Always respond with valid JSON only, no markdown."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.8,
        });

        const text = response.choices[0]?.message?.content || "{}";

        // Cleanup potential markdown
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const question: AptitudeQuestion = JSON.parse(cleanText);
        return question;
    } catch (error) {
        console.error("Error generating daily aptitude question:", error);
        return null;
    }
}
