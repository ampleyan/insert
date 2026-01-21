<template>
  <div class="insert-view" :style="appStyle" :class="{ 'fit-mode': settingsStore.fitToFormat }">
    <button class="win98-mode-toggle" @click="navigateToWin98">
      <span class="mode-current">INSERT</span>
      <span class="mode-arrow">→</span>
      <span class="mode-switch">Studio</span>
    </button>

    <VideoBackground :settings="settingsStore.$state" />
    <FormatBoundary :settings="settingsStore.$state" />
    <GridOverlay :settings="settingsStore.$state" />
    <ImageOverlay
      :images="settingsStore.imageOverlays || []"
      :dragMode="settingsStore.dragMode"
      @update="onUpdate"
    />
    <VideoOverlay
      :videos="settingsStore.videoOverlays || []"
      :dragMode="settingsStore.dragMode"
      @update="onUpdate"
    />

    <button class="toggle-controls" @click="toggleControls">
      <span class="icon" :class="{ hidden: isControlsHidden }">◀</span>
      <span class="text">{{ isControlsHidden ? 'Show Controls' : 'Hide Controls' }}</span>
    </button>

    <div class="shortcut-hint" :class="{ visible: isShortcutHintVisible }">
      Double-click anywhere to toggle controls
    </div>

    <ControlPanel
      :class="{ hidden: isControlsHidden }"
      @update="onUpdate"
      @change-effect="onUpdate"
      @reset="resetToDefaults"
      @audioPlay="handleAudioPlay"
      @audioPause="handleAudioPause"
      @audioStop="handleAudioStop"
      @audioFile="handleAudioFile"
    />

    <ErrorBoundary>
      <TextVibration
        v-if="settingsStore.effectType === 'vibration'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <GlitchEffect v-if="settingsStore.effectType === 'glitch'" :settings="settingsStore.$state" @update="onUpdate" />
      <WaveEffect v-if="settingsStore.effectType === 'wave'" :settings="settingsStore.$state" @update="onUpdate" />
      <ParticleBurst
        v-if="settingsStore.effectType === 'particle'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <Rotation3D
        v-if="settingsStore.effectType === 'rotation3d'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <NeonGlow v-if="settingsStore.effectType === 'neon'" :settings="settingsStore.$state" @update="onUpdate" />
      <LiquidDistortion
        v-if="settingsStore.effectType === 'liquid'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <TypewriterEffect
        v-if="settingsStore.effectType === 'typewriter'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <ChromaticAberration
        v-if="settingsStore.effectType === 'chromatic'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <TextDistort
        v-if="settingsStore.effectType === 'distort'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <SplitText v-if="settingsStore.effectType === 'split'" :settings="settingsStore.$state" @update="onUpdate" />
      <WavyText v-if="settingsStore.effectType === 'wavy'" :settings="settingsStore.$state" @update="onUpdate" />
      <FlickerText
        v-if="settingsStore.effectType === 'flicker'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <StrokeText v-if="settingsStore.effectType === 'stroke'" :settings="settingsStore.$state" @update="onUpdate" />
      <GradientText
        v-if="settingsStore.effectType === 'gradient'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <ScanlinesEffect
        v-if="settingsStore.effectType === 'scanlines'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <HolographicEffect
        v-if="settingsStore.effectType === 'holographic'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <PerspectiveEffect
        v-if="settingsStore.effectType === 'perspective'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <ShatterEffect
        v-if="settingsStore.effectType === 'shatter'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
    </ErrorBoundary>
  </div>
</template>

<script>
import VideoBackground from '../components/VideoBackground.vue';
import FormatBoundary from '../components/FormatBoundary.vue';
import GridOverlay from '../components/GridOverlay.vue';
import ImageOverlay from '../components/ImageOverlay.vue';
import VideoOverlay from '../components/VideoOverlay.vue';
import ControlPanel from '../components/ControlPanel/ControlPanel.vue';
import TextVibration from '../components/Effects/TextVibration.vue';
import TextDistort from '../components/Effects/TextDistort.vue';
import GlitchEffect from '../components/Effects/GlitchEffect.vue';
import WaveEffect from '../components/Effects/WaveEffect.vue';
import ParticleBurst from '../components/Effects/ParticleBurst.vue';
import Rotation3D from '../components/Effects/Rotation3D.vue';
import NeonGlow from '../components/Effects/NeonGlow.vue';
import LiquidDistortion from '../components/Effects/LiquidDistortion.vue';
import TypewriterEffect from '../components/Effects/TypewriterEffect.vue';
import ChromaticAberration from '../components/Effects/ChromaticAberration.vue';
import SplitText from '../components/Effects/SplitText.vue';
import WavyText from '../components/Effects/WavyText.vue';
import FlickerText from '../components/Effects/FlickerText.vue';
import StrokeText from '../components/Effects/StrokeText.vue';
import GradientText from '../components/Effects/GradientText.vue';
import ScanlinesEffect from '../components/Effects/ScanlinesEffect.vue';
import HolographicEffect from '../components/Effects/HolographicEffect.vue';
import PerspectiveEffect from '../components/Effects/PerspectiveEffect.vue';
import ShatterEffect from '../components/Effects/ShatterEffect.vue';
import ErrorBoundary from '../components/ErrorBoundary.vue';
import { useSettingsStore } from '../stores/settings';
import { useHistoryStore } from '../stores/history';
import { useAudioSync } from '../composables/useAudioSync';

export default {
  name: 'InsertView',
  components: {
    VideoBackground,
    FormatBoundary,
    GridOverlay,
    ImageOverlay,
    VideoOverlay,
    ControlPanel,
    TextVibration,
    TextDistort,
    GlitchEffect,
    WaveEffect,
    ParticleBurst,
    Rotation3D,
    NeonGlow,
    LiquidDistortion,
    TypewriterEffect,
    ChromaticAberration,
    SplitText,
    WavyText,
    FlickerText,
    StrokeText,
    GradientText,
    ScanlinesEffect,
    HolographicEffect,
    PerspectiveEffect,
    ShatterEffect,
    ErrorBoundary,
  },
  data() {
    const storedState = localStorage.getItem('appState');
    const defaultState = {
      isControlsHidden: false,
    };

    return {
      ...JSON.parse(storedState || JSON.stringify(defaultState)),
      isShortcutHintVisible: false,
    };
  },
  setup() {
    const settingsStore = useSettingsStore();
    const historyStore = useHistoryStore();
    const { audioData, isPlaying, initAudio, play, pause, stop, setVolume } = useAudioSync();

    return {
      settingsStore,
      historyStore,
      audioData,
      audioIsPlaying: isPlaying,
      audioInit: initAudio,
      audioPlay: play,
      audioPause: pause,
      audioStop: stop,
      audioSetVolume: setVolume,
    };
  },
  mounted() {
    document.addEventListener('dblclick', this.handleDoubleClick);

    setTimeout(() => {
      this.isShortcutHintVisible = true;
      setTimeout(() => {
        this.isShortcutHintVisible = false;
      }, 3000);
    }, 1000);

    this.$watch(
      () => [this.audioData, this.settingsStore.audioSync],
      ([audioData, audioSync]) => {
        if (!audioSync?.enabled || !audioData) return;

        const influence = (audioSync.influence || 50) / 100;
        let audioValue = 0;

        switch (audioSync.target) {
          case 'amplitude':
            audioValue = audioData.amplitude;
            break;
          case 'bass':
            audioValue = audioData.bass;
            break;
          case 'mid':
            audioValue = audioData.mid;
            break;
          case 'treble':
            audioValue = audioData.treble;
            break;
          case 'beat':
            audioValue = audioData.beat ? 1 : 0;
            break;
        }

        const modulation = audioValue * influence;

        switch (audioSync.applyTo) {
          case 'intensity':
            this.settingsStore.vibrateIntensity = 1 + modulation * 10;
            break;
          case 'scale':
            this.settingsStore.scaleX = this.settingsStore.scaleX.map(() => 1 + modulation * 0.5);
            this.settingsStore.scaleY = this.settingsStore.scaleY.map(() => 1 + modulation * 0.5);
            break;
          case 'color':
            this.settingsStore.hue = (this.settingsStore.hue + modulation * 360) % 360;
            break;
          case 'glitch':
            if (this.settingsStore.glitch) {
              this.settingsStore.glitch.glitchIntensity = 10 + modulation * 20;
            }
            break;
        }
      },
      { deep: true }
    );
  },
  beforeUnmount() {
    document.removeEventListener('dblclick', this.handleDoubleClick);
  },
  provide() {
    return {
      audioData: this.audioData,
    };
  },
  computed: {
    appStyle() {
      return {
        width: `${this.settingsStore.videoWidth}px`,
        height: `${this.settingsStore.videoHeight}px`
      };
    },
  },
  methods: {
    resetToDefaults() {
      localStorage.removeItem('appState');
      this.settingsStore.resetToDefaults();
      this.isControlsHidden = false;
    },
    onUpdate(val) {
      this.historyStore.recordState(this.settingsStore.$state);
      this.settingsStore.updateSettings(val);
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
    showShortcutHint() {
      this.isShortcutHintVisible = true;
      setTimeout(() => {
        this.isShortcutHintVisible = false;
      }, 2000);
    },
    handleAudioFile(file) {
      if (file) {
        this.audioInit(file);
        if (this.settingsStore.audioSync?.volume) {
          this.audioSetVolume(this.settingsStore.audioSync.volume);
        }
      }
    },
    handleAudioPlay() {
      this.audioPlay();
    },
    handleAudioPause() {
      this.audioPause();
    },
    handleAudioStop() {
      this.audioStop();
    },
    navigateToWin98() {
      this.$router.push('/studio');
    },
  },
};
</script>

<style scoped>
.insert-view {
  position: relative;
  overflow: visible;
  margin: 0 auto;
}

.insert-view.fit-mode {
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
}

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
