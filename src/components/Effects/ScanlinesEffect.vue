<template>
  <div class="scanlines-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="scanlines-text"
      :class="{ 'draggable': settings.dragMode, 'has-path': isPathEnabled(index) }"
      :style="[getTextStyle(index), getDraggableStyle(index)]"
      @mousedown="handleMouseDown($event, index)"
      @touchstart="handleTouchStart($event, index)"
      @contextmenu="handleContextMenu($event, index)"
      v-memo="[text, settings.fontSize[index], settings.color, settings.blendMode]"
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
        {{ text }}
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
    <div class="scanlines-overlay"></div>
    <div class="vhs-noise"></div>
  </div>
</template>

<script>
import draggableTextMixin from '@/mixins/draggableTextMixin';
import textPathMixin from '@/mixins/textPathMixin';
import InlineTextEditor from '@/components/InlineTextEditor.vue';

export default {
  name: 'ScanlinesEffect',
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
      const scanlinesSettings = this.settings.scanlines || {};

      return {
        fontSize: `${fontSize}px`,
        color: scanlinesSettings.vintageTint || this.settings.color,
        opacity: this.settings.opacity / 100,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        filter: `hue-rotate(${this.settings.hue}deg)`,
        '--scanline-intensity': (scanlinesSettings.scanlineIntensity || 50) / 100,
        '--scanline-count': scanlinesSettings.scanlineCount || 200,
        '--vhs-noise': (scanlinesSettings.vhsNoise || 30) / 100,
        '--chromatic-shift': `${scanlinesSettings.chromaticShift || 3}px`,
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
.scanlines-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  overflow: hidden;
  transform: translateZ(0);
}

.scanlines-text {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  will-change: transform;
  backface-visibility: hidden;
  white-space: nowrap;
  max-width: none;
  text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
}

.scanlines-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 1;
  animation: scanlines-move 8s linear infinite;
}

.vhs-noise {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="noise"><feTurbulence baseFrequency="0.9" numOctaves="4" /></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.05"/></svg>');
  pointer-events: none;
  z-index: 1;
  opacity: 0.3;
  animation: noise 0.2s infinite;
}

@keyframes scanlines-move {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(4px);
  }
}

@keyframes vhs-distort {
  0% {
    transform: skewX(0deg);
    text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
  }
  25% {
    transform: skewX(0.5deg);
    text-shadow: 3px 0 #ff0000, -3px 0 #00ffff;
  }
  50% {
    transform: skewX(-0.5deg);
    text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
  }
  75% {
    transform: skewX(0.3deg);
    text-shadow: 4px 0 #ff0000, -4px 0 #00ffff;
  }
  100% {
    transform: skewX(0deg);
    text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
  }
}

@keyframes noise {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.4; }
}

.scanlines-text.draggable {
  transition: none;
}

.scanlines-text.draggable:hover {
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

.scanlines-text.draggable:hover .drag-handle {
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

.scanlines-text.draggable:hover .resize-handle {
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

.scanlines-text.draggable:hover .edit-icon {
  opacity: 1;
}
</style>
