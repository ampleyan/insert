<template>
  <section class="brand-presets">
    <div class="brand-presets-header">
      <div>
        <p class="brand-kicker">INSERT IDENTITY</p>
        <h3>Brand Presets</h3>
      </div>
      <span class="brand-active">{{ brandStore.activePreset.name }}</span>
    </div>

    <div class="brand-preset-grid">
      <button
        v-for="preset in brandStore.allPresets"
        :key="preset.id"
        type="button"
        :class="['brand-preset', { active: brandStore.activePresetId === preset.id }]"
        @click="applyPreset(preset)"
      >
        <span class="brand-preset-swatch" :style="{ '--preset-accent': preset.identity.accent }"></span>
        <span class="brand-preset-name">{{ preset.name }}</span>
        <span class="brand-preset-description">{{ preset.description }}</span>
      </button>
    </div>
  </section>
</template>

<script>
import { useBrandStore } from '@/stores/brand';

export default {
  name: 'BrandPresetControls',
  emits: ['update'],
  setup() {
    const brandStore = useBrandStore();
    return { brandStore };
  },
  methods: {
    applyPreset(preset) {
      this.brandStore.selectPreset(preset.id);
      this.$emit('update', preset.settings);
    },
  },
};
</script>

<style scoped>
.brand-presets {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.brand-presets-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.brand-kicker {
  margin: 0 0 4px;
  color: var(--identity-acid);
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  letter-spacing: var(--tracking-label);
}

.brand-presets h3 {
  margin: 0;
  color: var(--identity-ink);
  font-family: var(--font-ui);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.brand-active {
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  text-transform: uppercase;
  white-space: nowrap;
}

.brand-preset-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.brand-preset {
  display: flex;
  min-height: 82px;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 10px;
  color: var(--identity-ink);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  text-align: left;
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.brand-preset:hover,
.brand-preset.active {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--preset-accent);
}

.brand-preset-swatch {
  width: 24px;
  height: 4px;
  background: var(--preset-accent);
  box-shadow: 0 0 10px var(--preset-accent);
}

.brand-preset-name {
  font-family: var(--font-ui);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.brand-preset-description {
  color: var(--color-text-tertiary);
  font-family: var(--font-ui);
  font-size: var(--type-caption);
  line-height: var(--leading-ui);
}
</style>
