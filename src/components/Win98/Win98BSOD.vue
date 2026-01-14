<template>
  <div class="win98-bsod" @click="dismiss">
    <div class="bsod-content">
      <div class="bsod-title">Windows</div>
      <div class="bsod-message">
        <p>A fatal exception CHAOS_OVERFLOW has occurred at 0028:C0011F69.</p>
        <p>The current application will be terminated.</p>
        <br />
        <p>* Press any key to continue to the party.</p>
        <br />
        <p>PARTY DETAILS:</p>
        <p>Location: {{ bsodContent.location }}</p>
        <p>Date: {{ bsodContent.date }}</p>
        <p>Time: {{ bsodContent.time }}</p>
        <br />
        <p>Press any key to continue <span class="blink">_</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';

export default {
  name: 'Win98BSOD',
  emits: ['dismiss'],
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  computed: {
    bsodContent() {
      return this.settingsStore.win98.bsodContent;
    },
  },
  mounted() {
    document.addEventListener('keypress', this.dismiss);
  },
  beforeUnmount() {
    document.removeEventListener('keypress', this.dismiss);
  },
  methods: {
    dismiss() {
      this.$emit('dismiss');
    },
  },
};
</script>

<style scoped>
.win98-bsod {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--win98-bsod-blue);
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.bsod-content {
  color: var(--win98-white);
  font-family: var(--win98-font-mono);
  font-size: 16px;
  text-align: center;
  max-width: 80%;
  line-height: 1.6;
}

.bsod-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  background: var(--win98-gray);
  color: var(--win98-bsod-blue);
  display: inline-block;
  padding: 4px 16px;
}

.bsod-message {
  text-align: left;
}

.bsod-message p {
  margin: 4px 0;
}

.blink {
  animation: win98-blink 1s step-end infinite;
}
</style>
