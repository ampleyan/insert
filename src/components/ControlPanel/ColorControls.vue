<template>
  <div class="control-group">
    <h3>Color Settings</h3>
    <div class="sub-controls">
      <label for="hue-rotate">Hue Rotation:</label>
      <input type="range" id="hue-rotate" v-model.number="controlSettings.hue" min="0" max="360">
      <input type="number" class="value-input" v-model.number="controlSettings.hue" min="0" max="360">
      <span class="unit">°</span>

      <label for="color-picker">Text Color:</label>
      <input type="color" id="color-picker" v-model="controlSettings.color" >

      <label for="opacity">Opacity:</label>
      <input type="range" id="opacity" v-model.number="controlSettings.opacity" min="0" max="100">
      <input type="number" class="value-input" v-model.number="controlSettings.opacity" min="0" max="100">
      <span class="unit">%</span>
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

<style scoped>
.sub-controls {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 10px;
  align-items: center;
}

.sub-controls label {
  color: white;
  font-size: 14px;
}

.sub-controls input[type="range"] {
  accent-color: #ffffff;
}

.sub-controls input[type="color"] {
  grid-column: 2 / -1;
  width: 100%;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.value-input {
  width: 60px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  text-align: right;
}

.value-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.unit {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  min-width: 20px;
}
</style>
