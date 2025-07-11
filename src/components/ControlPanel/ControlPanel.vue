<template>
  <div class="controls">
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
          </div>
          <button @click="removeLine(index)" v-if="settings.textLines.length > 1">✕</button>
        </div>
      </div>
      <button @click="addLine">Add Line</button>
    </div>

    <!--      <div class="text-options">-->
    <!--        <label class="text-size">-->
    <!--          Font Size:-->
    <!--          <input-->
    <!--            type="range"-->
    <!--            v-model.number="settings.fontSize"-->
    <!--            min="12"-->
    <!--            max="200"-->
    <!--            @input="onUpdate(settings)"-->
    <!--          />-->
    <!--          <span>{{ settings.fontSize }}px</span>-->
    <!--        </label>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="control-group">
      <div class="source-control">
        <input
          type="text"
          v-model="videoUrl"
          placeholder="Enter YouTube URL or video link"
          @keyup.enter="handleUrlInput"
        />
        <button @click="handleUrlInput">Load Video</button>
      </div>

      <div class="upload-control" v-if="1 === 0">
        <input
          type="file"
          @change="handleFileUpload"
          accept="video/mp4,video/webm"
          ref="fileInput"
        />
      </div>
      <div class="play-overlay" @click="startVideo">
        <button class="play-button">Play Video</button>
      </div>
      <label class="mute-control">
        <input type="checkbox" v-model="isMuted" @change="handleMuteChange" />
        Mute video
      </label>
    </div>
    <div class="source-control">
      <input v-model="audioUrl" placeholder="Enter audio URL" @keyup.enter="emitAudioUrl" />
      <button @click="emitAudioUrl">Load Audio</button>
      <input type="file" accept="audio/*" @change="emitAudioFile" />
      <label
        ><input type="checkbox" v-model="isAudioMuted" @change="emitAudioMute" /> Mute audio</label
      >
    </div>
  </div>
</template>

<script>
  import BlendControls from './BlendControls.vue';
  import ColorControls from './ColorControls.vue';
  import AnimationControls from './AnimationControls.vue';
  // import controlsMixin from '@/mixins/controlsMixin';
  // import animationMixin from '@/mixins/animationMixin';

  export default {
    name: 'ControlPanel',
    components: {
      BlendControls,
      ColorControls,
      AnimationControls,
    },
    // mixins: [controlsMixin, animationMixin],
    emits: [
      'update',
      'fileUpload',
      'urlInput',
      'muteChange',
      'startVideo',
      'audioFileUpload',
      'audioUrlInput',
      'audioMuteChange',
    ],
    data() {
      return {
        isMuted: true,
        videoUrl: '',
        audioUrl: '',
        isAudioMuted: false,
        settings: {
          blendMode: 'difference',

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
        },
      };
    },
    // provide() {
    //   return {
    //     animationSettings: this.mergedSettings
    //   };
    // },
    methods: {
      emitAudioUrl() {
        if (this.audioUrl) this.$emit('audioUrlInput', this.audioUrl);
      },
      emitAudioFile(e) {
        const file = e.target.files[0];
        if (file) this.$emit('audioFileUpload', file);
      },
      emitAudioMute() {
        this.$emit('audioMuteChange', this.isAudioMuted);
      },

      addLine() {
        this.settings.textLines.push('');
        this.onUpdate(this.settings);
      },
      removeLine(index) {
        this.settings.textLines.splice(index, 1);
        this.onUpdate(this.settings);
      },
      startVideo() {
        this.$emit('startVideo', true);
      },
      handleMuteChange() {
        this.$emit('muteChange', this.isMuted);
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.$emit('fileUpload', file);
        }
      },

      handleUrlInput() {
        if (!this.videoUrl) return;
        this.$emit('urlInput', this.videoUrl);
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
