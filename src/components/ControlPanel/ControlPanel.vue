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
      <option value="glitch">Glitch</option>
      <option value="wave">Wave</option>
      <option value="particle">Particle Burst</option>
      <option value="rotation3d">3D Rotation</option>
      <option value="neon">Neon Glow</option>
      <option value="liquid">Liquid Distortion</option>
      <option value="typewriter">Typewriter</option>
      <option value="chromatic">Chromatic Aberration</option>
      <option value="goo">SVG Distort</option>
      <option value="split">Split Text</option>
      <option value="wavy">Wavy Text</option>
      <option value="flicker">Flicker Text</option>
      <option value="stroke">Stroke Text</option>
      <option value="gradient">Gradient Text</option>
    </select>

    <VideoLayerControls />
    <BackdropControls @update="onUpdate" />
    <BlendControls @update="onUpdate" />
    <ColorControls @update="onUpdate" />
    <AnimationControls @update="onUpdate" />

    <div class="control-group text-control">
      <h3>Text Settings</h3>
      <div class="positioning-mode">
        <label class="drag-mode-toggle">
          <input type="checkbox" v-model="settings.dragMode" @change="onUpdate(settings)" />
          <span>Enable Drag Mode</span>
          <span class="help-text">Click and drag text to reposition. Hold Shift for grid snap.</span>
        </label>
      </div>
      <div class="text-input-group">
        <div class="text-line" v-for="(line, index) in settings.textLines" :key="index">
          <div class="text-block">
            <div class="text-header">
              <div class="text-type-controls">
                <button
                  :class="{ active: !settings.textTypes?.[index] }"
                  @click="setTextType(index, 'line')"
                  title="Single line"
                >
                  ⟶
                </button>
                <button
                  :class="{ active: settings.textTypes?.[index] === 'paragraph' }"
                  @click="setTextType(index, 'paragraph')"
                  title="Paragraph"
                >
                  ¶
                </button>
              </div>
              <button class="remove-button" @click="removeLine(index)" v-if="settings.textLines.length > 1">✕</button>
            </div>

            <div class="text-input-container">
              <template v-if="settings.textTypes?.[index] === 'paragraph'">
                <textarea
                  v-model="settings.textLines[index]"
                  @input="onUpdate(settings)"
                  placeholder="Enter paragraph text"
                  rows="4"
                ></textarea>
              </template>
              <template v-else>
                <input
                  type="text"
                  v-model="settings.textLines[index]"
                  @input="onUpdate(settings)"
                  placeholder="Enter line of text"
                />
              </template>
            </div>

            <div class="text-options">
              <div class="options-grid">
                <div class="option-item">
                  <label>Font Size</label>
                  <div class="slider-container">
                    <input
                      type="range"
                      v-model.number="settings.fontSize[index]"
                      min="12"
                      max="200"
                      @input="onUpdate(settings)"
                    />
                    <span class="value">{{ settings.fontSize[index] }}px</span>
                  </div>
                </div>
                <div class="option-item">
                  <label>Letter Spacing</label>
                  <div class="slider-container">
                    <input
                      type="range"
                      v-model.number="settings.letterSpacing[index]"
                      min="-20"
                      max="100"
                      @input="onUpdate(settings)"
                    />
                    <span class="value">{{ settings.letterSpacing[index] }}px</span>
                  </div>
                </div>
                <div class="option-item">
      <label>Random Amount</label>
      <div class="slider-container">
        <input
          type="range"
          v-model.number="settings.randomAmount[index]"
          min="0"
          max="100"
          @input="onUpdate(settings)"
        />
        <span class="value">{{ settings.randomAmount[index] }}%</span>
      </div>
    </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="add-line-button" @click="addLine">Add Line</button>
    </div>


    <RecordingControls />
  </div>
</template>


<script>
  import BlendControls from './BlendControls.vue';
  import ColorControls from './ColorControls.vue';
  import AnimationControls from './AnimationControls.vue';
  import BackdropControls from './BackdropFilterControls.vue';
  import RecordingControls from './RecordingControls.vue';
  import VideoLayerControls from '../VideoLayerControls.vue';

  export default {
    name: 'ControlPanel',
    components: {
      BlendControls,
      ColorControls,
      AnimationControls,
      BackdropControls,
      RecordingControls,
      VideoLayerControls,
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
                textTypes: [], // Will store 'line' or 'paragraph' for each text entry

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
  randomAmount: [50, 50, 50], // Initialize with default values for each line
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

  setTextType(index, type) {
    if (!this.settings.textTypes) {
      this.settings.textTypes = [];
    }
    this.settings.textTypes[index] = type === 'paragraph' ? 'paragraph' : null;
    this.onUpdate(this.settings);
  },

addLine() {
  this.settings.textLines.push('');
  this.settings.margin.push(0);
  this.settings.marginTop.push(0);
  this.settings.letterSpacing.push(0);
  this.settings.randomAmount.push(0); // Initialize with 0 to use global amount
  if (!this.settings.textTypes) {
    this.$set(this.settings, 'textTypes', []);
  }
  this.settings.textTypes.push(null);
  this.onUpdate(this.settings);
},

 removeLine(index) {
  this.settings.textLines.splice(index, 1);
  this.settings.margin.splice(index, 1);
  this.settings.marginTop.splice(index, 1);
  this.settings.letterSpacing.splice(index, 1);
  this.settings.randomAmount.splice(index, 1); // Add this line
  this.settings.textTypes.splice(index, 1);
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
          Object.keys(val).forEach((key) => {
    this.settings[key] = val[key];
  });

        console.log(this.settings);

        this.$emit('update', this.settings);
      },
    },
  };
</script>

<style scoped>

.text-input-container {
  display: flex;
  gap: 10px;
  width: 100%;
}

.input-type-toggle {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-type-toggle button {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.input-type-toggle button.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.input-wrapper {
  flex: 1;
}

textarea {
  width: 100%;
  min-height: 100px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
}

textarea:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

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

  .text-block {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.text-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.text-type-controls {
  display: flex;
  gap: 8px;
}

.text-type-controls button {
  min-width: 36px;
  height: 36px;
  padding: 0;
}

.text-input-container {
  margin-bottom: 15px;
}

.text-options {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 15px;
  margin-top: 10px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-container input[type="range"] {
  flex: 1;
}

.slider-container .value {
  min-width: 60px;
  text-align: right;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.remove-button {
  background: rgba(255, 59, 48, 0.5);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-button:hover {
  background: rgba(255, 59, 48, 0.7);
}

.add-line-button {
  width: 100%;
  margin-top: 10px;
  background: rgba(0, 122, 255, 0.5);
  border: none;
  padding: 10px;
  border-radius: 4px;
  color: white;
  transition: all 0.2s ease;
}

.add-line-button:hover {
  background: rgba(0, 122, 255, 0.7);
}

.positioning-mode {
  background: rgba(0, 122, 255, 0.1);
  border: 1px solid rgba(0, 122, 255, 0.3);
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}

.drag-mode-toggle {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}

.drag-mode-toggle input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-right: 10px;
}

.drag-mode-toggle span {
  color: white;
  font-size: 14px;
}

.drag-mode-toggle .help-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 5px;
}
</style>
