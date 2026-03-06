# 🎵 Soundboard PWA

A Progressive Web App that lets you create a custom soundboard using audio files from your local file system. Built with Vue 3, TypeScript, and modern browser APIs.

## ✨ Features

- **File System Access**: Select individual audio files or entire folders from your computer
- **Multiple Audio Formats**: Supports MP3, WAV, OGG, M4A, AAC, FLAC, WebM, and Opus
- **Loop Mode**: Toggle looping for any sound button
- **IndexedDB Persistence**: Your soundboard configuration is saved locally and persists across sessions
- **PWA Installable**: Install as a standalone app on your desktop or mobile device
- **Offline Ready**: Works offline once installed (requires permission to access files)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A modern browser with File System Access API support (Chrome, Edge, or Opera)

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory. You can serve them with any static file server.

To preview the production build locally:
```bash
npm run preview
```

## 📖 How to Use

1. **Add Audio Files**
   - Click "Add Files" to select individual audio files
   - Click "Add Folder" to add all audio files from a directory
   - The app will scan folders recursively for supported audio formats

2. **Play Sounds**
   - Click any sound button to play the audio
   - Click again while playing to stop it

3. **Enable Loop Mode**
   - Click the 🔁 button on any sound to toggle looping
   - Looping sounds will play continuously until stopped
   - Looping buttons have a gold border

4. **Remove Sounds**
   - Click the ✕ button on any sound to remove it from your soundboard

5. **Clear All**
   - Click "Clear All" to remove all sounds at once
   - You'll be asked to confirm this action

## 🔧 Technical Details

### Architecture

- **Vue 3 Composition API**: Modern reactive state management
- **TypeScript**: Full type safety
- **Vite**: Fast development and optimized production builds
- **Composables Pattern**: Modular, reusable logic

### Key Technologies

- **File System Access API**: Access files from user's local file system with permission
- **Web Audio API**: Decode and play audio with loop support
- **IndexedDB**: Store file handles and soundboard configuration persistently
- **Service Worker**: Enable offline functionality and PWA installation
- **Vite PWA Plugin**: Automatic PWA setup and manifest generation

### Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| File System Access API | ✅ 86+ | ✅ 86+ | ❌ | ❌ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ |
| IndexedDB | ✅ | ✅ | ✅ | ✅ |
| Service Workers | ✅ | ✅ | ✅ | ✅ |

**Recommended Browser**: Chrome or Edge for full functionality

### File System Permissions

The app uses the File System Access API which requires user permission:
- You'll be prompted to grant access when selecting files/folders
- Permission prompts may appear again when revisiting the app
- No files are uploaded or sent anywhere - everything stays local

## 🎨 Customization

### Add PWA Icons

To customize the app icons, replace the placeholder icons referenced in `vite.config.ts`:
- `public/pwa-192x192.png` - 192x192px icon
- `public/pwa-512x512.png` - 512x512px icon

### Modify Styling

- Component styles are in each `.vue` file's `<style scoped>` section
- Global styles are in `src/assets/main.css`
- Color gradients can be customized in component styles

### Supported Audio Formats

Edit the `AUDIO_EXTENSIONS` array in `src/composables/useFileSystem.ts` to add/remove supported formats.

## 📝 Project Structure

```
src/
├── composables/           # Reusable logic
│   ├── useIndexedDB.ts    # IndexedDB operations
│   ├── useAudioPlayer.ts  # Web Audio API wrapper
│   ├── useFileSystem.ts   # File System Access API
│   └── useSoundboard.ts   # Main state management
├── components/            # Vue components
│   ├── SoundButton.vue    # Individual sound button
│   ├── SoundboardGrid.vue # Grid layout
│   └── FileSelector.vue   # File picker controls
├── types/                 # TypeScript definitions
│   └── file-system-access.d.ts
├── App.vue                # Main app component
└── main.ts                # App entry point
```

## 🐛 Troubleshooting

### "File System Access API not supported"
- Use Chrome, Edge, or Opera browser
- The API is not available in Safari or Firefox

### Files won't play after refresh
- Re-grant permission when prompted
- Browser security requires re-authorization periodically

### Sound doesn't loop properly
- Click the 🔁 button to enable loop mode
- If sound is already playing, it will restart with loop enabled

### PWA not installing
- Ensure you're using HTTPS (or localhost)
- Check browser console for service worker errors
- Try a hard refresh (Ctrl/Cmd + Shift + R)

## 📄 License

This project is open source. Feel free to use and modify as needed.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 🔮 Future Enhancements

Potential features for future versions:
- Volume controls per button
- Audio waveform visualization
- Button color customization
- Keyboard shortcuts
- MIDI controller support
- Export/import configurations
- Multiple soundboard pages
- Audio effects (reverb, pitch shift)
- Drag-and-drop file upload

## 🙏 Acknowledgments

Built with modern web APIs and inspired by the need for a simple, local-first soundboard solution.
