<template>
  <div class="vibration-demo" @mousemove="handleMouseMove" @touchmove="handleTouchMove">
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
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
        default: () => ({
          hue: 0,
          opacity: 100,
          color: '#ffffff',
          blendMode: 'difference',
          randomAmount: 50,
          intervalSpeed: 200,
          blurAmount: 2,
          vibrateIntensity: 2,
          vibrateSpeed: 200,
          textLines: ['TEXT'],
          fontSize: 80,
        }),
      },
    },
    computed: {
      rootStyles() {
        const gooSettings = this.settings.goo || {};
        return {
          '--translate-x': `${gooSettings.gooAmount || 20}px`,
          '--translate-y': `${gooSettings.gooAmount || 20}px`,
          '--vibrate-speed': `${1000 / (gooSettings.morphSpeed || 1)}ms`,
          '--turbulence-intensity': gooSettings.turbulenceIntensity || 30,
        };
      },
    },
    data() {
      return {
        textLinesVar: this.settings.textLines,
        textLineFontSize: Array.isArray(this.settings.fontSize)
          ? this.settings.fontSize
          : this.settings.textLines.map(() => this.settings.fontSize),
        vibratingLetters: {},
        animationInterval: null,
      };
    },
    watch: {
      'settings.textLines'(newValue) {
        this.textLinesVar = newValue;
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
    font-size: calc(10vw + 0.5rem);
    font-weight: 900;
    text-transform: uppercase;
    color: black;
    position: relative;
    background: linear-gradient(transparent 50%, #000 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

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
