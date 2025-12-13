<template>
  <div class="vibration-demo" @mousemove="handleMouseMove" @touchmove="handleTouchMove">
    <h1
      v-for="(text, index) in textLinesVar"
      :key="index"
      class="distort-text"
      :class="{ 'draggable': settings.dragMode, 'has-path': isPathEnabled(index) }"
      :style="[rootStyles, getDraggableStyle(index)]"
      contenteditable
      :data-heading="`${text}`"
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

      <template v-if="isPathEnabled(index)">
        <span
          v-for="(letterObj, letterIndex) in getLettersForLine(index)"
          :key="`letter-${letterIndex}`"
          class="path-letter"
          :style="getLetterPositionStyle(index, letterIndex)"
        >
          {{ letterObj.letter }}
        </span>
      </template>

      <template v-else>
        {{ text }}
      </template>
    </h1>
  </div>
</template>

<script>
  import draggableTextMixin from '@/mixins/draggableTextMixin';
  import textPathMixin from '@/mixins/textPathMixin';

  export default {
    name: 'TextDistort',
    mixins: [draggableTextMixin, textPathMixin],
    emits: ['update'],
    props: {
      settings: {
        type: Object,
        required: true,
      },
    },
    computed: {
      rootStyles() {
        const distortSettings = this.settings.distort || {};
        return {
          '--translate-x': `${distortSettings.distortAmount || 20}px`,
          '--translate-y': `${distortSettings.distortAmount || 20}px`,
          '--vibrate-speed': `${1000 / (distortSettings.morphSpeed || 1)}ms`,
          '--turbulence-intensity': distortSettings.turbulenceIntensity || 30,
        };
      },
    },
    data() {
      return {
        textLinesVar: this.settings.textLines,
      };
    },
    watch: {
      'settings.textLines'(newValue) {
        this.textLinesVar = newValue;
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
    },
  };
</script>

<style scoped>
  body {
    font-family: 'Roboto', sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vibration-demo {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
  }
  h1 {
    font-weight: 900;
    text-transform: uppercase;
    color: black;
    position: relative;
    background: linear-gradient(transparent 50%, #000 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    white-space: nowrap;
    max-width: none;

    &::after {
      content: attr(data-heading);
      position: absolute;
      left: 0;
      background: linear-gradient(#000 50%, transparent 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transform: translate(var(--translate-x), -2px);
      animation: fracture 5s infinite ease;
    }
  }

  h1.has-path {
    position: relative;
    width: auto;
    height: 100vh;

    &::after {
      display: none;
    }
  }

  .path-letter {
    display: inline-block;
    white-space: pre;
  }

  @keyframes fracture {
    0% {
      transform: translate(var(--translate-x), var(--translate-y));
    }
    50% {
      transform: translate(var(--translate-x), var(--translate-y));
    }
  }

  .distort-text.draggable {
    transition: none;
  }

  .distort-text.draggable:hover {
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

  .distort-text.draggable:hover .drag-handle {
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

  .distort-text.draggable:hover .resize-handle {
    opacity: 1;
  }
</style>
