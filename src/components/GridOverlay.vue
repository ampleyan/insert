<template>
  <div v-if="settings.showGrid" class="grid-overlay" :style="gridStyle">
    <svg :width="width" :height="height" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern :id="`grid-${gridSize}`" :width="gridSize" :height="gridSize" patternUnits="userSpaceOnUse">
          <path
            :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`"
            fill="none"
            :stroke="gridColor"
            :stroke-width="gridStrokeWidth"
            :opacity="gridOpacity"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" :fill="`url(#grid-${gridSize})`" />

      <line
        v-if="settings.showCenterGuides"
        :x1="width / 2"
        y1="0"
        :x2="width / 2"
        :y2="height"
        :stroke="guideColor"
        :stroke-width="guideStrokeWidth"
        :opacity="guideOpacity"
        stroke-dasharray="5,5"
      />
      <line
        v-if="settings.showCenterGuides"
        x1="0"
        :y1="height / 2"
        :x2="width"
        :y2="height / 2"
        :stroke="guideColor"
        :stroke-width="guideStrokeWidth"
        :opacity="guideOpacity"
        stroke-dasharray="5,5"
      />

      <line
        v-if="settings.showThirdsGuides"
        :x1="width / 3"
        y1="0"
        :x2="width / 3"
        :y2="height"
        :stroke="guideColor"
        :stroke-width="guideStrokeWidth"
        :opacity="guideOpacity"
        stroke-dasharray="5,5"
      />
      <line
        v-if="settings.showThirdsGuides"
        :x1="(width / 3) * 2"
        y1="0"
        :x2="(width / 3) * 2"
        :y2="height"
        :stroke="guideColor"
        :stroke-width="guideStrokeWidth"
        :opacity="guideOpacity"
        stroke-dasharray="5,5"
      />
      <line
        v-if="settings.showThirdsGuides"
        x1="0"
        :y1="height / 3"
        :x2="width"
        :y2="height / 3"
        :stroke="guideColor"
        :stroke-width="guideStrokeWidth"
        :opacity="guideOpacity"
        stroke-dasharray="5,5"
      />
      <line
        v-if="settings.showThirdsGuides"
        x1="0"
        :y1="(height / 3) * 2"
        :x2="width"
        :y2="(height / 3) * 2"
        :stroke="guideColor"
        :stroke-width="guideStrokeWidth"
        :opacity="guideOpacity"
        stroke-dasharray="5,5"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'GridOverlay',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  computed: {
    width() {
      return this.settings.videoWidth || 1080;
    },
    height() {
      return this.settings.videoHeight || 1920;
    },
    gridSize() {
      return this.settings.gridSize || 50;
    },
    gridColor() {
      return this.settings.gridColor || '#00ffff';
    },
    gridOpacity() {
      return this.settings.gridOpacity || 0.3;
    },
    gridStrokeWidth() {
      return 0.5;
    },
    guideColor() {
      return this.settings.guideColor || '#ff00ff';
    },
    guideOpacity() {
      return this.settings.guideOpacity || 0.5;
    },
    guideStrokeWidth() {
      return 1;
    },
    gridStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      };
    }
  }
};
</script>

<style scoped>
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1000;
}

.grid-overlay svg {
  display: block;
}
</style>
