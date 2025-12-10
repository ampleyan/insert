<template>
  <div class="flicker-container">
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="flicker-text"
      :class="{ 'draggable': settings.dragMode }"
      :style="[getTextStyle(index), getDraggableStyle(index)]"
      :data-text="text"
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
      {{ text }}
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
  name: 'FlickerText',
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
  methods: {
    getTextStyle(index) {
      const fontSize = this.settings.fontSize?.[index] || 120;
      const letterSpacing = this.settings.letterSpacing?.[index] || 0;
      const flickerSettings = this.settings.flicker || {};

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        filter: `hue-rotate(${this.settings.hue}deg)`,
        '--flicker-speed': `${flickerSettings.flickerSpeed || 200}ms`,
        '--min-opacity': (flickerSettings.minOpacity || 30) / 100,
        '--max-opacity': (flickerSettings.maxOpacity || 100) / 100,
      };
    },
  },
};
</script>

<style scoped>
.flicker-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.flicker-text {
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  animation: flicker 3s linear infinite;
  text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
}

.flicker-text::before,
.flicker-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
}

.flicker-text::before {
  animation: glitch-1 0.3s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-2px, -2px);
}

.flicker-text::after {
  animation: glitch-2 0.3s infinite;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  transform: translate(2px, 2px);
}

@keyframes flicker {
  0%,
  19%,
  21%,
  23%,
  25%,
  54%,
  56%,
  100% {
    opacity: 1;
    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
  }
  20%,
  24%,
  55% {
    opacity: 0.4;
    text-shadow: none;
  }
}

@keyframes glitch-1 {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-5px, 2px);
  }
  40% {
    transform: translate(-5px, -2px);
  }
  60% {
    transform: translate(5px, 2px);
  }
  80% {
    transform: translate(5px, -2px);
  }
}

@keyframes glitch-2 {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(5px, -2px);
  }
  40% {
    transform: translate(5px, 2px);
  }
  60% {
    transform: translate(-5px, -2px);
  }
  80% {
    transform: translate(-5px, 2px);
  }
}

.flicker-text.draggable {
  transition: none;
}

.flicker-text.draggable:hover {
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

.flicker-text.draggable:hover .drag-handle {
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

.flicker-text.draggable:hover .resize-handle {
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

.flicker-text.draggable:hover .edit-icon {
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
