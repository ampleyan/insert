<template>
  <div class="app">
    <VideoBackground />
    
    <button class="toggle-controls" @click="toggleControls">
      <span class="icon" :class="{ 'hidden': isControlsHidden }">◀</span>
      <span class="text">{{ isControlsHidden ? 'Show Controls' : 'Hide Controls' }}</span>
    </button>
    
    <div class="shortcut-hint" :class="{ 'visible': isShortcutHintVisible }">
      Double-click anywhere to toggle controls
    </div>
    
    <ControlPanel :class="{ 'hidden': isControlsHidden }" @update="onUpdate" />
    
    <TextEffect :settings="settings"/>
  </div>
</template>

<script>
import VideoBackground from './components/VideoBackground.vue';
import ControlPanel from './components/ControlPanel/ControlPanel.vue';
import TextEffect from './components/TextEffect.vue';

export default {
  name: 'App',
  components: {
    VideoBackground,
    ControlPanel,
    TextEffect
  },
  data() {
    return {
      isControlsHidden: false,
      isShortcutHintVisible: false,
      settings:  {
        // Blend settings
        blendMode: 'difference',

        // Color settings
        hue: 0,
        color: '#ffffff',
        opacity: 100,

        // Animation settings
        vibrateSpeed: 50,
        vibrateIntensity: 1,
        blurAmount: 2,
        randomAmount: 50,
        intervalSpeed: 200
      }
    };
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
    onUpdate(val) {
          Object.keys(this.settings).forEach(key => {
        if (key in val) {
            this.settings[key] = val[key];
        }
    });

          console.log(this.settings)

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
    }
  }
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