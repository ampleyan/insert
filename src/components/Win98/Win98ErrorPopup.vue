<template>
  <div class="win98-error-popup win98-frame" :style="popupStyle">
    <div class="win98-titlebar error-titlebar">
      <span>{{ error.title }}</span>
      <button class="win98-close" @click="dismiss">X</button>
    </div>
    <div class="error-content">
      <div class="error-icon" :style="iconStyle">⚠</div>
      <div class="error-message" :style="messageStyle">{{ error.message }}</div>
    </div>
    <div class="error-buttons">
      <button class="win98-button" @click="dismiss">OK</button>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';

export default {
  name: 'Win98ErrorPopup',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  emits: ['dismiss'],
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      dismissTimer: null,
    };
  },
  computed: {
    textScale() {
      return this.settingsStore.win98.textScale;
    },
    popupStyle() {
      return {
        left: this.error.position?.x + 'px',
        top: this.error.position?.y + 'px',
        width: (350 * this.textScale / 2) + 'px',
      };
    },
    iconStyle() {
      return {
        fontSize: (32 * this.textScale / 2) + 'px',
      };
    },
    messageStyle() {
      return {
        fontSize: (11 * this.textScale) + 'px',
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
  min-width: 200px;
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
