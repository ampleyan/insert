<template>
  <div class="control-group">
    <h3>Recording</h3>
    <div class="recording-controls">
      <div class="recording-mode-toggle" v-if="!isRecording && !isNativeRecording">
        <button
          :class="{ active: recordingMode === 'tab' }"
          @click="recordingMode = 'tab'"
        >
          Tab
        </button>
        <button
          :class="{ active: recordingMode === 'native' }"
          @click="recordingMode = 'native'"
        >
          Native
        </button>
      </div>

      <div v-if="recordingMode === 'tab'">
        <button @click="toggleRecording" :class="{ recording: isRecording }">
          {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
          <span v-if="isRecording" class="record-indicator"></span>
        </button>

        <div class="recording-info" v-if="isRecording">
          {{ formatTime(recordingTime) }}
        </div>

        <div class="recording-settings" v-if="!isRecording">
          <label>
            Quality:
            <select v-model="localSettings.quality">
              <option value="max">Maximum</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </label>

          <label>
            <input type="checkbox" v-model="localSettings.captureAudio" /> Include Audio
          </label>
        </div>
      </div>

      <div v-if="recordingMode === 'native'">
        <button @click="toggleNativeRecording" :class="{ recording: isNativeRecording }">
          {{ isNativeRecording ? 'Stop Recording' : 'Start Native Recording' }}
          <span v-if="isNativeRecording" class="record-indicator"></span>
        </button>

        <div class="recording-info" v-if="isNativeRecording">
          {{ formatTime(nativeRecordingTime) }}
        </div>

        <div class="recording-settings" v-if="!isNativeRecording">
          <label>
            Frame Rate:
            <select v-model="nativeSettings.frameRate">
              <option :value="15">15 fps</option>
              <option :value="30">30 fps</option>
              <option :value="60">60 fps</option>
            </select>
          </label>

          <label>
            Quality:
            <select v-model="nativeSettings.quality">
              <option value="high">High (8 Mbps)</option>
              <option value="medium">Medium (5 Mbps)</option>
              <option value="low">Low (2 Mbps)</option>
            </select>
          </label>
        </div>

        <div class="format-info" v-if="!isNativeRecording">
          {{ formatWidth }}x{{ formatHeight }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import nativeRecorder from '@/services/nativeRecorder';
  import { FORMAT_PRESETS } from '@/constants/formatPresets';

  export default {
    name: 'RecordingControls',
    props: {
      settings: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        recordingMode: 'native',
        isRecording: false,
        isNativeRecording: false,
        mediaRecorder: null,
        recordedChunks: [],
        recordingTime: 0,
        nativeRecordingTime: 0,
        timer: null,
        localSettings: {
          quality: 'high',
          captureAudio: true,
        },
        nativeSettings: {
          frameRate: 30,
          quality: 'high',
        },
        qualityPresets: {
          max: {
            videoBitsPerSecond: 12000000,
            frameRate: 60,
          },
          high: {
            videoBitsPerSecond: 8000000,
            frameRate: 60,
          },
          medium: {
            videoBitsPerSecond: 5000000,
            frameRate: 30,
          },
        },
        nativeQualityPresets: {
          high: 8000000,
          medium: 5000000,
          low: 2000000,
        },
      };
    },
    computed: {
      formatWidth() {
        const format = this.settings.videoFormat || 'vertical';
        const preset = FORMAT_PRESETS.find((p) => p.value === format);
        return preset ? preset.width : 1080;
      },
      formatHeight() {
        const format = this.settings.videoFormat || 'vertical';
        const preset = FORMAT_PRESETS.find((p) => p.value === format);
        return preset ? preset.height : 1920;
      },
    },
    methods: {
      async startNativeRecording() {
        const targetElement = document.querySelector('.format-container');
        if (!targetElement) {
          alert('Could not find content area to record');
          return;
        }

        try {
          await nativeRecorder.startRecording(
            targetElement,
            this.formatWidth,
            this.formatHeight,
            {
              frameRate: this.nativeSettings.frameRate,
              videoBitsPerSecond: this.nativeQualityPresets[this.nativeSettings.quality],
              onTimeUpdate: (time) => {
                this.nativeRecordingTime = time;
              },
            }
          );
          this.isNativeRecording = true;
          this.nativeRecordingTime = 0;
        } catch (error) {
          console.error('Error starting native recording:', error);
          alert('Failed to start native recording: ' + error.message);
        }
      },

      async stopNativeRecording() {
        await nativeRecorder.stopRecording();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        nativeRecorder.downloadRecording(`native-recording-${timestamp}.webm`);
        this.isNativeRecording = false;
        this.nativeRecordingTime = 0;
      },

      async toggleNativeRecording() {
        if (!this.isNativeRecording) {
          await this.startNativeRecording();
        } else {
          await this.stopNativeRecording();
        }
      },

      async startRecording() {
        try {
          const config = this.qualityPresets[this.localSettings.quality];

          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              frameRate: { ideal: config.frameRate },
              displaySurface: 'browser',
            },
            audio: false,
            preferCurrentTab: true,
            selfBrowserSurface: 'include',
            surfaceSwitching: 'include',
          });

          let finalStream = displayStream;

          if (this.localSettings.captureAudio) {
            try {
              const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  sampleRate: 48000,
                },
              });

              const tracks = [...displayStream.getTracks(), ...audioStream.getTracks()];
              finalStream = new MediaStream(tracks);
            } catch (audioError) {
              console.warn('Audio capture failed:', audioError);
            }
          }

          const options = {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: config.videoBitsPerSecond,
            audioBitsPerSecond: 256000,
          };

          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'video/webm;codecs=vp8';
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options.mimeType = 'video/webm';
            }
          }

          this.recordedChunks = [];
          this.recordingTime = 0;
          this.mediaRecorder = new MediaRecorder(finalStream, options);

          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };

          this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.recordedChunks, {
              type: 'video/webm',
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.href = url;
            a.download = `screen-recording-${timestamp}.webm`;
            a.click();

            URL.revokeObjectURL(url);
            finalStream.getTracks().forEach((track) => track.stop());

            this.isRecording = false;
            clearInterval(this.timer);
          };

          this.mediaRecorder.start(1000);
          this.isRecording = true;

          this.timer = setInterval(() => {
            this.recordingTime++;
          }, 1000);
        } catch (error) {
          console.error('Error starting recording:', error);
          alert(
            'Failed to start recording. Please make sure you have granted the necessary permissions.'
          );
        }
      },

      stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        }
      },

      async toggleRecording() {
        if (!this.isRecording) {
          await this.startRecording();
        } else {
          this.stopRecording();
        }
      },

      formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
          .toString()
          .padStart(2, '0')}`;
      },
    },
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

  .recording-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .recording-controls button {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .recording-controls button:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .recording-controls button.recording {
    background: rgba(255, 0, 0, 0.3);
    border-color: rgba(255, 0, 0, 0.4);
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
  }

  .recording-settings {
    display: flex;
    gap: 15px;
    margin-top: 5px;
  }

  .recording-settings label {
    color: white;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .recording-settings select {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
</style>
