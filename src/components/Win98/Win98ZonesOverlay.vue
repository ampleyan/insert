<template>
  <div v-if="visible" class="zones-overlay">
    <div
      v-for="(zone, zoneId) in zones"
      :key="zoneId"
      class="zone"
      :class="zoneId"
      :style="getZoneStyle(zone)"
    >
      <span class="zone-label">{{ zone.label }}</span>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_FORMATS } from '../../constants/win98';

export default {
  name: 'Win98ZonesOverlay',
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    visible() {
      return this.win98.zonesVisible;
    },
    zones() {
      return this.win98.zones || {};
    },
    formatHeight() {
      const format = WIN98_FORMATS[this.win98.format] || WIN98_FORMATS.portrait;
      return format.height - 36;
    },
  },
  methods: {
    getZoneStyle(zone) {
      const top = (zone.y / 100) * this.formatHeight;
      const height = (zone.heightPercent / 100) * this.formatHeight;
      return {
        top: top + 'px',
        height: height + 'px',
        background: zone.color,
      };
    },
  },
};
</script>

<style scoped>
.zones-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 28px;
  pointer-events: none;
  z-index: 5;
}

.zone {
  position: absolute;
  left: 0;
  right: 0;
  border: 1px dashed rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 4px;
}

.zone-label {
  font-family: var(--win98-font);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  text-transform: uppercase;
}

.zone.header {
  border-color: rgba(255, 215, 0, 0.5);
}

.zone.lineup {
  border-color: rgba(100, 149, 237, 0.5);
}

.zone.footer {
  border-color: rgba(128, 128, 128, 0.5);
}
</style>
