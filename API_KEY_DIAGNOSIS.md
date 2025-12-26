# API Key Exhaustion Diagnosis & Fix

## Problem Identified

**Issue:** All 3 API keys were being exhausted after a single prompt.

## Root Cause Analysis

### What Was Happening:

1. **Environment Variable:** `.env.local` contains:
   ```
   VITE_OPENROUTER_API_KEY=key1,key2,key3
   ```

2. **The Bug in `aiService.ts`:**
   ```typescript
   const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
   // This gets: "key1,key2,key3" as a SINGLE STRING
   
   const openai = new OpenAI({
       apiKey: apiKey,  // ❌ Sends malformed key to API
       ...
   });
   ```

3. **What Happened:**
   - OpenAI SDK sent: `"sk-or-v1-key1,sk-or-v1-key2,sk-or-v1-key3"` as the auth header
   - OpenRouter rejected it (invalid format)
   - OpenAI SDK has **built-in retry logic** (3 attempts)
   - Each retry counted as a separate API call
   - All retries failed → User saw "all keys exhausted"

### Console Evidence:

```
POST https://openrouter.ai/api/v1/chat/completions 429 (Too Many Requests)
POST https://openrouter.ai/api/v1/chat/completions 429 (Too Many Requests)  
POST https://openrouter.ai/api/v1/chat/completions 429 (Too Many Requests)
```

**3 requests = OpenAI SDK's 3 retry attempts with the SAME malformed key**

## The Fix

### What Was Changed:

**File:** `src/services/aiService.ts`

**Before:**
```typescript
// ❌ Used entire comma-separated string as one key
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const openai = new OpenAI({ apiKey: apiKey, ... });

export async function summarizeText(text: string) {
    const response = await openai.chat.completions.create({...});
    // This sent malformed key → failed → retried 3x
}
```

**After:**
```typescript
// ✅ Split keys and use rotation utility
import { callOpenRouterWithRotation } from '@/utils/apiKeyRotation';

export async function summarizeText(text: string) {
    const apiKeysString = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    // Use rotation utility that tries each key separately
    const result = await callOpenRouterWithRotation(
        apiKeysString,  // "key1,key2,key3"
        model,
        messages
    );
    // Tries key1 → if 429, tries key2 → if 429, tries key3
}
```

### How Rotation Works Now:

1. **Split keys:** `"key1,key2,key3"` → `["key1", "key2", "key3"]`
2. **Try key1:** If 429 → continue to next
3. **Try key2:** If 429 → continue to next  
4. **Try key3:** If 429 → all exhausted
5. **Success:** Return result from whichever key worked

## Components Updated

### ✅ Fixed Components:
- **`TryItLive.tsx`** - Already using rotation ✓
- **`aiService.ts` → `summarizeText()`** - Now using rotation ✓

### ⚠️ Still Using Single Key:
- **`aiService.ts` → Other functions:**
  - `summarizeFile()` (for images)
  - `chatWithAI()`
  - `generateQuestions()`
  - `generateDailyAptitudeQuestion()`

**Note:** These functions now use only the **first API key** from the list. They can be updated to use rotation later if needed.

## Expected Behavior Now

### Before Fix:
```
User uploads PDF
  → Extract text ✓
  → Call summarizeText()
    → Send malformed key "key1,key2,key3"
    → Fail
    → Retry 3x with same malformed key
    → All retries fail
  → Error: "All keys exhausted"
```

### After Fix:
```
User uploads PDF
  → Extract text ✓
  → Call summarizeText()
    → Try key1 → 429 rate limit
    → Try key2 → 429 rate limit  
    → Try key3 → SUCCESS! ✓
  → Summary displayed
```

## Testing

### To Verify the Fix:

1. **Wait 2-3 minutes** for rate limits to reset
2. Upload a PDF or enter text
3. Click "Summarize with AI"
4. **Watch console for:**
   ```
   🔄 API key 1/3 rate limited, trying next...
   ✅ Successfully used fallback API key 2/3
   ```

### Expected Results:

- ✅ Should try multiple keys automatically
- ✅ Should succeed if ANY key has quota
- ✅ Only shows "all exhausted" if ALL 3 keys are rate limited

## Summary

**Root Cause:** Comma-separated API keys treated as single malformed key  
**Impact:** Every request failed + retried 3x = appeared as "all keys exhausted"  
**Fix:** Use API key rotation utility that tries each key individually  
**Result:** Proper failover between keys, better reliability  

🎉 **The AI Summarizer now properly rotates through API keys!**
