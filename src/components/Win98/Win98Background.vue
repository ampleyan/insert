<template>
  <div class="win98-background" :style="backgroundColorStyle">
    <div v-if="win98.customBackground" class="background-image" :style="backgroundImageStyle"></div>
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
    backgroundColorStyle() {
      return {
        backgroundColor: this.win98.backgroundColor || '#008080',
      };
    },
    backgroundImageStyle() {
      const bg = this.win98.customBackground;
      if (!bg) return {};

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

      const opacity = this.win98.backgroundOpacity ?? 1;
      const blendMode = this.win98.backgroundBlendMode || 'normal';
      const brightness = this.win98.backgroundBrightness ?? 100;
      const contrast = this.win98.backgroundContrast ?? 100;
      const saturate = this.win98.backgroundSaturate ?? 100;
      const blur = this.win98.backgroundBlur ?? 0;

      const filters = [];
      if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
      if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
      if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
      if (blur > 0) filters.push(`blur(${blur}px)`);

      return {
        backgroundImage: `url(${bg})`,
        backgroundSize: size,
        backgroundRepeat: repeat,
        backgroundPosition: position,
        opacity: opacity,
        mixBlendMode: blendMode,
        filter: filters.length > 0 ? filters.join(' ') : 'none',
      };
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

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.background-logo {
  opacity: 0.6;
  pointer-events: none;
}
</style>
