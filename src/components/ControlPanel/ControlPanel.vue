<template>
  <div class="controls">
    <div class="control-header">
      <h2>Controls</h2>
      <button class="reset-button" @click="handleReset" title="Reset all settings to defaults">
        Reset All
      </button>
    </div>

    <select v-model="settings.effectType" @change="onEffectChoice(settings)">
      <option value="vibration">Vibration</option>
      <!--      <option value="goo">Gooey</option>-->
    </select>
    <BackdropControls @update="onUpdate" />

    <BlendControls @update="onUpdate" />
    <ColorControls @update="onUpdate" />
    <AnimationControls @update="onUpdate" />
    <div class="control-group text-control">
      <h3>Text Settings</h3>
      <div class="text-input-group">
        <div class="text-line" v-for="(line, index) in settings.textLines" :key="index">
          <input
            type="text"
            v-model="settings.textLines[index]"
            @input="onUpdate(settings)"
            placeholder="Enter line of text"
          />
          <div class="text-options">
            <label class="text-size">
              Font Size:
              <input
                type="range"
                v-model.number="settings.fontSize[index]"
                min="12"
                max="200"
                @input="onUpdate(settings)"
              />
              <span>{{ settings.fontSize[index] }}px</span>
            </label>
            <label class="letter-spacing-control">
    Letter Spacing:
    <input
      type="range"
      v-model.number="settings.letterSpacing[index]"
      min="-20"
      max="100"
      @input="onUpdate(settings)"
    />
    <span>{{ settings.letterSpacing[index] }}px</span>
  </label>

            <label class="margin-control">
              Horizontal position:
              <input
                type="range"
                v-model.number="settings.margin[index]"
                min="-1000"
                max="1000"
                @input="onUpdate(settings)"
              />
              <span>{{ settings.margin[index] }}px</span>
            </label>
            <label class="margin-control">
              Vertical position:
              <input
                type="range"
                v-model.number="settings.marginTop[index]"
                min="-1000"
                max="1000"
                @input="onUpdate(settings)"
              />
              <span>{{ settings.marginTop[index] }}px</span>
            </label>
          </div>
          <button @click="removeLine(index)" v-if="settings.textLines.length > 1">✕</button>
        </div>
      </div>
      <button @click="addLine">Add Line</button>
    </div>
    <div class="control-group">
      <h3>Video Controls</h3>

      <div class="source-control">
        <input
          type="text"
          v-model="videoUrl"
          placeholder="Enter YouTube URL or video link"
          @keyup.enter="handleUrlInput"
        />
        <button @click="handleUrlInput">Load Video</button>
      </div>

      <div class="source-control">
        <div class="file-input-wrapper">
          <input
            type="file"
            @change="handleFileUpload"
            accept="video/mp4,video/webm"
            ref="fileInput"
            id="file-input"
          />
          <label for="file-input" class="file-input-label">Choose File</label>
          <span class="file-name">{{ selectedFileName || 'No file chosen' }}</span>
        </div>
      </div>

      <div class="play-overlay">
        <button class="play-button" @click="startVideo">Play Video</button>
        <button class="play-button" @click="stopVideo">Stop Video</button>
      </div>
      <div class="play-overlay"></div>
      <label class="mute-control">
        <input type="checkbox" v-model="isMuted" @change="handleMuteChange" />
        Mute video
      </label>
    </div>
    <div class="control-group">
      <h3>Audio Controls</h3>
      <div class="source-control">
        <input
          type="text"
          v-model="audioUrl"
          placeholder="Enter audio URL or YouTube link"
          @keyup.enter="emitAudioUrl"
        />
        <button @click="emitAudioUrl">Load Audio</button>
      </div>

      <div class="source-control">
        <div class="file-input-wrapper">
          <input
            type="file"
            @change="emitAudioFile"
            accept="audio/*"
            ref="audioFileInput"
            id="audio-file-input"
          />
          <label for="audio-file-input" class="file-input-label">Choose Audio</label>
          <span class="file-name">{{ selectedAudioFileName || 'No audio file chosen' }}</span>
        </div>
      </div>

      <div class="mute-control">
        <label>
          <input type="checkbox" v-model="isAudioMuted" @change="emitAudioMute" />
          <span>Mute Audio</span>
        </label>
      </div>
    </div>

    <RecordingControls />
  </div>
</template>

<script>
  import BlendControls from './BlendControls.vue';
  import ColorControls from './ColorControls.vue';
  import AnimationControls from './AnimationControls.vue';
  // import controlsMixin from '@/mixins/controlsMixin';
  // import animationMixin from '@/mixins/animationMixin';
  import BackdropControls from './BackdropFilterControls.vue';
  import RecordingControls from './RecordingControls.vue';

  export default {
    name: 'ControlPanel',
    components: {
      BlendControls,
      ColorControls,
      AnimationControls,
      BackdropControls,
      RecordingControls,
    },
    // mixins: [controlsMixin, animationMixin],
    emits: [
      'update',
      'fileUpload',
      'urlInput',
      'muteChange',
      'startVideo',
      'stopVideo',
      'audioFileUpload',
      'audioUrlInput',
      'audioMuteChange',
    ],
    data() {
      return {
        selectedFileName: '',
        selectedAudioFileName: '',

        isMuted: true,
        videoUrl: '',
        audioUrl: '',
        isAudioMuted: false,
        settings: {
          blendMode: 'difference',
          effectType: 'vibration',
                letterSpacing: [0, 0, 0], // Initialize with default values for each line

          // Color settings
          hue: 0,
          color: '#ffffff',
          opacity: 100,

          // Animation settings (will be merged with animation settings from useAnimation)
          vibrateSpeed: 50,
          vibrateIntensity: 1,
          blurAmount: 2,
          randomAmount: 50,
          intervalSpeed: 200,

          textLines: ['INSERT', "SUN'O3.08", 'BAR OOST'],
          fontSize: [120, 120, 120],
          margin: [0, 0, 0],
          marginTop: [0, 0, 0],
          backdropBlur: 0,
          backdropBrightness: 100,
          backdropContrast: 100,
          backdropSaturate: 100,
        },
      };
    },
    // provide() {
    //   return {
    //     animationSettings: this.mergedSettings
    //   };
    // },
    methods: {
      handleReset() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
          this.$emit('reset');
        }
      },

      emitAudioUrl() {
        if (this.audioUrl) this.$emit('audioUrlInput', this.audioUrl);
      },
      emitAudioFile(event) {
        const file = event.target.files[0];
        if (file) {
          this.selectedAudioFileName = file.name;
          this.$emit('audio-file-upload', file);
        }
      },

      emitAudioMute() {
        this.$emit('audioMuteChange', this.isAudioMuted);
      },

        addLine() {
    this.settings.textLines.push('');
    this.settings.margin.push(0);
    this.settings.marginTop.push(0);
    this.settings.letterSpacing.push(0); // Add default letter spacing for new line
    this.onUpdate(this.settings);
  },

        removeLine(index) {
    this.settings.textLines.splice(index, 1);
    this.settings.margin.splice(index, 1);
    this.settings.marginTop.splice(index, 1);
    this.settings.letterSpacing.splice(index, 1); // Remove letter spacing for removed line
    this.onUpdate(this.settings);
  },

      startVideo() {
        this.$emit('startVideo', true);
      },
      stopVideo() {
        this.$emit('stopVideo', false);
      },
      handleMuteChange() {
        this.$emit('muteChange', this.isMuted);
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.selectedFileName = file.name;

          this.$emit('fileUpload', file);
        }
      },

      handleUrlInput() {
        if (!this.videoUrl) return;
        this.$emit('urlInput', this.videoUrl);
      },
      onEffectChoice() {
        console.log(this.settings.effectType);
        this.$emit('changeEffect', this.settings);
      },
      onUpdate(val) {
        console.log(val);
        // this.blendMode = val;
        // this.controlSettings.blendMode = val;
        Object.keys(this.settings).forEach((key) => {
          if (key in val) {
            this.settings[key] = val[key];
          }
        });
        console.log(this.settings);

        this.$emit('update', this.settings);
      },
    },
  };
</script>

<style scoped>
.letter-spacing-control {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 14px;
}

.letter-spacing-control input[type='range'] {
  flex: 1;
  accent-color: #ffffff;
}

.letter-spacing-control span {
  min-width: 50px;
  text-align: right;
}
  .margin-control {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-size: 14px;
  }

  .margin-control input[type='range'] {
    flex: 1;
    accent-color: #ffffff;
  }

  .margin-control span {
    min-width: 50px;
    text-align: right;
  }

  .control-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
    margin-left: 15px;
  }

  .control-header h2 {
    color: white;
    margin: 0;
    font-size: 16px;
    font-weight: normal;
  }

  .reset-button {
    background: rgba(255, 59, 48, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    margin-left: 15px;
  }

  .reset-button:hover {
    background: rgba(255, 59, 48, 0.9);
    border-color: rgba(255, 255, 255, 0.4);
  }

  /* Mute control styling */
  .mute-control {
    margin-top: 10px;
  }

  .mute-control label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
    font-size: 14px;
    cursor: pointer;
  }

  .mute-control input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .source-control {
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  /* Hide the default file input */
  .file-input-wrapper input[type='file'] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  .file-input-wrapper {
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
  }

  /* Style the custom file input button */
  .file-input-label {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    min-width: 100px;
    text-align: center;
  }

  .file-input-label:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
  }

  /* Style the filename display */
  .file-name {
    flex: 1;
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 8px 15px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Existing styles for text input and button */
  .source-control input[type='text'] {
    flex: 1;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .source-control input[type='text']:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  .source-control button {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    min-width: 100px;
  }

  .source-control button:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .text-line {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    gap: 10px;
  }

  .text-line input[type='text'] {
    flex: 1;
  }

  .text-line button {
    background: rgba(255, 0, 0, 0.5);
    border: none;
    color: white;
    font-size: 16px;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  .text-line button:hover {
    background: rgba(255, 0, 0, 0.7);
  }

  .text-control {
    background: rgba(0, 0, 0, 0.7);
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 15px;
  }

  .text-control h3 {
    color: white;
    margin: 0 0 10px 0;
    font-size: 14px;
    font-weight: normal;
  }

  .text-input-group {
    margin-bottom: 15px;
  }

  .text-input-group input[type='text'] {
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .text-input-group input[type='text']:focus {
    border-color: rgba(255, 255, 255, 0.4);
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  .text-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .text-options label {
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .text-options input[type='range'] {
    flex: 1;
    accent-color: #ffffff;
  }

  .text-options span {
    min-width: 50px;
    text-align: right;
  }

  /* Base button style */
  .controls button {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    min-width: 100px;
  }

  /* Hover state */
  .controls button:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
  }

  /* Active/Pressed state */
  .controls button:active {
    transform: scale(0.98);
    background: rgba(0, 0, 0, 0.9);
  }

  /* Focus state */
  .controls button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  /* Special styling for play button */
  .controls .play-button {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.3);
    padding: 10px 20px;
    font-size: 16px;
    min-width: 120px;
  }

  /* Disabled state */
  .controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Input fields styling to match buttons */
  .controls input[type='text'] {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .controls input[type='text']:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }
</style>
