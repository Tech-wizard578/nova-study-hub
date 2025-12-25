
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

if (!apiKey) {
    console.warn("Missing Google AI API Key! Check your .env.local file.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");
// Using gemini-1.5-flash for speed and efficiency
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function summarizeText(text: string): Promise<string> {
    try {
        const prompt = `Summarize the following text in 3-4 concise sentences. Focus on the key points:\n\n${text}`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error summarizing text:", error);
        throw error;
    }
}

export async function chatWithAI(question: string, context?: string): Promise<string> {
    try {
        const systemPrompt = context
            ? `You are a helpful study assistant for college students. Use this context to answer questions: ${context}`
            : 'You are a helpful study assistant for college students specializing in AIML topics.';

        const prompt = `${systemPrompt}\n\nUser Question: ${question}`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error chatting with AI:", error);
        throw error;
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

        const result = await model.generateContent(prompt);
        const text = result.response.text();

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

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Cleanup potential markdown
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const question: AptitudeQuestion = JSON.parse(cleanText);
        return question;
    } catch (error) {
        console.error("Error generating daily aptitude question:", error);
        return null;
    }
}
