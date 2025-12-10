<template>
  <div class="quick-actions-bar">
    <div class="actions-group">
      <button
        @click="undo"
        :disabled="!canUndo"
        class="action-btn"
        title="Undo (Ctrl+Z)"
      >
        <span class="icon">↶</span>
        <span class="label">Undo</span>
      </button>
      <button
        @click="redo"
        :disabled="!canRedo"
        class="action-btn"
        title="Redo (Ctrl+Shift+Z)"
      >
        <span class="icon">↷</span>
        <span class="label">Redo</span>
      </button>
    </div>

    <div class="actions-group">
      <button @click="savePreset" class="action-btn" title="Save Preset">
        <span class="icon">💾</span>
        <span class="label">Save</span>
      </button>
      <button @click="showPresets" class="action-btn" title="Load Preset">
        <span class="icon">📂</span>
        <span class="label">Load</span>
      </button>
    </div>

    <div class="actions-group">
      <button @click="exportSettings" class="action-btn" title="Export Settings">
        <span class="icon">⬇</span>
        <span class="label">Export</span>
      </button>
      <button @click="importSettings" class="action-btn" title="Import Settings">
        <span class="icon">⬆</span>
        <span class="label">Import</span>
      </button>
    </div>

    <div class="actions-group">
      <button @click="randomize" class="action-btn" title="Randomize Effect">
        <span class="icon">🎲</span>
        <span class="label">Random</span>
      </button>
      <button @click="reset" class="action-btn danger" title="Reset All">
        <span class="icon">↺</span>
        <span class="label">Reset</span>
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    />
  </div>
</template>

<script>
import { useHistoryStore } from '@/stores/history';
import { useSettingsStore } from '@/stores/settings';
import { usePresetsStore } from '@/stores/presets';

export default {
  name: 'QuickActionsBar',
  emits: ['reset', 'show-presets', 'save-preset'],
  setup() {
    const historyStore = useHistoryStore();
    const settingsStore = useSettingsStore();
    const presetsStore = usePresetsStore();

    return {
      historyStore,
      settingsStore,
      presetsStore,
    };
  },
  computed: {
    canUndo() {
      return this.historyStore.canUndo;
    },
    canRedo() {
      return this.historyStore.canRedo;
    },
  },
  methods: {
    undo() {
      this.historyStore.undo(this.settingsStore);
    },

    redo() {
      this.historyStore.redo(this.settingsStore);
    },

    savePreset() {
      this.$emit('save-preset');
    },

    showPresets() {
      this.$emit('show-presets');
    },

    exportSettings() {
      const settings = JSON.stringify(this.settingsStore.$state, null, 2);
      const blob = new Blob([settings], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `text-effect-settings-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    importSettings() {
      this.$refs.fileInput.click();
    },

    handleFileImport(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target.result);
            this.settingsStore.updateSettings(settings);
          } catch (error) {
            alert('Failed to import settings: Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
      event.target.value = '';
    },

    randomize() {
      const effects = [
        'vibration',
        'glitch',
        'wave',
        'particle',
        'rotation3d',
        'neon',
        'liquid',
        'typewriter',
        'chromatic',
        'scanlines',
        'holographic',
        'perspective',
        'shatter',
      ];
      const blendModes = [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'difference',
        'exclusion',
        'color-dodge',
        'color-burn',
      ];

      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      const randomBlend = blendModes[Math.floor(Math.random() * blendModes.length)];
      const randomHue = Math.floor(Math.random() * 360);
      const randomColor = `hsl(${randomHue}, 100%, 50%)`;

      this.settingsStore.updateSettings({
        effectType: randomEffect,
        blendMode: randomBlend,
        hue: randomHue,
        color: randomColor,
        vibrateSpeed: Math.floor(Math.random() * 150) + 30,
        vibrateIntensity: Math.random() * 3 + 0.5,
      });
    },

    reset() {
      if (confirm('Are you sure you want to reset all settings?')) {
        this.$emit('reset');
      }
    },
  },
};
</script>

<style scoped>
.quick-actions-bar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  background: rgba(0, 0, 0, 0.9);
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 100;
  backdrop-filter: blur(10px);
}

.actions-group {
  display: flex;
  gap: 8px;
  padding: 0 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.actions-group:last-child {
  border-right: none;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
}

.action-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.action-btn:active:not(:disabled) {
  transform: translateY(0);
}

.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.action-btn.danger {
  border-color: rgba(255, 59, 48, 0.3);
}

.action-btn.danger:hover:not(:disabled) {
  background: rgba(255, 59, 48, 0.2);
  border-color: rgba(255, 59, 48, 0.5);
}

.icon {
  font-size: 18px;
  line-height: 1;
}

.label {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .quick-actions-bar {
    bottom: 10px;
    padding: 8px 12px;
    gap: 8px;
  }

  .actions-group {
    padding: 0 6px;
  }

  .action-btn {
    min-width: 50px;
    padding: 6px 8px;
  }

  .label {
    font-size: 9px;
  }
}
</style>
