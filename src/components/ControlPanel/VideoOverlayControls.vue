<template>
  <div class="video-overlay-controls">
    <div class="section-header">
      <h4>Video Overlays</h4>
      <div class="header-buttons">
        <button class="add-video-button" @click="triggerFileInput">+ Add Video</button>
        <button class="capture-video-button" @click="captureFromCamera" title="Capture from camera">📷 Camera</button>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="video/mp4,video/webm,video/mov,video/avi"
      multiple
      @change="handleFileUpload"
      style="display: none"
    />

    <div v-if="isRecording" class="recording-status">
      <div class="recording-indicator"></div>
      <span>Recording... Click "Stop" to finish</span>
      <button class="stop-recording-button" @click="stopRecording">⏹ Stop</button>
    </div>

    <div v-if="videos.length === 0" class="empty-state">
      <p>No videos added yet. Click "+ Add Video" to upload.</p>
    </div>

    <div v-for="(video, index) in videos" :key="index" class="video-item">
      <div class="video-header">
        <div class="video-preview">
          <video :src="video.src" muted></video>
        </div>
        <div class="video-info">
          <span class="video-name">{{ video.name }}</span>
          <div class="video-actions">
            <button
              :class="['visibility-button', { hidden: !video.visible }]"
              @click="toggleVisibility(index)"
              :title="video.visible ? 'Hide video' : 'Show video'"
            >
              {{ video.visible ? '👁' : '👁‍🗨' }}
            </button>
            <button class="remove-button" @click="removeVideo(index)" title="Remove video">
              ✕
            </button>
          </div>
        </div>
      </div>

      <div class="video-controls-expanded">
        <div class="control-row">
          <label>Playback</label>
          <div class="playback-controls">
            <button @click="updateVideo(index, 'playing', !video.playing)">
              {{ video.playing ? '⏸ Pause' : '▶ Play' }}
            </button>
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="video.loop || false"
                @change="updateVideo(index, 'loop', $event.target.checked)"
              />
              <span>Loop</span>
            </label>
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="video.muted !== false"
                @change="updateVideo(index, 'muted', $event.target.checked)"
              />
              <span>Mute</span>
            </label>
          </div>
        </div>

        <div class="control-row">
          <label>Speed</label>
          <div class="range-control">
            <input
              type="range"
              :value="video.playbackRate || 1"
              @input="updateVideo(index, 'playbackRate', parseFloat($event.target.value))"
              min="0.25"
              max="2"
              step="0.25"
            />
            <input
              type="number"
              class="value-input"
              :value="video.playbackRate || 1"
              @input="updateVideo(index, 'playbackRate', parseFloat($event.target.value))"
              min="0.25"
              max="2"
              step="0.25"
            />
            <span class="unit">×</span>
          </div>
        </div>

        <div class="control-row">
          <label>Opacity</label>
          <div class="range-control">
            <input
              type="range"
              :value="video.opacity !== undefined ? video.opacity : 100"
              @input="updateVideo(index, 'opacity', parseInt($event.target.value))"
              min="0"
              max="100"
            />
            <input
              type="number"
              class="value-input"
              :value="video.opacity !== undefined ? video.opacity : 100"
              @input="updateVideo(index, 'opacity', parseInt($event.target.value))"
              min="0"
              max="100"
            />
            <span class="unit">%</span>
          </div>
        </div>

        <div class="control-row">
          <label>Scale</label>
          <div class="range-control">
            <input
              type="range"
              :value="video.scale || 1"
              @input="updateVideo(index, 'scale', parseFloat($event.target.value))"
              min="0.1"
              max="5"
              step="0.1"
            />
            <input
              type="number"
              class="value-input"
              :value="video.scale || 1"
              @input="updateVideo(index, 'scale', parseFloat($event.target.value))"
              min="0.1"
              max="5"
              step="0.1"
            />
            <span class="unit">×</span>
          </div>
        </div>

        <div class="control-row">
          <label>Rotation</label>
          <div class="range-control">
            <input
              type="range"
              :value="video.rotation || 0"
              @input="updateVideo(index, 'rotation', parseInt($event.target.value))"
              min="0"
              max="360"
            />
            <input
              type="number"
              class="value-input"
              :value="video.rotation || 0"
              @input="updateVideo(index, 'rotation', parseInt($event.target.value))"
              min="0"
              max="360"
            />
            <span class="unit">°</span>
          </div>
        </div>

        <div class="control-row">
          <label>Hue</label>
          <div class="range-control">
            <input
              type="range"
              :value="video.hue || 0"
              @input="updateVideo(index, 'hue', parseInt($event.target.value))"
              min="0"
              max="360"
            />
            <input
              type="number"
              class="value-input"
              :value="video.hue || 0"
              @input="updateVideo(index, 'hue', parseInt($event.target.value))"
              min="0"
              max="360"
            />
            <span class="unit">°</span>
          </div>
        </div>

        <div class="control-row">
          <label>Blend Mode</label>
          <select
            :value="video.blendMode || 'normal'"
            @change="updateVideo(index, 'blendMode', $event.target.value)"
          >
            <option value="normal">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
            <option value="color-dodge">Color Dodge</option>
            <option value="color-burn">Color Burn</option>
            <option value="hard-light">Hard Light</option>
            <option value="soft-light">Soft Light</option>
            <option value="difference">Difference</option>
            <option value="exclusion">Exclusion</option>
            <option value="hue">Hue</option>
            <option value="saturation">Saturation</option>
            <option value="color">Color</option>
            <option value="luminosity">Luminosity</option>
          </select>
        </div>

        <div class="control-row">
          <label>Layer Order</label>
          <div class="layer-order-controls">
            <button @click="moveVideoUp(index)" :disabled="index === 0" title="Move up">↑</button>
            <button @click="moveVideoDown(index)" :disabled="index === videos.length - 1" title="Move down">↓</button>
            <span class="layer-number">Layer {{ index + 1 }}</span>
          </div>
        </div>

        <div class="control-row">
          <label>Animation</label>
          <select
            :value="video.animation?.preset || 'none'"
            @change="updateAnimation(index, 'preset', $event.target.value)"
          >
            <option value="none">None</option>
            <option value="fade-in">Fade In</option>
            <option value="fade-out">Fade Out</option>
            <option value="slide-left">Slide Left</option>
            <option value="slide-right">Slide Right</option>
            <option value="slide-up">Slide Up</option>
            <option value="slide-down">Slide Down</option>
            <option value="zoom-in">Zoom In</option>
            <option value="zoom-out">Zoom Out</option>
            <option value="bounce">Bounce</option>
            <option value="split-flicker">Split Flicker</option>
          </select>
        </div>

        <div v-if="video.animation?.preset !== 'none'" class="animation-params">
          <div class="control-row">
            <label>Duration</label>
            <div class="range-control">
              <input
                type="range"
                :value="video.animation?.duration || 1000"
                @input="updateAnimation(index, 'duration', parseInt($event.target.value))"
                min="100"
                max="5000"
                step="100"
              />
              <input
                type="number"
                class="value-input"
                :value="video.animation?.duration || 1000"
                @input="updateAnimation(index, 'duration', parseInt($event.target.value))"
                min="100"
                max="5000"
                step="100"
              />
              <span class="unit">ms</span>
            </div>
          </div>

          <div class="control-row">
            <label>Delay</label>
            <div class="range-control">
              <input
                type="range"
                :value="video.animation?.delay || 0"
                @input="updateAnimation(index, 'delay', parseInt($event.target.value))"
                min="0"
                max="5000"
                step="100"
              />
              <input
                type="number"
                class="value-input"
                :value="video.animation?.delay || 0"
                @input="updateAnimation(index, 'delay', parseInt($event.target.value))"
                min="0"
                max="5000"
                step="100"
              />
              <span class="unit">ms</span>
            </div>
          </div>

          <div class="control-row">
            <label>
              <input
                type="checkbox"
                :checked="video.animation?.loop || false"
                @change="updateAnimation(index, 'loop', $event.target.checked)"
              />
              <span>Loop Animation</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoOverlayControls',
  props: {
    videos: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update'],
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      recordedChunks: [],
      stream: null
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async handleFileUpload(event) {
      const files = Array.from(event.target.files);

      for (const file of files) {
        if (file && file.type && file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file);
          const newVideos = [...this.videos];
          newVideos.push({
            src: url,
            name: file.name,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 100,
            hue: 0,
            blendMode: 'normal',
            visible: true,
            zIndex: newVideos.length + 20,
            playing: false,
            loop: true,
            muted: true,
            playbackRate: 1
          });
          this.$emit('update', { videoOverlays: newVideos });
        }
      }

      event.target.value = '';
    },

    removeVideo(index) {
      const video = this.videos[index];
      if (video.src.startsWith('blob:')) {
        URL.revokeObjectURL(video.src);
      }

      const newVideos = [...this.videos];
      newVideos.splice(index, 1);
      this.$emit('update', { videoOverlays: newVideos });
    },

    toggleVisibility(index) {
      const newVideos = [...this.videos];
      newVideos[index] = {
        ...newVideos[index],
        visible: !newVideos[index].visible
      };
      this.$emit('update', { videoOverlays: newVideos });
    },

    updateVideo(index, property, value) {
      const newVideos = [...this.videos];
      newVideos[index] = {
        ...newVideos[index],
        [property]: value
      };
      this.$emit('update', { videoOverlays: newVideos });
    },

    moveVideoUp(index) {
      if (index === 0) return;
      const newVideos = [...this.videos];
      [newVideos[index - 1], newVideos[index]] = [newVideos[index], newVideos[index - 1]];
      this.$emit('update', { videoOverlays: newVideos });
    },

    moveVideoDown(index) {
      if (index === this.videos.length - 1) return;
      const newVideos = [...this.videos];
      [newVideos[index], newVideos[index + 1]] = [newVideos[index + 1], newVideos[index]];
      this.$emit('update', { videoOverlays: newVideos });
    },

    updateAnimation(index, property, value) {
      const newVideos = [...this.videos];
      const currentAnimation = newVideos[index].animation || { preset: 'none', duration: 1000, delay: 0, loop: false };

      if (property === 'preset') {
        newVideos[index] = {
          ...newVideos[index],
          animation: {
            preset: value,
            duration: value === 'none' ? 1000 : (currentAnimation.duration || 1000),
            delay: currentAnimation.delay || 0,
            loop: currentAnimation.loop || false
          }
        };
      } else {
        newVideos[index] = {
          ...newVideos[index],
          animation: {
            ...currentAnimation,
            [property]: value
          }
        };
      }

      this.$emit('update', { videoOverlays: newVideos });
    },

    async captureFromCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: true
        });

        this.recordedChunks = [];
        const options = {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 2500000
        };

        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/webm';
        }

        this.mediaRecorder = new MediaRecorder(this.stream, options);

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const newVideos = [...this.videos];
          newVideos.push({
            src: url,
            name: `camera-${timestamp}.webm`,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 100,
            hue: 0,
            blendMode: 'normal',
            visible: true,
            playing: true,
            loop: true,
            muted: false,
            playbackRate: 1
          });
          this.$emit('update', { videoOverlays: newVideos });

          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
          }
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Failed to access camera. Please ensure camera permissions are granted.');
      }
    },

    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
        this.isRecording = false;
      }
    }
  }
};
</script>

<style scoped>
.video-overlay-controls {
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h4 {
  color: white;
  margin: 0;
  font-size: 13px;
  font-weight: 500;
}

.add-video-button {
  background: rgba(0, 255, 255, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.5);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.add-video-button:hover {
  background: rgba(0, 255, 255, 0.5);
}

.header-buttons {
  display: flex;
  gap: 8px;
}

.capture-video-button {
  background: rgba(255, 100, 0, 0.3);
  border: 1px solid rgba(255, 100, 0, 0.5);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.capture-video-button:hover {
  background: rgba(255, 100, 0, 0.5);
}

.recording-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.5);
  border-radius: 4px;
  margin-bottom: 10px;
  color: white;
  font-size: 13px;
}

.recording-indicator {
  width: 12px;
  height: 12px;
  background: red;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.stop-recording-button {
  background: rgba(255, 0, 0, 0.5);
  border: 1px solid rgba(255, 0, 0, 0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-left: auto;
}

.stop-recording-button:hover {
  background: rgba(255, 0, 0, 0.7);
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.video-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.video-item:last-child {
  margin-bottom: 0;
}

.video-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.video-preview {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-preview video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.video-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.video-actions {
  display: flex;
  gap: 4px;
}

.visibility-button {
  background: rgba(0, 255, 255, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.visibility-button.hidden {
  background: rgba(255, 59, 48, 0.3) !important;
  opacity: 0.6;
}

.remove-button {
  background: rgba(255, 59, 48, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.remove-button:hover {
  background: rgba(255, 59, 48, 0.5);
}

.video-controls-expanded {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 10px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.control-row:last-child {
  margin-bottom: 0;
}

.control-row label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  min-width: 70px;
}

.control-row select {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.playback-controls {
  flex: 1;
  display: flex;
  gap: 8px;
  align-items: center;
}

.playback-controls button {
  background: rgba(0, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.playback-controls button:hover {
  background: rgba(0, 255, 255, 0.5);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  cursor: pointer;
  min-width: auto;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

.range-control {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
}

.range-control input[type="range"] {
  width: 100%;
}

.value-input {
  width: 60px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 11px;
  text-align: center;
}

.value-input:focus {
  outline: none;
  border-color: rgba(0, 255, 255, 0.5);
}

.unit {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  min-width: 25px;
}

.layer-order-controls {
  flex: 1;
  display: flex;
  gap: 4px;
  align-items: center;
}

.layer-order-controls button {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.layer-order-controls button:hover:not(:disabled) {
  background: rgba(0, 255, 255, 0.3);
}

.layer-order-controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.layer-number {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  margin-left: auto;
}
</style>
