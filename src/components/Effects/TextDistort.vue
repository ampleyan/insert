<template>
  <div class="vibration-demo" @mousemove="handleMouseMove" @touchmove="handleTouchMove" @mousemove.capture="onMouseMoveWithManipulation" @touchmove.capture="onTouchMoveWithManipulation">
    <div v-if="keyboardModeLabel" class="keyboard-mode-indicator">
      {{ keyboardModeLabel }}
    </div>
    <h1
      v-for="(text, index) in textLinesVar"
      :key="index"
      class="distort-text"
      :class="{ 'draggable': settings.dragMode, 'has-path': isPathEnabled(index) }"
      :style="[rootStyles, getTextStyle(index), getDraggableStyle(index)]"
      contenteditable
      :data-heading="`${text}`"
      @mousedown="handleMouseDown($event, index)"
      @touchstart="handleTouchStart($event, index)"
    >
      <span class="drag-handle" v-if="settings.dragMode">⋮⋮</span>
      <span
        class="resize-handle"
        v-if="settings.dragMode"
        @mousedown="handleResizeStart($event, index)"
        @touchstart="handleResizeStart($event, index)"
      >◢</span>

      <template v-if="isPathEnabled(index)">
        <span
          v-for="(letterObj, letterIndex) in getLettersForLine(index)"
          :key="`letter-${letterIndex}`"
          class="path-letter"
          :style="getLetterPositionStyle(index, letterIndex)"
        >
          {{ letterObj.letter }}
        </span>
      </template>

      <template v-else-if="settings.letterEditMode">
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
    </h1>
  </div>
</template>

<script>
  import draggableTextMixin from '@/mixins/draggableTextMixin';
  import textPathMixin from '@/mixins/textPathMixin';
  import letterManipulationMixin from '@/mixins/letterManipulationMixin';

  export default {
    name: 'TextDistort',
    mixins: [draggableTextMixin, textPathMixin, letterManipulationMixin],
    emits: ['update'],
    props: {
      settings: {
        type: Object,
        required: true,
      },
    },
    computed: {
      rootStyles() {
        const gooSettings = this.settings.goo || {};
        return {
          '--translate-x': `${gooSettings.gooAmount || 20}px`,
          '--translate-y': `${gooSettings.gooAmount || 20}px`,
          '--vibrate-speed': `${1000 / (gooSettings.morphSpeed || 1)}ms`,
          '--turbulence-intensity': gooSettings.turbulenceIntensity || 30,
        };
      },
    },
    data() {
      return {
        textLinesVar: this.settings.textLines,
      };
    },
    watch: {
      'settings.textLines'(newValue) {
        this.textLinesVar = newValue;
      },
    },
    methods: {
      getTextStyle(index) {
        const fontSize = this.settings.fontSize?.[index] || 120;
        const letterSpacing = this.settings.letterSpacing?.[index] || 0;

        return {
          fontSize: `${fontSize}px`,
          color: this.settings.color,
          opacity: this.settings.opacity / 100,
          letterSpacing: `${letterSpacing}px`,
          mixBlendMode: this.settings.blendMode,
          filter: `hue-rotate(${this.settings.hue}deg)`,
        };
      },
      getDraggableStyle(index) {
        const scaleX = this.settings.scaleX?.[index] || 1;
        const scaleY = this.settings.scaleY?.[index] || 1;

        if (this.settings.dragMode) {
          return {
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${this.settings.margin[index]}px), calc(-50% + ${
              this.settings.marginTop[index]
            }px)) scale(${scaleX}, ${scaleY})`,
            cursor: 'grab',
            userSelect: 'none',
          };
        } else {
          return {
            marginRight: `${this.settings.margin?.[index] || 0}px`,
            marginTop: `${this.settings.marginTop?.[index] || 0}px`,
            transform: `scale(${scaleX}, ${scaleY})`,
          };
        }
      },
    },
  };
</script>

<style scoped>
  .keyboard-mode-indicator {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: #00ffff;
    padding: 20px 40px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    z-index: 9999;
    pointer-events: none;
    border: 2px solid #00ffff;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.05);
    }
  }

  body {
    font-family: 'Roboto', sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vibration-demo {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
  }
  h1 {
    font-weight: 900;
    text-transform: uppercase;
    color: black;
    position: relative;
    background: linear-gradient(transparent 50%, #000 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    white-space: nowrap;
    max-width: none;

    &::after {
      content: attr(data-heading);
      position: absolute;
      left: 0;
      background: linear-gradient(#000 50%, transparent 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transform: translate(var(--translate-x), -2px);
      animation: fracture 5s infinite ease;
    }
  }

  h1.has-path {
    position: relative;
    width: auto;
    height: 100vh;

    &::after {
      display: none;
    }
  }

  .path-letter {
    display: inline-block;
    white-space: pre;
  }

  @keyframes fracture {
    0% {
      transform: translate(var(--translate-x), var(--translate-y));
    }
    50% {
      transform: translate(var(--translate-x), var(--translate-y));
    }
  }

  .distort-text.draggable {
    transition: none;
  }

  .distort-text.draggable:hover {
    outline: 2px dashed rgba(255, 255, 255, 0.3);
    outline-offset: 10px;
  }

  .drag-handle {
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    padding: 4px 8px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s;
    font-size: 12px;
    cursor: grab;
    pointer-events: none;
    color: white;
    z-index: 10;
  }

  .distort-text.draggable:hover .drag-handle {
    opacity: 1;
  }

  .resize-handle {
    position: absolute;
    bottom: -25px;
    right: -25px;
    background: rgba(0, 0, 0, 0.7);
    padding: 6px 8px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s;
    font-size: 16px;
    cursor: nwse-resize;
    color: white;
    pointer-events: all;
    z-index: 10;
  }

  .distort-text.draggable:hover .resize-handle {
    opacity: 1;
  }

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
</style>
