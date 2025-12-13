<template>
  <div class="vibration-demo" @mousemove="handleMouseMove" @touchmove="handleTouchMove">
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
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
          :class="{ vibrate: isLetterVibrating(index, letterIndex) }"
          :style="getFullStyle(index, letterIndex, letter)"
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
import { useDraggable } from '@/composables/useDraggable';
import { useResizable } from '@/composables/useResizable';
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
      if (!props.settings.dragMode) return;
      if (resizing.value.active) {
        onResize(event, props.settings.fontSize);
      } else {
        onDrag(event, props.settings.margin, props.settings.marginTop, true);
      }
    };

    const handleTouchMove = (event) => {
      if (!props.settings.dragMode) return;
      if (resizing.value.active) {
        onResize(event, props.settings.fontSize);
      } else {
        onDrag(event, props.settings.margin, props.settings.marginTop, true);
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

    return {
      textLinesVar,
      vibratingItems,
      dragging,
      resizing,
      handleMouseDown,
      handleTouchStart,
      handleResizeStart,
      handleMouseMove,
      handleTouchMove,
      getDraggableStyle,
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

      const hue = `hue-rotate(${this.settings.hue}deg)`;
      const blur = isVibrating ? `blur(${this.settings.blurAmount}px)` : '';
      const glow = isVibrating
        ? `drop-shadow(0 0 ${this.settings.blurAmount * 1.5}px ${this.settings.color})`
        : '';
      const filter = [hue, blur, glow].filter(Boolean).join(' ');

      const scale = isVibrating ? 1.05 : 1;

      const baseStyle = {
        fontSize: `${fontSize}px`,
        fontFamily,
        fontWeight,
        fontStyle,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        filter,
        transform: `scale(${scale})`,
        transition: 'all 300ms ease',
        letterSpacing,
      };

      if (letter.trim() === '') {
        return baseStyle;
      }

      return this.getLetterPositionStyle(lineIndex, letterIndex, baseStyle);
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
.vibration.is-paragraph {
  text-align: left;
  max-width: 800px;
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

.position-guides {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.position-guide {
  position: fixed;
  pointer-events: none;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.position-guide.x-axis {
  width: 100%;
  height: 1px;
  top: 50%;
  left: 0;
}

.position-guide.y-axis {
  height: 100%;
  width: 1px;
  left: 50%;
  top: 0;
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
      scale(1.1);
  }
  16.66% {
    transform: translateX(calc(3 * var(--translate-x))) translateY(calc(-3 * var(--translate-y)))
      scale(0.95);
  }
  33.33% {
    transform: translateX(calc(-2 * var(--translate-x))) translateY(calc(4 * var(--translate-y)))
      scale(1.05);
  }
  50% {
    transform: translateX(calc(4 * var(--translate-x))) translateY(calc(-2 * var(--translate-y)))
      scale(0.9);
  }
  66.66% {
    transform: translateX(calc(-3 * var(--translate-x))) translateY(calc(3 * var(--translate-y)))
      scale(1.15);
  }
  83.33% {
    transform: translateX(calc(2 * var(--translate-x))) translateY(calc(-4 * var(--translate-y)))
      scale(0.92);
  }
  100% {
    transform: translateX(calc(-4 * var(--translate-x))) translateY(calc(2 * var(--translate-y)))
      scale(1.1);
  }
}
</style>
