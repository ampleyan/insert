<template>
  <div class="typewriter-container">
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="typewriter-text"
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
          v-for="(letterObj, letterIndex) in getLettersForLine(index).slice(0, visibleText[index].length)"
          :key="`letter-${letterIndex}`"
          class="path-letter"
          :style="getLetterPositionStyle(index, letterIndex, getTextStyle(index))"
        >
          {{ letterObj.letter }}
        </span>
        <span class="cursor path-cursor" v-if="isTyping[index]" :style="getLetterPositionStyle(index, visibleText[index].length, getTextStyle(index))">|</span>
      </template>

      <template v-else>
        {{ visibleText[index] }}<span class="cursor" v-if="isTyping[index]">|</span>
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
  name: 'TypewriterEffect',
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
      visibleText: [],
      isTyping: [],
      intervals: [],
    };
  },
  mounted() {
    this.startTyping();
  },
  beforeUnmount() {
    this.stopTyping();
  },
  watch: {
    'settings.textLines': {
      handler() {
        this.stopTyping();
        this.startTyping();
      },
      deep: true,
    },
  },
  methods: {
    startTyping() {
      const typewriterSettings = this.settings.typewriter || {};
      const typingSpeed = typewriterSettings.typingSpeed || 100;
      const initialDelay = typewriterSettings.initialDelay || 500;

      this.visibleText = this.settings.textLines.map(() => '');
      this.isTyping = this.settings.textLines.map(() => true);

      setTimeout(() => {
        this.settings.textLines.forEach((text, lineIndex) => {
          let charIndex = 0;
          const interval = setInterval(() => {
            if (charIndex < text.length) {
              this.visibleText[lineIndex] = text.slice(0, charIndex + 1);
              charIndex++;
            } else {
              this.isTyping[lineIndex] = false;
              clearInterval(interval);
              setTimeout(() => {
                charIndex = 0;
                this.visibleText[lineIndex] = '';
                this.isTyping[lineIndex] = true;
              }, 2000);
            }
          }, typingSpeed);

          this.intervals.push(interval);
        });
      }, initialDelay);
    },
    stopTyping() {
      this.intervals.forEach((interval) => clearInterval(interval));
      this.intervals = [];
    },
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
      };
    },
  },
};
</script>

<style scoped>
.typewriter-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.typewriter-text {
  font-weight: 900;
  text-transform: uppercase;
  white-space: nowrap;
}

.typewriter-text.has-path {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.path-letter {
  display: inline-block;
  white-space: pre;
}

.cursor.path-cursor {
  display: inline-block;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.typewriter-text.draggable {
  transition: none;
}

.typewriter-text.draggable:hover {
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

.typewriter-text.draggable:hover .drag-handle {
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

.typewriter-text.draggable:hover .resize-handle {
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

.typewriter-text.draggable:hover .edit-icon {
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
