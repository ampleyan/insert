<template>
  <div class="alignment-controls">
    <div class="alignment-section">
      <h4>Align All Text</h4>

      <div class="alignment-buttons">
        <div class="button-group">
          <label>Horizontal:</label>
          <button @click="alignHorizontal('left')" title="Align Left">
            <span class="icon">⬅</span>
          </button>
          <button @click="alignHorizontal('center')" title="Align Center">
            <span class="icon">↔</span>
          </button>
          <button @click="alignHorizontal('right')" title="Align Right">
            <span class="icon">➡</span>
          </button>
        </div>

        <div class="button-group">
          <label>Vertical:</label>
          <button @click="alignVertical('top')" title="Align Top">
            <span class="icon">⬆</span>
          </button>
          <button @click="alignVertical('middle')" title="Align Middle">
            <span class="icon">↕</span>
          </button>
          <button @click="alignVertical('bottom')" title="Align Bottom">
            <span class="icon">⬇</span>
          </button>
        </div>

        <div class="button-group">
          <label>Distribute:</label>
          <button @click="distributeVertically()" title="Distribute Vertically">
            <span class="icon">☰</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlignmentControls',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  emits: ['align'],
  methods: {
    alignHorizontal(alignment) {
      this.$emit('align', {
        type: 'horizontal',
        alignment: alignment,
        videoWidth: this.settings.videoWidth || 1080
      });
    },

    alignVertical(alignment) {
      this.$emit('align', {
        type: 'vertical',
        alignment: alignment,
        videoHeight: this.settings.videoHeight || 1920
      });
    },

    distributeVertically() {
      this.$emit('align', {
        type: 'distribute',
        axis: 'vertical',
        videoHeight: this.settings.videoHeight || 1920
      });
    }
  }
};
</script>

<style scoped>
.alignment-controls {
  background: rgba(0, 122, 255, 0.1);
  border: 1px solid rgba(0, 122, 255, 0.3);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 15px;
}

.alignment-section h4 {
  color: white;
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 500;
}

.alignment-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-group label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  min-width: 75px;
}

.button-group button {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 36px;
}

.button-group button:hover {
  background: rgba(0, 122, 255, 0.5);
  border-color: rgba(0, 122, 255, 0.7);
  transform: translateY(-1px);
}

.button-group button:active {
  transform: translateY(0);
}

.icon {
  font-size: 16px;
}
</style>
