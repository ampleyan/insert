<template>
  <div class="control-group backdrop-control">
    <h3>Backdrop Filter</h3>

    <div class="filter-control">
      <label>
        Blur
        <input
          type="range"
          v-model.number="settings.backdropBlur"
          min="0"
          max="20"
          step="0.5"
          @input="updateSettings"
        />
        <span>{{ settings.backdropBlur }}px</span>
      </label>
    </div>

    <div class="filter-control">
      <label>
        Brightness
        <input
          type="range"
          v-model.number="settings.backdropBrightness"
          min="0"
          max="200"
          step="5"
          @input="updateSettings"
        />
        <span>{{ settings.backdropBrightness }}%</span>
      </label>
    </div>

    <div class="filter-control">
      <label>
        Contrast
        <input
          type="range"
          v-model.number="settings.backdropContrast"
          min="0"
          max="200"
          step="5"
          @input="updateSettings"
        />
        <span>{{ settings.backdropContrast }}%</span>
      </label>
    </div>

    <div class="filter-control">
      <label>
        Saturation
        <input
          type="range"
          v-model.number="settings.backdropSaturate"
          min="0"
          max="200"
          step="5"
          @input="updateSettings"
        />
        <span>{{ settings.backdropSaturate }}%</span>
      </label>
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
  }

  .filter-control label {
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
  }

  .filter-control input[type='range'] {
    flex: 1;
    accent-color: #ffffff;
  }

  .filter-control span {
    min-width: 50px;
    text-align: right;
  }
</style>
