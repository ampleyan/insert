<template>
  <div class="liquid-container" @mousemove="onMouseMoveWithManipulation" @touchmove="onTouchMoveWithManipulation">
    <div v-if="keyboardModeLabel" class="keyboard-mode-indicator">
      {{ keyboardModeLabel }}
    </div>
    <svg width="0" height="0" style="position: absolute">
      <defs>
        <filter :id="`liquid-${uid}`">
          <feTurbulence type="fractalNoise" :baseFrequency="liquidFrequency" numOctaves="2" seed="0" result="turbulence1">
            <animate
              attributeName="seed"
              from="0"
              to="10000"
              :dur="`${liquidSpeed * 3}ms`"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feTurbulence type="fractalNoise" :baseFrequency="liquidFrequency" numOctaves="2" seed="5000" result="turbulence2">
            <animate
              attributeName="seed"
              from="5000"
              to="15000"
              :dur="`${liquidSpeed * 2}ms`"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feBlend in="turbulence1" in2="turbulence2" mode="multiply" result="blended" />
          <feDisplacementMap in="SourceGraphic" in2="blended" :scale="liquidScale" />
        </filter>
      </defs>
    </svg>
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

      <template v-else-if="settings.letterEditMode">
        <span
          v-for="(letter, letterIndex) in text.split('')"
          :key="`${index}-${letterIndex}`"
          :class="{
            'letter-selectable': settings.letterEditMode,
            'letter-selected': isLetterSelected(index, letterIndex)
          }"
          :style="applyLetterTransform({}, index, letterIndex)"
          @click.stop="handleLetterClick(index, letterIndex)"
        >
          {{ letter }}
          <div
            v-if="isLetterSelected(index, letterIndex)"
            class="letter-handles"
          >
            <button class="letter-handle scale-handle" @mousedown="handleManipulationStart($event, 'scale', index, letterIndex)" title="Scale">⤢</button>
            <button class="letter-handle rotate-handle" @mousedown="handleManipulationStart($event, 'rotate', index, letterIndex)" title="Rotate">↻</button>
            <button class="letter-handle skew-x-handle" @mousedown="handleManipulationStart($event, 'skewX', index, letterIndex)" title="Skew X">⇆</button>
            <button class="letter-handle skew-y-handle" @mousedown="handleManipulationStart($event, 'skewY', index, letterIndex)" title="Skew Y">⇅</button>
          </div>
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
import letterManipulationMixin from '@/mixins/letterManipulationMixin';
import InlineTextEditor from '@/components/InlineTextEditor.vue';

let uidCounter = 0;

export default {
  name: 'LiquidDistortion',
  components: {
    InlineTextEditor,
  },
  mixins: [draggableTextMixin, textPathMixin, letterManipulationMixin],
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
.keyboard-mode-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: #00ffff;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  z-index: 9999;
  pointer-events: none;
  border: 2px solid #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

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
  white-space: nowrap;
  max-width: none;
}

.liquid-text.has-path {
  position: relative;
  width: auto;
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

.letter-selectable {
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
}

.letter-selectable:hover {
  opacity: 0.8;
  outline: 1px dashed rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.letter-selected {
  outline: 2px solid rgba(0, 255, 255, 0.8) !important;
  outline-offset: 3px;
  background: rgba(0, 255, 255, 0.1);
}

.letter-handles {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.9);
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.letter-handle {
  min-width: 36px;
  min-height: 36px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.letter-handle:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(0, 255, 255, 0.8);
  transform: scale(1.1);
}

.letter-handle:active {
  transform: scale(0.95);
  background: rgba(0, 255, 255, 0.3);
}

.scale-handle { border-color: rgba(255, 100, 100, 0.5); }
.rotate-handle { border-color: rgba(100, 255, 100, 0.5); }
.skew-x-handle { border-color: rgba(100, 100, 255, 0.5); }
.skew-y-handle { border-color: rgba(255, 255, 100, 0.5); }
</style>
