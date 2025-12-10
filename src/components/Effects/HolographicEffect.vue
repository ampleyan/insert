<template>
  <div class="holographic-container">
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="holographic-text"
      :class="{ 'draggable': settings.dragMode }"
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
      <span class="holo-layer layer-1">{{ text }}</span>
      <span class="holo-layer layer-2">{{ text }}</span>
      <span class="holo-layer layer-3">{{ text }}</span>
      <span class="holo-layer layer-main">{{ text }}</span>
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
  name: 'HolographicEffect',
  components: {
    InlineTextEditor,
  },
  mixins: [draggableTextMixin],
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
      const holoSettings = this.settings.holographic || {};

      return {
        fontSize: `${fontSize}px`,
        letterSpacing: `${letterSpacing}px`,
        '--holo-hue': `${this.settings.hue}deg`,
        '--holo-opacity': (holoSettings.holoOpacity || 70) / 100,
        '--holo-shift': `${holoSettings.holoShift || 8}px`,
        '--holo-speed': `${holoSettings.holoSpeed || 2000}ms`,
        '--rainbow-intensity': (holoSettings.rainbowIntensity || 80) / 100,
      };
    },
  },
};
</script>

<style scoped>
.holographic-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background: #000;
  transform: translateZ(0);
}

.holographic-text {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.holo-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: var(--holo-opacity);
  mix-blend-mode: screen;
  animation: holo-shift 3s ease-in-out infinite;
}

.layer-1 {
  color: #ff00ff;
  filter: hue-rotate(calc(var(--holo-hue) + 0deg)) blur(1px);
  animation-delay: 0s;
}

.layer-2 {
  color: #00ffff;
  filter: hue-rotate(calc(var(--holo-hue) + 120deg)) blur(1px);
  animation-delay: 0.5s;
}

.layer-3 {
  color: #ffff00;
  filter: hue-rotate(calc(var(--holo-hue) + 240deg)) blur(1px);
  animation-delay: 1s;
}

.layer-main {
  color: #ffffff;
  position: relative;
  filter: hue-rotate(var(--holo-hue));
  mix-blend-mode: normal;
  z-index: 1;
}

@keyframes holo-shift {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: calc(var(--holo-opacity) * 0.6);
  }
  25% {
    transform: translate(calc(var(--holo-intensity) * 1px), calc(var(--holo-intensity) * -1px)) scale(1.01);
    opacity: calc(var(--holo-opacity) * 0.8);
  }
  50% {
    transform: translate(calc(var(--holo-intensity) * -1px), calc(var(--holo-intensity) * 1px)) scale(0.99);
    opacity: calc(var(--holo-opacity) * 0.7);
  }
  75% {
    transform: translate(calc(var(--holo-intensity) * 1px), calc(var(--holo-intensity) * 1px)) scale(1.01);
    opacity: calc(var(--holo-opacity) * 0.9);
  }
}

.holographic-text.draggable {
  transition: none;
}

.holographic-text.draggable:hover {
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

.holographic-text.draggable:hover .drag-handle {
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

.holographic-text.draggable:hover .resize-handle {
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

.holographic-text.draggable:hover .edit-icon {
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
