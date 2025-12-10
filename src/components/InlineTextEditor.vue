<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="inline-editor-overlay"
      @mousedown.self="$emit('close')"
    >
      <div
        class="inline-editor"
        :style="{ left: `${position.x}px`, top: `${position.y}px` }"
        @mousedown.stop
      >
        <div class="inline-editor-header">
          <h3>Line {{ lineIndex + 1 }} Settings</h3>
          <button class="close-btn" @click="$emit('close')" type="button">×</button>
        </div>

        <div class="inline-editor-content">
          <div class="form-group">
            <label>Text Content</label>
            <textarea
              :value="currentText"
              @input="updateText($event.target.value)"
              placeholder="Enter text..."
              rows="2"
            ></textarea>
          </div>

          <div class="form-group">
            <label>
              Font Size
              <span class="value">{{ currentFontSize }}px</span>
            </label>
            <input
              type="range"
              min="12"
              max="300"
              :value="currentFontSize"
              @input="updateFontSize(Number($event.target.value))"
            />
          </div>

          <div class="form-group">
            <label>
              Letter Spacing
              <span class="value">{{ currentLetterSpacing }}px</span>
            </label>
            <input
              type="range"
              min="-20"
              max="100"
              :value="currentLetterSpacing"
              @input="updateLetterSpacing(Number($event.target.value))"
            />
          </div>

          <div class="form-group">
            <label>
              Horizontal Position
              <span class="value">{{ currentMargin }}px</span>
            </label>
            <input
              type="range"
              min="-500"
              max="500"
              :value="currentMargin"
              @input="updateMargin(Number($event.target.value))"
            />
          </div>

          <div class="form-group">
            <label>
              Vertical Position
              <span class="value">{{ currentMarginTop }}px</span>
            </label>
            <input
              type="range"
              min="-500"
              max="500"
              :value="currentMarginTop"
              @input="updateMarginTop(Number($event.target.value))"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'InlineTextEditor',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    lineIndex: {
      type: Number,
      default: 0,
    },
    settings: {
      type: Object,
      required: true,
    },
    position: {
      type: Object,
      default: () => ({ x: 0, y: 0 }),
    },
  },
  emits: ['update', 'close'],
  watch: {
    visible(newVal) {
      console.log('[InlineEditor] Visibility changed:', newVal, {
        lineIndex: this.lineIndex,
        hasSettings: !!this.settings
      });
    },
    lineIndex(newVal) {
      console.log('[InlineEditor] LineIndex changed:', newVal);
    }
  },
  computed: {
    currentText() {
      return this.settings.textLines?.[this.lineIndex] || '';
    },
    currentFontSize() {
      return this.settings.fontSize?.[this.lineIndex] || 120;
    },
    currentLetterSpacing() {
      return this.settings.letterSpacing?.[this.lineIndex] || 0;
    },
    currentMargin() {
      return this.settings.margin?.[this.lineIndex] || 0;
    },
    currentMarginTop() {
      return this.settings.marginTop?.[this.lineIndex] || 0;
    },
  },
  methods: {
    updateText(value) {
      const newTextLines = [...this.settings.textLines];
      newTextLines[this.lineIndex] = value;
      this.$emit('update', { textLines: newTextLines });
    },
    updateFontSize(value) {
      const newFontSizes = [...this.settings.fontSize];
      newFontSizes[this.lineIndex] = value;
      this.$emit('update', { fontSize: newFontSizes });
    },
    updateLetterSpacing(value) {
      const newLetterSpacing = [...this.settings.letterSpacing];
      newLetterSpacing[this.lineIndex] = value;
      this.$emit('update', { letterSpacing: newLetterSpacing });
    },
    updateMargin(value) {
      const newMargins = [...this.settings.margin];
      newMargins[this.lineIndex] = value;
      this.$emit('update', { margin: newMargins });
    },
    updateMarginTop(value) {
      const newMarginTops = [...this.settings.marginTop];
      newMarginTops[this.lineIndex] = value;
      this.$emit('update', { marginTop: newMarginTops });
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleEscape);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscape);
  },
  created() {
    this.handleEscape = (e) => {
      if (e.key === 'Escape' && this.visible) {
        this.$emit('close');
      }
    };
  },
};
</script>

<style scoped>
.inline-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  pointer-events: all;
}

.inline-editor {
  position: fixed;
  width: 320px;
  background: rgba(20, 20, 25, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px) saturate(150%);
  animation: fadeIn 0.2s ease-out;
  pointer-events: all;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.inline-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.inline-editor-header h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 59, 48, 0.2);
  color: rgba(255, 59, 48, 1);
}

.inline-editor-content {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.form-group label .value {
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
}

.form-group textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  padding: 8px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-group textarea:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2);
}

.form-group input[type='range'] {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.form-group input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.form-group input[type='range']::-webkit-slider-thumb:hover {
  background: #4A9EFF;
  box-shadow: 0 0 0 4px rgba(74, 158, 255, 0.2);
}

.form-group input[type='range']::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.form-group input[type='range']::-moz-range-thumb:hover {
  background: #4A9EFF;
  box-shadow: 0 0 0 4px rgba(74, 158, 255, 0.2);
}
</style>
