<template>
  <div class="control-group">
    <h3>Color Settings</h3>
    <div class="sub-controls">
      <label for="hue-rotate">Hue Rotation:</label>
      <input type="range" id="hue-rotate" v-model.number="controlSettings.hue" min="0" max="360">
      <div class="value-display" id="hue-value">{{ controlSettings.hue }}°</div>

      <label for="color-picker">Text Color:</label>
      <input type="color" id="color-picker" v-model="controlSettings.color" >

      <label for="opacity">Opacity:</label>
      <input type="range" id="opacity" v-model.number="controlSettings.opacity" min="0" max="100">
      <div class="value-display" id="opacity-value">{{ controlSettings.opacity }}%</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorControls',
  data() {
    return {
      // hue: 0,
      // color: '#ffffff',
      // opacity: 100,
      controlSettings: {
        // Blend settings
        // Color settings
        hue: 0,
        color: '#ffffff',
        opacity: 100,

      }
    };
  },
  emits: ['update'],
  mounted() {
    // Initialize with values from controlSettings or defaults
    // this.hue = this.controlSettings.hue || 0;
    // this.color = this.controlSettings.color || '#ffffff';
    // this.opacity = this.controlSettings.opacity || 100;
    // this.updateSettings();
  },
  watch: {
  controlSettings: {
    handler(newValue) {
      this.$emit('update', newValue);
    },
    deep: true
  }

  },

};
</script>
