# Copilot Instructions: Video Blend Text Effect

## Project Overview

**video-blend-text** is a Vue.js 3 web app that creates customizable text effects (15+ types) layered over video backgrounds with real-time blend modes, filters, and animations.

**Key Tech:** Vue 3 + Pinia (state), plain CSS, localStorage persistence, GitHub Pages deployment.

## Critical Architecture

### Data Flow
- **State Source:** Pinia stores (`src/stores/settings.js`, `src/stores/videos.js`)
- **App.vue** imports both stores and passes `settingsStore.$state` to components as props
- **Child components** emit `@update` events with partial settings objects
- **onUpdate() method** in App.vue merges emitted changes into the store
- **localStorage** auto-syncs via Pinia persist plugin

### Component Hierarchy
```
App.vue (orchestrator)
├── VideoBackground (renders video layers from videosStore)
├── ControlPanel (nested sub-controls, emits @update)
│   ├── TabContainer
│   ├── EffectSelector (dropdown with 15+ effects)
│   ├── EffectSpecificControls (dynamic controls per effect)
│   ├── BlendControls
│   ├── AnimationControls
│   ├── ColorControls
│   ├── BackdropFilterControls
│   ├── TextPathControls
│   └── RecordingControls
└── 15+ Effect Components (conditional render based on effectType)
    ├── TextVibration (default, CSS transforms + setInterval)
    ├── GlitchEffect, WaveEffect, ParticleBurst
    ├── Rotation3D, NeonGlow, LiquidDistortion
    ├── TypewriterEffect, ChromaticAberration, SplitText
    └── ...more
```

### State Management Pattern
1. **Settings Store** (`settings.js`): UI controls + text effect parameters (hue, opacity, animation speeds, etc.)
2. **Videos Store** (`videos.js`): Video layers array with blendMode, filters, transforms, effects per layer
3. **Both stores** persist to localStorage automatically
4. **No separate app state**—all data flows through Pinia

## Developer Workflows

### Local Development
```bash
npm install
npm run serve        # Starts on http://localhost:8080
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier (2 spaces, single quotes)
```

### Build & Deploy
```bash
npm run build        # Output: dist/ with publicPath="/insert/"
npm run deploy       # Build + push dist/ to gh-pages branch (GitHub Actions)
```

### Code Quality
- **ESLint:** `plugin:vue/vue3-essential` + `eslint:recommended`
- **Prettier:** Single quotes, 2-space indent, 100 char width, trailing commas ES5
- Both configured in package.json + root config files

## Key Files & Patterns

### Adding a New Effect
1. **Create component** in `src/components/Effects/MyEffect.vue`:
   ```vue
   <script>
   export default {
     props: { settings: Object },
     emits: ['update'],
   };
   </script>
   ```
2. **Import + register** in App.vue
3. **Add conditional render:**
   ```vue
   <MyEffect v-if="settingsStore.effectType === 'myeffect'" :settings="settingsStore.$state" @update="onUpdate" />
   ```
4. **Update effect list** in `EffectSelector.vue`
5. **Add effect-specific state** to `settings.js` if needed (e.g., `myeffect: { param1: value }`)

### Adding a New Control
1. **Create component** in `src/components/ControlPanel/`
2. **Emit pattern:**
   ```vue
   <input @input="$emit('update', { paramName: $event.target.value })" />
   ```
3. **Add default state** to `settings.js`
4. **Import in ControlPanel.vue** and add to template

### Accessing Settings in Effects
All effect components receive full settings via `props.settings`:
```javascript
props.settings.textLines      // Array of text strings
props.settings.fontSize       // Array of font sizes per line
props.settings.effectType     // Current effect name
props.settings.blendMode      // CSS blend mode
props.settings.hue            // Hue rotation 0-360
// + all other Pinia state properties
```

### localStorage Schema
**Key:** `settings` (auto-managed by Pinia)
```javascript
{
  blendMode: string,
  effectType: string,
  textLines: string[],
  fontSize: number[],
  margin: number[],           // horizontal position per line
  marginTop: number[],        // vertical position per line
  letterSpacing: number[],
  vibrateSpeed: number,       // animation interval ms
  vibrateIntensity: number,   // movement range
  blurAmount: number,
  hue: number, color: string, opacity: number,
  backdropBlur/Brightness/Contrast/Saturate: number,
  textPaths: object[],        // curved text path configs
  vibration/glitch/wave/particle/...: object  // per-effect settings
}

"videoLayers": {
  layers: [
    { id, name, src, blendMode, opacity, filters, transform, effects, playback, visible }
  ]
}
```

## Project-Specific Conventions

### File Organization
- **Components:** PascalCase (e.g., `TextVibration.vue`)
- **Composables:** camelCase with `use` prefix (e.g., `useAnimation.js`)
- **Stores:** Pinia defineStore in `src/stores/`
- **Constants:** `src/constants/blendModes.js` is single source of truth for CSS blend modes
- **Styles:** Global CSS in `src/assets/styles/` + scoped styles in components

### Animation Pattern
Most effects use **setInterval + CSS transforms**:
```javascript
export default {
  mounted() {
    this.animationId = setInterval(() => {
      this.updatePositions(); // reactive data triggers re-render
    }, this.settings.vibrateSpeed);
  },
  unmounted() {
    clearInterval(this.animationId);
  }
};
```

### Video Layers
- Default video: `src/assets/video/back.mp4` (50MB)
- Config: `vue.config.js` uses CopyWebpackPlugin to copy video to `dist/assets/video/`
- Production path: `/insert/video/back.mp4` (GitHub Pages subdirectory)
- Video upload creates blob URLs (handled in VideoLayer.vue)

## Important Gotchas & Known Issues

1. **Mixed API patterns:** Options API in App.vue + Composition API in effects. New code should use Composition API.
2. **Unused composables:** `useControls.js`, `useAnimation.js` exist but aren't imported in App.vue—consider consolidating into stores.
3. **Large video file:** 50MB back.mp4 exists in both root and `src/assets/video/` (should clean up root copy).
4. **Path awareness:** All imports need correct relative paths; `@/` alias points to `src/`.
5. **localStorage sync:** Pinia auto-persists, but localStorage is read on app init only—changes made outside the app won't sync.
6. **Effect-specific state:** Each effect has nested config object in store (e.g., `settings.wave`, `settings.glitch`)—must initialize defaults in `settings.js` before using.

## Testing Strategy

**Current:** No test files. Recommend:
- Unit tests (Vue Test Utils) for effects and controls
- Integration tests for settings persistence
- E2E tests (Playwright/Cypress) for user workflows

## Browser Support

Target: modern browsers (>1% market share, not IE 11)

Key requirements:
- CSS blend modes (widely supported)
- CSS backdrop-filter (may need -webkit- prefix)
- ES6+ and Vue 3 features

## Before Making Changes

1. **Always read the code first**—understand the current implementation
2. **Check Pinia stores**—state structure and persistence
3. **Understand data flow**—props down, events up through onUpdate()
4. **Test localStorage**—ensure persistence works (browser DevTools → Application tab)
5. **Watch for side effects**—animations create intervals that must be cleaned up
