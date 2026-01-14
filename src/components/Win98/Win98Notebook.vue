<template>
  <div class="win98-notebook">
    <div
      class="notebook-content win98-frame-sunken"
      :style="contentStyle"
      contenteditable="true"
      @input="onInput"
      v-html="content"
    ></div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';

export default {
  name: 'Win98Notebook',
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  computed: {
    content() {
      return this.settingsStore.win98.notebookContent;
    },
    textScale() {
      return this.settingsStore.win98.textScale;
    },
    contentStyle() {
      return {
        fontSize: (12 * this.textScale) + 'px',
        lineHeight: 1.4,
      };
    },
  },
  methods: {
    onInput(e) {
      this.settingsStore.win98UpdateSettings({
        notebookContent: e.target.innerHTML,
      });
    },
  },
};
</script>

<style scoped>
.win98-notebook {
  width: 100%;
  height: 300px;
}

.notebook-content {
  width: 100%;
  height: 100%;
  background: var(--win98-white);
  padding: 8px;
  font-family: var(--win98-font-mono);
  font-size: 12px;
  color: var(--win98-black);
  overflow-y: auto;
  outline: none;
  line-height: 1.4;
}

.notebook-content:focus {
  outline: none;
}
</style>
