<template>
  <div class="stroke-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="stroke-text"
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
  name: 'StrokeText',
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
      const scaleX = this.settings.scaleX?.[index] || 1;
      const scaleY = this.settings.scaleY?.[index] || 1;
      const strokeSettings = this.settings.stroke || {};

      return {
        fontSize: `${fontSize}px`,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        transform: `scale(${scaleX}, ${scaleY})`,
        filter: `hue-rotate(${this.settings.hue}deg)`,
        '--stroke-width': `${strokeSettings.strokeWidth || 2}px`,
        '--stroke-color': strokeSettings.strokeColor || '#ffffff',
        '--fill-opacity': (strokeSettings.fillOpacity || 100) / 100,
        opacity: this.settings.opacity / 100,
      };
    },
  },
};
</script>

<style scoped>
.stroke-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.stroke-text {
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  color: transparent;
  -webkit-text-stroke: 2px var(--stroke-color);
  text-stroke: 2px var(--stroke-color);
}

.stroke-text::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  color: var(--stroke-color);
  -webkit-text-stroke: 2px var(--stroke-color);
  text-stroke: 2px var(--stroke-color);
  animation: stroke-fill 4s ease-in-out infinite;
  clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
}

@keyframes stroke-fill {
  0%,
  100% {
    clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
  }
  50% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

.stroke-text.draggable {
  transition: none;
}

.stroke-text.draggable:hover {
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

.stroke-text.draggable:hover .drag-handle {
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

.stroke-text.draggable:hover .resize-handle {
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

.stroke-text.draggable:hover .edit-icon {
  opacity: 1;
}

</style>
