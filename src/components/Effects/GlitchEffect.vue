<template>
  <div class="glitch-container" @mousemove="onMouseMoveWithManipulation" @touchmove="onTouchMoveWithManipulation">
    <div v-if="keyboardModeLabel" class="keyboard-mode-indicator">
      {{ keyboardModeLabel }}
    </div>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="glitch-text"
      :class="{ 'draggable': settings.dragMode, 'has-path': isPathEnabled(index) }"
      :style="[getTextStyle(index), getDraggableStyle(index)]"
      @mousedown="handleMouseDown($event, index)"
      @touchstart="handleTouchStart($event, index)"
      @contextmenu="handleContextMenu($event, index)"
    >
      <span  class="drag-handle" v-if="settings.dragMode"        
         @mousedown="handleResizeStart($event, index,'y')"
        @touchstart="handleResizeStart($event, index,'y')">^</span>
      <span
        class="resize-handle"
        v-if="settings.dragMode"
        @mousedown="handleResizeStart($event, index)"
        @touchstart="handleResizeStart($event, index)"
      >◢</span>
      <span
        class="edit-icon"
        v-if="settings.dragMode"
         @mousedown="handleResizeStart($event, index,'x')"
        @click.stop="openInlineEditor(index, $event)"
      >✏</span>

      <template v-if="isPathEnabled(index)">
        <span
          v-for="(letterObj, letterIndex) in getLettersForLine(index)"
          :key="`letter-${letterIndex}`"
          class="path-letter glitch-letter-animated"
          :data-letter="letterObj.letter"
          :style="[getLetterPositionStyle(index, letterIndex, getTextStyle(index)), getLetterStyle(index, letterIndex)]"
        >
          {{ letterObj.letter }}
        </span>
      </template>

      <template v-else-if="settings.letterEditMode">
        <span
          v-for="(letter, letterIndex) in text.split('')"
          :key="`${index}-${letterIndex}`"
          class="glitch-letter glitch-letter-animated letter-selectable"
          :class="{ 'letter-selected': isLetterSelected(index, letterIndex) }"
          :data-letter="letter"
          :style="[getLetterStyle(index, letterIndex), applyLetterTransform({}, index, letterIndex)]"
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
        <span
          v-for="(letter, letterIndex) in text.split('')"
          :key="`${index}-${letterIndex}`"
          class="glitch-letter glitch-letter-animated"
          :data-letter="letter"
          :style="getLetterStyle(index, letterIndex)"
        >
          {{ letter }}
        </span>
      </template>
    </div>

    <InlineTextEditor
      :visible="inlineEditor.visible"
      :lineIndex="inlineEditor.lineIndex"
      :settings="settings"
      :position="inlineEditor.position"
      @update="$emit('update', $event)"
      @close="closeInlineEditor"
    />
  </div>
</template>

<script>
import { useTextAnimation } from '@/composables/useTextAnimation';
import draggableTextMixin from '@/mixins/draggableTextMixin';
import textPathMixin from '@/mixins/textPathMixin';
import letterManipulationMixin from '@/mixins/letterManipulationMixin';
import InlineTextEditor from '@/components/InlineTextEditor.vue';

export default {
  name: 'GlitchEffect',
  components: {
    InlineTextEditor,
  },
  mixins: [draggableTextMixin, textPathMixin, letterManipulationMixin],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      textLinesVar: this.settings.textLines,
      vibratingItems: {},
      animationInstance: null,
    };
  },
  watch: {
    'settings.textLines'(newValue) {
      this.textLinesVar = newValue;
    },
  },
  mounted() {
    const computed = () => this.settings;
    const textLinesVar = {
      get value() { return this.textLinesVar; },
      set value(val) { this.textLinesVar = val; }
    };

    const animation = useTextAnimation(
      { value: computed },
      textLinesVar
    );

    this.animationInstance = animation;
    this.vibratingItems = animation.vibratingItems;
    animation.startAnimation();
  },
  beforeUnmount() {
    if (this.animationInstance) {
      this.animationInstance.stopAnimation();
    }
  },
  methods: {
    getTextStyle(index) {
      const fontSize = this.settings.fontSize?.[index] || 120;
      const letterSpacing = this.settings.letterSpacing?.[index] || 0;
      const scaleX = this.settings.scaleX?.[index] || 1;
      const scaleY = this.settings.scaleY?.[index] || 1;
      const glitchSettings = this.settings.glitch || {};

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        transform: `scale(${scaleX}, ${scaleY})`,
        '--glitch-intensity': `${glitchSettings.glitchIntensity || 10}px`,
        '--glitch-speed': `${glitchSettings.glitchSpeed || 500}ms`,
        '--color-separation': `${glitchSettings.colorSeparation || 5}px`,
        filter: `hue-rotate(${this.settings.hue}deg)`,
      };
    },
    isLetterVibrating(lineIndex, letterIndex) {
      const key = `${lineIndex}-${letterIndex}`;
      return this.vibratingItems[key] || false;
    },
    getLetterStyle(lineIndex, letterIndex) {
      const isVibrating = this.isLetterVibrating(lineIndex, letterIndex);
      const randomRange = this.settings.vibrateIntensity || 5;

      if (isVibrating) {
        const randomX = (Math.random() - 0.5) * randomRange * 2;
        const randomY = (Math.random() - 0.5) * randomRange * 2;

        return {
          transform: `translate(${randomX}px, ${randomY}px)`,
        };
      }

      return {};
    },
  },
};
</script>

<style scoped>
.glitch-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

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

.glitch-text {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  will-change: transform, text-shadow;
  white-space: nowrap;
  max-width: none;
}

.glitch-text.has-path {
  position: relative;
  width: auto;
  height: 100vh;
}

.path-letter {
  display: inline-block;
  white-space: pre;
}

.glitch-letter {
  display: inline-block;
  margin-right: 10px;
}

.glitch-letter-animated {
  position: relative;
  animation: glitch-skew var(--glitch-speed) infinite;
}

.glitch-letter-animated::before,
.glitch-letter-animated::after {
  content: attr(data-letter);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-letter-animated::before {
  color: #ff0000;
  z-index: -1;
  animation: glitch-anim-1 calc(var(--glitch-speed) * 2) infinite linear alternate-reverse;
}

.glitch-letter-animated::after {
  color: #00ffff;
  z-index: -2;
  animation: glitch-anim-2 calc(var(--glitch-speed) * 2) infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
  20% {
    clip-path: inset(92% 0 1% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  40% {
    clip-path: inset(43% 0 1% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  60% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
  80% {
    clip-path: inset(54% 0 7% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(65% 0 15% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  20% {
    clip-path: inset(30% 0 40% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
  40% {
    clip-path: inset(10% 0 80% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
  60% {
    clip-path: inset(70% 0 15% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  80% {
    clip-path: inset(20% 0 50% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  100% {
    clip-path: inset(45% 0 30% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
}

@keyframes glitch-skew {
  0% {
    transform: skew(0deg);
  }
  10% {
    transform: skew(-2deg);
  }
  20% {
    transform: skew(2deg);
  }
  30% {
    transform: skew(-1deg);
  }
  40% {
    transform: skew(1deg);
  }
  50% {
    transform: skew(0deg);
  }
  60% {
    transform: skew(2deg);
  }
  70% {
    transform: skew(-2deg);
  }
  80% {
    transform: skew(1deg);
  }
  90% {
    transform: skew(-1deg);
  }
  100% {
    transform: skew(0deg);
  }
}

.glitch-text.draggable {
  transition: none;
}

.glitch-text.draggable:hover {
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
  pointer-events: none;
  color: white;
  z-index: 10;
    cursor: nwse-resize;
  color: white;
  pointer-events: all;
  z-index: 10;
}

.glitch-text.draggable:hover .drag-handle {
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

.glitch-text.draggable:hover .resize-handle {
  opacity: 1;
}

.edit-icon {
  position: absolute;
  top: -35px;
  right: -35px;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 14px;
  cursor: pointer;
  color: white;
  pointer-events: all;
  z-index: 10;
}

.glitch-text.draggable:hover .edit-icon {
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
