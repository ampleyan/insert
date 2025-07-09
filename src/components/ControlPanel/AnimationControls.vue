<template>
  <div class="control-group">
    <h3>Animation Settings</h3>
    <div class="sub-controls">
      <label for="vibrate-speed">Animation Speed:</label>
      <div class="dual-slider">
        <input type="range" id="vibrate-speed" v-model.number="controlSettings.vibrateSpeed" min="10" max="500">
        <div class="value-display" id="speed-value">{{ controlSettings.vibrateSpeed }}ms</div>
      </div>

      <label for="vibrate-intensity">Vibration Intensity:</label>
      <div class="dual-slider">
        <input type="range" id="vibrate-intensity" v-model.number="controlSettings.vibrateIntensity" min="1" max="10" >
        <div class="value-display" id="intensity-value">{{ controlSettings.vibrateIntensity }}x</div>
      </div>

      <label for="blur-amount">Blur Amount:</label>
      <div class="dual-slider">
        <input type="range" id="blur-amount" v-model.number="controlSettings.blurAmount" min="0" max="10" step="0.5" >
        <div class="value-display" id="blur-value">{{ controlSettings.blurAmount }}px</div>
      </div>

      <label for="random-amount">Random Letters (%):</label>
      <div class="dual-slider">
        <input type="range" id="random-amount" v-model.number="controlSettings.randomAmount" min="1" max="100">
        <div class="value-display" id="random-value">{{ controlSettings.randomAmount }}%</div>
      </div>

      <label for="interval-speed">Effect Interval:</label>
      <div class="dual-slider">
        <input type="range" id="interval-speed" v-model.number="controlSettings.intervalSpeed" min="50" max="1000">
        <div class="value-display" id="interval-value">{{ controlSettings.intervalSpeed }}ms</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimationControls',
  data() {
    return {
      animationInterval: null
,
      controlSettings: {
        // Animation settings
        vibrateSpeed: 50,
        vibrateIntensity: 1,
        blurAmount: 2,
        randomAmount: 50,
        intervalSpeed: 200,

      }
    };
  },
  watch: {
  controlSettings: {
    handler(newValue) {
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
      }
      this.$emit('update', newValue);
    },
    deep: true
  }
  },
  methods: {
    updateSettings() {
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
      }
      // }
    }
  }
};
</script>
