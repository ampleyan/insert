import { defineStore } from 'pinia';
import { BRAND_PRESETS, DEFAULT_BRAND_IDENTITY } from '../constants/brandPresets';

const STORAGE_KEY = 'insertBrandIdentity';

export const useBrandStore = defineStore('brand', {
  state: () => ({
    identity: { ...DEFAULT_BRAND_IDENTITY },
    activePresetId: BRAND_PRESETS[0].id,
    customPresets: [],
  }),

  getters: {
    allPresets: (state) => [...BRAND_PRESETS, ...state.customPresets],
    activePreset: (state) =>
      [...BRAND_PRESETS, ...state.customPresets].find(
        (preset) => preset.id === state.activePresetId
      ) || BRAND_PRESETS[0],
  },

  actions: {
    loadFromLocalStorage() {
      if (typeof localStorage === 'undefined') return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const data = JSON.parse(stored);
        this.identity = { ...DEFAULT_BRAND_IDENTITY, ...(data.identity || {}) };
        this.activePresetId = data.activePresetId || BRAND_PRESETS[0].id;
        this.customPresets = Array.isArray(data.customPresets) ? data.customPresets : [];
      } catch (error) {
        console.error('Failed to load brand identity:', error);
      }
    },

    saveToLocalStorage() {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          identity: this.identity,
          activePresetId: this.activePresetId,
          customPresets: this.customPresets,
        })
      );
    },

    selectPreset(presetId) {
      const preset = this.allPresets.find((item) => item.id === presetId);
      if (!preset) return null;
      this.activePresetId = preset.id;
      this.identity = { ...this.identity, ...preset.identity };
      this.saveToLocalStorage();
      return preset;
    },

    savePreset(name, description, identity, settings) {
      const preset = {
        id: `brand-${Date.now()}`,
        name,
        description: description || '',
        identity: { ...identity },
        settings: JSON.parse(JSON.stringify(settings)),
        createdAt: new Date().toISOString(),
      };
      this.customPresets.push(preset);
      this.saveToLocalStorage();
      return preset;
    },

    deletePreset(presetId) {
      this.customPresets = this.customPresets.filter((preset) => preset.id !== presetId);
      if (this.activePresetId === presetId) {
        this.activePresetId = BRAND_PRESETS[0].id;
      }
      this.saveToLocalStorage();
    },
  },
});
