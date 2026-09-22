# INSERT Identity and Poster Tool

## Goal

Turn INSERT from a general text-effects playground into a recognizable club-poster and motion-title tool. It should preserve the existing freeform letter manipulation and video compositing, while making the Instagram-facing identity repeatable through templates, brand presets, and export-safe layouts.

## Direction

Use the recommended `Xerox Heat` direction as the foundation: black and white editorial compositions, condensed or custom display lettering, acid accent colors, dense event metadata, and controlled blur, outline, photocopy, wet, and chromatic treatments. The existing Win98 interface remains a product-layer reference for the editor chrome, not the visual language of every exported design.

## Product Flow

1. Choose a format: Story, Reel, Feed Square, Feed Portrait, or Fullscreen.
2. Choose a template: Event Announcement, Lineup Reveal, Artist Spotlight, Date/Venue Card, or Animated Title.
3. Edit content in the canvas with the current drag, resize, per-letter manipulation, video, and image controls.
4. Apply a brand preset that controls typography, layout rhythm, texture, color, and motion together.
5. Review safe zones and export PNG, SVG, transparent WebM, or recorded video.

## Architecture

- `src/assets/styles/tokens.css` owns semantic typography, identity colors, spacing, and export-safe layout tokens.
- `src/assets/fonts/` stores the licensed display face in `.woff2`; the UI uses a stable neutral fallback stack.
- `src/constants/brandPresets.js` defines immutable preset metadata and settings patches.
- `src/stores/brand.js` owns the selected brand identity, preset, and user-saved presets.
- `src/components/BrandKit/` provides identity controls for display face, palette, texture, and motion signatures.
- `src/components/Templates/` provides template selection and applies composition presets without duplicating editor state.

Pinia remains the single source of truth. Templates and presets dispatch patches into the existing settings store; they do not maintain parallel typography or canvas state. Export formats continue to use the existing format boundary and export services.

## Initial Presets

- `Xerox Heat`: black/white, condensed display, rough outline, jitter, high contrast.
- `Wet Chrome`: reflective gradient, chromatic separation, slow distortion, tight tracking.
- `Acid Office`: fluorescent accent, mono metadata, grid alignment, sharp flicker.
- `Blackout Lineup`: oversized title, small mono lineup, strict safe-zone alignment.

## TouchDesigner Performance Layer

TouchDesigner should receive a compact, normalized control vocabulary through the existing WebSocket-to-OSC bridge. The browser remains the authoring surface; TouchDesigner provides live audio response, feedback, compositing, and output routing.

Recommended effect stacks:

- `Xerox Pulse`: Text TOP → Threshold TOP → Feedback TOP → Displace TOP → Composite. Drive threshold, displacement, feedback decay, and scale from kick and beat envelopes.
- `Wet Signal`: Text TOP → Blur TOP → Displace TOP → RGB Split / chromatic offsets → Bloom → Composite. Drive displacement and color separation from mid-frequency energy for liquid club visuals.
- `Office Panic`: Text TOP instances → Transform TOP → Scanline/Noise overlay → Feedback TOP. Trigger short position jumps, scanline intensity, and frame holds from OSC scene cues rather than continuous randomness.
- `Crowd Echo`: Duplicate the wordmark into delayed feedback layers with per-layer scale, rotation, and opacity decay. Use it for artist names and repeated lineup reveals.

Expose normalized channels such as `/insert/energy`, `/insert/beat`, `/insert/kick`, `/insert/scene`, `/insert/warp`, `/insert/feedback`, `/insert/chromatic`, and `/insert/seed`. Keep text, font, preset, and layout messages separate from high-rate animation channels so a dropped performance update cannot change content.

The useful live workflow is: select a template in INSERT, choose a performance preset, connect the bridge, map the normalized channels in TouchDesigner, and trigger scenes from MIDI, OSC, or audio analysis. Include a freeze/hold control and a maximum-feedback safeguard to prevent runaway loops.

## Acceptance Criteria

- A new user can create an event graphic without manually combining five separate effects.
- Presets change one shared settings model and remain editable after application.
- Typography has explicit display, UI, metadata, and numeric roles.
- Story, square, portrait, and fullscreen outputs preserve hierarchy and safe zones.
- Existing Insert and Win98 modes continue to load and existing exports remain available.
- TouchDesigner presets produce useful motion from audio without requiring manual parameter remapping for every project.
- High-rate animation data is isolated from content/settings data and includes a safe freeze state.

## Verification

Run `npm run lint` and `npm run build`. Manually verify each initial preset in Story, Square, and Portrait formats, including long event names, multi-line lineups, and mobile viewport controls. There is no configured automated test suite, so these browser checks are required for the first implementation phase.
