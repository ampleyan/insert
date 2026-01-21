<template>
  <div class="win98-view" :style="win98Style">
    <Win98Desktop />
  </div>
</template>

<script>
import Win98Desktop from '../components/Win98/Win98Desktop.vue';
import { useSettingsStore } from '../stores/settings';

export default {
  name: 'Win98View',
  components: {
    Win98Desktop,
  },
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  computed: {
    win98Style() {
      const formats = {
        square: { width: 1080, height: 1080 },
        portrait: { width: 1080, height: 1350 },
        landscape: { width: 1080, height: 566 },
        reels: { width: 1080, height: 1920 }
      };
      const format = formats[this.settingsStore.win98.format] || formats.reels;
      return {
        width: `${format.width}px`,
        height: `${format.height}px`
      };
    },
  },
};
</script>

<style scoped>
.win98-view {
  position: relative;
  overflow: visible;
  margin: 0 auto;
}
</style>
