<template>
  <section class="performance-controls">
    <div class="performance-header">
      <div>
        <p class="performance-kicker">LIVE OUTPUT</p>
        <h3>TouchDesigner</h3>
      </div>
      <span :class="['bridge-status', { connected }]">
        {{ connected ? 'CONNECTED' : 'OFFLINE' }}
      </span>
    </div>

    <div class="bridge-row">
      <input v-model.trim="url" type="url" aria-label="TouchDesigner bridge URL" />
      <button type="button" @click="toggleConnection">
        {{ connected ? 'Disconnect' : 'Connect' }}
      </button>
    </div>

    <div class="performance-grid">
      <button
        v-for="preset in presets"
        :key="preset.id"
        type="button"
        :class="['performance-card', { active: performance.scene === preset.id }]"
        @click="selectPreset(preset)"
      >
        <span class="performance-card-name">{{ preset.name }}</span>
        <span class="performance-card-description">{{ preset.description }}</span>
      </button>
    </div>

    <div class="performance-ranges">
      <label v-for="control in rangeControls" :key="control.key">
        <span>{{ control.label }}</span>
        <input
          v-model.number="performance[control.key]"
          type="range"
          min="0"
          max="1"
          step="0.01"
          @input="updatePerformance"
        />
        <output>{{ performance[control.key].toFixed(2) }}</output>
      </label>
    </div>

    <label class="freeze-toggle">
      <input v-model="performance.freeze" type="checkbox" @change="updatePerformance" />
      <span>Freeze output</span>
      <small>Hold the current frame and protect the feedback loop.</small>
    </label>
  </section>
</template>

<script>
import { PERFORMANCE_PRESETS } from '@/constants/brandPresets';
import websocketBridge from '@/services/websocket';
import { useSettingsStore } from '@/stores/settings';

export default {
  name: 'PerformanceControls',
  data() {
    return {
      settingsStore: useSettingsStore(),
      presets: PERFORMANCE_PRESETS,
      url: 'ws://localhost:8080',
      connected: false,
      statusTimer: null,
      rangeControls: [
        { key: 'warp', label: 'Warp' },
        { key: 'feedback', label: 'Feedback' },
        { key: 'chromatic', label: 'Chromatic' },
      ],
    };
  },
  computed: {
    performance() {
      return this.settingsStore.performance;
    },
  },
  mounted() {
    this.statusTimer = window.setInterval(() => {
      this.connected = websocketBridge.isConnected();
    }, 250);
  },
  beforeUnmount() {
    window.clearInterval(this.statusTimer);
  },
  methods: {
    toggleConnection() {
      if (this.connected) {
        websocketBridge.disconnect();
        this.connected = false;
        return;
      }

      websocketBridge.connect(this.url);
    },
    selectPreset(preset) {
      this.settingsStore.updatePerformance(preset.settings);
    },
    updatePerformance() {
      this.settingsStore.updatePerformance({ ...this.performance });
    },
  },
};
</script>

<style scoped>
.performance-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
  padding: 14px 0 16px;
  border-bottom: 1px solid var(--border-color);
}

.performance-header,
.bridge-row,
.performance-ranges label,
.freeze-toggle {
  display: flex;
  align-items: center;
}

.performance-header {
  justify-content: space-between;
}

.performance-kicker {
  margin: 0 0 4px;
  color: var(--identity-acid);
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  letter-spacing: var(--tracking-label);
}

.performance-header h3 {
  margin: 0;
  color: var(--identity-ink);
  font-family: var(--font-ui);
  font-size: var(--font-size-lg);
}

.bridge-status,
.performance-card-description,
.freeze-toggle small {
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: var(--type-caption);
}

.bridge-status.connected {
  color: var(--identity-acid);
}

.bridge-row {
  gap: 8px;
}

.bridge-row input {
  min-width: 0;
  flex: 1;
  padding: 8px;
  color: var(--identity-ink);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--type-caption);
}

.bridge-row button,
.performance-card {
  color: var(--identity-ink);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.bridge-row button {
  padding: 8px 10px;
  font-family: var(--font-ui);
  font-size: var(--type-caption);
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.performance-card {
  min-height: 62px;
  padding: 10px;
  text-align: left;
}

.performance-card.active,
.performance-card:hover,
.bridge-row button:hover {
  background: rgba(223, 255, 0, 0.1);
  border-color: var(--identity-acid);
}

.performance-card-name,
.performance-card-description {
  display: block;
}

.performance-card-name {
  margin-bottom: 5px;
  font-family: var(--font-ui);
  font-size: var(--type-ui);
  font-weight: var(--font-weight-bold);
}

.performance-card-description {
  line-height: var(--leading-ui);
}

.performance-ranges {
  display: grid;
  gap: 8px;
}

.performance-ranges label {
  gap: 8px;
  color: var(--color-text-secondary);
  font-family: var(--font-ui);
  font-size: var(--type-caption);
}

.performance-ranges label span {
  width: 62px;
}

.performance-ranges input {
  min-width: 0;
  flex: 1;
  accent-color: var(--identity-acid);
}

.performance-ranges output {
  width: 34px;
  color: var(--identity-ink);
  font-family: var(--font-mono);
  text-align: right;
}

.freeze-toggle {
  flex-wrap: wrap;
  gap: 8px;
  color: var(--identity-ink);
  font-family: var(--font-ui);
  font-size: var(--type-ui);
}

.freeze-toggle input {
  accent-color: var(--identity-red);
}

.freeze-toggle small {
  flex-basis: 100%;
  margin-left: 24px;
}
</style>
