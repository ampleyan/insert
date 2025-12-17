<template>
  <div class="vibration-demo" @mousemove="handleMouseMove" @touchmove="handleTouchMove">
    <div v-if="keyboardModeLabel" class="keyboard-mode-indicator">
      {{ keyboardModeLabel }}
    </div>
    <div
      class="vibration"
      v-for="(text, index) in textLinesVar"
      :key="index"
      v-show="settings.textVisible?.[index] !== false"
      :style="[rootStyles, getDraggableStyle(index), getAnimationStyle(index)]"
      :class="[
        { 'is-paragraph': isParagraph(index), 'draggable': settings.dragMode, 'has-path': isPathEnabled(index) },
        getAnimationClass(index)
      ]"
      @mousedown="handleMouseDown($event, index)"
      @touchstart="handleTouchStart($event, index)"
      @contextmenu="handleContextMenu($event, index)"
    >
      <span class="drag-handle" v-if="settings.dragMode">⋮⋮</span>
      <span
        class="resize-handle"
        v-if="settings.dragMode"
        @mousedown="handleResizeStart($event, index)"
        @touchstart="handleResizeStart($event, index)"
      >◢</span>
      <span
        class="edit-icon"
        v-if="settings.dragMode"
        @click.stop="openInlineEditor(index, $event)"
      >✏</span>

      <template v-if="isParagraph(index)">
        <p
          v-for="(line, lineIndex) in splitIntoParagraphLines(text)"
          :key="`p-${index}-${lineIndex}`"
        >
          <span
            v-for="(word, wordIndex) in splitIntoWords(line)"
            :key="`${index}-${lineIndex}-${wordIndex}`"
            :class="{ vibrate: isWordVibrating(index, lineIndex, wordIndex) }"
            :style="getFullStyle(index, wordIndex)"
          >
            {{ word }}
          </span>
        </p>
      </template>

      <template v-else>
        <span
          v-for="(letter, letterIndex) in text.split('')"
          :key="`${index}-${letterIndex}`"
          :class="{
            vibrate: isLetterVibrating(index, letterIndex),
            'letter-selectable': settings.letterEditMode,
            'letter-selected': isLetterSelected(index, letterIndex)
          }"
          :style="getFullStyle(index, letterIndex, letter)"
          @click.stop="handleLetterClick(index, letterIndex)"
        >
          {{ letter }}
          <div
            v-if="isLetterSelected(index, letterIndex) && settings.letterEditMode"
            class="letter-handles"
          >
            <button
              class="letter-handle scale-handle"
              @mousedown="handleManipulationStart($event, 'scale', index, letterIndex)"
              @touchstart="handleManipulationStart($event, 'scale', index, letterIndex)"
              title="Scale"
            >⤢</button>
            <button
              class="letter-handle rotate-handle"
              @mousedown="handleManipulationStart($event, 'rotate', index, letterIndex)"
              @touchstart="handleManipulationStart($event, 'rotate', index, letterIndex)"
              title="Rotate"
            >↻</button>
            <button
              class="letter-handle skew-x-handle"
              @mousedown="handleManipulationStart($event, 'skewX', index, letterIndex)"
              @touchstart="handleManipulationStart($event, 'skewX', index, letterIndex)"
              title="Skew X"
            >⇆</button>
            <button
              class="letter-handle skew-y-handle"
              @mousedown="handleManipulationStart($event, 'skewY', index, letterIndex)"
              @touchstart="handleManipulationStart($event, 'skewY', index, letterIndex)"
              title="Skew Y"
            >⇅</button>
          </div>
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
import { useDraggable } from '@/composables/useDraggable';
import { useResizable } from '@/composables/useResizable';
import { useLetterManipulation } from '@/composables/useLetterManipulation';
import InlineTextEditor from '@/components/InlineTextEditor.vue';
import textPathMixin from '@/mixins/textPathMixin';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'TextVibration',
  components: {
    InlineTextEditor,
  },
  mixins: [textPathMixin],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  emits: ['update'],
  data() {
    return {
      inlineEditor: {
        visible: false,
        lineIndex: 0,
        position: { x: 0, y: 0 },
      },
    };
  },
  setup(props, { emit }) {
    const textLinesVar = ref(props.settings.textLines);

    const { vibratingItems, startAnimation, stopAnimation } = useTextAnimation(
      computed(() => props.settings),
      textLinesVar
    );

    const { dragging, startDrag, onDrag } = useDraggable(emit);
    const { resizing, startResize, onResize } = useResizable(emit);
    const {
      selectedLetter,
      manipulating,
      selectLetter,
      deselectLetter,
      isLetterSelected: checkLetterSelected,
      startManipulation,
      onManipulate,
      stopManipulation,
    } = useLetterManipulation(emit);

    watch(
      () => props.settings.textLines,
      (newValue) => {
        textLinesVar.value = newValue;
      }
    );

    onMounted(() => {
      startAnimation();
    });

    onBeforeUnmount(() => {
      stopAnimation();
    });

    const handleMouseDown = (event, index) => {
      if (!props.settings.dragMode) return;
      startDrag(event, index, props.settings.margin, props.settings.marginTop);
    };

    const handleTouchStart = (event, index) => {
      if (!props.settings.dragMode) return;
      startDrag(event, index, props.settings.margin, props.settings.marginTop);
    };

    const handleResizeStart = (event, index) => {
      if (!props.settings.dragMode) return;
      startResize(event, index, props.settings.fontSize);
    };

    const handleMouseMove = (event) => {
      if (manipulating.value.active) {
        onManipulate(event, props.settings.letterTransforms || [{}, {}, {}]);
      } else if (props.settings.dragMode) {
        if (resizing.value.active) {
          onResize(event, props.settings.fontSize);
        } else {
          onDrag(event, props.settings.margin, props.settings.marginTop, true);
        }
      }
    };

    const handleTouchMove = (event) => {
      if (manipulating.value.active) {
        onManipulate(event, props.settings.letterTransforms || [{}, {}, {}]);
      } else if (props.settings.dragMode) {
        if (resizing.value.active) {
          onResize(event, props.settings.fontSize);
        } else {
          onDrag(event, props.settings.margin, props.settings.marginTop, true);
        }
      }
    };

    const getDraggableStyle = (index) => {
      if (props.settings.dragMode) {
        let cursor = 'grab';
        if (dragging.value.active && dragging.value.index === index) {
          cursor = 'grabbing';
        } else if (resizing.value.active && resizing.value.index === index) {
          cursor = 'nwse-resize';
        }

        return {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${props.settings.margin[index]}px), calc(-50% + ${
            props.settings.marginTop[index]
          }px))`,
          cursor,
          userSelect: 'none',
        };
      } else {
        return {
          marginRight: `${props.settings.margin?.[index] || 0}px`,
          marginTop: `${props.settings.marginTop?.[index] || 0}px`,
        };
      }
    };

    onMounted(() => {
      window.addEventListener('mouseup', stopManipulation);
      window.addEventListener('touchend', stopManipulation);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('mouseup', stopManipulation);
      window.removeEventListener('touchend', stopManipulation);
    });

    return {
      textLinesVar,
      vibratingItems,
      dragging,
      resizing,
      selectedLetter,
      handleMouseDown,
      handleTouchStart,
      handleResizeStart,
      handleMouseMove,
      handleTouchMove,
      getDraggableStyle,
      selectLetter,
      deselectLetter,
      checkLetterSelected,
      startManipulation,
    };
  },
  computed: {
    rootStyles() {
      return {
        '--translate-x': `${this.settings.vibrateIntensity}px`,
        '--translate-y': `${this.settings.vibrateIntensity}px`,
        '--vibrate-speed': `${this.settings.vibrateSpeed}ms`,
        mixBlendMode: this.settings.blendMode,
      };
    },
    textLineFontSize() {
      return Array.isArray(this.settings.fontSize)
        ? this.settings.fontSize
        : this.settings.textLines.map(() => this.settings.fontSize);
    },
  },
  methods: {
    splitIntoWords(text) {
      return text.split(/(\s+)/).map((part) => {
        return part.trim() === '' ? ' ' : part;
      });
    },
    isWordVibrating(lineIndex, pLineIndex, wordIndex) {
      const key = `${lineIndex}-${pLineIndex}-${wordIndex}`;
      return this.vibratingItems[key] || false;
    },
    isParagraph(index) {
      return this.settings.textTypes?.[index] === 'paragraph';
    },
    splitIntoParagraphLines(text) {
      return text.split('\n').filter((line) => line.trim());
    },
    getFullStyle(lineIndex, letterIndex, letter = '') {
      const isVibrating = this.isLetterVibrating(lineIndex, letterIndex);
      const fontSize = this.textLineFontSize[lineIndex] || this.settings.fontSize;
      const letterSpacing = `${this.settings.letterSpacing?.[lineIndex] || 0}px`;
      const fontFamily = this.settings.fontFamily?.[lineIndex] || 'Arial';
      const fontWeight = this.settings.fontWeight?.[lineIndex] || '900';
      const fontStyle = this.settings.fontStyle?.[lineIndex] || 'normal';
      const scaleX = this.settings.scaleX?.[lineIndex] || 1;
      const scaleY = this.settings.scaleY?.[lineIndex] || 1;

      const letterTransforms = this.settings.letterTransforms || [{}, {}, {}];
      const letterTransform = letterTransforms[lineIndex]?.[letterIndex] || {
        scale: 1,
        rotate: 0,
        skewX: 0,
        skewY: 0,
      };

      const hue = `hue-rotate(${this.settings.hue}deg)`;
      const blur = isVibrating ? `blur(${this.settings.blurAmount}px)` : '';
      const glow = isVibrating
        ? `drop-shadow(0 0 ${this.settings.blurAmount * 1.5}px ${this.settings.color})`
        : '';
      const filter = [hue, blur, glow].filter(Boolean).join(' ');

      const vibrateScale = isVibrating ? 1.05 : 1;
      const finalScale = scaleX * scaleY * vibrateScale * letterTransform.scale;

      const baseStyle = {
        fontSize: `${fontSize}px`,
        fontFamily,
        fontWeight,
        fontStyle,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        filter,
        transform: `scale(${finalScale}) rotate(${letterTransform.rotate}deg) skew(${letterTransform.skewX}deg, ${letterTransform.skewY}deg)`,
        '--letter-scale': finalScale,
        '--letter-rotate': `${letterTransform.rotate}deg`,
        '--letter-skew-x': `${letterTransform.skewX}deg`,
        '--letter-skew-y': `${letterTransform.skewY}deg`,
        transition: 'all 300ms ease',
        letterSpacing,
        position: 'relative',
      };

      if (letter.trim() === '') {
        return baseStyle;
      }

      return this.getLetterPositionStyle(lineIndex, letterIndex, baseStyle);
    },
    handleLetterClick(lineIndex, letterIndex) {
      if (!this.settings.letterEditMode) return;
      if (this.checkLetterSelected(lineIndex, letterIndex)) {
        this.deselectLetter();
      } else {
        this.selectLetter(lineIndex, letterIndex);
      }
    },
    isLetterSelected(lineIndex, letterIndex) {
      return this.checkLetterSelected(lineIndex, letterIndex);
    },
    handleManipulationStart(event, type, lineIndex, letterIndex) {
      const letterTransforms = this.settings.letterTransforms || [{}, {}, {}];
      const letterTransform = letterTransforms[lineIndex]?.[letterIndex] || {
        scale: 1,
        rotate: 0,
        skewX: 0,
        skewY: 0,
      };
      this.startManipulation(event, type, letterTransform[type]);
    },
    openInlineEditor(lineIndex, event) {
      this.inlineEditor = {
        visible: true,
        lineIndex,
        position: {
          x: event.clientX,
          y: event.clientY,
        },
      };
    },
    closeInlineEditor() {
      this.inlineEditor.visible = false;
    },
    handleContextMenu(event, index) {
      if (this.settings.dragMode) {
        event.preventDefault();
        this.openInlineEditor(index, event);
      }
    },
    isLetterVibrating(lineIndex, letterIndex) {
      const key = `${lineIndex}-${letterIndex}`;
      return this.vibratingItems[key] || false;
    },
    getAnimationClass(index) {
      const animation = this.settings.textAnimations?.[index];
      if (!animation || animation.preset === 'none') {
        return '';
      }
      return `text-animation-${animation.preset}`;
    },
    getAnimationStyle(index) {
      const animation = this.settings.textAnimations?.[index];
      if (!animation || animation.preset === 'none') {
        return {};
      }

      const iterationCount = animation.loop ? 'infinite' : '1';

      return {
        '--animation-duration': `${animation.duration}ms`,
        '--animation-delay': `${animation.delay}ms`,
        '--animation-iteration': iterationCount,
        '--animation-timing': 'ease-out',
      };
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

.vibration.is-paragraph {
  text-align: left;
  max-width: none;
  margin: 0 auto;
}
.vibration.is-paragraph span {
  display: inline-block;
  margin-right: 0;
  padding: 0 2px;
}

.vibration.is-paragraph span.vibrate {
  animation: vibrate var(--vibrate-speed) linear infinite forwards;
}

.vibration.is-paragraph p {
  margin: 0.5em 0;
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

.vibration {
  position: relative;
  overflow: visible;
  transition: margin 0.3s ease;
}

.vibration.draggable {
  transition: none;
}

.vibration.draggable:hover {
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
}

.vibration.draggable:hover .drag-handle {
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

.vibration.draggable:hover .resize-handle {
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

.vibration.draggable:hover .edit-icon {
  opacity: 1;
}

.vibration.has-path span {
  display: inline-block;
}

.vibration {
  white-space: nowrap;
  max-width: none;
}

.vibration span {
  font-weight: 900;
  display: inline-block;
  margin-right: 10px;
  text-transform: uppercase;
  color: white;
  mix-blend-mode: difference;
  will-change: transform, filter;
  overflow: visible;
}

.vibration span.vibrate {
  animation: vibrate var(--vibrate-speed) linear infinite forwards;
}

@keyframes vibrate {
  0% {
    transform: translateX(calc(-4 * var(--translate-x))) translateY(calc(2 * var(--translate-y)))
      scale(calc(var(--letter-scale, 1) * 1.1)) rotate(var(--letter-rotate, 0deg)) skew(var(--letter-skew-x, 0deg), var(--letter-skew-y, 0deg));
  }
  16.66% {
    transform: translateX(calc(3 * var(--translate-x))) translateY(calc(-3 * var(--translate-y)))
      scale(calc(var(--letter-scale, 1) * 0.95)) rotate(var(--letter-rotate, 0deg)) skew(var(--letter-skew-x, 0deg), var(--letter-skew-y, 0deg));
  }
  33.33% {
    transform: translateX(calc(-2 * var(--translate-x))) translateY(calc(4 * var(--translate-y)))
      scale(calc(var(--letter-scale, 1) * 1.05)) rotate(var(--letter-rotate, 0deg)) skew(var(--letter-skew-x, 0deg), var(--letter-skew-y, 0deg));
  }
  50% {
    transform: translateX(calc(4 * var(--translate-x))) translateY(calc(-2 * var(--translate-y)))
      scale(calc(var(--letter-scale, 1) * 0.9)) rotate(var(--letter-rotate, 0deg)) skew(var(--letter-skew-x, 0deg), var(--letter-skew-y, 0deg));
  }
  66.66% {
    transform: translateX(calc(-3 * var(--translate-x))) translateY(calc(3 * var(--translate-y)))
      scale(calc(var(--letter-scale, 1) * 1.15)) rotate(var(--letter-rotate, 0deg)) skew(var(--letter-skew-x, 0deg), var(--letter-skew-y, 0deg));
  }
  83.33% {
    transform: translateX(calc(2 * var(--translate-x))) translateY(calc(-4 * var(--translate-y)))
      scale(calc(var(--letter-scale, 1) * 0.92)) rotate(var(--letter-rotate, 0deg)) skew(var(--letter-skew-x, 0deg), var(--letter-skew-y, 0deg));
  }
  100% {
    transform: translateX(calc(-4 * var(--translate-x))) translateY(calc(2 * var(--translate-y)))
      scale(calc(var(--letter-scale, 1) * 1.1)) rotate(var(--letter-rotate, 0deg)) skew(var(--letter-skew-x, 0deg), var(--letter-skew-y, 0deg));
  }
}

.letter-selectable {
  cursor: pointer;
  transition: all 0.2s ease;
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
  display: flex;
  align-items: center;
  justify-content: center;
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

.scale-handle {
  border-color: rgba(255, 100, 100, 0.5);
}

.rotate-handle {
  border-color: rgba(100, 255, 100, 0.5);
}

.skew-x-handle {
  border-color: rgba(100, 100, 255, 0.5);
}

.skew-y-handle {
  border-color: rgba(255, 255, 100, 0.5);
}
</style>
