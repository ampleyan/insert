<template>
  <div class="liquid-container">
    <svg width="0" height="0" style="position: absolute">
      <defs>
        <filter :id="`liquid-${uid}`">
          <feTurbulence type="fractalNoise" :baseFrequency="liquidFrequency" numOctaves="5">
            <animate
              attributeName="baseFrequency"
              :from="liquidFrequency"
              :to="animatedFrequency"
              :dur="`${liquidSpeed}ms`"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" :scale="liquidScale" />
        </filter>
      </defs>
    </svg>
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="liquid-text"
      :class="{ 'draggable': settings.dragMode, 'has-path': isPathEnabled(index) }"
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

let uidCounter = 0;

export default {
  name: 'LiquidDistortion',
  components: {
    InlineTextEditor,
  },
  mixins: [draggableTextMixin, textPathMixin],
  emits: ['update'],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uid: `uid-${uidCounter++}`,
      baseFrequency: '0.01 0.03',
      animatedFrequency: '0.03 0.01',
    };
  },
  computed: {
    liquidFrequency() {
      const liquidSettings = this.settings.liquid || {};
      const freq = liquidSettings.baseFrequency || 0.02;
      return `${freq} ${freq * 1.5}`;
    },
    liquidScale() {
      const liquidSettings = this.settings.liquid || {};
      return liquidSettings.turbulenceScale || 30;
    },
    liquidSpeed() {
      const liquidSettings = this.settings.liquid || {};
      return (liquidSettings.flowSpeed || 1) * 1000;
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
        filter: `url(#liquid-${this.uid}) hue-rotate(${this.settings.hue}deg)`,
      };
    },
  },
};
</script>

<style scoped>
.liquid-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.liquid-text {
  font-weight: 900;
  text-transform: uppercase;
  will-change: filter;
}

.liquid-text.has-path {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.path-letter {
  display: inline-block;
  white-space: pre;
}

.liquid-text.draggable {
  transition: none;
}

.liquid-text.draggable:hover {
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

.liquid-text.draggable:hover .drag-handle {
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

.liquid-text.draggable:hover .resize-handle {
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

.liquid-text.draggable:hover .edit-icon {
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
