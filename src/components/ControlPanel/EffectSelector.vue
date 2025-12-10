<template>
  <div class="effect-selector">
    <div class="selector-header">
      <h3>Choose Effect</h3>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search effects..."
        class="search-input"
      />
    </div>

    <div class="category-filters">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="{ active: activeCategory === category.id }"
        @click="activeCategory = category.id"
        class="category-btn"
      >
        {{ category.icon }} {{ category.name }}
      </button>
    </div>

    <div class="effects-grid">
      <div
        v-for="effect in filteredEffects"
        :key="effect.value"
        :class="['effect-card', { active: settings.effectType === effect.value }]"
        @click="selectEffect(effect.value)"
        @mouseenter="previewOnHover && previewEffect(effect.value)"
        @mouseleave="previewOnHover && cancelPreview()"
      >
        <div class="effect-preview">
          <div class="preview-text" :class="`preview-${effect.value}`">
            {{ effect.previewText }}
          </div>
        </div>
        <div class="effect-info">
          <div class="effect-name">{{ effect.label }}</div>
          <div class="effect-category">{{ effect.category }}</div>
        </div>
      </div>
    </div>

    <div class="selector-footer">
      <label class="preview-toggle">
        <input type="checkbox" v-model="previewOnHover" />
        <span>Preview on hover</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EffectSelector',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  emits: ['update'],
  data() {
    return {
      searchQuery: '',
      activeCategory: 'all',
      previewOnHover: false,
      previewTimeout: null,
      categories: [
        { id: 'all', name: 'All', icon: '∗' },
        { id: 'motion', name: 'Motion', icon: '⚡' },
        { id: 'typography', name: 'Typography', icon: 'T' },
        { id: '3d', name: '3D/Depth', icon: '◧' },
        { id: 'light', name: 'Light', icon: '✦' },
        { id: 'retro', name: 'Retro', icon: '◉' },
      ],
      effects: [
        { value: 'vibration', label: 'Vibration', category: 'motion', previewText: 'VIB' },
        { value: 'glitch', label: 'Glitch', category: 'retro', previewText: 'GLI' },
        { value: 'wave', label: 'Wave', category: 'motion', previewText: 'WAV' },
        { value: 'particle', label: 'Particle Burst', category: 'motion', previewText: 'PAR' },
        { value: 'rotation3d', label: '3D Rotation', category: '3d', previewText: '3D' },
        { value: 'neon', label: 'Neon Glow', category: 'light', previewText: 'NEO' },
        { value: 'liquid', label: 'Liquid Distortion', category: 'motion', previewText: 'LIQ' },
        { value: 'typewriter', label: 'Typewriter', category: 'typography', previewText: 'TYP' },
        { value: 'chromatic', label: 'Chromatic Aberration', category: '3d', previewText: 'CHR' },
        { value: 'goo', label: 'SVG Distort', category: 'motion', previewText: 'GOO' },
        { value: 'split', label: 'Split Text', category: 'typography', previewText: 'SPL' },
        { value: 'wavy', label: 'Wavy Text', category: 'typography', previewText: 'WAV' },
        { value: 'flicker', label: 'Flicker', category: 'light', previewText: 'FLI' },
        { value: 'stroke', label: 'Stroke Text', category: 'typography', previewText: 'STR' },
        { value: 'gradient', label: 'Gradient', category: 'typography', previewText: 'GRA' },
        { value: 'scanlines', label: 'Scanlines/VHS', category: 'retro', previewText: 'VHS' },
        { value: 'holographic', label: 'Holographic', category: 'light', previewText: 'HOLO' },
        { value: 'perspective', label: 'Perspective Shift', category: '3d', previewText: '3D' },
        { value: 'shatter', label: 'Shatter', category: 'motion', previewText: 'SHT' },
      ],
    };
  },
  computed: {
    filteredEffects() {
      let filtered = this.effects;

      if (this.activeCategory !== 'all') {
        filtered = filtered.filter((e) => e.category === this.activeCategory);
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((e) => e.label.toLowerCase().includes(query));
      }

      return filtered;
    },
  },
  methods: {
    selectEffect(effectType) {
      this.$emit('update', { effectType });
    },

    previewEffect(effectType) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = setTimeout(() => {
        this.$emit('update', { effectType });
      }, 300);
    },

    cancelPreview() {
      clearTimeout(this.previewTimeout);
    },
  },
};
</script>

<style scoped>
.effect-selector {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.selector-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selector-header h3 {
  color: white;
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.search-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
}

.category-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.category-btn {
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.category-btn.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.effect-card {
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.effect-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.effect-card.active {
  background: rgba(0, 122, 255, 0.2);
  border-color: rgba(0, 122, 255, 0.5);
}

.effect-preview {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.preview-text {
  font-size: 20px;
  font-weight: 900;
  color: white;
}

.preview-vibration { animation: preview-vibrate 0.5s infinite; }
.preview-glitch { animation: preview-glitch 0.8s infinite; }
.preview-wave { animation: preview-wave 2s infinite; }
.preview-neon { text-shadow: 0 0 10px #fff, 0 0 20px #ff00ff; }
.preview-scanlines { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
.preview-holographic { background: linear-gradient(45deg, #ff00ff, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

@keyframes preview-vibrate {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 2px); }
  50% { transform: translate(2px, -2px); }
  75% { transform: translate(-2px, -2px); }
}

@keyframes preview-glitch {
  0%, 100% { transform: skew(0deg); }
  25% { transform: skew(2deg); }
  75% { transform: skew(-2deg); }
}

@keyframes preview-wave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.effect-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.effect-name {
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.effect-category {
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
}

.selector-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 10px;
}

.preview-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  cursor: pointer;
}

.preview-toggle input {
  cursor: pointer;
}
</style>
