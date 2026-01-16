<template>
  <div class="win98-background" :style="backgroundStyle">
    <img v-if="showLogo" :src="logoPath" alt="Logo" class="background-logo" />
  </div>
</template>

<script>
import { getWin98AssetPath } from '../../constants/win98';
import { useSettingsStore } from '../../stores/settings';

export default {
  name: 'Win98Background',
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    logoPath() {
      return getWin98AssetPath('win98/assets/insert_logo.png');
    },
    showLogo() {
      return !this.win98.customBackground;
    },
    backgroundStyle() {
      const bg = this.win98.customBackground;
      const color = this.win98.backgroundColor || '#008080';

      if (bg) {
        const fit = this.win98.customBackgroundFit || 'cover';
        let size = fit;
        let repeat = 'no-repeat';
        let position = 'center';

        if (fit === 'stretch') {
          size = '100% 100%';
        } else if (fit === 'tile') {
          size = 'auto';
          repeat = 'repeat';
        } else if (fit === 'center') {
          size = 'auto';
        }

        return {
          backgroundImage: `url(${bg})`,
          backgroundSize: size,
          backgroundRepeat: repeat,
          backgroundPosition: position,
          backgroundColor: color,
        };
      }

      return { backgroundColor: color };
    },
  },
};
</script>

<style scoped>
.win98-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--win98-desktop, #008080);
  display: flex;
  justify-content: center;
  z-index: 0;
}

.background-logo {
  opacity: 0.6;
  pointer-events: none;
}
</style>
