<template>
  <div class="neon-container" @mousemove="handleMouseMove" @touchmove="handleTouchMove">
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="neon-text"
      :class="{ 'draggable': settings.dragMode }"
      :style="[getTextStyle(index), getDraggableStyle(index)]"
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
      {{ text }}
    </div>
  </div>
</template>

<script>
import draggableTextMixin from '@/mixins/draggableTextMixin';

export default {
  name: 'NeonGlow',
  mixins: [draggableTextMixin],
  emits: ['update'],
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

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        filter: `hue-rotate(${this.settings.hue}deg)`,
        '--glow-intensity': `${this.settings.vibrateIntensity * 10}px`,
        '--pulse-speed': `${this.settings.vibrateSpeed * 10}ms`,
      };
    },
  },
};
</script>

<style scoped>
.neon-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background: #000;
}

.neon-text {
  font-weight: 900;
  text-transform: uppercase;
  animation: neon-pulse var(--pulse-speed) ease-in-out infinite;
  will-change: text-shadow;
}

@keyframes neon-pulse {
  0%,
  100% {
    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor,
      0 0 var(--glow-intensity) currentColor, 0 0 calc(var(--glow-intensity) * 2) currentColor;
  }
  50% {
    text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor,
      0 0 calc(var(--glow-intensity) * 0.5) currentColor,
      0 0 calc(var(--glow-intensity) * 1) currentColor;
  }
}

.neon-text.draggable {
  transition: none;
}

.neon-text.draggable:hover {
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

.neon-text.draggable:hover .drag-handle {
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

.neon-text.draggable:hover .resize-handle {
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
