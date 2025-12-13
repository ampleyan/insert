<template>
  <div class="shatter-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="shatter-text"
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
      <span
        v-for="(char, charIndex) in text"
        :key="charIndex"
        class="shatter-fragment"
        :style="getFragmentStyle(charIndex)"
      >{{ char }}</span>
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
  name: 'ShatterEffect',
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
      const scaleX = this.settings.scaleX?.[index] || 1;
      const scaleY = this.settings.scaleY?.[index] || 1;

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        transform: `scale(${scaleX}, ${scaleY})`,
        filter: `hue-rotate(${this.settings.hue}deg)`,
      };
    },
    getFragmentStyle(index) {
      const shatterSettings = this.settings.shatter || {};
      const explosionForce = (shatterSettings.explosionForce || 50) / 10;
      const rotationSpeed = shatterSettings.rotationSpeed || 5;

      const randomX = (Math.sin(index * 12.9898) * 43758.5453123) % 1;
      const randomY = (Math.cos(index * 78.233) * 43758.5453123) % 1;
      const randomRotate = (Math.sin(index * 45.234) * 43758.5453123) % 1;

      const translateX = (randomX - 0.5) * explosionForce * 2;
      const translateY = (randomY - 0.5) * explosionForce * 2;
      const rotate = (randomRotate - 0.5) * rotationSpeed * 10;

      return {
        '--fragment-x': `${translateX}px`,
        '--fragment-y': `${translateY}px`,
        '--fragment-rotate': `${rotate}deg`,
        '--fragment-delay': `${index * 0.05 + (shatterSettings.shatterDelay || 0) / 1000}s`,
      };
    },
  },
};
</script>

<style scoped>
.shatter-container {
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

.shatter-text {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  display: flex;
  white-space: nowrap;
  max-width: none;
}

.shatter-fragment {
  display: inline-block;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  animation: shatter 2s ease-in-out infinite;
  animation-delay: var(--fragment-delay);
}

@keyframes shatter {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    filter: blur(0px);
  }
  50% {
    transform: translate(var(--fragment-x), var(--fragment-y)) rotate(var(--fragment-rotate));
    filter: blur(1px);
  }
}

.shatter-text.draggable {
  transition: none;
}

.shatter-text.draggable:hover {
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

.shatter-text.draggable:hover .drag-handle {
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

.shatter-text.draggable:hover .resize-handle {
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

.shatter-text.draggable:hover .edit-icon {
  opacity: 1;
}
</style>
