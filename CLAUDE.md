# Vue Video Blend Text Effect - Project Guide

## Stack & Tools
Vue 3 (Options API), Vue CLI 5.0, npm, plain CSS, localStorage state, GitHub Pages deployment

## Critical Architecture Patterns

**IMPORTANT: State Management**
- Centralized state in App.vue via `settings` object (persisted to localStorage as `appSettings`)
- Event flow: Child emits `@update` → Parent `onUpdate()` merges partial settings → localStorage watcher saves
- State update pattern:
```javascript
this.$emit('update', { blendMode: 'difference' });
```

**Key Files**
- `src/App.vue`: Root component with `onUpdate(val)` universal settings updater
- `src/components/Effects/TextVibration.vue`: Primary text effect using setInterval + CSS transforms
- `src/components/ControlPanel/ControlPanel.vue`: Control interface, all children emit `@update`
- `src/constants/blendModes.js`: Blend mode definitions

**Component Tree**
```
App.vue
├── VideoBackground.vue
├── ControlPanel.vue (nested: Backdrop, Blend, Color, Animation, Recording controls)
└── Effects (conditional: TextVibration.vue | TextDistort.vue)
```

## Code Conventions

**IMPORTANT: Style Rules**
- Prettier: single quotes, 2 spaces, 100 char width, semicolons required
- ESLint: vue3-essential + eslint:recommended
- File naming: Components PascalCase, composables camelCase with `use` prefix, styles kebab-case
- NO COMMENTS unless asked

**Component Structure Order**
1. Template → 2. Script (imports → data → computed → watchers → lifecycle → methods) → 3. Styles

## Common Tasks

**Adding Control Parameter**
1. Add to App.vue defaultSettings (lines ~79-108)
2. Add to App.vue resetToDefaults (lines ~196-216)
3. Create/update control in `src/components/ControlPanel/`
4. Emit: `<input @input="$emit('update', { newParam: value })" />`
5. Use via `props.settings.newParam`

**Adding Text Effect**
1. Create in `src/components/Effects/NewEffect.vue`
2. Import + register in App.vue components
3. Add conditional: `<NewEffect v-if="settings.effectType === 'new'" :settings="settings" />`
4. Update effect selector in ControlPanel.vue

## Commands
```bash
npm run serve      # Dev server (port 8080)
npm run build      # Production build (dist/)
npm run deploy     # Deploy to GitHub Pages
npm run lint       # Lint check
npm run lint:fix   # Auto-fix
npm run format     # Prettier
```

## localStorage Schema
- `appSettings`: settings object (blendMode, effectType, colors, animation params, text config)
- `appState`: app state (audio, video, controls visibility, playback state)

## Known Quirks
- back.mp4 (50MB) duplicated in root + src/assets/video/
- Composables (useControls.js, useAnimation.js) exist but unused
- TextGoo.vue commented out in App.vue
- vue.config.js CopyWebpackPlugin copies src/assets/video/ → dist/assets/video/

## Vue 3 Patterns
- Options API primary (App.vue)
- Composition API composables available but not integrated
- Legacy mixins exist but unused

## PWA & Mobile Support
**PWA Configuration:**
- `public/manifest.json`: PWA manifest with app metadata
- `public/service-worker.js`: Offline caching service worker
- Service worker registered in main.js (production only)
- Mobile-first responsive CSS in `src/assets/styles/mobile.css`

**Mobile Features:**
- Camera/video capture via MediaRecorder API (VideoOverlayControls.vue)
- Touch-friendly controls (44px min touch targets)
- Responsive breakpoints: 768px (tablet), 480px (phone)
- Performance utils in `src/utils/mobileOptimization.js`
- Full-screen control panel on mobile
- Hardware acceleration for animations

---

## Win98 Party Promo Integration

**RECENTLY ADDED (2026-01-13):** Complete Windows 98 desktop interface for party promo videos.

### Location & Access
- **Directory:** `win98/` (subdirectory in INSERT repository)
- **Entry point:** `win98/index.html`
- **Local URL:** `http://localhost:8000/win98/`
- **Production URL:** `https://ampleyan.github.io/insert/win98/`

### Project Structure
```
insert/
├── win98/                          # Win98 party promo (standalone)
│   ├── index.html                  # Main desktop interface (single-file app)
│   ├── assets/                     # Icons & images
│   │   ├── constant.png            # Icon image
│   │   ├── graftak.png             # Icon image
│   │   ├── sweat.png               # Icon image
│   │   ├── insert_trash.png        # Trash (full)
│   │   ├── insert_trash_empty.png  # Trash (empty)
│   │   └── insert_logo.png         # Desktop background logo
│   ├── sounds/                     # Sound effects
│   │   ├── Single Click.wav        # Click sound
│   │   ├── clink.wav               # Window open sound
│   │   ├── crumple.mp3             # Trash sound
│   │   └── thump.wav               # Unused
│   ├── videos/                     # Party promo videos
│   │   ├── in_constant.mp4         # Video 1 (9.1MB)
│   │   ├── graftak.mp4             # Video 2 (4.7MB)
│   │   └── sweat.mp4               # Video 3 (4.7MB)
│   ├── docs/plans/                 # Design documentation
│   ├── README.md                   # Win98 documentation
│   ├── INTEGRATION.md              # Integration details
│   ├── QUICK_DEPLOY.md             # Fast deployment guide
│   ├── link-example.html           # HTML snippets for main site
│   ├── DEPLOY.md                   # GitHub Pages setup
│   ├── deploy.sh                   # Deployment script
│   ├── .gitignore                  # Git ignore rules
│   └── example.jpg                 # Reference screenshot
└── INTEGRATION_SUMMARY.md          # Overview of integration
```

### Tech Stack
- **Framework:** Vanilla HTML/CSS/JavaScript (no dependencies)
- **Browser:** Chrome-optimized (works in all modern browsers)
- **Style:** Windows 98 skeuomorphic design (#c0c0c0 gray, beveled borders)
- **Assets:** Relative paths (works in subdirectory)

### Features
1. **Boot Sequence** - Win98 loading animation with progress bar
2. **Desktop** - Draggable icons, delete to trash, desktop background
3. **Video Players** - Win98-style media players with controls (play/pause/stop/seek)
4. **Audio Focus** - Only most recently opened/clicked video has audio (others muted)
5. **Screensaver** - Flying logos after 30 seconds of inactivity
6. **Error Popups** - Fake Win98 error messages (party-themed)
7. **BSOD** - Blue Screen of Death with customizable party info
8. **Effects** - Cursor trail, sound effects, animations
9. **Instagram Formats** - Preset dimensions (Stories/Reels 9:16, Square 1:1, Portrait 4:5, Landscape 1.91:1)
10. **Settings Panel** - Icon scale (default 3x), zoom scale, volume, format selector

### Key Files & Locations
- **Main HTML:** `win98/index.html` (~49KB, single-file app)
- **Party Info:** Lines 644-656 (Notebook window content)
- **BSOD Text:** Lines 640-646 (Blue screen party message)
- **Error Messages:** Lines 1300-1305 (Popup messages array)
- **Default Icon Scale:** Line 22 (`--base-icon-scale: 3`)
- **Icon Positions:** Lines 656-682 (Desktop icon placement)
- **Video Sources:** Lines 697, 720, 743 (Video file paths)

### Icon Configuration
**Current Icons (3x size by default):**
- `Notebook` - Opens text editor (20px, 20px)
- `IN_CONSTANT.mp4` - Opens video player (220px, 20px)
- `GRAFTAK.mp4` - Opens video player (220px, 20px)
- `SWEAT.mp4` - Opens video player (220px, 220px)
- `Recycle Bin` - Trash can (bottom-right)

**Icon Sizes:**
- Base: 144px (48px × 3)
- Container: 180px width
- Label: 16px font
- Spacing: 220px horizontal/vertical

### Customization Points
1. **Videos:** Replace files in `win98/videos/` (MP4, H.264, under 100MB)
2. **Icons:** Replace PNG files in `win98/assets/`
3. **Logo:** Replace `win98/assets/insert_logo.png` (desktop background)
4. **Party Info:** Edit Notebook content in `win98/index.html` lines 644-656
5. **BSOD:** Edit Blue Screen text in `win98/index.html` lines 640-646
6. **Error Messages:** Edit popup messages in `win98/index.html` lines 1300-1305

### Settings Panel Controls
```javascript
// Icon Scale: 0.5x - 5x (default: 3x)
// Zoom Scale: 1.2x - 3x (default: 1.8x)
// Sound: On/Off
// Volume: 0-100% (default: 50%)
// Cursor Trail: On/Off
// Format: square | portrait | landscape | reels (default: reels)
// Show Format Info: On/Off
```

### Instagram Format Presets
```javascript
square:    1080 × 1080 px (1:1)    - Feed posts
portrait:  1080 × 1350 px (4:5)    - Vertical feed posts
landscape: 1080 × 566 px (1.91:1)  - Horizontal posts
reels:     1080 × 1920 px (9:16)   - Stories/Reels (default)
```

### Audio Management
- **Multiple Videos:** Only last opened/clicked video has audio
- **Auto-Mute:** Opening new video mutes all others
- **Focus:** Clicking video player window gives it audio focus
- **Implementation:** `document.querySelectorAll('video').forEach(v => v.muted = true)`

### Deployment Status
- ✅ Files copied to `insert/win98/`
- ✅ All paths relative (GitHub Pages ready)
- ✅ Documentation created
- ⏳ **NOT YET DEPLOYED** - Awaiting git commit & push
- ⏳ **NOT LINKED** from main site

### Next Steps
1. **Deploy to GitHub Pages:**
   ```bash
   git add win98/
   git commit -m "Add Win98 party promo interface"
   git push origin main
   ```

2. **Test Locally:**
   ```bash
   python -m http.server 8000
   # Visit: http://localhost:8000/win98/
   ```

3. **Link from Main Site (Optional):**
   ```html
   <a href="win98/">🎉 Party Promo</a>
   ```
   See `win98/link-example.html` for styled examples.

### Common Tasks - Win98

**Update Videos:**
```bash
# Replace files in win98/videos/
cp new-video.mp4 win98/videos/in_constant.mp4
git add win98/videos/
git commit -m "Update party videos"
git push
```

**Update Party Info:**
```bash
# Edit win98/index.html lines 644-656 (Notebook)
# Edit win98/index.html lines 640-646 (BSOD)
git add win98/index.html
git commit -m "Update party information"
git push
```

**Change Icon Scale:**
```javascript
// Edit win98/index.html line 22
--base-icon-scale: 3;  // Change to desired scale (0.5-5)
```

**Adjust Icon Positions:**
```html
<!-- Edit win98/index.html lines 656-682 -->
<div class="icon" id="notebook" style="top: 20px; left: 20px;">
```

### Video Player Controls
- **Play/Pause:** Toggle playback (▶/⏸)
- **Stop:** Stop and reset to beginning (■)
- **Seek Bar:** Click to jump to position
- **Time Display:** Shows current / total time
- **Draggable:** Drag by title bar
- **Close:** X button (pauses video)

### Troubleshooting
- **Videos not playing:** Check MP4 H.264 codec, files exist in `win98/videos/`
- **Sounds not working:** Check "Enable Sounds" in Settings, verify sound files exist
- **Icons wrong size:** Adjust Icon Scale slider in Settings
- **Format not changing:** Use format selector in Settings panel
- **Path errors:** All paths must be relative (no `/` prefix)

### Performance Notes
- Single-file app: ~49KB HTML (no external JS/CSS)
- Videos: Total ~18.5MB (under GitHub 100MB limit)
- Loads instantly (videos lazy-loaded)
- Chrome optimized but works cross-browser
- No build step required

### Documentation Files
- `INTEGRATION_SUMMARY.md` - Main overview (INSERT root)
- `win98/QUICK_DEPLOY.md` - 3-step deployment
- `win98/INTEGRATION.md` - Technical details
- `win98/README.md` - Complete Win98 guide
- `win98/DEPLOY.md` - GitHub Pages setup
- `win98/link-example.html` - HTML snippets

### Related URLs
- **Repo:** https://github.com/ampleyan/insert
- **Production (after deploy):** https://ampleyan.github.io/insert/win98/
- **Local Path:** `C:\Users\ample\Documents\workspace\projects\insert\win98\`

---

## Context for Claude Code Sessions

### Current State (2026-01-13)
- Main INSERT project: Vue 3 video blend text effect app
- Win98 subdirectory: Complete party promo interface (standalone)
- Git status: win98/ is untracked (not committed yet)
- Both projects work independently
- No conflicts between projects

### If Working on Main INSERT App
- Ignore `win98/` directory
- Focus on Vue 3 components in `src/`
- Follow Vue 3 patterns from top of this file

### If Working on Win98 Project
- Work in `win98/` directory
- Single `index.html` file (no build process)
- All resources in `win98/assets/`, `win98/sounds/`, `win98/videos/`
- Test with local server: `python -m http.server 8000`
- Edit directly (no npm commands needed)

### Integration Points
- No code dependencies between projects
- Can link from main site to `/win98/`
- Both deploy to same GitHub Pages
- Separate documentation in each folder
