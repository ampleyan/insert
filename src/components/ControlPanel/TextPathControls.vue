<template>
  <div class="text-path-controls">
    <div v-for="(path, lineIndex) in textPaths" :key="lineIndex" class="line-path-section">
      <div class="line-header">
        <span class="line-label">Line {{ lineIndex + 1 }}: {{ settings.textLines[lineIndex] }}</span>
        <label class="enable-toggle">
          <input
            type="checkbox"
            :checked="path.enabled"
            @change="updatePath(lineIndex, 'enabled', $event.target.checked)"
          />
          <span>Enable Path</span>
        </label>
      </div>

      <div v-if="path.enabled" class="path-content">
        <div class="preset-buttons">
          <button
            v-for="preset in presets"
            :key="preset.type"
            :class="['preset-btn', { active: path.type === preset.type }]"
            @click="applyPreset(lineIndex, preset)"
            :title="preset.description"
          >
            <span class="preset-icon">{{ preset.icon }}</span>
            <span class="preset-label">{{ preset.label }}</span>
          </button>
        </div>

        <div v-if="path.type !== 'none'" class="path-controls">
          <div v-if="path.type === 'arc'" class="control-group">
            <label>
              <span class="label-text">Arc Radius</span>
              <input
                type="range"
                :value="path.arcRadius"
                @input="updatePath(lineIndex, 'arcRadius', Number($event.target.value))"
                min="100"
                max="1000"
                step="10"
              />
              <input
                type="number"
                class="value-input"
                :value="path.arcRadius"
                @input="updatePath(lineIndex, 'arcRadius', Number($event.target.value))"
                min="100"
                max="1000"
                step="10"
              />
              <span class="unit">px</span>
            </label>

            <label>
              <span class="label-text">Arc Start</span>
              <input
                type="range"
                :value="path.arcStart"
                @input="updatePath(lineIndex, 'arcStart', Number($event.target.value))"
                min="-180"
                max="180"
                step="5"
              />
              <input
                type="number"
                class="value-input"
                :value="path.arcStart"
                @input="updatePath(lineIndex, 'arcStart', Number($event.target.value))"
                min="-180"
                max="180"
                step="5"
              />
              <span class="unit">°</span>
            </label>

            <label>
              <span class="label-text">Arc Span</span>
              <input
                type="range"
                :value="path.arcSpan"
                @input="updatePath(lineIndex, 'arcSpan', Number($event.target.value))"
                min="30"
                max="360"
                step="5"
              />
              <input
                type="number"
                class="value-input"
                :value="path.arcSpan"
                @input="updatePath(lineIndex, 'arcSpan', Number($event.target.value))"
                min="30"
                max="360"
                step="5"
              />
              <span class="unit">°</span>
            </label>

            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="path.letterRotation"
                @change="updatePath(lineIndex, 'letterRotation', $event.target.checked)"
              />
              <span>Rotate Letters</span>
            </label>
          </div>

          <div v-if="path.type === 'wave'" class="control-group">
            <label>
              <span class="label-text">Wave Amplitude</span>
              <input
                type="range"
                :value="path.waveAmplitude"
                @input="updatePath(lineIndex, 'waveAmplitude', Number($event.target.value))"
                min="0"
                max="100"
                step="5"
              />
              <input
                type="number"
                class="value-input"
                :value="path.waveAmplitude"
                @input="updatePath(lineIndex, 'waveAmplitude', Number($event.target.value))"
                min="0"
                max="100"
                step="5"
              />
              <span class="unit">px</span>
            </label>

            <label>
              <span class="label-text">Wave Frequency</span>
              <input
                type="range"
                :value="path.waveFrequency"
                @input="updatePath(lineIndex, 'waveFrequency', Number($event.target.value))"
                min="0.1"
                max="5"
                step="0.1"
              />
              <input
                type="number"
                class="value-input"
                :value="path.waveFrequency"
                @input="updatePath(lineIndex, 'waveFrequency', Number($event.target.value))"
                min="0.1"
                max="5"
                step="0.1"
              />
            </label>

            <label>
              <span class="label-text">Wave Offset</span>
              <input
                type="range"
                :value="path.waveOffset"
                @input="updatePath(lineIndex, 'waveOffset', Number($event.target.value))"
                min="0"
                max="360"
                step="10"
              />
              <input
                type="number"
                class="value-input"
                :value="path.waveOffset"
                @input="updatePath(lineIndex, 'waveOffset', Number($event.target.value))"
                min="0"
                max="360"
                step="10"
              />
              <span class="unit">°</span>
            </label>

            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="path.letterRotation"
                @change="updatePath(lineIndex, 'letterRotation', $event.target.checked)"
              />
              <span>Rotate Letters</span>
            </label>
          </div>

          <div v-if="path.type === 'circle'" class="control-group">
            <label>
              <span class="label-text">Circle Radius</span>
              <input
                type="range"
                :value="path.circleRadius"
                @input="updatePath(lineIndex, 'circleRadius', Number($event.target.value))"
                min="50"
                max="500"
                step="10"
              />
              <input
                type="number"
                class="value-input"
                :value="path.circleRadius"
                @input="updatePath(lineIndex, 'circleRadius', Number($event.target.value))"
                min="50"
                max="500"
                step="10"
              />
              <span class="unit">px</span>
            </label>

            <label>
              <span class="label-text">Position</span>
              <select
                :value="path.circlePosition"
                @change="updatePath(lineIndex, 'circlePosition', $event.target.value)"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>

            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="path.inwardFacing"
                @change="updatePath(lineIndex, 'inwardFacing', $event.target.checked)"
              />
              <span>Inward Facing</span>
            </label>

            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="path.letterRotation"
                @change="updatePath(lineIndex, 'letterRotation', $event.target.checked)"
              />
              <span>Rotate Letters</span>
            </label>
          </div>

          <div class="control-group">
            <label>
              <span class="label-text">Letter Alignment</span>
              <select
                :value="path.letterAlignment"
                @change="updatePath(lineIndex, 'letterAlignment', $event.target.value)"
              >
                <option value="baseline">Baseline</option>
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextPathControls',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  emits: ['update'],
  computed: {
    textPaths() {
      return this.settings.textPaths || [];
    },
  },
  data() {
    return {
      presets: [
        {
          type: 'none',
          label: 'Straight',
          icon: '━',
          description: 'Normal straight text',
          config: { enabled: false, type: 'none' },
        },
        {
          type: 'arc',
          label: 'Arch Up',
          icon: '⌒',
          description: 'Arch upward',
          config: {
            type: 'arc',
            arcRadius: 300,
            arcStart: -90,
            arcSpan: 180,
            letterRotation: true,
          },
        },
        {
          type: 'arc',
          label: 'Arch Down',
          icon: '⌓',
          description: 'Arch downward',
          config: {
            type: 'arc',
            arcRadius: 300,
            arcStart: 90,
            arcSpan: 180,
            letterRotation: true,
          },
        },
        {
          type: 'wave',
          label: 'Wave',
          icon: '∿',
          description: 'Wavy text path',
          config: {
            type: 'wave',
            waveAmplitude: 30,
            waveFrequency: 1,
            waveOffset: 0,
            letterRotation: false,
          },
        },
        {
          type: 'circle',
          label: 'Circle Top',
          icon: '○',
          description: 'Circular text at top',
          config: {
            type: 'circle',
            circleRadius: 200,
            circlePosition: 'top',
            inwardFacing: false,
            letterRotation: true,
          },
        },
        {
          type: 'circle',
          label: 'Circle Bottom',
          icon: '◎',
          description: 'Circular text at bottom',
          config: {
            type: 'circle',
            circleRadius: 200,
            circlePosition: 'bottom',
            inwardFacing: false,
            letterRotation: true,
          },
        },
      ],
    };
  },
  methods: {
    updatePath(lineIndex, key, value) {
      const updatedPaths = [...this.textPaths];
      updatedPaths[lineIndex] = {
        ...updatedPaths[lineIndex],
        [key]: value,
      };
      this.$emit('update', { textPaths: updatedPaths });
    },
    applyPreset(lineIndex, preset) {
      const updatedPaths = [...this.textPaths];
      updatedPaths[lineIndex] = {
        ...updatedPaths[lineIndex],
        ...preset.config,
        enabled: preset.type !== 'none',
      };
      this.$emit('update', { textPaths: updatedPaths });
    },
  },
};
</script>

<style scoped>
.text-path-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.line-path-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.line-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.line-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}

.enable-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.enable-toggle input[type='checkbox'] {
  cursor: pointer;
}

.path-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.preset-btn.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgb(59, 130, 246);
  color: rgb(147, 197, 253);
}

.preset-icon {
  font-size: 20px;
  line-height: 1;
}

.preset-label {
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.path-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.label-text {
  min-width: 120px;
  font-weight: 500;
}

.control-group input[type='range'] {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.control-group input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: rgb(59, 130, 246);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-group input[type='range']::-webkit-slider-thumb:hover {
  background: rgb(96, 165, 250);
  transform: scale(1.1);
}

.control-group select {
  flex: 1;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  cursor: pointer;
}

.control-group select:focus {
  outline: none;
  border-color: rgb(59, 130, 246);
}

.value-display {
  min-width: 60px;
  text-align: right;
  font-weight: 600;
  color: rgb(147, 197, 253);
  font-size: 11px;
}

.value-input {
  width: 60px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  text-align: right;
}

.value-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.unit {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  min-width: 20px;
}

.checkbox-label {
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type='checkbox'] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.checkbox-label span {
  font-size: 12px;
}
</style>
