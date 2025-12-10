import { defineStore } from 'pinia';

export const usePresetsStore = defineStore('presets', {
  state: () => ({
    presets: [
      {
        id: 'retro-vhs',
        name: 'Retro VHS',
        description: 'Classic VHS glitch aesthetic',
        settings: {
          effectType: 'glitch',
          blendMode: 'difference',
          hue: 180,
          color: '#00ff00',
          opacity: 85,
          vibrateSpeed: 100,
          vibrateIntensity: 2,
        },
      },
      {
        id: 'neon-dreams',
        name: 'Neon Dreams',
        description: 'Vibrant neon glow',
        settings: {
          effectType: 'neon',
          blendMode: 'screen',
          hue: 280,
          color: '#ff00ff',
          opacity: 100,
          vibrateSpeed: 50,
          vibrateIntensity: 0.5,
        },
      },
      {
        id: 'subtle-wave',
        name: 'Subtle Wave',
        description: 'Gentle wave motion',
        settings: {
          effectType: 'wave',
          blendMode: 'normal',
          hue: 0,
          color: '#ffffff',
          opacity: 90,
          vibrateSpeed: 200,
          vibrateIntensity: 1,
        },
      },
      {
        id: 'intense-vibration',
        name: 'Intense Vibration',
        description: 'High energy vibration',
        settings: {
          effectType: 'vibration',
          blendMode: 'difference',
          hue: 0,
          color: '#ffffff',
          opacity: 100,
          vibrateSpeed: 30,
          vibrateIntensity: 3,
          blurAmount: 4,
        },
      },
    ],
    customPresets: [],
  }),

  getters: {
    allPresets: (state) => [...state.presets, ...state.customPresets],
  },

  actions: {
    loadFromLocalStorage() {
      const stored = localStorage.getItem('customPresets');
      if (stored) {
        try {
          this.customPresets = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to load custom presets:', e);
        }
      }
    },

    savePreset(name, description, settings) {
      const preset = {
        id: `custom-${Date.now()}`,
        name,
        description: description || '',
        settings: JSON.parse(JSON.stringify(settings)),
        createdAt: new Date().toISOString(),
      };
      this.customPresets.push(preset);
      this.saveToLocalStorage();
      return preset;
    },

    deletePreset(id) {
      const index = this.customPresets.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.customPresets.splice(index, 1);
        this.saveToLocalStorage();
      }
    },

    saveToLocalStorage() {
      localStorage.setItem('customPresets', JSON.stringify(this.customPresets));
    },

    exportPresets() {
      const data = {
        version: '1.0',
        presets: this.customPresets,
        exportedAt: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    },

    importPresets(json) {
      try {
        const data = JSON.parse(json);
        if (data.presets && Array.isArray(data.presets)) {
          this.customPresets = [...this.customPresets, ...data.presets];
          this.saveToLocalStorage();
          return true;
        }
      } catch (e) {
        console.error('Failed to import presets:', e);
        return false;
      }
    },

    exportPresetsAsFile() {
      const json = this.exportPresets();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `text-effects-presets-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
});
