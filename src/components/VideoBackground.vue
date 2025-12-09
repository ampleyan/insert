<template>
  <div class="video-container">
    <VideoLayer v-for="layer in videoStore.layers" :key="layer.id" :layer="layer" />
    <div class="backdrop-filter" :style="backdropStyle"></div>
  </div>
</template>

<script>
import VideoLayer from './VideoLayer.vue';
import { useVideoStore } from '@/stores/videos';

export default {
  name: 'VideoBackground',
  components: {
    VideoLayer,
  },
  props: {
    settings: {
      type: Object,
      default: () => ({
        backdropBlur: 0,
        backdropBrightness: 100,
        backdropContrast: 100,
        backdropSaturate: 100,
      }),
    },
  },
  setup() {
    const videoStore = useVideoStore();
    return { videoStore };
  },
  computed: {
    backdropStyle() {
      const filters = [];
      if (this.settings.backdropBlur > 0) {
        filters.push(`blur(${this.settings.backdropBlur}px)`);
      }
      if (this.settings.backdropBrightness !== 100) {
        filters.push(`brightness(${this.settings.backdropBrightness}%)`);
      }
      if (this.settings.backdropContrast !== 100) {
        filters.push(`contrast(${this.settings.backdropContrast}%)`);
      }
      if (this.settings.backdropSaturate !== 100) {
        filters.push(`saturate(${this.settings.backdropSaturate}%)`);
      }

      return {
        backdropFilter: filters.join(' '),
        WebkitBackdropFilter: filters.join(' '),
      };
    },
  },
};
</script>

<style scoped>
.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

.backdrop-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}
</style>
