<template>
  <span
    :class="{
      'letter-selectable': settings.letterEditMode,
      'letter-selected': isLetterSelected(lineIndex, letterIndex),
      ...customClasses
    }"
    :style="letterStyle"
    @click.stop="handleLetterClick"
  >
    {{ letter }}
    <div
      v-if="isLetterSelected(lineIndex, letterIndex) && settings.letterEditMode"
      class="letter-handles"
    >
      <button
        class="letter-handle scale-handle"
        @mousedown="handleManipulation($event, 'scale')"
        @touchstart="handleManipulation($event, 'scale')"
        title="Scale"
      >⤢</button>
      <button
        class="letter-handle rotate-handle"
        @mousedown="handleManipulation($event, 'rotate')"
        @touchstart="handleManipulation($event, 'rotate')"
        title="Rotate"
      >↻</button>
      <button
        class="letter-handle skew-x-handle"
        @mousedown="handleManipulation($event, 'skewX')"
        @touchstart="handleManipulation($event, 'skewX')"
        title="Skew X"
      >⇆</button>
      <button
        class="letter-handle skew-y-handle"
        @mousedown="handleManipulation($event, 'skewY')"
        @touchstart="handleManipulation($event, 'skewY')"
        title="Skew Y"
      >⇅</button>
    </div>
  </span>
</template>

<script>
export default {
  name: 'LetterRenderer',
  props: {
    letter: {
      type: String,
      required: true,
    },
    lineIndex: {
      type: Number,
      required: true,
    },
    letterIndex: {
      type: Number,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
    letterStyle: {
      type: Object,
      default: () => ({}),
    },
    customClasses: {
      type: Object,
      default: () => ({}),
    },
    isLetterSelected: {
      type: Function,
      required: true,
    },
    onLetterClick: {
      type: Function,
      required: true,
    },
    onManipulationStart: {
      type: Function,
      required: true,
    },
  },
  methods: {
    handleLetterClick() {
      this.onLetterClick(this.lineIndex, this.letterIndex);
    },
    handleManipulation(event, type) {
      this.onManipulationStart(event, type, this.lineIndex, this.letterIndex);
    },
  },
};
</script>

<style scoped>
.letter-selectable {
  cursor: pointer;
  transition: all 0.2s ease;
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
  display: flex;
  align-items: center;
  justify-content: center;
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

.scale-handle {
  border-color: rgba(255, 100, 100, 0.5);
}

.rotate-handle {
  border-color: rgba(100, 255, 100, 0.5);
}

.skew-x-handle {
  border-color: rgba(100, 100, 255, 0.5);
}

.skew-y-handle {
  border-color: rgba(255, 255, 100, 0.5);
}
</style>
