import { defineStore } from 'pinia';
import { debounce } from 'lodash-es';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    blendMode: 'difference',
    effectType: 'vibration',
    hue: 0,
    color: '#ffffff',
    opacity: 100,
    vibrateSpeed: 50,
    vibrateIntensity: 1,
    blurAmount: 2,
    intervalSpeed: 200,
    textLines: ['INSERT', "SUN'O3.08", 'BAR OOST'],
    fontSize: [120, 120, 120],
    margin: [0, 0, 0],
    marginTop: [0, 0, 0],
    letterSpacing: [0, 0, 0],
    globalRandomAmount: 50,
    randomAmount: [0, 0, 0],
    backdropBlur: 0,
    backdropBrightness: 100,
    backdropContrast: 100,
    backdropSaturate: 100,
    textTypes: [],
    dragMode: true,
  }),

  actions: {
    loadFromLocalStorage() {
      const stored = localStorage.getItem('appSettings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          Object.assign(this.$state, parsed);
        } catch (e) {
          console.error('Failed to parse stored settings:', e);
        }
      }
    },

    updateSettings(settings) {
      Object.assign(this.$state, settings);
      this.saveToLocalStorageDebounced();
    },

    saveToLocalStorageDebounced: debounce(function () {
      localStorage.setItem('appSettings', JSON.stringify(this.$state));
    }, 300),

    resetToDefaults() {
      this.$state.blendMode = 'difference';
      this.$state.effectType = 'vibration';
      this.$state.hue = 0;
      this.$state.color = '#ffffff';
      this.$state.opacity = 100;
      this.$state.vibrateSpeed = 50;
      this.$state.vibrateIntensity = 1;
      this.$state.blurAmount = 2;
      this.$state.globalRandomAmount = 50;
      this.$state.randomAmount = [0, 0, 0];
      this.$state.intervalSpeed = 200;
      this.$state.textLines = ['INSERT', "SUN'O3.08", 'BAR OOST'];
      this.$state.fontSize = [120, 120, 120];
      this.$state.margin = [0, 0, 0];
      this.$state.marginTop = [0, 0, 0];
      this.$state.letterSpacing = [0, 0, 0];
      this.$state.backdropBlur = 0;
      this.$state.backdropBrightness = 100;
      this.$state.backdropContrast = 100;
      this.$state.backdropSaturate = 100;
      this.$state.textTypes = [];
      this.$state.dragMode = false;
      localStorage.removeItem('appSettings');
    },

    addTextLine() {
      this.textLines.push('');
      this.fontSize.push(120);
      this.margin.push(0);
      this.marginTop.push(0);
      this.letterSpacing.push(0);
      this.randomAmount.push(0);
      this.textTypes.push(null);
    },

    removeTextLine(index) {
      this.textLines.splice(index, 1);
      this.fontSize.splice(index, 1);
      this.margin.splice(index, 1);
      this.marginTop.splice(index, 1);
      this.letterSpacing.splice(index, 1);
      this.randomAmount.splice(index, 1);
      this.textTypes.splice(index, 1);
    },

    setTextType(index, type) {
      this.textTypes[index] = type === 'paragraph' ? 'paragraph' : null;
    },
  },
});
