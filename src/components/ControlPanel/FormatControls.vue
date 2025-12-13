<template>
  <div class="control-group">
    <h3>Video Format</h3>
    <div class="format-grid">
      <button
        v-for="format in formats"
        :key="format.value"
        :class="['format-button', { active: selectedFormat === format.value }]"
        @click="selectFormat(format)"
      >
        <div class="format-label">{{ format.label }}</div>
        <div class="format-aspect">{{ format.aspectRatio }}</div>
        <div class="format-description">{{ format.description }}</div>
      </button>
    </div>
    <div class="format-info" v-if="selectedFormatData">
      <span>{{ selectedFormatData.width }}×{{ selectedFormatData.height }}px</span>
    </div>

    <div class="format-options">
      <label class="option-label">
        <input type="checkbox" v-model="showBoundary" @change="updateOptions" />
        <span>Show Format Boundary</span>
      </label>
      <label class="option-label">
        <input type="checkbox" v-model="fitToFormat" @change="updateOptions" />
        <span>Fit Video to Format</span>
      </label>
    </div>
  </div>
</template>

<script>
import { FORMAT_PRESETS, DEFAULT_FORMAT } from '@/constants/formatPresets';

export default {
  name: 'FormatControls',
  props: {
    modelValue: {
      type: String,
      default: DEFAULT_FORMAT
    }
  },
  emits: ['update'],
  data() {
    return {
      selectedFormat: DEFAULT_FORMAT,
      formats: FORMAT_PRESETS,
      showBoundary: true,
      fitToFormat: false
    };
  },
  computed: {
    selectedFormatData() {
      return this.formats.find(f => f.value === this.selectedFormat);
    }
  },
  mounted() {
    this.selectedFormat = this.modelValue || DEFAULT_FORMAT;
  },
  methods: {
    selectFormat(format) {
      this.selectedFormat = format.value;
      this.$emit('update', {
        videoFormat: format.value,
        videoWidth: format.width,
        videoHeight: format.height
      });
    },
    updateOptions() {
      this.$emit('update', {
        showFormatBoundary: this.showBoundary,
        fitToFormat: this.fitToFormat
      });
    }
  }
};
</script>

<style scoped>
.control-group {
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.control-group h3 {
  color: white;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: normal;
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.format-button {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.format-button:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.4);
}

.format-button.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.6);
}

.format-label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.format-aspect {
  font-size: 11px;
  opacity: 0.8;
  margin-bottom: 2px;
}

.format-description {
  font-size: 10px;
  opacity: 0.6;
}

.format-info {
  color: white;
  font-size: 12px;
  text-align: center;
  opacity: 0.7;
}

.format-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.option-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 13px;
  cursor: pointer;
}

.option-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.option-label span {
  user-select: none;
}
</style>
