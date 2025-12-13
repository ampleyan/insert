<template>
  <div class="animation-preset-controls">
    <h4>Text Animation</h4>

    <div v-for="(line, index) in settings.textLines" :key="index" class="line-animation">
      <div class="line-header">
        <span class="line-label">Line {{ index + 1 }}: {{ line.substring(0, 20) }}{{ line.length > 20 ? '...' : '' }}</span>
      </div>

      <div class="animation-select">
        <label>Animation:</label>
        <select
          :value="getAnimationPreset(index)"
          @change="updateAnimationPreset(index, $event.target.value)"
        >
          <option v-for="preset in animationPresets" :key="preset.value" :value="preset.value">
            {{ preset.label }}
          </option>
        </select>
      </div>

      <div v-if="getAnimationPreset(index) !== 'none'" class="animation-params">
        <div class="param-row">
          <label>Duration:</label>
          <div class="range-control">
            <input
              type="range"
              :value="getAnimationDuration(index)"
              @input="updateAnimationDuration(index, parseInt($event.target.value))"
              min="100"
              max="5000"
              step="100"
            >
            <input
              type="number"
              class="value-input"
              :value="getAnimationDuration(index)"
              @input="updateAnimationDuration(index, parseInt($event.target.value))"
              min="100"
              max="5000"
              step="100"
            >
            <span class="unit">ms</span>
          </div>
        </div>

        <div class="param-row">
          <label>Delay:</label>
          <div class="range-control">
            <input
              type="range"
              :value="getAnimationDelay(index)"
              @input="updateAnimationDelay(index, parseInt($event.target.value))"
              min="0"
              max="5000"
              step="100"
            >
            <input
              type="number"
              class="value-input"
              :value="getAnimationDelay(index)"
              @input="updateAnimationDelay(index, parseInt($event.target.value))"
              min="0"
              max="5000"
              step="100"
            >
            <span class="unit">ms</span>
          </div>
        </div>

        <div class="param-row">
          <label>Loop:</label>
          <input
            type="checkbox"
            :checked="getAnimationLoop(index)"
            @change="updateAnimationLoop(index, $event.target.checked)"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ANIMATION_PRESETS, DEFAULT_ANIMATION } from '@/constants/animationPresets';

export default {
  name: 'AnimationPresetControls',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  emits: ['update'],
  data() {
    return {
      animationPresets: ANIMATION_PRESETS
    };
  },
  methods: {
    getAnimationPreset(index) {
      return this.settings.textAnimations?.[index]?.preset || DEFAULT_ANIMATION;
    },

    getAnimationDuration(index) {
      const preset = this.animationPresets.find(p => p.value === this.getAnimationPreset(index));
      return this.settings.textAnimations?.[index]?.duration || preset?.defaultDuration || 1000;
    },

    getAnimationDelay(index) {
      return this.settings.textAnimations?.[index]?.delay || 0;
    },

    getAnimationLoop(index) {
      return this.settings.textAnimations?.[index]?.loop || false;
    },

    updateAnimationPreset(index, value) {
      const animations = [...(this.settings.textAnimations || [])];
      const preset = this.animationPresets.find(p => p.value === value);

      animations[index] = {
        ...(animations[index] || {}),
        preset: value,
        duration: preset?.defaultDuration || 1000,
        delay: 0,
        loop: false
      };

      this.$emit('update', { textAnimations: animations });
    },

    updateAnimationDuration(index, value) {
      const animations = [...(this.settings.textAnimations || [])];
      animations[index] = {
        ...(animations[index] || { preset: DEFAULT_ANIMATION, delay: 0, loop: false }),
        duration: value
      };
      this.$emit('update', { textAnimations: animations });
    },

    updateAnimationDelay(index, value) {
      const animations = [...(this.settings.textAnimations || [])];
      animations[index] = {
        ...(animations[index] || { preset: DEFAULT_ANIMATION, duration: 1000, loop: false }),
        delay: value
      };
      this.$emit('update', { textAnimations: animations });
    },

    updateAnimationLoop(index, value) {
      const animations = [...(this.settings.textAnimations || [])];
      animations[index] = {
        ...(animations[index] || { preset: DEFAULT_ANIMATION, duration: 1000, delay: 0 }),
        loop: value
      };
      this.$emit('update', { textAnimations: animations });
    }
  }
};
</script>

<style scoped>
.animation-preset-controls {
  background: rgba(123, 104, 238, 0.1);
  border: 1px solid rgba(123, 104, 238, 0.3);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 15px;
}

.animation-preset-controls h4 {
  color: white;
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 500;
}

.line-animation {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.line-animation:last-child {
  margin-bottom: 0;
}

.line-header {
  margin-bottom: 8px;
}

.line-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
}

.animation-select {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.animation-select label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  min-width: 70px;
}

.animation-select select {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.animation-params {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 8px;
  margin-top: 8px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.param-row:last-child {
  margin-bottom: 0;
}

.param-row label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  min-width: 70px;
}

.param-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.range-control {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
}

.range-control input[type="range"] {
  width: 100%;
}

.value-input {
  width: 60px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 11px;
  text-align: center;
}

.value-input:focus {
  outline: none;
  border-color: rgba(123, 104, 238, 0.5);
}

.unit {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  min-width: 25px;
}
</style>
