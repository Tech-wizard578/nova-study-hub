# API Key Rotation Setup Guide

## Overview

The AI Summarizer now supports **automatic API key rotation**! When one API key hits its rate limit, the system automatically tries the next one.

## How to Set Up Multiple API Keys

### Step 1: Get Multiple API Keys

1. Go to [OpenRouter](https://openrouter.ai/)
2. Create multiple accounts (or use different API keys from the same account)
3. Copy each API key

### Step 2: Configure Your `.env.local`

Add your API keys separated by commas:

```bash
# Single API key (old way)
VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx

# Multiple API keys (new way - comma separated)
VITE_OPENROUTER_API_KEY=sk-or-v1-key1111111,sk-or-v1-key2222222,sk-or-v1-key3333333
```

**Important:**
- Separate keys with commas (`,`)
- No spaces between keys
- You can add as many keys as you want

### Step 3: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## How It Works

### Automatic Fallback

When you use the AI Summarizer:

1. **First Request** → Uses API Key #1
2. **If Key #1 is rate limited (429)** → Automatically tries Key #2
3. **If Key #2 is rate limited** → Tries Key #3
4. **And so on...**

### Console Logs

You'll see helpful messages in the console:

```
🔄 API key 1/3 rate limited, trying next...
✅ Successfully used fallback API key 2/3
```

### Error Messages

- **One key rate limited** → Automatically uses next key (silent)
- **All keys rate limited** → Shows: "⚠️ All API keys are rate limited. Please wait 1-2 minutes."

## Benefits

✅ **No downtime** - Automatic failover to backup keys
✅ **Better reliability** - Multiple keys = more requests
✅ **Transparent** - Works automatically, no code changes needed
✅ **Smart detection** - Only rotates on 429 errors, not other failures

## Example Configurations

### Development (3 keys)
```bash
VITE_OPENROUTER_API_KEY=sk-or-v1-dev-key1,sk-or-v1-dev-key2,sk-or-v1-dev-key3
```

### Production (5 keys for high traffic)
```bash
VITE_OPENROUTER_API_KEY=sk-or-v1-prod-key1,sk-or-v1-prod-key2,sk-or-v1-prod-key3,sk-or-v1-prod-key4,sk-or-v1-prod-key5
```

### Single Key (still works)
```bash
VITE_OPENROUTER_API_KEY=sk-or-v1-single-key
```

## Testing

To test the rotation:

1. Add 2-3 API keys to `.env.local`
2. Make multiple requests quickly to hit rate limits
3. Watch the console for rotation messages
4. Verify that requests succeed even when first key is limited

## Troubleshooting

### Keys not rotating?

- Check that keys are comma-separated with no spaces
- Restart dev server after changing `.env.local`
- Check browser console for error messages

### Still getting rate limited?

- All your keys have hit their limits
- Wait 1-2 minutes for limits to reset
- Consider adding more keys or upgrading to paid tier

## Where Rotation Works

Currently implemented in:
- ✅ **TryItLive.tsx** - The "Try It Live" sandbox AI Summarizer
- ⏳ **AIDemoSection.tsx** - Uses OpenAI SDK (different implementation)

## Future Enhancements

- [ ] Add rotation to all AI features
- [ ] Track which keys are rate limited
- [ ] Smart load balancing across keys
- [ ] Key health monitoring dashboard
