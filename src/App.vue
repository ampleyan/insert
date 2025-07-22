<template>
  <div class="app">
    <VideoBackground
      :settings="settings"
      :file="file"
      :isMute="isMute"
      :inputUrl="inputUrl"
      :isPlaying="isPlaying"
    />

    <button class="toggle-controls" @click="toggleControls" v-show="!isControlsHidden">
      <span class="icon" :class="{ hidden: isControlsHidden }">◀</span>
      <span class="text">{{ isControlsHidden ? 'Show Controls' : 'Hide Controls' }}</span>
    </button>

    <div class="shortcut-hint" :class="{ visible: isShortcutHintVisible }">
      Double-click anywhere to toggle controls
    </div>

    <ControlPanel
      :class="{ hidden: isControlsHidden }"
      @update="onUpdate"
      @file-upload="onUpload"
      @mute-change="onMute"
      @url-input="onInput"
      @start-video="onPlay"
      @stop-video="onStop"
      @audio-file-upload="audioFileBlob = $event"
      @audio-url-input="startAudio($event)"
      @audio-mute-change="isAudioMuted = $event"
      @change-effect="onUpdate"
      @reset="resetToDefaults"
    />

    <TextVibration v-if="settings.effectType === 'vibration'" :settings="settings" />
    <!--    <TextGoo v-if="settings.effectType === 'goo'" :settings="settings" />-->
    <TextDistort
      v-if="settings.effectType === 'goo'"
      :settings="settings"
      text="Wavy Text"
      baseFrequency="0.02 0.02"
      scale="30"
      fontSize="12vw"
      color="#ff0"
    />
    <!--    <audio ref="audio" autoplay :src="audioSrc" :muted="isAudioMuted" controls></audio>-->
    <div style="width: 0; height: 0; overflow: hidden">
      <iframe
        v-if="youtubeEmbedUrl"
        :src="youtubeEmbedUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="background-video"
      ></iframe>
    </div>
  </div>
</template>

<script>
  import VideoBackground from './components/VideoBackground.vue';
  import ControlPanel from './components/ControlPanel/ControlPanel.vue';
  import TextVibration from './components/Effects/TextVibration.vue';
  // import TextGoo from './components/Effects/TextGoo.vue';
  import TextDistort from './components/Effects/TextDistort.vue';

  export default {
    name: 'App',
    components: {
      VideoBackground,
      ControlPanel,
      TextVibration,
      // TextGoo,
      TextDistort,
    },
    data() {
      // Get stored settings or use defaults
      const storedSettings = localStorage.getItem('appSettings');
      const defaultSettings = {
        // Blend settings
        blendMode: 'difference',
        effectType: 'vibration',
        // Color settings
        hue: 0,
        color: '#ffffff',
        opacity: 100,

        // Animation settings
        vibrateSpeed: 50,
        vibrateIntensity: 1,
        blurAmount: 2,
        randomAmount: 50,
        intervalSpeed: 200,

        textLines: ['INSERT', "SUN'O3.08", 'BAR OOST'],
        fontSize: [120, 120, 120],

        // Backdrop settings
        backdropBlur: 0,
        backdropBrightness: 100,
        backdropContrast: 100,
        backdropSaturate: 100,
      };

      // Get stored state or use defaults
      const storedState = localStorage.getItem('appState');
      const defaultState = {
        audioSrc: '',
        isAudioMuted: false,
        youtubeEmbedUrl: '',
        isControlsHidden: false,
        isPlaying: false,
        isMute: true,
        inputUrl: '',
      };

      return {
        ...JSON.parse(storedState || JSON.stringify(defaultState)),
        settings: JSON.parse(storedSettings || JSON.stringify(defaultSettings)),
        isShortcutHintVisible: false,
        audioUrlLink: '',
        audioFileBlob: '',
        file: null,
      };
    },

    watch: {
      settings: {
        handler(newSettings) {
          localStorage.setItem('appSettings', JSON.stringify(newSettings));
        },
        deep: true,
      },
      inputUrl(val) {
        this.updateStoredState('inputUrl', val);
      },
      youtubeEmbedUrl(val) {
        this.updateStoredState('youtubeEmbedUrl', val);
      },
      audioSrc(val) {
        this.updateStoredState('audioSrc', val);
      },

      audioUrlLink(newUrl) {
        console.log(newUrl);

        this.audioSrc = newUrl;
        this.$nextTick(() => {
          if (this.$refs.audio) {
            this.$refs.audio.load();
            this.$refs.audio.play().catch((error) => {
              console.log('audio playback failed:', error);
            });
          }
        });
      },
      audioFileBlob(newFile) {
        this.audioSrc = URL.createObjectURL(newFile);
        this.$refs.audio.load();
      },
      isAudioMuted(val) {
        this.updateStoredState('isAudioMuted', val);

        this.$refs.audio.muted = val;
      },
    },

    mounted() {
      // Add event listeners
      document.addEventListener('dblclick', this.handleDoubleClick);
      document.addEventListener('keydown', this.handleKeyDown);

      // Show initial shortcut hint
      setTimeout(() => {
        this.isShortcutHintVisible = true;
        setTimeout(() => {
          this.isShortcutHintVisible = false;
        }, 3000);
      }, 1000);
    },
    beforeUnmount() {
      // Remove event listeners
      document.removeEventListener('dblclick', this.handleDoubleClick);
      document.removeEventListener('keydown', this.handleKeyDown);
    },
    methods: {
      resetToDefaults() {
        localStorage.removeItem('appSettings');
        localStorage.removeItem('appState');
        this.settings = {
          blendMode: 'difference',
          effectType: 'vibration',
          hue: 0,
          color: '#ffffff',
          opacity: 100,
          vibrateSpeed: 50,
          vibrateIntensity: 1,
          blurAmount: 2,
          randomAmount: 50,
          intervalSpeed: 200,
          textLines: ['INSERT', "SUN'O3.08", 'BAR OOST'],
          fontSize: [120, 120, 120],
          backdropBlur: 0,
          backdropBrightness: 100,
          backdropContrast: 100,
          backdropSaturate: 100,
        };

        // Reset state
        this.audioSrc = '';
        this.isAudioMuted = false;
        this.youtubeEmbedUrl = '';
        this.isControlsHidden = false;
        this.isPlaying = false;
        this.isMute = true;
        this.inputUrl = '';

        // window.location.reload();
      },

      updateStoredState(key, value) {
        const currentState = JSON.parse(localStorage.getItem('appState') || '{}');
        currentState[key] = value;
        localStorage.setItem('appState', JSON.stringify(currentState));
      },

      getYoutubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
      },
      startAudio(url) {
        let audioUrlId = this.getYoutubeVideoId(url);
        if (audioUrlId) {
          this.youtubeEmbedUrl = `https://www.youtube.com/embed/${audioUrlId}?autoplay=1&loop=1&playlist=${audioUrlId}&mute=0`;
        }
      },
      onPlay(val) {
        this.isPlaying = val;
      },
      onStop() {
        this.isPlaying = false;
      },
      onUpload(val) {
        this.file = val;
      },
      onMute(val) {
        this.isMute = val;
      },
      onInput(val) {
        this.inputUrl = val;
      },
      onUpdate(val) {
        Object.keys(this.settings).forEach((key) => {
          if (key in val) {
            this.settings[key] = val[key];
          }
        });

        console.log(this.settings);
      },

      toggleControls() {
        this.isControlsHidden = !this.isControlsHidden;
        this.showShortcutHint();
      },
      handleDoubleClick(e) {
        if (!e.target.closest('.controls') && !e.target.closest('.toggle-controls')) {
          this.toggleControls();
        }
      },
      handleKeyDown(e) {
        if (e.key === 'h' || e.key === 'H') {
          this.toggleControls();
        }
      },
      showShortcutHint() {
        this.isShortcutHintVisible = true;
        setTimeout(() => {
          this.isShortcutHintVisible = false;
        }, 2000);
      },
    },
  };
</script>

<style>
  .toggle-controls {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 4;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .toggle-controls:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .toggle-controls .icon {
    transition: transform 0.3s ease;
  }

  .toggle-controls.hidden .icon {
    transform: rotate(180deg);
  }

  .shortcut-hint {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .shortcut-hint.visible {
    opacity: 1;
  }
</style>
