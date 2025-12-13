<template>
  <div class="control-group grid-controls">
    <h3>Grid & Guides</h3>

    <div class="toggle-section">
      <label class="toggle-label">
        <input type="checkbox" v-model="localSettings.showGrid" @change="update" />
        <span>Show Grid</span>
      </label>
      <label class="toggle-label">
        <input type="checkbox" v-model="localSettings.snapToGrid" @change="update" />
        <span>Snap to Grid (Shift+Drag)</span>
      </label>
    </div>

    <div v-if="localSettings.showGrid" class="grid-settings">
      <div class="control-row">
        <label>Grid Size</label>
        <input
          type="range"
          v-model.number="localSettings.gridSize"
          min="10"
          max="200"
          step="10"
          @input="update"
        />
        <input
          type="number"
          class="value-input"
          v-model.number="localSettings.gridSize"
          min="10"
          max="200"
          step="10"
          @input="update"
        />
        <span class="unit">px</span>
      </div>

      <div class="control-row">
        <label>Grid Opacity</label>
        <input
          type="range"
          v-model.number="localSettings.gridOpacity"
          min="0"
          max="1"
          step="0.1"
          @input="update"
        />
        <input
          type="number"
          class="value-input"
          v-model.number="localSettings.gridOpacity"
          min="0"
          max="1"
          step="0.1"
          @input="update"
        />
      </div>

      <div class="control-row">
        <label>Grid Color</label>
        <input
          type="color"
          v-model="localSettings.gridColor"
          @input="update"
        />
      </div>
    </div>

    <div class="guides-section">
      <h4>Alignment Guides</h4>
      <label class="toggle-label">
        <input type="checkbox" v-model="localSettings.showCenterGuides" @change="update" />
        <span>Center Lines</span>
      </label>
      <label class="toggle-label">
        <input type="checkbox" v-model="localSettings.showThirdsGuides" @change="update" />
        <span>Rule of Thirds</span>
      </label>

      <div v-if="localSettings.showCenterGuides || localSettings.showThirdsGuides" class="guide-settings">
        <div class="control-row">
          <label>Guide Opacity</label>
          <input
            type="range"
            v-model.number="localSettings.guideOpacity"
            min="0"
            max="1"
            step="0.1"
            @input="update"
          />
          <input
            type="number"
            class="value-input"
            v-model.number="localSettings.guideOpacity"
            min="0"
            max="1"
            step="0.1"
            @input="update"
          />
        </div>

        <div class="control-row">
          <label>Guide Color</label>
          <input
            type="color"
            v-model="localSettings.guideColor"
            @input="update"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridControls',
  emits: ['update'],
  data() {
    return {
      localSettings: {
        showGrid: false,
        gridSize: 50,
        gridColor: '#00ffff',
        gridOpacity: 0.3,
        showCenterGuides: true,
        showThirdsGuides: false,
        guideColor: '#ff00ff',
        guideOpacity: 0.5,
        snapToGrid: true
      }
    };
  },
  methods: {
    update() {
      this.$emit('update', this.localSettings);
    }
  }
};
</script>

<style scoped>
.grid-controls {
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.grid-controls h3 {
  color: white;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: normal;
}

.grid-controls h4 {
  color: rgba(255, 255, 255, 0.8);
  margin: 15px 0 10px 0;
  font-size: 13px;
  font-weight: normal;
}

.toggle-section,
.guides-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 13px;
  cursor: pointer;
}

.toggle-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.grid-settings,
.guide-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.control-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 10px;
  align-items: center;
}

.control-row label {
  color: white;
  font-size: 13px;
}

.control-row input[type="range"] {
  accent-color: #00ffff;
}

.control-row input[type="color"] {
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
</style>
