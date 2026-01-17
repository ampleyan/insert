<template>
  <div v-if="visible" class="grid-overlay" :style="overlayStyle">
    <svg width="100%" height="100%">
      <defs>
        <pattern
          id="grid-pattern"
          :width="cellWidth"
          :height="cellHeight"
          patternUnits="userSpaceOnUse"
        >
          <template v-if="style === 'dots'">
            <circle :cx="cellWidth / 2" :cy="cellHeight / 2" r="2" fill="rgba(255,255,255,0.3)" />
          </template>
          <template v-else-if="style === 'lines'">
            <line x1="0" y1="0" :x2="cellWidth" y2="0" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
            <line x1="0" y1="0" x2="0" :y2="cellHeight" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
          </template>
          <template v-else>
            <line :x1="cellWidth / 2 - 4" :y1="cellHeight / 2" :x2="cellWidth / 2 + 4" :y2="cellHeight / 2" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
            <line :x1="cellWidth / 2" :y1="cellHeight / 2 - 4" :x2="cellWidth / 2" :y2="cellHeight / 2 + 4" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
          </template>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_FORMATS } from '../../constants/win98';

export default {
  name: 'Win98GridOverlay',
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    grid() {
      return this.win98.grid || {};
    },
    visible() {
      return this.grid.visible;
    },
    cellWidth() {
      return this.grid.cellWidth || 80;
    },
    cellHeight() {
      return this.grid.cellHeight || 100;
    },
    style() {
      return this.grid.style || 'dots';
    },
    overlayStyle() {
      const format = WIN98_FORMATS[this.win98.format] || WIN98_FORMATS.portrait;
      return {
        height: (format.height - 36) + 'px',
      };
    },
  },
};
</script>

<style scoped>
.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 4;
}
</style>
