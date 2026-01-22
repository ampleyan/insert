<template>
  <div class="win98-desktop-wrapper" :style="wrapperStyle">
    <div v-if="showMacLoadingScreen" class="fullscreen-container" :style="formatStyle">
      <MacOSLoadingScreen
        :userName="win98.macLoginScreen.userName"
        @loading-complete="onLoadingComplete"
      />
    </div>
    <div v-else-if="win98.showMacLoginScreen" class="fullscreen-container" :style="formatStyle">
      <MacOSLoginScreen
        @login="onMacLogin"
        @shutdown="onMacShutdown"
        @change-password="onMacChangePassword"
      />
    </div>
    <div v-if="!win98.bootComplete && !win98.showMacLoginScreen" class="fullscreen-container" :style="formatStyle">
      <Win98BootScreen @boot-complete="onBootComplete" />
    </div>
    <div v-if="win98.bsodActive" class="fullscreen-container" :style="formatStyle">
      <Win98BSOD @dismiss="onBsodDismiss" />
    </div>
    <div v-if="win98.screensaverActive" class="fullscreen-container" :style="formatStyle">
      <Win98Screensaver @dismiss="onScreensaverDismiss" />
    </div>
    <Win98FormatContainer v-show="win98.desktopActive && !win98.showMacLoginScreen" />
    <Win98CursorTrail v-if="win98.cursorTrailEnabled && win98.desktopActive && !win98.showMacLoginScreen" />
    <Win98ErrorPopup
      v-for="error in win98.errorPopups"
      :key="error.id"
      :error="error"
      @dismiss="onErrorDismiss"
    />
    <div class="hotkey-hint" v-if="win98.desktopActive && showHotkeyHint && !win98.showMacLoginScreen">
      R: Reboot | E: Error | B: BSOD | S: Screensaver | P: Settings | F: Format | I: Back to INSERT | H: Hide | L: Login | Ctrl+R: Record | Ctrl+Shift+X: Reset All
    </div>
    <div class="recording-controls">
      <button
        class="record-btn"
        :class="{ recording: isRecording }"
        @click="toggleRecording"
        :title="isRecording ? 'Stop Recording' : 'Start Recording (Ctrl+R)'"
      >
        <span class="record-icon"></span>
        <span class="record-text">{{ isRecording ? recordingTimeDisplay : 'REC' }}</span>
      </button>
      <div class="record-settings" v-if="!isRecording">
        <select v-model="recordingFrameRate" class="record-select" title="Frame rate">
          <option :value="15">15fps</option>
          <option :value="30">30fps</option>
        </select>
        <label class="record-audio-toggle" title="Record audio (microphone)">
          <input type="checkbox" v-model="recordingWithAudio" />
          <span class="audio-icon">{{ recordingWithAudio ? '🔊' : '🔇' }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_FORMATS } from '../../constants/win98';
import win98AssetsService from '../../services/win98Assets';
import { applySkinStyles, applyCustomBackgroundColor } from '../../utils/skinStyles';
import nativeRecorder from '../../services/nativeRecorder';
import MacOSLoginScreen from './MacOSLoginScreen.vue';
import MacOSLoadingScreen from './MacOSLoadingScreen.vue';
import Win98BootScreen from './Win98BootScreen.vue';
import Win98FormatContainer from './Win98FormatContainer.vue';
import Win98Screensaver from './Win98Screensaver.vue';
import Win98BSOD from './Win98BSOD.vue';
import Win98ErrorPopup from './Win98ErrorPopup.vue';
import Win98CursorTrail from './Win98CursorTrail.vue';

export default {
  name: 'Win98Desktop',
  components: {
    MacOSLoginScreen,
    MacOSLoadingScreen,
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
      showMacLoadingScreen: false,
      isRecording: false,
      recordingTime: 0,
      recordingFrameRate: 30,
      recordingWithAudio: true,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    recordingTimeDisplay() {
      const mins = Math.floor(this.recordingTime / 60);
      const secs = this.recordingTime % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    formatDimensions() {
      const formats = {
        square: { width: 1080, height: 1080 },
        portrait: { width: 1080, height: 1350 },
        landscape: { width: 1080, height: 566 },
        reels: { width: 1080, height: 1920 }
      };
      return formats[this.win98.format] || formats.reels;
    },
    wrapperStyle() {
      return {
        width: this.formatDimensions.width + 'px',
        height: this.formatDimensions.height + 'px',
      };
    },
    formatStyle() {
      return {
        width: this.formatDimensions.width + 'px',
        height: this.formatDimensions.height + 'px',
      };
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
    onMacLogin(data) {
      console.log('Mac OS Login:', data);
      this.showMacLoadingScreen = true;
    },
    onLoadingComplete() {
      this.showMacLoadingScreen = false;
      this.settingsStore.win98UpdateSettings({ showMacLoginScreen: false });
      this.settingsStore.win98CompleteBoot();
    },
    onMacShutdown() {
      console.log('Mac OS Shutdown');
      this.$router.push('/insert');
    },
    onMacChangePassword(data) {
      console.log('Mac OS Change Password:', data);
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
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

      const key = e.key.toLowerCase();

      if (e.ctrlKey && key === 'r') {
        e.preventDefault();
        this.toggleRecording();
        return;
      }

      if (!this.win98.desktopActive && !this.win98.bsodActive && !this.win98.screensaverActive && !this.win98.showMacLoginScreen) return;

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
        this.$router.push('/insert');
      } else if (key === 'h') {
        e.preventDefault();
        this.showHotkeyHint = !this.showHotkeyHint;
      } else if (key === 'l') {
        e.preventDefault();
        this.settingsStore.win98UpdateSettings({ showMacLoginScreen: !this.win98.showMacLoginScreen });
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
    async toggleRecording() {
      if (this.isRecording) {
        await this.stopRecording();
      } else {
        await this.startRecording();
      }
    },
    async startRecording() {
      const targetElement = document.querySelector('.win98-view');
      if (!targetElement) {
        console.error('Could not find .win98-view element');
        return;
      }

      try {
        await nativeRecorder.startRecording(
          targetElement,
          this.formatDimensions.width,
          this.formatDimensions.height,
          {
            frameRate: this.recordingFrameRate,
            videoBitsPerSecond: 8000000,
            captureAudio: this.recordingWithAudio,
            onTimeUpdate: (time) => {
              this.recordingTime = time;
            },
          }
        );
        this.isRecording = true;
        this.recordingTime = 0;
      } catch (error) {
        console.error('Failed to start recording:', error);
        alert('Failed to start recording: ' + error.message);
      }
    },
    async stopRecording() {
      try {
        await nativeRecorder.stopRecording();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const format = this.win98.format || 'reels';
        nativeRecorder.downloadRecording(`studio-${format}-${timestamp}.webm`);
      } catch (error) {
        console.error('Failed to stop recording:', error);
      }
      this.isRecording = false;
      this.recordingTime = 0;
    },
  },
};
</script>

<style scoped>
.win98-desktop-wrapper {
  position: relative;
  background: #000;
  overflow: hidden;
}

.fullscreen-container {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
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

.recording-controls {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 9999;
}

.record-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-family: monospace;
  font-size: 12px;
  transition: all 0.2s;
}

.record-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.4);
}

.record-btn.recording {
  background: rgba(180, 0, 0, 0.9);
  border-color: rgba(255, 100, 100, 0.5);
}

.record-icon {
  width: 12px;
  height: 12px;
  background: #ff3333;
  border-radius: 50%;
}

.record-btn.recording .record-icon {
  animation: pulse-record 1s ease-in-out infinite;
}

@keyframes pulse-record {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.record-text {
  min-width: 36px;
  text-align: center;
}

.record-settings {
  display: flex;
  gap: 4px;
}

.record-select {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  padding: 6px 8px;
  font-size: 11px;
  cursor: pointer;
}

.record-select:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.record-audio-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.record-audio-toggle:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.record-audio-toggle input {
  display: none;
}

.audio-icon {
  font-size: 14px;
}
</style>
