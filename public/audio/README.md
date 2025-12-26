# Audio Files Directory

This directory contains audio files for the Study Assistant features.

## Required Files

Please add the following audio files to this directory:

### Binaural Beats (Focus Mode)
1. **intense-study.mp3** - For deep concentration and intense study sessions (auto-selected)
2. **adhd-relief.mp3** - For calming and ADHD relief (optional)

### Motivational Audio
3. **motivation-1.mp3** - First motivational audio clip
4. **motivation-2.mp3** - Second motivational audio clip

## File Requirements

- **Format**: MP3, WAV, OGG, or M4A
- **Binaural Beats Duration**: At least 30 minutes (recommended for focus sessions)
- **Motivation Audio Duration**: 30 seconds to 2 minutes (recommended)
- **Quality**: 128kbps or higher
- **Loop-friendly** (for binaural beats): Should have seamless loop points

## How to Add Files

1. Copy your audio files to this directory (`/public/audio/`)
2. Rename them to match the names above
3. Files will be automatically detected by the app
4. No server restart needed (hot reload)

## Features

### Focus Mode
- Automatically plays **intense-study.mp3** when you start a focus session
- Shows creative headphone notification for better experience
- Music loops continuously during the session

### Motivate Me Button
- Randomly selects between **motivation-1.mp3** and **motivation-2.mp3**
- Click "Stop Audio" to stop playback anytime
- Button changes dynamically based on playback state

## Testing

### Test Binaural Beats:
1. Open the app
2. Click Voice Assistant (floating button)
3. Set focus duration
4. Click "Start Focus Session"
5. Music should play automatically with headphone notification

### Test Motivation Audio:
1. Open Voice Assistant
2. Click "Motivate Me" button
3. Random audio should play
4. Click "Stop Audio" to stop
5. Repeat to test random selection

---

## Important Notes

⚠️ **Audio files are NOT included in the Git repository** due to file size limitations (GitHub has a 100MB limit).

- Audio files are listed in `.gitignore`
- Each developer/deployment needs to add their own audio files
- Keep your audio files locally or use a CDN/cloud storage for production
- The app will show error messages if audio files are missing

## Recommended Sources

- **Binaural Beats**: YouTube Audio Library, FreeMusicArchive, or create your own
- **Motivational Audio**: Record your own or use royalty-free clips
- Ensure you have proper licenses for any audio you use
