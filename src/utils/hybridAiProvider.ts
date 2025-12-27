/**
 * Hybrid AI Provider
 * Uses Google Gemini as primary provider with automatic fallback to OpenRouter
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { callOpenRouterWithRotation } from './apiKeyRotation';

interface HybridAIResponse {
    success: boolean;
    content?: string;
    provider?: 'gemini' | 'openrouter';
    error?: any;
}

interface ChatMessage {
    role: string;
    content: string;
}

/**
 * Makes an AI request with Gemini as primary and OpenRouter as fallback
 * @param messages - Array of chat messages
 * @param options - Configuration options
 * @returns Response with content and provider info
 */
export async function callHybridAI(
    messages: ChatMessage[],
    options: {
        temperature?: number;
        maxTokens?: number;
    } = {}
): Promise<HybridAIResponse> {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const openRouterApiKeys = import.meta.env.VITE_OPENROUTER_API_KEY;

    // Try Gemini first if API key is available
    if (geminiApiKey && geminiApiKey.trim().length > 0) {
        // Try multiple model names in order of preference (verified available models)
        const modelNames = [
            "gemini-2.5-flash",
            "gemini-flash-latest",
            "gemini-2.5-pro",
            "gemini-pro-latest",
            "gemini-2.0-flash",
            "gemini-exp-1206"
        ];

        let lastError: any = null;

        for (const modelName of modelNames) {
            try {
                console.log(`🔵 Trying Gemini API with model: ${modelName}...`);

                const genAI = new GoogleGenerativeAI(geminiApiKey);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        temperature: options.temperature ?? 0.7,
                        maxOutputTokens: options.maxTokens ?? 2048,
                    }
                });

                // Convert messages to Gemini format
                const systemMessage = messages.find(m => m.role === 'system');
                const userMessages = messages.filter(m => m.role !== 'system');

                // Combine system message with first user message if exists
                let prompt = userMessages.map(m => m.content).join('\n\n');
                if (systemMessage) {
                    prompt = `${systemMessage.content}\n\n${prompt}`;
                }

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                console.log(`✅ Gemini API succeeded with model: ${modelName}`);
                return {
                    success: true,
                    content: text,
                    provider: 'gemini'
                };
            } catch (error: any) {
                console.warn(`⚠️ Model ${modelName} failed:`, error?.message || error);
                lastError = error;

                // Check if it's a rate limit error (stop trying other models)
                const isRateLimit =
                    error?.message?.includes('quota') ||
                    error?.message?.includes('rate limit') ||
                    error?.message?.includes('429') ||
                    error?.status === 429;

                if (isRateLimit) {
                    console.log('🔄 Rate limit detected, falling back to OpenRouter...');
                    break; // Exit the loop and fall back to OpenRouter
                }

                // If it's a 404, try the next model
                if (error?.message?.includes('404') || error?.status === 404) {
                    console.log(`Model ${modelName} not found, trying next...`);
                    continue;
                }

                // For other errors, try next model
                continue;
            }
        }

        // If all models failed and it's not a rate limit, return the last error
        if (lastError) {
            const isRateLimit =
                lastError?.message?.includes('quota') ||
                lastError?.message?.includes('rate limit') ||
                lastError?.message?.includes('429') ||
                lastError?.status === 429;

            if (!isRateLimit) {
                console.warn('⚠️ All Gemini models failed, falling back to OpenRouter...');
            }
        }
    } else {
        console.log('⚠️ No Gemini API key configured, using OpenRouter...');
    }

    // Fallback to OpenRouter
    if (!openRouterApiKeys || openRouterApiKeys.trim().length === 0) {
        return {
            success: false,
            error: new Error('No API keys configured. Please add VITE_GEMINI_API_KEY or VITE_OPENROUTER_API_KEY to your .env.local file.')
        };
    }

    try {
        console.log('🟠 Trying OpenRouter API (fallback provider)...');

        const result = await callOpenRouterWithRotation(
            openRouterApiKeys,
            'google/gemini-2.0-flash-exp:free',
            messages,
            {
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens ?? 2048,
            }
        );

        if (result.success && result.data) {
            console.log('✅ OpenRouter API succeeded');
            return {
                success: true,
                content: result.data.choices[0]?.message?.content,
                provider: 'openrouter'
            };
        } else {
            return {
                success: false,
                error: result.error,
                provider: 'openrouter'
            };
        }
    } catch (error) {
        console.error('❌ OpenRouter API failed:', error);
        return {
            success: false,
            error: error,
            provider: 'openrouter'
        };
    }
}

/**
 * Analyzes an image using Gemini's vision capabilities with OpenRouter fallback
 * @param base64Image - Base64 encoded image data URL
 * @param prompt - Text prompt for image analysis
 * @returns Response with analysis content
 */
export async function analyzeImageHybrid(
    base64Image: string,
    prompt: string = "Please analyze this image and provide a concise summary of what it contains in 3-4 sentences."
): Promise<HybridAIResponse> {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Try Gemini first (has native vision support)
    if (geminiApiKey && geminiApiKey.trim().length > 0) {
        // Try multiple model names in order of preference (verified available models)
        const modelNames = [
            "gemini-2.5-flash",
            "gemini-flash-latest",
            "gemini-2.5-pro",
            "gemini-pro-latest"
        ];

        for (const modelName of modelNames) {
            try {
                console.log(`🔵 Trying Gemini Vision API with model: ${modelName}...`);

                const genAI = new GoogleGenerativeAI(geminiApiKey);
                const model = genAI.getGenerativeModel({ model: modelName });

                // Extract base64 data and mime type from data URL
                const matches = base64Image.match(/^data:([^;]+);base64,(.+)$/);
                if (!matches) {
                    throw new Error('Invalid base64 image format');
                }

                const mimeType = matches[1];
                const base64Data = matches[2];

                const result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: mimeType
                        }
                    }
                ]);

                const response = await result.response;
                const text = response.text();

                console.log(`✅ Gemini Vision API succeeded with model: ${modelName}`);
                return {
                    success: true,
                    content: text,
                    provider: 'gemini'
                };
            } catch (error: any) {
                console.warn(`⚠️ Vision model ${modelName} failed:`, error?.message || error);

                // If it's a 404, try the next model
                if (error?.message?.includes('404') || error?.status === 404) {
                    console.log(`Vision model ${modelName} not found, trying next...`);
                    continue;
                }

                // For other errors, try next model
                continue;
            }
        }

        console.log('⚠️ All Gemini vision models failed, falling back to OpenRouter...');
    }

    // Fallback to OpenRouter with vision model
    const openRouterApiKeys = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!openRouterApiKeys || openRouterApiKeys.trim().length === 0) {
        return {
            success: false,
            error: new Error('No API keys configured for image analysis.')
        };
    }

    try {
        console.log('🟠 Trying OpenRouter Vision API (fallback provider)...');

        const result = await callOpenRouterWithRotation(
            openRouterApiKeys,
            'google/gemini-2.0-flash-exp:free',
            [
                {
                    role: 'user',
                    content: `${prompt}\n\nImage: ${base64Image}`
                }
            ],
            {
                temperature: 0.7
            }
        );

        if (result.success && result.data) {
            console.log('✅ OpenRouter Vision API succeeded');
            return {
                success: true,
                content: result.data.choices[0]?.message?.content,
                provider: 'openrouter'
            };
        } else {
            return {
                success: false,
                error: result.error,
                provider: 'openrouter'
            };
        }
    } catch (error) {
        console.error('❌ OpenRouter Vision API failed:', error);
        return {
            success: false,
            error: error,
            provider: 'openrouter'
        };
    }
}
