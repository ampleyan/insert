# Windows 98 Desktop - Party Promo Interface

An interactive Windows 98-themed desktop interface designed for creating party promo videos with Instagram-optimized formats.

![Windows 98 Desktop](example.jpg)

## 🎯 Features

- **Authentic Win98 UI** - Classic beveled borders, gray chrome, system fonts
- **Boot Sequence** - Windows 98 boot animation with loading bar
- **Interactive Desktop** - Drag icons, delete to trash, double-click to open
- **Video Players** - Win98-style media players with full controls
- **Screensaver** - Flying logos after 30 seconds of inactivity
- **Error Popups** - Party-themed fake Windows error messages
- **Blue Screen** - BSOD with customizable party information
- **Retro Effects** - Cursor trail, sound effects, animations
- **Instagram Formats** - Preset dimensions for Stories, Reels, and Posts

## 📱 Instagram Format Support

Choose from 4 Instagram-optimized recording formats:

| Format | Dimensions | Aspect Ratio | Use Case |
|--------|-----------|--------------|----------|
| **Stories/Reels** | 1080 x 1920 px | 9:16 | Full-screen vertical video |
| **Square** | 1080 x 1080 px | 1:1 | Classic feed posts |
| **Portrait** | 1080 x 1350 px | 4:5 | Modern vertical posts |
| **Landscape** | 1080 x 566 px | 1.91:1 | Horizontal posts |

## 🚀 Quick Start

### Online (GitHub Pages)

Visit: **[https://YOUR-USERNAME.github.io/win98](https://YOUR-USERNAME.github.io/win98)**

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/win98.git
cd win98
```

2. Add your video files to `videos/` folder:
   - `in_constant.mp4`
   - `graftak.mp4`
   - `sweat.mp4`

3. Open `index.html` in Chrome

## 📝 Customization

### Party Information

Edit the notebook window content in `index.html` (lines 644-656):

```html
<div class="window-content" id="window-content" contenteditable="true">
    <p><strong>PARTY INFORMATION</strong></p>
    <br>
    <p>Date: [YOUR DATE HERE]</p>
    <p>Time: [YOUR TIME HERE]</p>
    <p>Location: [YOUR LOCATION HERE]</p>
    ...
</div>
```

### Blue Screen Message

Customize the BSOD party info in `index.html` (lines 640-646):

```html
<p>Join the party at [YOUR LOCATION HERE]</p>
<p>Date: [YOUR DATE HERE]</p>
<p>Time: [YOUR TIME HERE]</p>
```

### Desktop Icons

Replace images in `assets/` folder:
- `constant.png` - First icon
- `graftak.png` - Second icon
- `sweat.png` - Third icon
- `insert_trash.png` - Full trash
- `insert_trash_empty.png` - Empty trash
- `insert_logo.png` - Desktop background logo

### Error Messages

Customize error popups in `index.html` (lines 1300-1305):

```javascript
const errorMessages = [
    { title: 'Party Alert', message: 'Your custom message here!' },
    // Add more...
];
```

## 🎬 Recording Your Video

### Method 1: Browser Screen Recording (Chrome)

1. Open Chrome DevTools (F12)
2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
3. Type "screenshot" and select "Capture node screenshot"
4. Or use Chrome's built-in screen recorder

### Method 2: OBS Studio (Recommended)

1. Download [OBS Studio](https://obsproject.com/)
2. Add "Window Capture" source
3. Select your browser window
4. Crop to the format container (dark box with content)
5. Set output resolution to match your selected format (e.g., 1080x1920)
6. Start recording!

### Method 3: Other Screen Recorders

- **Windows**: Xbox Game Bar (Win+G)
- **Mac**: QuickTime Player (Cmd+Shift+5)
- **Cross-platform**: ShareX, Bandicam, ScreenFlow

### Recording Tips

- Set browser zoom to 100% for true 1080px width
- The dark background helps you crop in post-production
- Use "Show Format Info" toggle to verify dimensions
- Record at 60fps for smooth animations
- Export in MP4 (H.264) for best Instagram compatibility

## ⚙️ Settings Panel

Access settings via the taskbar "Settings" button:

- **Icon Scale** - Adjust desktop icon size (0.5x - 2x)
- **Zoom Scale** - Control double-click zoom effect (1.2x - 3x)
- **Enable Sounds** - Toggle click/trash sound effects
- **Volume** - Adjust sound effect volume (0-100%)
- **Cursor Trail** - Toggle retro cursor trail effect
- **Recording Format** - Select Instagram format preset
- **Show Format Info** - Display format dimensions overlay
- **Trigger BSOD** - Manually activate Blue Screen

## 🎮 Controls

### Desktop
- **Single Click** - Select icon
- **Double Click Notebook** - Open text editor
- **Double Click Images** - Open video player
- **Drag Icon** - Move around desktop
- **Drag to Trash** - Delete icon with animation

### Video Players
- **▶/⏸** - Play/Pause video
- **■** - Stop and reset to beginning
- **Seek Bar** - Click to jump to position
- **Title Bar** - Drag to move window
- **X Button** - Close player

### Audio Focus
- Only the most recently opened/clicked video player has audio
- All other video players are automatically muted
- Click on a video player window to give it audio focus

## 📁 Project Structure

```
win98/
├── index.html              # Main application file
├── README.md              # This file
├── example.jpg            # Reference screenshot
├── assets/                # Desktop icons and images
│   ├── constant.png
│   ├── graftak.png
│   ├── sweat.png
│   ├── insert_trash.png
│   ├── insert_trash_empty.png
│   └── insert_logo.png
├── sounds/                # Sound effects
│   ├── Single Click.wav
│   ├── clink.wav
│   ├── crumple.mp3
│   └── thump.wav
├── videos/                # Video files for players
│   ├── in_constant.mp4
│   ├── graftak.mp4
│   └── sweat.mp4
└── docs/                  # Documentation
    └── plans/
```

## 🌐 Deploying to GitHub Pages

1. **Create a GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Win98 desktop interface"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/win98.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"

3. **Access your site**
   - Visit `https://YOUR-USERNAME.github.io/win98`
   - May take a few minutes to deploy

### Important for GitHub Pages

- All file paths are relative (no changes needed)
- Video files should be under 100MB each (GitHub limit)
- For larger videos, consider using:
  - [Git LFS](https://git-lfs.github.com/) for large files
  - External hosting (YouTube, Vimeo) with embedded players
  - Compressed video formats

## 🎨 Browser Compatibility

**Recommended:** Chrome/Chromium-based browsers (Chrome, Edge, Brave)

**Tested:**
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ⚠️ Safari (some CSS features may differ)

**Requirements:**
- JavaScript enabled
- HTML5 video support
- CSS3 animations support
- Web Audio API (for sounds)

## 📄 License

This project is open source and available for personal and commercial use.

## 🙏 Credits

- Inspired by authentic Windows 98 UI design
- Sound effects from classic Windows system sounds
- Built with vanilla HTML/CSS/JavaScript

## 💡 Tips & Tricks

1. **Performance**: Close unnecessary browser tabs before recording
2. **Smooth Playback**: Pre-load videos by opening players before recording
3. **Multiple Takes**: Use the screensaver (wait 30s) for transitions
4. **Branding**: Replace `insert_logo.png` with your party brand
5. **Viral Content**: Use Stories/Reels format (9:16) for maximum reach

## 🐛 Troubleshooting

**Videos not playing?**
- Check video files are in `videos/` folder
- Ensure filenames match: `in_constant.mp4`, `graftak.mp4`, `sweat.mp4`
- Use MP4 format with H.264 codec

**Sounds not working?**
- Check "Enable Sounds" in Settings
- Increase volume slider
- Allow audio autoplay in browser

**Wrong dimensions?**
- Set browser zoom to 100%
- Check selected format in Settings
- Verify "Show Format Info" overlay

**Icons not showing?**
- Check files exist in `assets/` folder
- Clear browser cache (Ctrl+Shift+R)
- Verify image paths in HTML

## 🔄 Updates

Check the repository for updates and new features:
- New Instagram format presets
- Additional sound effects
- Enhanced Win98 components
- Performance improvements

---

Made with 💾 for your party promo needs | [Report an Issue](https://github.com/YOUR-USERNAME/win98/issues)
