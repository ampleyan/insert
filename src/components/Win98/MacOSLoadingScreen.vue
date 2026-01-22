<template>
  <div class="macos-loading-screen" :style="loadingScreenStyle">
    <div v-if="hasBackgroundImage" class="macos-loading-background" :style="backgroundImageStyle"></div>
    <div class="loading-content">
<!--      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z'/%3E%3C/svg%3E" alt="Apple" class="apple-logo-loading">-->
          <img :src="getWin98AssetPath('gnome/assets/white gaw logo.PNG')"  alt="Apple" class="apple-logo-loading" />


      <div class="loading-text">{{ loadingMessage }}</div>

      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>

      <div class="loading-details">
        {{ userName }}
      </div>
    </div>
  </div>
</template>

<script>
import { getSkin } from '../../constants/skins';
import { useSettingsStore } from '../../stores/settings';
import {getWin98AssetPath} from "@/constants/win98";

export default {
  name: 'MacOSLoadingScreen',
  props: {
    userName: {
      type: String,
      default: 'User',
    },
  },
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      progress: 0,
      loadingMessage: 'Logging in...',
      progressInterval: null,
      messageTimeout: null,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    skin() {
      return getSkin(this.win98.activeSkin);
    },
    loginConfig() {
      return this.win98.macLoginScreen || {};
    },
    loadingScreenStyle() {
      const bgColor = this.loginConfig.backgroundColor || this.skin.colors.loginBg || '#6b7b9b';

      const styles = {
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor} 100%)`,
      };

      if (this.loginConfig.loadingBackgroundImage) {
        const opacity = (this.loginConfig.loadingBackgroundOpacity || 100) / 100;
        const blur = this.loginConfig.loadingBackgroundBlur || 0;
        const fit = this.loginConfig.loadingBackgroundFit || 'cover';

        styles.backgroundImage = `url(${this.loginConfig.loadingBackgroundImage})`;
        styles.backgroundSize = fit;
        styles.backgroundPosition = 'center';
        styles.backgroundRepeat = 'no-repeat';
        styles.position = 'relative';

        if (opacity < 1 || blur > 0) {
          styles.backgroundImage = 'none';
        }
      }

      return styles;
    },
    hasBackgroundImage() {
      return !!this.loginConfig.loadingBackgroundImage;
    },
    backgroundImageStyle() {
      if (!this.loginConfig.loadingBackgroundImage) return {};

      const opacity = (this.loginConfig.loadingBackgroundOpacity || 100) / 100;
      const blur = this.loginConfig.loadingBackgroundBlur || 0;
      const fit = this.loginConfig.loadingBackgroundFit || 'cover';
      const scale = (this.loginConfig.loadingBackgroundScale || 100) / 100;
      const posX = this.loginConfig.loadingBackgroundPosX ?? 50;
      const posY = this.loginConfig.loadingBackgroundPosY ?? 50;

      return {
        backgroundImage: `url(${this.loginConfig.loadingBackgroundImage})`,
        backgroundSize: fit,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundRepeat: 'no-repeat',
        opacity: opacity,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        transform: scale !== 1 ? `scale(${scale})` : 'none',
      };
    },
  },
  mounted() {
    this.startLoadingAnimation();
  },
  beforeUnmount() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
  },
  methods: {
    getWin98AssetPath,
    startLoadingAnimation() {
      const messages = [
        'Verifying credentials...',
        'Loading user preferences...',
        'Initializing desktop...',
        'Starting system services...',
        'Almost ready...',
      ];

      let messageIndex = 0;

      this.progressInterval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += Math.random() * 15;
          if (this.progress > 100) {
            this.progress = 100;
          }

          const expectedIndex = Math.floor((this.progress / 100) * messages.length);
          if (expectedIndex !== messageIndex && expectedIndex < messages.length) {
            messageIndex = expectedIndex;
            this.loadingMessage = messages[messageIndex];
          }
        }

        if (this.progress >= 100) {
          clearInterval(this.progressInterval);
          this.messageTimeout = setTimeout(() => {
            this.$emit('loading-complete');
          }, 500);
        }
      }, 150);
    },
  },
};
</script>

<style scoped>
.macos-loading-screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Charcoal', 'Geneva', 'Lucida Grande', 'Helvetica Neue', Helvetica, sans-serif;
  position: relative;
  overflow: hidden;
}

.macos-loading-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 400px;
  width: 90%;
  position: relative;
  z-index: 1;
}

.apple-logo-loading {
  width: 240px;
  height:240px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.loading-text {
  color: white;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  min-height: 27px;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.95));
  border-radius: 4px;
  transition: width 0.3s ease-out;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.loading-details {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  text-align: center;
}
</style>
