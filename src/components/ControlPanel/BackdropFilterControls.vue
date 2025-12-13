<template>
  <div class="control-group backdrop-control">
    <h3>Backdrop Filter</h3>

    <div class="filter-control">
      <label>Blur</label>
      <input
        type="range"
        v-model.number="settings.backdropBlur"
        min="0"
        max="20"
        step="0.5"
        @input="updateSettings"
      />
      <input
        type="number"
        class="value-input"
        v-model.number="settings.backdropBlur"
        min="0"
        max="20"
        step="0.5"
        @input="updateSettings"
      />
      <span class="unit">px</span>
    </div>

    <div class="filter-control">
      <label>Brightness</label>
      <input
        type="range"
        v-model.number="settings.backdropBrightness"
        min="0"
        max="200"
        step="5"
        @input="updateSettings"
      />
      <input
        type="number"
        class="value-input"
        v-model.number="settings.backdropBrightness"
        min="0"
        max="200"
        step="5"
        @input="updateSettings"
      />
      <span class="unit">%</span>
    </div>

    <div class="filter-control">
      <label>Contrast</label>
      <input
        type="range"
        v-model.number="settings.backdropContrast"
        min="0"
        max="200"
        step="5"
        @input="updateSettings"
      />
      <input
        type="number"
        class="value-input"
        v-model.number="settings.backdropContrast"
        min="0"
        max="200"
        step="5"
        @input="updateSettings"
      />
      <span class="unit">%</span>
    </div>

    <div class="filter-control">
      <label>Saturation</label>
      <input
        type="range"
        v-model.number="settings.backdropSaturate"
        min="0"
        max="200"
        step="5"
        @input="updateSettings"
      />
      <input
        type="number"
        class="value-input"
        v-model.number="settings.backdropSaturate"
        min="0"
        max="200"
        step="5"
        @input="updateSettings"
      />
      <span class="unit">%</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BackdropControls',
    data() {
      return {
        settings: {
          backdropBlur: 0,
          backdropBrightness: 100,
          backdropContrast: 100,
          backdropSaturate: 100,
        },
      };
    },
    methods: {
      updateSettings() {
        this.$emit('update', this.settings);
      },
    },
  };
</script>

<style scoped>
  .backdrop-control {
    background: rgba(0, 0, 0, 0.7);
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 15px;
  }

  .backdrop-control h3 {
    color: white;
    margin: 0 0 10px 0;
    font-size: 14px;
    font-weight: normal;
  }

  .filter-control {
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 10px;
    align-items: center;
  }

  .filter-control label {
    color: white;
    font-size: 14px;
  }

  .filter-control input[type='range'] {
    accent-color: #ffffff;
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
