<template>
  <div class="glitch-container">
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="glitch-text"
      :class="{ 'draggable': settings.dragMode, 'has-path': isPathEnabled(index) }"
      :data-text="text"
      :style="[getTextStyle(index), getDraggableStyle(index)]"
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

      <template v-if="isPathEnabled(index)">
        <span
          v-for="(letterObj, letterIndex) in getLettersForLine(index)"
          :key="`letter-${letterIndex}`"
          class="path-letter"
          :style="getLetterPositionStyle(index, letterIndex, getTextStyle(index))"
        >
          {{ letterObj.letter }}
        </span>
      </template>

      <template v-else>
        <span
          v-for="(letter, letterIndex) in text.split('')"
          :key="`${index}-${letterIndex}`"
          class="glitch-letter"
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
import draggableTextMixin from '@/mixins/draggableTextMixin';
import textPathMixin from '@/mixins/textPathMixin';
import InlineTextEditor from '@/components/InlineTextEditor.vue';

export default {
  name: 'GlitchEffect',
  components: {
    InlineTextEditor,
  },
  mixins: [draggableTextMixin, textPathMixin],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getTextStyle(index) {
      const fontSize = this.settings.fontSize?.[index] || 120;
      const letterSpacing = this.settings.letterSpacing?.[index] || 0;
      const glitchSettings = this.settings.glitch || {};

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        '--glitch-intensity': `${glitchSettings.glitchIntensity || 10}px`,
        '--glitch-speed': `${glitchSettings.glitchSpeed || 500}ms`,
        '--color-separation': `${glitchSettings.colorSeparation || 5}px`,
        filter: `hue-rotate(${this.settings.hue}deg)`,
      };
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

.glitch-text {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  animation: glitch-skew var(--glitch-speed) infinite;
  will-change: transform, text-shadow;
}

.glitch-text.has-path {
  position: relative;
  width: 100vw;
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

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  color: #ff0000;
  z-index: -1;
  animation: glitch-anim-1 calc(var(--glitch-speed) * 2) infinite linear alternate-reverse;
}

.glitch-text::after {
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
  cursor: grab;
  pointer-events: none;
  color: white;
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
</style>
