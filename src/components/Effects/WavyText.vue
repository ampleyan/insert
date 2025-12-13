<template>
  <div class="wavy-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="wavy-text"
      :class="{ 'draggable': settings.dragMode }"
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
      <span
        v-for="(letter, letterIndex) in text.split('')"
        :key="`${index}-${letterIndex}`"
        class="wavy-letter"
        :style="getLetterStyle(letterIndex)"
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
  name: 'WavyText',
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
      const wavySettings = this.settings.wavy || {};

      return {
        fontSize: `${fontSize}px`,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        transform: `scale(${scaleX}, ${scaleY})`,
        filter: `hue-rotate(${this.settings.hue}deg)`,
        '--wave-height': `${wavySettings.waveHeight || 20}px`,
        '--wave-speed': `${wavySettings.waveSpeed || 2}s`,
      };
    },
    getLetterStyle(index) {
      const wavySettings = this.settings.wavy || {};
      const delay = index * ((wavySettings.waveDelay || 50) / 1000);
      return {
        animationDelay: `${delay}s`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
      };
    },
  },
};
</script>

<style scoped>
.wavy-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.wavy-text {
  font-weight: 900;
  text-transform: uppercase;
  white-space: nowrap;
  max-width: none;
}

.wavy-letter {
  display: inline-block;
  animation: wavy var(--wave-speed, 2s) ease-in-out infinite;
}

@keyframes wavy {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(calc(-1 * var(--wave-height, 20px)));
  }
}

.wavy-text.draggable {
  transition: none;
}

.wavy-text.draggable:hover {
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

.wavy-text.draggable:hover .drag-handle {
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

.wavy-text.draggable:hover .resize-handle {
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

.wavy-text.draggable:hover .edit-icon {
  opacity: 1;
}

</style>
