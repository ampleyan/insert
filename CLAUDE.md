# CLAUDE.md - AI Assistant Guide for Video Blend Text Effect Project

## Project Overview

**Project Name:** video-blend-text
**Type:** Vue.js 3 Single Page Application
**Purpose:** An interactive web application that creates customizable text effects with vibration/animation over a video background, featuring blend modes, color controls, and real-time adjustments.

**Key Features:**
- Video background with text overlay effects
- Real-time customizable blend modes (16 CSS blend modes)
- Text vibration and distortion effects
- Color controls (hue, opacity, custom colors)
- Animation controls (speed, intensity, blur, randomness)
- Backdrop filters (blur, brightness, contrast, saturation)
- Recording controls for capturing output
- YouTube audio integration
- Persistent settings via localStorage
- Keyboard shortcuts and UI controls
- Responsive design

## Technology Stack

- **Framework:** Vue.js 3 (Composition API and Options API)
- **Build Tool:** Vue CLI 5.0
- **Package Manager:** npm
- **Styling:** Plain CSS (no preprocessor)
- **State Management:** Vue reactivity + localStorage persistence
- **Deployment:** GitHub Pages (via gh-pages)
- **Code Quality:** ESLint + Prettier

## Repository Structure

```
/home/user/insert/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment workflow (empty)
├── public/
│   ├── index.html                  # HTML entry point
│   └── video/                      # Public video assets
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.css           # Global styles
│   │   │   ├── animation.css      # Animation-specific styles
│   │   │   └── controls.css       # Control panel styles
│   │   └── video/
│   │       └── back.mp4           # Default background video
│   ├── components/
│   │   ├── VideoBackground.vue    # Video background component
│   │   ├── ControlPanel/
│   │   │   ├── ControlPanel.vue   # Main control panel container
│   │   │   ├── BlendControls.vue  # Blend mode selection
│   │   │   ├── ColorControls.vue  # Color adjustments
│   │   │   ├── AnimationControls.vue # Animation parameters
│   │   │   ├── BackdropFilterControls.vue # Backdrop filters
│   │   │   └── RecordingControls.vue # Screen recording controls
│   │   └── Effects/
│   │       ├── TextVibration.vue  # Text vibration effect (primary)
│   │       ├── TextDistort.vue    # SVG-based distortion effect
│   │       └── TextGoo.vue        # Goo/blob effect (commented out)
│   ├── composables/
│   │   ├── useControls.js         # Control settings composable
│   │   └── useAnimation.js        # Animation logic composable
│   ├── mixins/
│   │   ├── controlsMixin.js       # Legacy controls mixin
│   │   └── animationMixin.js      # Legacy animation mixin
│   ├── constants/
│   │   └── blendModes.js          # Blend mode definitions
│   ├── App.vue                     # Root application component
│   └── main.js                     # Application entry point
├── css/
│   ├── VideoBlendTextApp.vue      # Standalone CSS component
│   └── mains.css                  # Standalone CSS file
├── package.json                    # Project dependencies & scripts
├── vue.config.js                   # Vue CLI configuration
├── babel.config.js                 # Babel configuration
├── .prettierrc.js                  # Prettier configuration
├── .editorconfig.js                # EditorConfig settings
├── .eslintgnore.js                 # ESLint ignore patterns
├── .eslintsrc.js                   # ESLint configuration
├── index.html                      # Root HTML file (duplicate)
├── insert.html                     # Alternative HTML entry
├── back.mp4                        # Root-level video (50MB)
└── README.md                       # Project documentation
```

## Architecture & Design Patterns

### Component Hierarchy

```
App.vue (root)
├── VideoBackground.vue
├── ControlPanel.vue
│   ├── BackdropFilterControls.vue
│   ├── BlendControls.vue
│   ├── ColorControls.vue
│   ├── AnimationControls.vue
│   └── RecordingControls.vue
└── Text Effects (conditional rendering)
    ├── TextVibration.vue (effectType === 'vibration')
    └── TextDistort.vue (effectType === 'goo')
```

### State Management

**Primary Pattern:** Centralized reactive state in App.vue with prop drilling

1. **Settings State** (`settings` object in App.vue):
   - Blend mode, effect type, colors, animation parameters
   - Text content, font sizes, margins, letter spacing
   - Backdrop filters
   - Persisted to localStorage as `appSettings`

2. **Application State** (App.vue data):
   - Control panel visibility
   - Video playback state
   - Audio settings
   - YouTube embed URLs
   - Persisted to localStorage as `appState`

3. **Event Flow:**
   - Child components emit events (`@update`, `@file-upload`, etc.)
   - Parent (App.vue) handles updates via methods
   - Settings object updated triggers localStorage watcher
   - Props flow down to child components

### Composables (Modern Pattern)

Located in `src/composables/`:
- `useControls.js`: Provides reactive control settings with Vue 3 Composition API
- `useAnimation.js`: Animation logic and timing controls

**Note:** Project currently uses both Options API (App.vue) and Composition API patterns (composables). Composables exist but aren't fully integrated into main App.vue.

### Mixins (Legacy Pattern)

Located in `src/mixins/`:
- `controlsMixin.js`: Control-related functionality
- `animationMixin.js`: Animation-related functionality

**Status:** Appear to be legacy code; current implementation doesn't import these mixins.

## Key Files Explained

### App.vue (src/App.vue)
**Role:** Root component, state management, event orchestration

**Critical Methods:**
- `onUpdate(val)`: Universal settings updater (lines 262-270)
- `resetToDefaults()`: Resets all settings and clears localStorage (lines 193-228)
- `toggleControls()`: Shows/hides control panel (lines 272-275)
- `handleDoubleClick()`, `handleKeyDown()`: Keyboard shortcuts (lines 276-285)
- `startAudio(url)`: YouTube audio integration (lines 241-246)

**Watchers:**
- Deep watch on `settings` → localStorage sync (lines 134-139)
- Individual watchers for audio/video URLs → state persistence

### ControlPanel.vue (src/components/ControlPanel/ControlPanel.vue)
**Role:** Main control interface with nested sub-controls

**Features:**
- Dynamic text line management (add/remove lines)
- Per-line font size, letter spacing, positioning
- Text type toggle (single line vs paragraph)
- Nested control components for blend, color, animation, backdrop

**Key Pattern:** All child controls emit `@update` events with partial settings objects

### TextVibration.vue (src/components/Effects/TextVibration.vue)
**Role:** Primary text effect using CSS transforms and animations

**Implementation:**
- Each text line rendered as separate div with individual animation
- Uses `setInterval` for continuous random position updates
- Applies CSS `mix-blend-mode` for visual effects
- Filters: hue-rotate, blur, opacity
- Supports both single-line and multi-line paragraph rendering

### Constants (src/constants/blendModes.js)
**Role:** Single source of truth for blend modes

```javascript
export const BLEND_MODES = [
  { value: 'normal', label: 'Normal' },
  { value: 'difference', label: 'Difference' }, // default
  // ... 14 more modes
];
```

## Development Workflow

### Setup & Installation

```bash
npm install
```

### Development Server

```bash
npm run serve
```
- Runs on port 8080
- Auto-opens browser
- Hot module replacement enabled

### Build for Production

```bash
npm run build
```
- Output: `dist/` directory
- publicPath configured for `/insert/` subdirectory (GitHub Pages)

### Deployment

```bash
npm run deploy
```
- Builds and deploys to GitHub Pages using `gh-pages` package
- Pushes `dist/` folder to `gh-pages` branch

### Code Quality

```bash
npm run lint           # Check for errors
npm run lint:fix       # Auto-fix linting issues
npm run format         # Format with Prettier
```

## Coding Conventions

### Style Guide

**Prettier Configuration** (.prettierrc.js):
- Semi-colons: required
- Quotes: single quotes
- Tab width: 2 spaces
- Trailing commas: ES5
- Print width: 100 characters
- Vue indent script and style: true

**ESLint Configuration** (package.json):
- Extends: `plugin:vue/vue3-essential`, `eslint:recommended`
- Parser: @babel/eslint-parser
- No custom rules defined

### File Naming

- **Components:** PascalCase (e.g., `VideoBackground.vue`, `ControlPanel.vue`)
- **Composables:** camelCase with `use` prefix (e.g., `useControls.js`)
- **Constants:** camelCase files (e.g., `blendModes.js`)
- **Styles:** kebab-case (e.g., `animation.css`, `controls.css`)

### Component Structure

**Recommended Order:**
1. Template
2. Script (imports → component definition → data → computed → watchers → lifecycle → methods)
3. Styles (scoped or global)

### State Updates

**Pattern:** Partial object updates via `onUpdate` method
```javascript
// Child component emits
this.$emit('update', { blendMode: 'difference' });

// Parent handles
onUpdate(val) {
  Object.keys(val).forEach((key) => {
    if (key in val) {
      this.settings[key] = val[key];
    }
  });
}
```

## Common Patterns & Idioms

### Adding New Control Parameters

1. **Add to default settings** (App.vue lines 79-108):
   ```javascript
   const defaultSettings = {
     // ... existing settings
     newParameter: defaultValue,
   };
   ```

2. **Add to resetToDefaults** (App.vue lines 196-216)

3. **Create/update control component** in `src/components/ControlPanel/`

4. **Emit update event:**
   ```vue
   <input @input="$emit('update', { newParameter: value })" />
   ```

5. **Use in effect component** via `props.settings.newParameter`

### Adding New Text Effect

1. **Create component** in `src/components/Effects/NewEffect.vue`

2. **Import in App.vue:**
   ```javascript
   import NewEffect from './components/Effects/NewEffect.vue';
   ```

3. **Register in components:**
   ```javascript
   components: { VideoBackground, ControlPanel, NewEffect }
   ```

4. **Add conditional rendering:**
   ```vue
   <NewEffect v-if="settings.effectType === 'new'" :settings="settings" />
   ```

5. **Update effect selector** in ControlPanel.vue

### Video File Handling

**Configuration:** vue.config.js uses CopyWebpackPlugin
- Source: `src/assets/video/`
- Destination: `dist/assets/video/`
- Files are copied, not processed by webpack

**Note:** Large video file (back.mp4, 50MB) exists in both root and src/assets/video/

## localStorage Schema

### appSettings (settings object)
```javascript
{
  blendMode: string,           // CSS blend mode
  effectType: string,          // 'vibration' | 'goo'
  hue: number,                 // 0-360 degrees
  color: string,               // Hex color
  opacity: number,             // 0-100
  vibrateSpeed: number,        // Animation speed
  vibrateIntensity: number,    // Movement range
  blurAmount: number,          // Blur filter px
  intervalSpeed: number,       // Animation interval ms
  textLines: string[],         // Array of text content
  fontSize: number[],          // Per-line font sizes
  margin: number[],            // Horizontal positions
  marginTop: number[],         // Vertical positions
  letterSpacing: number[],     // Per-line letter spacing
  globalRandomAmount: number,  // Global randomness
  randomAmount: number[],      // Per-line randomness
  backdropBlur: number,        // Backdrop filter blur
  backdropBrightness: number,  // Backdrop brightness %
  backdropContrast: number,    // Backdrop contrast %
  backdropSaturate: number     // Backdrop saturation %
}
```

### appState (application state)
```javascript
{
  audioSrc: string,            // Audio source URL/blob
  isAudioMuted: boolean,
  youtubeEmbedUrl: string,     // Embedded YouTube URL
  isControlsHidden: boolean,
  isPlaying: boolean,          // Video playing state
  isMute: boolean,             // Video mute state
  inputUrl: string             // Video URL input
}
```

## Git Workflow

### Branching Strategy

- **Current Branch:** `claude/claude-md-mikotfw31nv7nv2k-01GPdq4pVstJPcsTfT7mxa2j`
- **Pattern:** Feature branches prefixed with `claude/` + session identifier
- **Main Branch:** Not explicitly defined in git config

### Commit Practices

1. Use descriptive commit messages (see git log):
   - "paragraphs" (recent feature additions)
   - "letter spacing" (UI improvements)
   - "margins" (layout adjustments)
   - "blur, recording, and more" (multi-feature commits)

2. Keep commits focused but practical (can combine related changes)

3. Never commit to main directly; use feature branches

### Push Requirements

- Must push to branches starting with `claude/`
- Branch name must match session ID
- Use: `git push -u origin <branch-name>`
- Retry with exponential backoff on network failures

## Important Notes for AI Assistants

### Before Making Changes

1. **Read existing files first** - Never propose changes to code you haven't read
2. **Check current state** - Settings may be persisted in localStorage
3. **Understand data flow** - Parent (App.vue) → Props → Children → Emit → Parent
4. **Review recent commits** - Check git log to understand recent changes

### Common Tasks

#### Modifying Text Effect Behavior
- Primary component: `src/components/Effects/TextVibration.vue`
- Settings flow from App.vue via props
- Animation logic uses setInterval pattern
- CSS transforms applied dynamically

#### Adding New Controls
- Create component in `src/components/ControlPanel/`
- Follow existing pattern: emit `@update` with partial settings
- Add default values to App.vue
- Update ControlPanel.vue to include new component

#### Styling Changes
- Global styles: `src/assets/styles/main.css`
- Control-specific: `src/assets/styles/controls.css`
- Animation-specific: `src/assets/styles/animation.css`
- Component styles: Use scoped `<style>` blocks

#### Video/Audio Integration
- Video upload: handled via `@file-upload` event
- URL input: handled via `@url-input` event
- YouTube: extracts video ID and creates embed URL
- File handling: creates blob URLs for local files

### Performance Considerations

1. **Animation intervals** - Each text line has independent setInterval
2. **Large video file** - 50MB back.mp4 should be optimized for production
3. **localStorage writes** - Deep watcher triggers on every settings change
4. **DOM updates** - Text positions update continuously during animation

### Security Notes

- User-uploaded videos create blob URLs (safe)
- YouTube embeds use standard iframe (safe)
- No external API calls or data transmission
- localStorage only (client-side persistence)

### Known Issues & Quirks

1. **Duplicate video files** - back.mp4 exists in root and src/assets/video/
2. **Config file naming** - `.eslintgnore.js` and `.eslintsrc.js` are unusual (typically `.eslintignore` and `.eslintrc.js`)
3. **Unused composables** - useControls and useAnimation exist but aren't imported in App.vue
4. **Empty workflow** - .github/workflows/deploy.yml is empty (deployment via npm script instead)
5. **Mixed patterns** - Both Options API and Composition API code present
6. **TextGoo component** - Exists but commented out in App.vue

### Testing Strategy

**Current State:** No test files present

**Recommendations for adding tests:**
- Unit tests: Component behavior (Vue Test Utils)
- Integration tests: Settings persistence, event handling
- E2E tests: User interactions, control panel operations

### Browser Compatibility

**Target Browsers** (from package.json browserslist):
- \> 1% market share
- Last 2 versions
- Not dead
- Not IE 11

**Key Dependencies:**
- Vue 3 features (Composition API, Teleport potential)
- CSS blend modes (widely supported in modern browsers)
- CSS backdrop-filter (may need -webkit- prefix)

### Deployment Configuration

**Production Build:**
- publicPath: `/insert/` (GitHub Pages subdirectory)
- Webpack copies video files to dist/assets/video/
- Uses gh-pages package for deployment

**Important:** When modifying vue.config.js, ensure video copying remains functional.

## Quick Reference Commands

```bash
# Development
npm install                    # Install dependencies
npm run serve                  # Start dev server (port 8080)

# Code Quality
npm run lint                   # Check linting
npm run lint:fix              # Auto-fix lint issues
npm run format                # Format code with Prettier

# Production
npm run build                 # Build for production
npm run deploy                # Build + deploy to GitHub Pages

# Git (on feature branch)
git status                    # Check status
git add .                     # Stage changes
git commit -m "message"       # Commit with message
git push -u origin claude/... # Push to feature branch
```

## Related Documentation

- **Vue.js 3:** https://vuejs.org/guide/
- **Vue CLI:** https://cli.vuejs.org/
- **CSS Blend Modes:** https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
- **CSS Backdrop Filter:** https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter

---

**Last Updated:** 2025-11-29
**Repository:** /home/user/insert
**Current Branch:** claude/claude-md-mikotfw31nv7nv2k-01GPdq4pVstJPcsTfT7mxa2j
