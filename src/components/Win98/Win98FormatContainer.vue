<template>
  <div class="win98-format-container" :class="win98.format" :style="containerStyle">
    <Win98Background />
    <Win98DesktopIcons @play-sound="playSound" />
    <Win98Taskbar />
    <Win98Window
      v-for="windowId in win98.openWindows"
      :key="windowId"
      :window-id="windowId"
    />
    <div v-if="win98.showFormatInfo" class="format-info">
      {{ formatInfo }}
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_FORMATS, WIN98_SOUNDS } from '../../constants/win98';
import Win98Background from './Win98Background.vue';
import Win98DesktopIcons from './Win98DesktopIcons.vue';
import Win98Taskbar from './Win98Taskbar.vue';
import Win98Window from './Win98Window.vue';

export default {
  name: 'Win98FormatContainer',
  components: {
    Win98Background,
    Win98DesktopIcons,
    Win98Taskbar,
    Win98Window,
  },
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      sounds: {},
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    containerStyle() {
      const format = WIN98_FORMATS[this.win98.format];
      return {
        width: format.width + 'px',
        height: format.height + 'px',
      };
    },
    formatInfo() {
      const format = WIN98_FORMATS[this.win98.format];
      return `${format.name} - ${format.width}x${format.height} (${format.ratio})`;
    },
  },
  mounted() {
    this.preloadSounds();
  },
  methods: {
    preloadSounds() {
      Object.keys(WIN98_SOUNDS).forEach(key => {
        const audio = new Audio('/' + WIN98_SOUNDS[key]);
        audio.preload = 'auto';
        this.sounds[key] = audio;
      });
    },
    playSound(soundName) {
      if (!this.win98.soundEnabled) return;
      const sound = this.sounds[soundName];
      if (sound) {
        sound.volume = this.win98.volume;
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    },
  },
};
</script>

<style scoped>
.win98-format-container {
  position: relative;
  margin: 0 auto;
  background: #008080;
  overflow: hidden;
}

.format-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px 10px;
  font-family: var(--win98-font);
  font-size: 11px;
  z-index: 100;
}
</style>
