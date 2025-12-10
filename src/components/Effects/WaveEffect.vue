<template>
  <div class="wave-container">
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
    <div
      v-for="(text, lineIndex) in settings.textLines"
      :key="lineIndex"
      class="wave-text"
      :class="{ 'draggable': settings.dragMode }"
      :style="[getLineStyle(lineIndex), getDraggableStyle(lineIndex)]"
      @mousedown="handleMouseDown($event, lineIndex)"
      @touchstart="handleTouchStart($event, lineIndex)"
      @contextmenu="handleContextMenu($event, lineIndex)"
    >
      <span class="drag-handle" v-if="settings.dragMode">⋮⋮</span>
      <span
        class="resize-handle"
        v-if="settings.dragMode"
        @mousedown="handleResizeStart($event, lineIndex)"
        @touchstart="handleResizeStart($event, lineIndex)"
      >◢</span>
      <span
        class="edit-icon"
        v-if="settings.dragMode"
        @click.stop="openInlineEditor(lineIndex, $event)"
      >✏</span>
      <span
        v-for="(letter, letterIndex) in text.split('')"
        :key="`${lineIndex}-${letterIndex}`"
        class="wave-letter"
        :style="getLetterStyle(lineIndex, letterIndex)"
      >
        {{ letter }}
      </span>
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
import InlineTextEditor from '@/components/InlineTextEditor.vue';

export default {
  name: 'WaveEffect',
  components: {
    InlineTextEditor,
  },
  mixins: [draggableTextMixin],
  emits: ['update'],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      time: 0,
      animationFrame: null,
    };
  },
  mounted() {
    this.startAnimation();
  },
  beforeUnmount() {
    this.stopAnimation();
  },
  methods: {
    startAnimation() {
      const animate = () => {
        const waveSettings = this.settings.wave || {};
        const speed = (waveSettings.waveSpeed || 2) * 0.025;
        this.time += speed;
        this.animationFrame = requestAnimationFrame(animate);
      };
      this.animationFrame = requestAnimationFrame(animate);
    },
    stopAnimation() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    },
    getLineStyle(index) {
      const letterSpacing = this.settings.letterSpacing?.[index] || 0;

      return {
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
      };
    },
    getLetterStyle(lineIndex, letterIndex) {
      const fontSize = this.settings.fontSize?.[lineIndex] || 120;
      const waveSettings = this.settings.wave || {};
      const frequency = waveSettings.waveFrequency || 1;
      const amplitude = waveSettings.waveAmplitude || 20;
      const phase = waveSettings.wavePhase || 0;
      const offset = letterIndex * 0.3;
      const y = Math.sin(this.time * frequency + offset + phase) * amplitude;

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        transform: `translateY(${y}px)`,
        filter: `hue-rotate(${this.settings.hue}deg) blur(${this.settings.blurAmount}px)`,
      };
    },
  },
};
</script>

<style scoped>
.wave-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.wave-text {
  position: relative;
  overflow: visible;
}

.wave-letter {
  font-weight: 900;
  display: inline-block;
  text-transform: uppercase;
  will-change: transform;
  transition: transform 0.1s ease-out;
}

.wave-text.draggable {
  transition: none;
}

.wave-text.draggable:hover {
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

.wave-text.draggable:hover .drag-handle {
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

.wave-text.draggable:hover .resize-handle {
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

.wave-text.draggable:hover .edit-icon {
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
