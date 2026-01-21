# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack & Tools
Vue 3 (Options + Composition API), Vue CLI 5.0, Pinia (state), plain CSS, localStorage, GitHub Pages deployment

## Commands

```bash
npm install           # Install dependencies
npm run serve         # Dev server on http://localhost:8080
npm run build         # Production build (outputs to dist/)
npm run deploy        # Build + deploy to GitHub Pages
npm run lint          # ESLint check
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format with Prettier

node websocket-bridge.js  # Start WebSocket bridge for TouchDesigner integration
```

## Core Architecture

### State Management Flow
**Critical Pattern:** Pinia stores are the single source of truth for all state.

```
Pinia Stores (settings.js, videos.js, history.js, presets.js)
    ↓
App.vue (orchestrator, imports stores and passes to children as props)
    ↓
Child Components (receive store state as props)
    ↓
User Interaction → @update events with partial state objects
    ↓
onUpdate() in App.vue → merges into Pinia store
    ↓
Pinia auto-persists to localStorage (debounced, 300ms)
```

**Key Files:**
- `src/stores/settings.js` - All UI settings, effect parameters, win98 state
- `src/App.vue` - Root component with onUpdate() universal settings handler
- `src/components/Effects/TextVibration.vue` - Default text effect (setInterval + CSS transforms)
- `src/constants/blendModes.js` - CSS blend mode definitions

### Component Hierarchy
```
App.vue
├── VideoBackground (renders video layers from videosStore)
├── FormatBoundary (format guides and boundaries)
├── GridOverlay (alignment grid)
├── ImageOverlay (draggable images)
├── VideoOverlay (draggable videos)
├── ControlPanel (all controls emit @update events)
│   ├── TabContainer
│   ├── EffectSelector (dropdown with 15+ effects)
│   ├── EffectSpecificControls (dynamic per effect type)
│   ├── BlendControls, AnimationControls, ColorControls, etc.
│   └── RecordingControls (canvas-based video/PNG export)
└── 15+ Effect Components (conditional render based on effectType)
    ├── TextVibration, GlitchEffect, WaveEffect, ParticleBurst
    ├── Rotation3D, NeonGlow, LiquidDistortion
    ├── TypewriterEffect, ChromaticAberration, SplitText
    └── WavyText, FlickerText, StrokeText, GradientText, etc.
```

### Dual Mode System
App supports two modes via `settingsStore.appMode`:
- **insert** - Main text effects app
- **win98** - Windows 98 desktop simulation with draggable icons, video players, timeline

Toggle with button in insert mode → switches to Win98Desktop.vue component

## Development Patterns

### Adding a New Text Effect

1. **Create component** in `src/components/Effects/NewEffect.vue`:
```vue
<script>
export default {
  props: { settings: Object },
  emits: ['update'],
  mounted() {
    // Initialize animation intervals
  },
  unmounted() {
    // Clean up intervals/listeners
  }
};
</script>
```

2. **Register in App.vue:**
```javascript
import NewEffect from './components/Effects/NewEffect.vue';

// In components object
components: { NewEffect, ... }

// In template
<NewEffect v-if="settingsStore.effectType === 'neweffect'"
           :settings="settingsStore.$state"
           @update="onUpdate" />
```

3. **Add to effect selector** in `src/components/ControlPanel/EffectSelector.vue`

4. **Add default state** to `settings.js`:
```javascript
state: () => ({
  // ...existing state
  neweffect: {
    param1: defaultValue,
    param2: defaultValue
  }
})
```

### Adding a New Control

1. **Create component** in `src/components/ControlPanel/NewControl.vue`
2. **Use emit pattern:**
```vue
<input @input="$emit('update', { paramName: $event.target.value })" />
```
3. **Add default to settings.js** state
4. **Import in ControlPanel.vue** and add to template

### State Update Pattern
**Always use the @update emit pattern:**
```javascript
// Child component
this.$emit('update', { blendMode: 'difference', opacity: 80 });

// Parent (App.vue onUpdate method)
onUpdate(val) {
  this.historyStore.recordState(this.settingsStore.$state);  // Undo/redo
  this.settingsStore.updateSettings(val);  // Merges into store + saves to localStorage
}
```

## Important Architectural Details

### Animation Pattern
Most effects use **setInterval + reactive data + CSS transforms**:
```javascript
export default {
  data() {
    return { positions: [] };
  },
  mounted() {
    this.animationId = setInterval(() => {
      this.positions = this.calculateNewPositions();  // Reactive update
    }, this.settings.vibrateSpeed);
  },
  unmounted() {
    clearInterval(this.animationId);  // CRITICAL: prevent memory leaks
  }
};
```

### Per-Line Text Configuration
Text lines are stored as arrays indexed by line number:
```javascript
textLines: ['Line 1', 'Line 2', 'Line 3']
fontSize: [120, 100, 80]          // Per-line font size
margin: [0, 50, -30]              // Per-line horizontal position
marginTop: [100, 0, -100]         // Per-line vertical position
letterSpacing: [0, 5, 10]         // Per-line letter spacing
scaleX/scaleY: [1, 1.2, 0.8]      // Per-line scale
textVisible: [true, true, false]   // Per-line visibility
letterTransforms: [{}, {}, {}]     // Per-letter transforms (letter edit mode)
textPaths: [{...}, {...}, {...}]   // Per-line curved text paths
textAnimations: [{...}, {...}, {...}]  // Per-line animation presets
```

### Asset Paths
**Build Configuration (vue.config.js):**
- `publicPath: '/insert/'` in production (GitHub Pages subdirectory)
- CopyWebpackPlugin copies assets from `src/assets/` to `dist/`:
  - `src/assets/video/` → `dist/assets/video/`
  - `src/assets/win98/images/` → `dist/win98/assets/`
  - `src/assets/win98/videos/` → `dist/win98/videos/`
  - `src/assets/win98/sounds/` → `dist/win98/sounds/`
  - `src/assets/gnome/images/` → `dist/gnome/assets/`
  - `src/assets/mac/images/` → `dist/mac/images/`

**Asset Path Helper:**
Use `getWin98AssetPath()` from `src/constants/win98.js` for correct BASE_URL handling:
```javascript
import { getWin98AssetPath } from '@/constants/win98';
const iconPath = getWin98AssetPath('win98/assets/icon.png');
```

### localStorage Schema
**Key:** `appSettings` (auto-managed by Pinia)
```javascript
{
  blendMode: 'difference',
  effectType: 'vibration',
  textLines: ['INSERT', 'TEXT'],
  fontSize: [120, 120],
  margin: [0, 0],
  marginTop: [0, 0],
  letterSpacing: [0, 0],
  vibrateSpeed: 50,
  vibrateIntensity: 1,
  hue: 0,
  opacity: 100,
  // Effect-specific nested objects
  vibration: { jitterMode: 'random', ... },
  glitch: { glitchIntensity: 10, ... },
  wave: { waveAmplitude: 20, ... },
  // ... per-effect settings

  // Win98 mode state
  appMode: 'insert',
  win98: {
    format: 'portrait',
    bootComplete: true,
    openWindows: [],
    iconPositions: {},
    deletedIcons: [],
    folders: {},
    timeline: { visible: false, items: [] },
    // ... extensive win98 state
  }
}
```

**Key:** `videoLayers` (managed by videos store)
```javascript
{
  layers: [
    { id, name, src, blendMode, opacity, filters, transform, effects, playback, visible }
  ]
}
```

## Code Conventions

### Style Rules
- **Prettier:** Single quotes, 2 spaces, 100 char width, semicolons required
- **ESLint:** `plugin:vue/vue3-essential` + `eslint:recommended`
- **File naming:** Components PascalCase, composables camelCase with `use` prefix
- **NO COMMENTS** unless requested

### Component Structure Order
```vue
<template>
  <!-- Template -->
</template>

<script>
// 1. Imports
// 2. export default { ... }
// 3. data()
// 4. computed
// 5. watch
// 6. lifecycle hooks (mounted, unmounted, etc.)
// 7. methods
</script>

<style>
/* Styles (scoped or global) */
</style>
```

### Mixed API Usage
- **App.vue:** Options API
- **Effects:** Mix of Options and Composition API
- **New code:** Prefer Composition API
- **Stores:** Pinia Composition API

## Important Gotchas

1. **Large video file:** 50MB back.mp4 exists in both root and `src/assets/video/` (redundant, can clean up root copy)
2. **Unused composables:** `useControls.js`, `useAnimation.js` exist but aren't imported (consider removing)
3. **Path aliases:** `@/` alias points to `src/`
4. **Effect state initialization:** Each effect has nested config in settings store - MUST initialize defaults in `settings.js` before using
5. **Interval cleanup:** ALWAYS clear intervals/timeouts in `unmounted()` hook to prevent memory leaks
6. **localStorage timing:** Auto-persists via Pinia with 300ms debounce - changes outside app won't sync
7. **Asset references:** Use getWin98AssetPath() helper for win98 assets to handle BASE_URL correctly

## WebSocket Bridge (TouchDesigner Integration)

**Files:**
- `websocket-bridge.js` (Node.js server, forwards WebSocket → OSC)
- `src/services/websocket.js` (WebSocket client for browser)

**Architecture:**
```
Browser App → WebSocket (port 8080) → Node Bridge → OSC (port 9000) → TouchDesigner
```

**See:** `TOUCHDESIGNER_INTEGRATION.md` and `WEBSOCKET_SETUP.md` for detailed setup

## Deployment

**Automatic:** GitHub Actions deploys to GitHub Pages on push to `main` branch
- Workflow: `.github/workflows/deploy.yml`
- CI checks: `.github/workflows/ci.yml` (on PRs, does NOT deploy)

**Manual:** `npm run deploy` (builds + pushes to gh-pages branch)

**Live URL:** https://ampleyan.github.io/insert/

**See:** `DEPLOYMENT.md` for troubleshooting and rollback procedures

## Win98 Mode Features

Windows 98 desktop simulation with:
- **Draggable icons** with customizable sizes, positions, folders
- **Desktop zones** (drop zones for organizing icons)
- **Grid system** with snap-to-grid
- **Alignment guides** (edge alignment indicators)
- **Timeline** (schedule icon appearances)
- **Multiple formats** (square, portrait, landscape, reels)
- **Windows** (video players, notebook, settings)
- **Boot screen, BSOD, screensaver** animations

**Win98 Architecture:**
- All state in `settingsStore.win98`
- Icons/videos defined in `src/constants/win98.js`
- Main component: `src/components/Win98/Win98Desktop.vue`
- Assets copied by webpack to `dist/win98/`

## Best Practices

1. **Read before edit:** Always read files before modifying
2. **Test localStorage:** Check browser DevTools → Application tab
3. **Clean up animations:** Always clear intervals/listeners in unmounted()
4. **Understand data flow:** Props down (from stores), events up (@update)
5. **Check Pinia stores:** Verify state structure before accessing nested properties
6. **Asset paths:** Use helper functions for win98 assets (BASE_URL handling)
7. **Effect parameters:** Initialize defaults in settings.js before adding controls
