<template>
  <div class="control-group">
    <h3>Animation Settings</h3>
    <div class="sub-controls">
      <label for="vibrate-speed">Animation Speed:</label>
      <div class="dual-slider">
        <input
          type="range"
          id="vibrate-speed"
          v-model.number="controlSettings.vibrateSpeed"
          min="10"
          max="500"
        />
<input
          type="number"
          v-model.number="controlSettings.vibrateSpeed"
          min="10"
          max="500"
          class="number-input"
        />
        <div class="value-display">ms</div>
      </div>

      <label for="vibrate-intensity">Vibration Intensity:</label>
      <div class="dual-slider">
        <input
          type="range"
          id="vibrate-intensity"
          v-model.number="controlSettings.vibrateIntensity"
          min="1"
          max="10"
        />
        <input
          type="number"
          v-model.number="controlSettings.vibrateIntensity"
          min="1"
          max="10"
          class="number-input"
        />
        <div class="value-display">x</div>
      </div>

      <label for="blur-amount">Blur Amount:</label>
      <div class="dual-slider">
        <input
          type="range"
          id="blur-amount"
          v-model.number="controlSettings.blurAmount"
          min="0"
          max="10"
          step="0.5"
        />
        <input
          type="number"
          v-model.number="controlSettings.blurAmount"
          min="0"
          max="10"
          step="0.5"
          class="number-input"
        />
        <div class="value-display">px</div>
      </div>

      <label for="random-amount">Random Letters (%):</label>
      <div class="dual-slider">
        <input
          type="range"
          id="random-amount"
          v-model.number="controlSettings.globalRandomAmount"
          min="1"
          max="100"
        />
        <input
          type="number"
          v-model.number="controlSettings.globalRandomAmount"
          min="1"
          max="100"
          class="number-input"
        />
        <div class="value-display">%</div>
      </div>

      <label for="interval-speed">Effect Interval:</label>
      <div class="dual-slider">
        <input
          type="range"
          id="interval-speed"
          v-model.number="controlSettings.intervalSpeed"
          min="50"
          max="1000"
        />
        <input
          type="number"
          v-model.number="controlSettings.intervalSpeed"
          min="50"
          max="1000"
          class="number-input"
        />
        <div class="value-display">ms</div>
</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AnimationControls',
    data() {
      return {
        animationInterval: null,
        controlSettings: {
          // Animation settings
          vibrateSpeed: 50,
          vibrateIntensity: 1,
          blurAmount: 2,
          globalRandomAmount: 50,
          intervalSpeed: 200,
        },
      };
    },
    watch: {
      controlSettings: {
    handler(newValue) {
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
      }
      // Ensure we're emitting the globalRandomAmount
      this.$emit('update', {
        vibrateSpeed: newValue.vibrateSpeed,
        vibrateIntensity: newValue.vibrateIntensity,
        blurAmount: newValue.blurAmount,
        globalRandomAmount: newValue.globalRandomAmount,
        intervalSpeed: newValue.intervalSpeed
      });
    },
    deep: true,
  },

    },
    methods: {
      updateSettings() {
        if (this.animationInterval) {
          clearInterval(this.animationInterval);
        }
        // }
      },
    },
  };
</script>

<style scoped>
.dual-slider {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dual-slider input[type="range"] {
  flex: 1;
}

.dual-slider input[type="number"] {
  width: 70px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
}

.dual-slider input[type="number"]:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
}

.value-display {
  min-width: 30px;
}
</style>
