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

## Win98 Party Promo (Vue Components)

Windows 98 desktop interface integrated as Vue components.

### Structure
```
src/
├── components/Win98/           # Vue components
│   ├── Win98Desktop.vue        # Main desktop layout
│   ├── Win98Icon.vue           # Draggable desktop icons
│   ├── Win98Window.vue         # Window container
│   ├── Win98VideoPlayer.vue    # Video player control
│   ├── Win98Notebook.vue       # Text editor
│   ├── Win98Settings.vue       # Settings panel
│   ├── Win98BootScreen.vue     # Boot animation
│   ├── Win98Taskbar.vue        # Taskbar
│   ├── Win98ErrorPopup.vue     # Error dialogs
│   ├── Win98BSOD.vue           # Blue screen
│   └── Win98Screensaver.vue    # Screensaver
├── assets/win98/               # Win98 assets (copied to dist/ by webpack)
│   ├── images/                 # PNG icons
│   ├── videos/                 # MP4 videos
│   └── sounds/                 # Audio files
├── constants/win98.js          # Icons, sounds, formats, default state
└── stores/settings.js          # Pinia store with win98 state
```

### Asset Paths
Assets use `getWin98AssetPath()` from `src/constants/win98.js` for correct BASE_URL handling:
```javascript
import { getWin98AssetPath } from '../../constants/win98';
const iconPath = getWin98AssetPath('win98/assets/icon.png');
```

### Build
`vue.config.js` copies assets from `src/assets/win98/` to `dist/win98/` via CopyWebpackPlugin.

### Customization
- **Icons/Videos:** Edit `src/constants/win98.js` WIN98_ICONS
- **Party Info:** Edit WIN98_DEFAULT_STATE.notebookContent in constants
- **Settings:** Edit WIN98_DEFAULT_STATE defaults
