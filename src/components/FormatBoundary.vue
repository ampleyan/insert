<template>
  <div v-if="settings.showFormatBoundary" class="format-boundary" :style="boundaryStyle">
  </div>
</template>

<script>
export default {
  name: 'FormatBoundary',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  computed: {
    boundaryStyle() {
      return {
        width: `${this.settings.videoWidth}px`,
        height: `${this.settings.videoHeight}px`,
        border: '2px solid rgba(255, 0, 255, 0.8)',
        boxShadow: 'inset 0 0 0 1px rgba(255, 0, 255, 0.3), 0 0 20px rgba(255, 0, 255, 0.4)'
      };
    },
    formatLabel() {
      const formats = {
        'vertical': 'Stories/Reels (1080×1920)',
        'square': 'Square (1080×1080)',
        'portrait': 'Portrait (1080×1350)',
        'landscape': 'Landscape (1080×566)',
        'fullscreen': 'Fullscreen (1920×1080)'
      };
      return formats[this.settings.videoFormat] || `${this.settings.videoWidth}×${this.settings.videoHeight}`;
    }
  }
};
</script>

<style scoped>
.format-boundary {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 999;
  box-sizing: border-box;
}

.boundary-label {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 0, 255, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: monospace;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>
