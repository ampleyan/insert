<template>
  <div class="app">
    <VideoBackground :settings="settingsStore.$state" />

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
      @change-effect="onUpdate"
      @reset="resetToDefaults"
    />

    <ErrorBoundary>
      <TextVibration
        v-if="settingsStore.effectType === 'vibration'"
        :settings="settingsStore.$state"
        @update="onUpdate"
      />
      <GlitchEffect v-if="settingsStore.effectType === 'glitch'" :settings="settingsStore.$state" />
      <WaveEffect v-if="settingsStore.effectType === 'wave'" :settings="settingsStore.$state" />
      <ParticleBurst
        v-if="settingsStore.effectType === 'particle'"
        :settings="settingsStore.$state"
      />
      <Rotation3D
        v-if="settingsStore.effectType === 'rotation3d'"
        :settings="settingsStore.$state"
      />
      <NeonGlow v-if="settingsStore.effectType === 'neon'" :settings="settingsStore.$state" />
      <LiquidDistortion
        v-if="settingsStore.effectType === 'liquid'"
        :settings="settingsStore.$state"
      />
      <TypewriterEffect
        v-if="settingsStore.effectType === 'typewriter'"
        :settings="settingsStore.$state"
      />
      <ChromaticAberration
        v-if="settingsStore.effectType === 'chromatic'"
        :settings="settingsStore.$state"
      />
      <TextDistort
        v-if="settingsStore.effectType === 'goo'"
        :settings="settingsStore.$state"
        text="Wavy Text"
        baseFrequency="0.02 0.02"
        scale="30"
        fontSize="12vw"
        color="#ff0"
      />
      <SplitText v-if="settingsStore.effectType === 'split'" :settings="settingsStore.$state" />
      <WavyText v-if="settingsStore.effectType === 'wavy'" :settings="settingsStore.$state" />
      <FlickerText
        v-if="settingsStore.effectType === 'flicker'"
        :settings="settingsStore.$state"
      />
      <StrokeText v-if="settingsStore.effectType === 'stroke'" :settings="settingsStore.$state" />
      <GradientText
        v-if="settingsStore.effectType === 'gradient'"
        :settings="settingsStore.$state"
      />
    </ErrorBoundary>

  </div>
</template>

<script>
import VideoBackground from './components/VideoBackground.vue';
import ControlPanel from './components/ControlPanel/ControlPanel.vue';
import TextVibration from './components/Effects/TextVibration.vue';
import TextDistort from './components/Effects/TextDistort.vue';
import GlitchEffect from './components/Effects/GlitchEffect.vue';
import WaveEffect from './components/Effects/WaveEffect.vue';
import ParticleBurst from './components/Effects/ParticleBurst.vue';
import Rotation3D from './components/Effects/Rotation3D.vue';
import NeonGlow from './components/Effects/NeonGlow.vue';
import LiquidDistortion from './components/Effects/LiquidDistortion.vue';
import TypewriterEffect from './components/Effects/TypewriterEffect.vue';
import ChromaticAberration from './components/Effects/ChromaticAberration.vue';
import SplitText from './components/Effects/SplitText.vue';
import WavyText from './components/Effects/WavyText.vue';
import FlickerText from './components/Effects/FlickerText.vue';
import StrokeText from './components/Effects/StrokeText.vue';
import GradientText from './components/Effects/GradientText.vue';
import ErrorBoundary from './components/ErrorBoundary.vue';
import { useSettingsStore } from './stores/settings';

export default {
  name: 'App',
  components: {
    VideoBackground,
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
    settingsStore.loadFromLocalStorage();
    return { settingsStore };
  },
  mounted() {
    document.addEventListener('dblclick', this.handleDoubleClick);
    document.addEventListener('keydown', this.handleKeyDown);

    setTimeout(() => {
      this.isShortcutHintVisible = true;
      setTimeout(() => {
        this.isShortcutHintVisible = false;
      }, 3000);
    }, 1000);
  },
  beforeUnmount() {
    document.removeEventListener('dblclick', this.handleDoubleClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    resetToDefaults() {
      localStorage.removeItem('appState');
      this.settingsStore.resetToDefaults();
      this.isControlsHidden = false;
    },
    onUpdate(val) {
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
