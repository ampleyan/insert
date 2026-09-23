<template>
  <section class="template-controls">
    <div class="template-header">
      <div>
        <p class="template-kicker">STARTING POINT</p>
        <h3>Templates</h3>
      </div>
      <span class="template-format">{{ currentFormat }}</span>
    </div>

    <div class="template-grid">
      <button
        v-for="template in templates"
        :key="template.id"
        type="button"
        class="template-card"
        @click="$emit('update', template.settings)"
      >
        <span class="template-card-name">{{ template.name }}</span>
        <span class="template-card-description">{{ template.description }}</span>
      </button>
    </div>
  </section>
</template>

<script>
import { TEMPLATE_PRESETS } from '@/constants/brandPresets';

export default {
  name: 'TemplateControls',
  props: {
    format: {
      type: String,
      default: 'vertical',
    },
  },
  emits: ['update'],
  data() {
    return {
      templates: TEMPLATE_PRESETS,
    };
  },
  computed: {
    currentFormat() {
      if (this.format === 'square') {
        return '1:1';
      }

      if (this.format === 'reels' || this.format === 'vertical') {
        return '9:16';
      }

      return '4:5';
    },
  },
};
</script>

<style scoped>
.template-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.template-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.template-kicker {
  margin: 0 0 4px;
  color: var(--identity-cyan);
  font-family: var(--font-mono);
  font-size: var(--type-caption);
  letter-spacing: var(--tracking-label);
}

.template-header h3 {
  margin: 0;
  color: var(--identity-ink);
  font-family: var(--font-ui);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.template-format {
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
  font-size: var(--type-caption);
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.template-card {
  min-height: 64px;
  padding: 10px;
  color: var(--identity-ink);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  text-align: left;
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.template-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--identity-cyan);
}

.template-card-name,
.template-card-description {
  display: block;
}

.template-card-name {
  margin-bottom: 5px;
  font-family: var(--font-ui);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.template-card-description {
  color: var(--color-text-tertiary);
  font-family: var(--font-ui);
  font-size: var(--type-caption);
  line-height: var(--leading-ui);
}
</style>
