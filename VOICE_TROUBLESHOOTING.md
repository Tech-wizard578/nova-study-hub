# Voice Assistant - Audio Troubleshooting Guide

## Why You Might Not Hear Audio

Browsers have security restrictions that prevent auto-playing audio without user interaction. This is why the automatic greeting might not play.

## How to Hear the Voice Greeting

### Method 1: Click "Greet Me" Button ✅ **RECOMMENDED**

1. Click the floating microphone button (bottom-right corner)
2. Click the **"Greet Me"** button
3. You should hear: *"Good evening, [your nickname]! Welcome to VignanVerse!..."*

### Method 2: Test with Other Buttons

Try these buttons to test if voice is working:
- **"Motivate Me"** - Hear a motivational message
- **"Break Reminder"** - Hear a break reminder
- **"Start Focus Session"** - Starts timer with voice announcement

## Checking Browser Console

Open the browser console (F12) and look for these messages:
- `🔊 Speech started:` - Voice is playing
- `✅ Speech ended` - Voice finished
- `❌ Speech error:` - There's an error
- `✅ Loaded X voices` - Voices are available

## Common Issues & Solutions

### Issue: No Sound at All
**Solution:**
1. Check your system volume
2. Check browser isn't muted
3. Try clicking "Greet Me" button (user interaction required)
4. Check console for errors

### Issue: "No voices available"
**Solution:**
1. Refresh the page
2. Wait a few seconds for voices to load
3. Try a different browser (Chrome works best)

### Issue: Greeting plays but very quiet
**Solution:**
1. Check system volume
2. Check browser tab isn't muted (look for speaker icon on tab)
3. Voice volume is set to 100% in the code

## Browser Compatibility

- ✅ **Chrome/Edge**: Best support, high-quality voices
- ✅ **Firefox**: Good support
- ✅ **Safari**: Works but different voices
- ❌ **Incognito/Private**: May have restrictions

## Testing Steps

1. **Open the page**: `http://localhost:8080/`
2. **Complete Entry Gate**: Enter nickname, answer question
3. **Open Voice Assistant**: Click microphone button
4. **Click "Greet Me"**: Should hear greeting immediately
5. **Check console**: Look for `🔊 Speech started` message

## Expected Console Output

```
✅ Voices loaded: 21 available
Using voice: Google US English
🎤 Speaking: Good evening, Alex! Welcome to VignanVerse!...
🔊 Speech started: Good evening, Alex! Welcome to VignanVerse!...
✅ Speech ended
```

## Still No Audio?

If you still don't hear anything:

1. **Check browser console** for error messages
2. **Try different browser** (Chrome recommended)
3. **Check system audio** settings
4. **Restart browser** and try again
5. **Check browser permissions** for audio

The voice assistant is working - it just needs a user click to start due to browser security policies!
