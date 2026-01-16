<template>
  <div class="win98-desktop-wrapper">
    <Win98BootScreen v-if="!win98.bootComplete" @boot-complete="onBootComplete" />
    <Win98BSOD v-if="win98.bsodActive" @dismiss="onBsodDismiss" />
    <Win98Screensaver v-if="win98.screensaverActive" @dismiss="onScreensaverDismiss" />
    <Win98FormatContainer v-show="win98.desktopActive" />
    <Win98CursorTrail v-if="win98.cursorTrailEnabled && win98.desktopActive" />
    <Win98ErrorPopup
      v-for="error in win98.errorPopups"
      :key="error.id"
      :error="error"
      @dismiss="onErrorDismiss"
    />
    <div class="hotkey-hint" v-if="win98.desktopActive && showHotkeyHint">
      R: Reboot | E: Error | B: BSOD | S: Screensaver | P: Settings | F: Format | I: INSERT | H: Hide | Ctrl+Shift+X: Reset All
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_FORMATS } from '../../constants/win98';
import win98AssetsService from '../../services/win98Assets';
import { applySkinStyles, applyCustomBackgroundColor } from '../../utils/skinStyles';
import Win98BootScreen from './Win98BootScreen.vue';
import Win98FormatContainer from './Win98FormatContainer.vue';
import Win98Screensaver from './Win98Screensaver.vue';
import Win98BSOD from './Win98BSOD.vue';
import Win98ErrorPopup from './Win98ErrorPopup.vue';
import Win98CursorTrail from './Win98CursorTrail.vue';

export default {
  name: 'Win98Desktop',
  components: {
    Win98BootScreen,
    Win98FormatContainer,
    Win98Screensaver,
    Win98BSOD,
    Win98ErrorPopup,
    Win98CursorTrail,
  },
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      idleTimer: null,
      errorTimer: null,
      idleTime: 0,
      showHotkeyHint: true,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
  },
  watch: {
    'win98.errorInterval'() {
      this.restartErrorTimer();
    },
    'win98.errorsEnabled'() {
      this.restartErrorTimer();
    },
    'win98.screensaverTimeout'() {
      this.idleTime = 0;
    },
    'win98.activeSkin'(newSkin) {
      applySkinStyles(newSkin);
    },
    'win98.backgroundColor'(color) {
      if (!this.win98.customBackground) {
        applyCustomBackgroundColor(color);
      }
    },
  },
  mounted() {
    applySkinStyles(this.win98.activeSkin);
    if (this.win98.backgroundColor && !this.win98.customBackground) {
      applyCustomBackgroundColor(this.win98.backgroundColor);
    }
    this.startIdleTimer();
    this.startErrorTimer();
    this.restoreCustomVideos();
    document.addEventListener('mousemove', this.resetIdleTimer);
    document.addEventListener('click', this.resetIdleTimer);
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    this.stopIdleTimer();
    this.stopErrorTimer();
    document.removeEventListener('mousemove', this.resetIdleTimer);
    document.removeEventListener('click', this.resetIdleTimer);
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    onBootComplete() {
      this.settingsStore.win98CompleteBoot();
    },
    async restoreCustomVideos() {
      await win98AssetsService.dbReady;
      await win98AssetsService.restoreVideoBlobUrls();
      const videos = win98AssetsService.getCustomVideos();
      if (videos.length > 0 && this.win98.customVideos) {
        this.win98.customVideos.forEach((v, i) => {
          if (videos[i]) {
            v.src = videos[i].src;
          }
        });
      }
    },
    onBsodDismiss() {
      this.settingsStore.win98DismissBSOD();
    },
    onScreensaverDismiss() {
      this.settingsStore.win98DismissScreensaver();
      this.resetIdleTimer();
    },
    onErrorDismiss(errorId) {
      this.settingsStore.win98DismissError(errorId);
    },
    startIdleTimer() {
      this.idleTimer = setInterval(() => {
        if (this.win98.desktopActive && !this.win98.bsodActive) {
          this.idleTime += 1000;
          if (this.idleTime >= this.win98.screensaverTimeout) {
            this.settingsStore.win98ActivateScreensaver();
            this.idleTime = 0;
          }
        }
      }, 1000);
    },
    stopIdleTimer() {
      if (this.idleTimer) {
        clearInterval(this.idleTimer);
        this.idleTimer = null;
      }
    },
    resetIdleTimer() {
      this.idleTime = 0;
    },
    startErrorTimer() {
      if (!this.win98.errorsEnabled) return;
      this.errorTimer = setInterval(() => {
        if (this.win98.desktopActive && this.win98.errorsEnabled) {
          if (Math.random() < this.win98.errorProbability) {
            if (this.win98.errorPopups.length < this.win98.maxErrors) {
              this.triggerRandomError();
            }
          }
        }
      }, this.win98.errorInterval);
    },
    stopErrorTimer() {
      if (this.errorTimer) {
        clearInterval(this.errorTimer);
        this.errorTimer = null;
      }
    },
    restartErrorTimer() {
      this.stopErrorTimer();
      this.startErrorTimer();
    },
    triggerRandomError() {
      const messages = this.win98.errorMessages;
      if (messages.length === 0) return;
      const randomError = messages[Math.floor(Math.random() * messages.length)];
      this.settingsStore.win98ShowError(randomError);
    },
    handleKeydown(e) {
      if (!this.win98.desktopActive && !this.win98.bsodActive && !this.win98.screensaverActive) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

      const key = e.key.toLowerCase();

      if (e.ctrlKey && e.shiftKey && key === 'x') {
        e.preventDefault();
        this.resetAllState();
        return;
      }

      if (key === 'r') {
        e.preventDefault();
        this.settingsStore.win98TriggerBoot();
      } else if (key === 'e') {
        e.preventDefault();
        this.triggerRandomError();
      } else if (key === 'b') {
        e.preventDefault();
        if (this.win98.bsodActive) {
          this.settingsStore.win98DismissBSOD();
        } else {
          this.settingsStore.win98TriggerBSOD();
        }
      } else if (key === 's') {
        e.preventDefault();
        if (this.win98.screensaverActive) {
          this.settingsStore.win98DismissScreensaver();
        } else {
          this.settingsStore.win98ActivateScreensaver();
        }
      } else if (key === 'p') {
        e.preventDefault();
        this.settingsStore.win98OpenWindow('settings');
      } else if (key === 'f') {
        e.preventDefault();
        this.cycleFormat();
      } else if (key === 'i') {
        e.preventDefault();
        this.settingsStore.setAppMode('insert');
      } else if (key === 'h') {
        e.preventDefault();
        this.showHotkeyHint = !this.showHotkeyHint;
      }
    },
    cycleFormat() {
      const formats = Object.keys(WIN98_FORMATS);
      const currentIndex = formats.indexOf(this.win98.format);
      const nextIndex = (currentIndex + 1) % formats.length;
      this.settingsStore.win98UpdateSettings({ format: formats[nextIndex] });
    },
    async resetAllState() {
      if (!confirm('Reset all settings and clear all cached data?\n\nThis will remove all custom icons, videos, and settings.')) {
        return;
      }
      await win98AssetsService.clearAllData();
      this.settingsStore.win98Reset();
      localStorage.removeItem('appSettings');
      localStorage.removeItem('appState');
      applySkinStyles('win98');
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.win98-desktop-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  overflow: auto;
}

.hotkey-hint {
  position: fixed;
  bottom: 40px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #888;
  padding: 4px 8px;
  font-family: var(--win98-font);
  font-size: 10px;
  z-index: 50;
  pointer-events: none;
}
</style>
