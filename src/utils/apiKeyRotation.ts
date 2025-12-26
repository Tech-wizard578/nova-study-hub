/**
 * API Key Rotation Utility
 * Automatically rotates through multiple API keys when rate limits are hit
 */

interface ApiCallOptions {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
}

interface ApiKeyRotationResult {
    success: boolean;
    data?: any;
    error?: any;
    keyIndex?: number;
}

/**
 * Tries multiple API keys sequentially until one succeeds or all fail
 * @param apiKeysString - Comma-separated list of API keys
 * @param makeRequest - Function that makes the API request with a given key
 * @returns Result object with success status and data/error
 */
export async function tryWithApiKeyRotation(
    apiKeysString: string,
    makeRequest: (apiKey: string) => Promise<Response>
): Promise<ApiKeyRotationResult> {
    // Split API keys by comma and trim whitespace
    const apiKeys = apiKeysString
        .split(',')
        .map(key => key.trim())
        .filter(key => key.length > 0);

    if (apiKeys.length === 0) {
        return {
            success: false,
            error: new Error('No API keys provided')
        };
    }

    let lastError: any = null;

    // Try each API key until one works
    for (let i = 0; i < apiKeys.length; i++) {
        const apiKey = apiKeys[i];

        try {
            const response = await makeRequest(apiKey);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // If rate limited, try next key
                if (response.status === 429) {
                    console.log(`🔄 API key ${i + 1}/${apiKeys.length} rate limited, trying next...`);
                    lastError = {
                        status: 429,
                        message: 'Rate limit exceeded',
                        data: errorData
                    };
                    continue; // Try next API key
                }

                // For other errors, throw immediately
                const error: any = new Error(errorData.error?.message || 'API request failed');
                error.status = response.status;
                error.statusText = response.statusText;
                error.data = errorData;
                return { success: false, error };
            }

            // Success!
            const data = await response.json();

            if (i > 0) {
                console.log(`✅ Successfully used fallback API key ${i + 1}/${apiKeys.length}`);
            }

            return {
                success: true,
                data,
                keyIndex: i
            };
        } catch (error: any) {
            // If it's a rate limit error, try next key
            if (error?.status === 429) {
                console.log(`🔄 API key ${i + 1}/${apiKeys.length} rate limited, trying next...`);
                lastError = error;
                continue;
            }

            // For other errors, return immediately
            return { success: false, error };
        }
    }

    // All keys failed (likely all rate limited)
    return {
        success: false,
        error: lastError || new Error('All API keys failed')
    };
}

/**
 * Makes an OpenRouter API call with automatic key rotation
 */
export async function callOpenRouterWithRotation(
    apiKeysString: string,
    model: string,
    messages: Array<{ role: string; content: string }>,
    options: {
        temperature?: number;
        max_tokens?: number;
    } = {}
): Promise<ApiKeyRotationResult> {
    return tryWithApiKeyRotation(apiKeysString, async (apiKey) => {
        return fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Nova Study Hub'
            },
            body: JSON.stringify({
                model,
                messages,
                temperature: options.temperature ?? 0.7,
                max_tokens: options.max_tokens ?? 200,
            })
        });
    });
}
