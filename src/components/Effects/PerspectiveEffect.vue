<template>
  <div class="perspective-container">
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="perspective-text"
      :class="{ 'draggable': settings.dragMode, 'has-path': isPathEnabled(index) }"
      :style="[getTextStyle(index), getDraggableStyle(index), getPerspectiveStyle()]"
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
  </div>
</template>

<script>
import draggableTextMixin from '@/mixins/draggableTextMixin';
import textPathMixin from '@/mixins/textPathMixin';
import InlineTextEditor from '@/components/InlineTextEditor.vue';

export default {
  name: 'PerspectiveEffect',
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
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
    };
  },
  methods: {
    getTextStyle(index) {
      const fontSize = this.settings.fontSize?.[index] || 120;
      const letterSpacing = this.settings.letterSpacing?.[index] || 0;
      const perspectiveSettings = this.settings.perspective || {};

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        filter: `hue-rotate(${this.settings.hue}deg)`,
        perspective: `${perspectiveSettings.perspectiveDepth || 500}px`,
      };
    },
    getPerspectiveStyle() {
      const perspectiveSettings = this.settings.perspective || {};
      const sensitivity = (perspectiveSettings.tiltSensitivity || 50) / 100;
      const maxTiltX = perspectiveSettings.maxTiltX || 20;
      const maxTiltY = perspectiveSettings.maxTiltY || 20;

      const rotateX = (this.mouseY - 0.5) * maxTiltX * sensitivity * 2;
      const rotateY = (this.mouseX - 0.5) * -maxTiltY * sensitivity * 2;

      return {
        transform: `perspective(${perspectiveSettings.perspectiveDepth || 500}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
      };
    },
    updateMousePosition(event) {
      const rect = this.$el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.mouseX = x / rect.width;
      this.mouseY = y / rect.height;
    },
    handleMouseMove(event) {
      this.updateMousePosition(event);
      if (!this.settings.dragMode) return;
      if (this.resizing.active) {
        this.onResize(event, this.settings.fontSize);
      } else {
        this.onDrag(event, this.settings.margin, this.settings.marginTop, true);
      }
    },
    handleTouchMove(event) {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        this.updateMousePosition(touch);
      }
      if (!this.settings.dragMode) return;
      if (this.resizing.active) {
        this.onResize(event, this.settings.fontSize);
      } else {
        this.onDrag(event, this.settings.margin, this.settings.marginTop, true);
      }
    },
  },
};
</script>

<style scoped>
.perspective-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  overflow: hidden;
  perspective: 1000px;
  transform: translateZ(0);
}

.perspective-text {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
}

.perspective-text.draggable {
  transition: none;
}

.perspective-text.draggable:hover {
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

.perspective-text.draggable:hover .drag-handle {
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

.perspective-text.draggable:hover .resize-handle {
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

.perspective-text.draggable:hover .edit-icon {
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
