<template>
  <div class="win98-taskbar win98-frame">
    <button class="win98-start-button win98-button" @click="toggleSettings">
      <span class="start-icon">&#9733;</span>
      <span>Start</span>
    </button>
    <div class="taskbar-spacer"></div>
    <div class="taskbar-tray win98-frame-sunken">
      <span class="clock">{{ time }}</span>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';

export default {
  name: 'Win98Taskbar',
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      time: '',
      clockInterval: null,
    };
  },
  mounted() {
    this.updateClock();
    this.clockInterval = setInterval(this.updateClock, 1000);
  },
  beforeUnmount() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  },
  methods: {
    updateClock() {
      const now = new Date();
      this.time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    },
    toggleSettings() {
      const win98 = this.settingsStore.win98;
      if (win98.openWindows.includes('settings')) {
        this.settingsStore.win98CloseWindow('settings');
      } else {
        this.settingsStore.win98OpenWindow('settings');
      }
    },
  },
};
</script>

<style scoped>
.win98-taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  display: flex;
  align-items: center;
  padding: 2px 4px;
  z-index: 500;
}

.win98-start-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-weight: bold;
}

.start-icon {
  font-size: 16px;
}

.taskbar-spacer {
  flex: 1;
}

.taskbar-tray {
  padding: 2px 8px;
  font-family: var(--win98-font);
  font-size: 11px;
}

.clock {
  color: var(--win98-black);
}
</style>
