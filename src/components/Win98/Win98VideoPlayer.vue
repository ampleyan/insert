<template>
  <div class="win98-video-player" :class="{ 'mac-style': isMacTheme }">
    <div class="video-container">
      <video
        ref="video"
        :src="videoPath"
        :muted="isMuted"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        @play="onPlay"
        @pause="onPause"
      ></video>
    </div>
    <div v-if="isMacTheme" class="mac-video-controls">
      <div class="mac-controls-row">
        <div class="mac-seek-container" @click="seek">
          <div class="mac-seek-track">
            <div class="mac-seek-progress" :style="{ width: progress + '%' }"></div>
            <div class="mac-seek-thumb" :style="{ left: progress + '%' }"></div>
          </div>
        </div>
      </div>
      <div class="mac-controls-row mac-buttons-row">
        <div class="mac-time-display">{{ formatTime(currentTime) }}</div>
        <div class="mac-center-controls">
          <button class="mac-control-btn" @click="skipBack" title="Skip back">
            <span class="mac-icon">⏮</span>
          </button>
          <button class="mac-control-btn mac-play-btn" @click="togglePlay">
            <span class="mac-icon">{{ isPlaying ? '⏸' : '▶' }}</span>
          </button>
          <button class="mac-control-btn" @click="skipForward" title="Skip forward">
            <span class="mac-icon">⏭</span>
          </button>
        </div>
        <div class="mac-volume-control">
          <button class="mac-control-btn mac-volume-btn" @click="toggleMute">
            <span class="mac-icon">{{ isMuted ? '🔇' : '🔊' }}</span>
          </button>
          <input
            type="range"
            class="mac-volume-slider"
            min="0"
            max="1"
            step="0.1"
            :value="volume"
            @input="setVolume($event.target.value)"
          />
        </div>
      </div>
    </div>
    <div v-else class="video-controls win98-frame-sunken">
      <button class="control-btn win98-button" @click="togglePlay">
        {{ isPlaying ? '⏸' : '▶' }}
      </button>
      <button class="control-btn win98-button" @click="stop">■</button>
      <div class="seek-container" @click="seek">
        <div class="seek-bar win98-frame-sunken">
          <div class="seek-progress" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <div class="time-display">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_ICONS, getWin98AssetPath } from '../../constants/win98';

export default {
  name: 'Win98VideoPlayer',
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    isMacTheme() {
      return this.win98.activeSkin === 'macOSX1' || this.win98.activeSkin === 'macOS9';
    },
    videoSrc() {
      const icon = WIN98_ICONS[this.videoId];
      if (icon) return icon.src;
      const customVideo = this.win98.customVideos?.find(v => v.id === this.videoId);
      if (customVideo) return customVideo.src;
      return '';
    },
    videoPath() {
      if (!this.videoSrc) return '';
      if (this.videoSrc.startsWith('blob:') || this.videoSrc.startsWith('data:')) {
        return this.videoSrc;
      }
      return getWin98AssetPath(this.videoSrc);
    },
    isMuted() {
      const videoState = this.win98.videoStates[this.videoId];
      return videoState ? videoState.muted : true;
    },
    volume() {
      return this.win98.volume || 0.5;
    },
    shouldPlay() {
      const videoState = this.win98.videoStates[this.videoId];
      return videoState ? videoState.playing : false;
    },
  },
  watch: {
    isMuted(val) {
      if (this.$refs.video) {
        this.$refs.video.muted = val;
      }
    },
    'win98.volume'(val) {
      if (this.$refs.video) {
        this.$refs.video.volume = val;
      }
    },
    shouldPlay: {
      handler(val) {
        if (!this.$refs.video) return;
        if (val && !this.isPlaying) {
          this.$refs.video.play();
        } else if (!val && this.isPlaying) {
          this.$refs.video.pause();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.$refs.video) {
      this.$refs.video.volume = this.win98.volume;
      this.$refs.video.addEventListener('loadedmetadata', () => {
        this.duration = this.$refs.video.duration;
        if (this.shouldPlay) {
          this.$refs.video.play();
        }
      });
    }
  },
  methods: {
    togglePlay() {
      if (!this.$refs.video) return;

      if (this.isPlaying) {
        this.$refs.video.pause();
      } else {
        this.settingsStore.win98SetAudioFocus(this.videoId);
        this.$refs.video.play();
      }
    },
    stop() {
      if (!this.$refs.video) return;
      this.$refs.video.pause();
      this.$refs.video.currentTime = 0;
      this.isPlaying = false;
    },
    seek(e) {
      if (!this.$refs.video) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      this.$refs.video.currentTime = pos * this.duration;
    },
    onTimeUpdate() {
      if (!this.$refs.video) return;
      this.currentTime = this.$refs.video.currentTime;
      this.progress = this.duration ? (this.currentTime / this.duration) * 100 : 0;
    },
    onPlay() {
      this.isPlaying = true;
    },
    onPause() {
      this.isPlaying = false;
    },
    onEnded() {
      this.isPlaying = false;
    },
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    skipBack() {
      if (!this.$refs.video) return;
      this.$refs.video.currentTime = Math.max(0, this.$refs.video.currentTime - 10);
    },
    skipForward() {
      if (!this.$refs.video) return;
      this.$refs.video.currentTime = Math.min(this.duration, this.$refs.video.currentTime + 10);
    },
    toggleMute() {
      this.settingsStore.win98ToggleVideoMute(this.videoId);
    },
    setVolume(value) {
      if (this.$refs.video) {
        this.$refs.video.volume = parseFloat(value);
      }
      this.settingsStore.win98UpdateSettings({ volume: parseFloat(value) });
    },
  },
};
</script>

<style scoped>
.win98-video-player {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.video-container {
  background: #000;
  width: 100%;
  flex: 1;
  min-height: 0;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: var(--win98-gray);
}

.control-btn {
  width: 28px;
  height: 24px;
  padding: 0;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seek-container {
  flex: 1;
  cursor: pointer;
  padding: 4px 0;
}

.seek-bar {
  height: 8px;
  background: var(--win98-white);
  position: relative;
}

.seek-progress {
  height: 100%;
  background: var(--win98-blue);
  transition: width 0.1s linear;
}

.time-display {
  font-family: var(--win98-font);
  font-size: 10px;
  color: var(--win98-black);
  min-width: 70px;
  text-align: right;
}

/* Mac QuickTime-style player */
.win98-video-player.mac-style {
  background: linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 50%, #b8b8b8 100%);
  border-radius: 6px;
  overflow: hidden;
}

.mac-style .video-container {
  background: #000;
  border-radius: 0;
  margin: 8px;
  margin-bottom: 0;
}

.mac-video-controls {
  padding: 8px 12px 12px;
  background: linear-gradient(180deg, #d0d0d0 0%, #b8b8b8 100%);
}

.mac-controls-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mac-buttons-row {
  margin-top: 8px;
  justify-content: space-between;
}

.mac-seek-container {
  flex: 1;
  cursor: pointer;
  padding: 4px 0;
}

.mac-seek-track {
  height: 6px;
  background: linear-gradient(180deg, #888 0%, #aaa 100%);
  border-radius: 3px;
  position: relative;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.mac-seek-progress {
  height: 100%;
  background: linear-gradient(180deg, #4a90d9 0%, #357abd 100%);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.mac-seek-thumb {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background: linear-gradient(180deg, #fff 0%, #ddd 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  border: 1px solid #999;
}

.mac-center-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mac-control-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: linear-gradient(180deg, #f0f0f0 0%, #d0d0d0 100%);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 1px solid #999;
}

.mac-control-btn:hover {
  background: linear-gradient(180deg, #fff 0%, #e0e0e0 100%);
}

.mac-control-btn:active {
  background: linear-gradient(180deg, #c0c0c0 0%, #d0d0d0 100%);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.mac-play-btn {
  width: 36px;
  height: 36px;
}

.mac-icon {
  font-size: 12px;
  color: #333;
}

.mac-play-btn .mac-icon {
  font-size: 16px;
}

.mac-time-display {
  font-family: 'Lucida Grande', 'Helvetica Neue', sans-serif;
  font-size: 11px;
  color: #333;
  min-width: 40px;
}

.mac-volume-control {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mac-volume-btn {
  width: 24px;
  height: 24px;
}

.mac-volume-slider {
  width: 60px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(180deg, #888 0%, #aaa 100%);
  border-radius: 2px;
  cursor: pointer;
}

.mac-volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: linear-gradient(180deg, #fff 0%, #ddd 100%);
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid #999;
  cursor: pointer;
}
</style>
