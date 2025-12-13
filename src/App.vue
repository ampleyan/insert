<template>
  <div class="app" :style="appStyle">
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
        v-if="settingsStore.effectType === 'goo'"
        :settings="settingsStore.$state"
        text="Wavy Text"
        baseFrequency="0.02 0.02"
        scale="30"
        fontSize="12vw"
        color="#ff0"
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

    <!-- <QuickActionsBar
      @reset="resetToDefaults"
      @show-presets="showPresetsModal = true"
      @save-preset="showSavePresetModal = true"
    /> -->
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
import ScanlinesEffect from './components/Effects/ScanlinesEffect.vue';
import HolographicEffect from './components/Effects/HolographicEffect.vue';
import PerspectiveEffect from './components/Effects/PerspectiveEffect.vue';
import ShatterEffect from './components/Effects/ShatterEffect.vue';
import ErrorBoundary from './components/ErrorBoundary.vue';
import { useSettingsStore } from './stores/settings';
import { useHistoryStore } from './stores/history';
import { usePresetsStore } from './stores/presets';

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
      showPresetsModal: false,
      showSavePresetModal: false,
    };
  },
  setup() {
    const settingsStore = useSettingsStore();
    const historyStore = useHistoryStore();
    const presetsStore = usePresetsStore();

    settingsStore.loadFromLocalStorage();
    presetsStore.loadFromLocalStorage();

    return { settingsStore, historyStore, presetsStore };
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
  computed: {
    appStyle() {
      return {
        width: `${this.settingsStore.videoWidth}px`,
        height: `${this.settingsStore.videoHeight}px`
      };
    }
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
    handleKeyDown(e) {
      if (e.key === 'h' || e.key === 'H') {
        this.toggleControls();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.historyStore.undo(this.settingsStore);
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        this.historyStore.redo(this.settingsStore);
      }

      const effectMap = {
        '1': 'vibration', '2': 'glitch', '3': 'wave', '4': 'particle',
        '5': 'rotation3d', '6': 'neon', '7': 'liquid', '8': 'typewriter',
        '9': 'chromatic'
      };

      if (effectMap[e.key]) {
        this.settingsStore.updateSettings({ effectType: effectMap[e.key] });
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
.app {
  position: relative;
  margin: 0 auto;
  overflow: hidden;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
