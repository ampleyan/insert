<template>
  <div class="win98-video-player">
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
    <div class="video-controls win98-frame-sunken">
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
    videoSrc() {
      const icon = WIN98_ICONS[this.videoId];
      return icon ? icon.src : '';
    },
    videoPath() {
      return this.videoSrc ? getWin98AssetPath(this.videoSrc) : '';
    },
    isMuted() {
      const videoState = this.win98.videoStates[this.videoId];
      return videoState ? videoState.muted : true;
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
  },
};
</script>

<style scoped>
.win98-video-player {
  width: 100%;
}

.video-container {
  background: #000;
  width: 100%;
  aspect-ratio: 16 / 9;
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
</style>
