# Windows 98 Desktop Interface - Party Promo Video

## Purpose
Interactive Win98 desktop for party promo video recording with Instagram format support

## Components
- **Desktop**: Black background with insert_logo.png centered
- **Icons**: Notebook (CSS), constant.png, graftak.png, sweat.png
- **Trash**: insert_trash.png (full) / insert_trash_empty.png (empty)
- **Windows**: Notebook text editor, Video players for each icon
- **Format Container**: Adjustable viewport for Instagram dimensions

## Interactions
- Drag icons around desktop
- Drag to trash → delete with fade-out
- Double-click notebook → open text window
- Double-click image icons → open video player
- Video players with full controls (play/pause/stop/seek)
- Window draggable by title bar
- Format selector in settings

## Features
- Boot sequence with loading bar
- Screensaver with flying logos (30s idle)
- Fake error message popups (party-themed)
- Blue screen of death (BSOD) with party info
- Retro cursor trail effect
- Sound effects (click, trash)
- Settings panel with adjustable scales and volume
- Instagram format presets

## Instagram Formats
1. **Square (1:1)** - 1080x1080px - Standard posts
2. **Portrait (4:5)** - 1080x1350px - Vertical posts
3. **Landscape (1.91:1)** - 1080x566px - Horizontal posts
4. **Stories/Reels (9:16)** - 1080x1920px - Full-screen vertical

## Tech
- Single index.html (vanilla HTML/CSS/JS)
- Chrome optimized
- Win98 aesthetic: #c0c0c0 gray, beveled borders, system fonts
- Format-aware viewport scaling

## Setup
1. Place videos in `videos/` folder (in_constant.mp4, graftak.mp4, sweat.mp4)
2. Adjust party info in Notebook window and BSOD text
3. Select recording format from Settings
4. Open in Chrome and record

## Deliverable
One HTML file with format selection, ready to record Instagram content
