<template>
  <div class="control-group">
    <h3>Export Text Layer</h3>
    <div class="export-controls">
      <button @click="exportPNG" class="export-button">
        <span class="icon">📸</span>
        Export PNG (Current Frame)
      </button>

      <button @click="toggleVideoRecording" :class="['export-button', { recording: isRecording }]">
        <span class="icon">{{ isRecording ? '⏹' : '🎬' }}</span>
        {{ isRecording ? 'Stop Recording' : 'Record Video (Transparent)' }}
        <span v-if="isRecording" class="record-indicator"></span>
      </button>

      <div v-if="isRecording" class="recording-info">
        <span>{{ formatTime(recordingTime) }}</span>
      </div>

      <div class="video-settings" v-if="!isRecording">
        <label>
          Duration (seconds):
          <input type="number" v-model.number="videoDuration" min="1" max="60" />
        </label>
        <label>
          Format:
          <select v-model="videoFormat">
            <option value="webm-alpha">WebM (Transparent)</option>
            <option value="webm">WebM (Black BG)</option>
          </select>
        </label>
      </div>

      <button @click="exportJSON" class="export-button">
        <span class="icon">💾</span>
        Export Settings (JSON)
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExportControls',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isRecording: false,
      recordingTime: 0,
      videoDuration: 10,
      videoFormat: 'webm-alpha',
      mediaRecorder: null,
      recordedChunks: [],
      timer: null,
      canvas: null,
      stream: null
    };
  },
  methods: {
    async exportPNG() {
      try {
        const canvas = await this.captureTextLayer();
        if (!canvas) {
          alert('Failed to capture text layer');
          return;
        }
        canvas.toBlob((blob) => {
          if (!blob) {
            alert('Failed to create image');
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          a.href = url;
          a.download = `text-layer-${timestamp}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      } catch (error) {
        console.error('Export PNG error:', error);
        alert('Failed to export PNG: ' + error.message);
      }
    },

    async captureTextLayer() {
      const textContainer = document.querySelector('.text-effect, .text-vibration, .glitch-effect, .wave-effect, .particle-burst, .rotation-3d, .neon-glow, .liquid-distortion, .typewriter-effect, .chromatic-aberration, .split-text, .wavy-text, .flicker-text, .stroke-text, .gradient-text, .scanlines-effect, .holographic-effect, .perspective-effect, .shatter-effect');

      if (!textContainer) {
        alert('No text layer found');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = this.settings.videoWidth || 1080;
      canvas.height = this.settings.videoHeight || 1920;
      const ctx = canvas.getContext('2d', { alpha: true });

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = `${canvas.width}px`;
      tempDiv.style.height = `${canvas.height}px`;
      tempDiv.style.background = 'transparent';
      tempDiv.innerHTML = textContainer.outerHTML;
      document.body.appendChild(tempDiv);

      await new Promise(resolve => setTimeout(resolve, 100));

      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width:${canvas.width}px;height:${canvas.height}px;">
              ${textContainer.outerHTML}
            </div>
          </foreignObject>
        </svg>
      `;

      const img = new Image();
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      return new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          document.body.removeChild(tempDiv);
          resolve(canvas);
        };
        img.src = url;
      });
    },

    async startVideoRecording() {
      try {
        const targetElement = document.querySelector('.app');
        if (!targetElement) {
          alert('Could not find app container');
          return;
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.settings.videoWidth || 1080;
        this.canvas.height = this.settings.videoHeight || 1920;
        const ctx = this.canvas.getContext('2d', { alpha: true });

        this.stream = this.canvas.captureStream(60);

        const mimeType = this.videoFormat === 'webm-alpha'
          ? 'video/webm;codecs=vp9'
          : 'video/webm;codecs=vp8';

        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType: mimeType,
          videoBitsPerSecond: 8000000
        });

        this.recordedChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          a.href = url;
          a.download = `text-layer-${timestamp}.webm`;
          a.click();
          URL.revokeObjectURL(url);

          this.isRecording = false;
          clearInterval(this.timer);
          clearInterval(this.captureInterval);
        };

        const captureFrame = () => {
          const textContainer = document.querySelector('.text-effect, .text-vibration, .glitch-effect, .wave-effect, .particle-burst, .rotation-3d, .neon-glow, .liquid-distortion, .typewriter-effect, .chromatic-aberration, .split-text, .wavy-text, .flicker-text, .stroke-text, .gradient-text, .scanlines-effect, .holographic-effect, .perspective-effect, .shatter-effect');

          if (textContainer) {
            if (this.videoFormat === 'webm-alpha') {
              ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            } else {
              ctx.fillStyle = '#000000';
              ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

            const htmlContent = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${this.canvas.width}" height="${this.canvas.height}">
                <foreignObject width="100%" height="100%">
                  <div xmlns="http://www.w3.org/1999/xhtml" style="width:${this.canvas.width}px;height:${this.canvas.height}px;">
                    ${textContainer.outerHTML}
                  </div>
                </foreignObject>
              </svg>
            `;

            const img = new Image();
            const blob = new Blob([htmlContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);

            img.onload = () => {
              ctx.drawImage(img, 0, 0);
              URL.revokeObjectURL(url);
            };
            img.src = url;
          }
        };

        this.captureInterval = setInterval(captureFrame, 1000 / 60);

        this.mediaRecorder.start(100);
        this.isRecording = true;
        this.recordingTime = 0;

        this.timer = setInterval(() => {
          this.recordingTime++;
          if (this.recordingTime >= this.videoDuration) {
            this.stopVideoRecording();
          }
        }, 1000);

      } catch (error) {
        console.error('Error starting recording:', error);
        alert('Failed to start recording: ' + error.message);
      }
    },

    stopVideoRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
        clearInterval(this.captureInterval);
      }
    },

    toggleVideoRecording() {
      if (this.isRecording) {
        this.stopVideoRecording();
      } else {
        this.startVideoRecording();
      }
    },

    exportJSON() {
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        settings: this.settings,
        metadata: {
          exportedFrom: 'Video Blend Text App',
          format: 'TouchDesigner Compatible'
        }
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `text-settings-${timestamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.control-group {
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.control-group h3 {
  color: white;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: normal;
}

.export-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.export-button {
  background: rgba(0, 122, 255, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.export-button:hover {
  background: rgba(0, 122, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.4);
}

.export-button.recording {
  background: rgba(255, 0, 0, 0.5);
  border-color: rgba(255, 0, 0, 0.6);
}

.icon {
  font-size: 18px;
}

.record-indicator {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.recording-info {
  color: white;
  text-align: center;
  font-size: 14px;
  font-family: monospace;
  padding: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

.video-settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.video-settings label {
  color: white;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.video-settings input[type="number"],
.video-settings select {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  width: 120px;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
