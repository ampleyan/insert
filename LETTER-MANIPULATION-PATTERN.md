# Letter Manipulation Pattern

This document explains how to add letter manipulation to any text effect component.

## Components with Letter Manipulation

✓ **Completed:**
- TextVibration (vibration)
- GradientText (gradient)
- LiquidDistortion (liquid)
- TextDistort (goo)

⚠ **Remaining:** Use this pattern to add to:
- FlickerText (flicker)
- StrokeText (stroke)
- NeonGlow (neon)
- TypewriterEffect (typewriter)
- SplitText (split)
- ScanlinesEffect (scanlines)
- GlitchEffect (glitch)
- Any other text effects

## Pattern to Apply

### 1. Template Changes

Find the text rendering section and wrap it with letter edit mode logic:

```vue
<!-- BEFORE -->
<template>
  <div class="effect-text">
    {{ text }}
  </div>
</template>

<!-- AFTER -->
<template>
  <div class="effect-text">
    <template v-if="settings.letterEditMode">
      <span
        v-for="(letter, letterIndex) in text.split('')"
        :key="`${index}-${letterIndex}`"
        :class="{
          'letter-selectable': true,
          'letter-selected': isLetterSelected(index, letterIndex)
        }"
        :style="applyLetterTransform({}, index, letterIndex)"
        @click.stop="handleLetterClick(index, letterIndex)"
      >
        {{ letter }}
        <div v-if="isLetterSelected(index, letterIndex)" class="letter-handles">
          <button class="letter-handle scale-handle" @mousedown="handleManipulationStart($event, 'scale', index, letterIndex)">⤢</button>
          <button class="letter-handle rotate-handle" @mousedown="handleManipulationStart($event, 'rotate', index, letterIndex)">↻</button>
          <button class="letter-handle skew-x-handle" @mousedown="handleManipulationStart($event, 'skewX', index, letterIndex)">⇆</button>
          <button class="letter-handle skew-y-handle" @mousedown="handleManipulationStart($event, 'skewY', index, letterIndex)">⇅</button>
        </div>
      </span>
    </template>
    <template v-else>
      {{ text }}
    </template>
  </div>
</template>
```

### 2. Script Changes

Add the mixin import and include it:

```javascript
// Add import
import letterManipulationMixin from '@/mixins/letterManipulationMixin';

export default {
  name: 'YourEffect',
  mixins: [
    // ... existing mixins
    letterManipulationMixin  // Add this
  ],
  // ... rest of component
}
```

### 3. Style Changes

Add letter manipulation styles at the end of the `<style>` section:

```css
.letter-selectable {
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
}

.letter-selectable:hover {
  opacity: 0.8;
  outline: 1px dashed rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.letter-selected {
  outline: 2px solid rgba(0, 255, 255, 0.8) !important;
  outline-offset: 3px;
  background: rgba(0, 255, 255, 0.1);
}

.letter-handles {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.9);
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.letter-handle {
  min-width: 36px;
  min-height: 36px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.letter-handle:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(0, 255, 255, 0.8);
  transform: scale(1.1);
}

.letter-handle:active {
  transform: scale(0.95);
  background: rgba(0, 255, 255, 0.3);
}

.scale-handle { border-color: rgba(255, 100, 100, 0.5); }
.rotate-handle { border-color: rgba(100, 255, 100, 0.5); }
.skew-x-handle { border-color: rgba(100, 100, 255, 0.5); }
.skew-y-handle { border-color: rgba(255, 255, 100, 0.5); }
```

## Testing

After applying the pattern:

1. Run `npm run serve`
2. Select your effect from the effect selector
3. Enable "Letter Edit Mode" in Controls → Text tab
4. Click letters to select them
5. Use handles to manipulate: ⤢ (scale), ↻ (rotate), ⇆ (skew X), ⇅ (skew Y)

## Notes

- The mixin provides all necessary methods automatically
- Letter transforms persist in `settings.letterTransforms` array
- Works with any text effect that renders individual text lines
- Special handling may be needed for effects with complex animations
