<template>
  <div class="win98-error-popup win98-frame" :style="popupStyle">
    <div class="win98-titlebar error-titlebar">
      <span>{{ error.title }}</span>
      <button class="win98-close" @click="dismiss">X</button>
    </div>
    <div class="error-content">
      <div class="error-icon">⚠</div>
      <div class="error-message">{{ error.message }}</div>
    </div>
    <div class="error-buttons">
      <button class="win98-button" @click="dismiss">OK</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Win98ErrorPopup',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  emits: ['dismiss'],
  data() {
    return {
      dismissTimer: null,
    };
  },
  computed: {
    popupStyle() {
      return {
        left: this.error.position?.x + 'px',
        top: this.error.position?.y + 'px',
      };
    },
  },
  mounted() {
    this.dismissTimer = setTimeout(() => {
      this.dismiss();
    }, 8000);
  },
  beforeUnmount() {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
    }
  },
  methods: {
    dismiss() {
      this.$emit('dismiss', this.error.id);
    },
  },
};
</script>

<style scoped>
.win98-error-popup {
  position: absolute;
  width: 350px;
  z-index: 8000;
  animation: win98-window-open 0.15s ease-out;
}

.error-titlebar {
  background: linear-gradient(to right, #800000, #c00000);
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--win98-gray);
}

.error-icon {
  font-size: 32px;
  color: #c00000;
  flex-shrink: 0;
}

.error-message {
  font-family: var(--win98-font);
  font-size: 11px;
  color: var(--win98-black);
  line-height: 1.4;
}

.error-buttons {
  display: flex;
  justify-content: center;
  padding: 8px 16px 16px;
  background: var(--win98-gray);
}

.error-buttons .win98-button {
  min-width: 80px;
}
</style>
