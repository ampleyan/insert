<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
import { useSettingsStore } from './stores/settings';
import { usePresetsStore } from './stores/presets';

export default {
  name: 'App',
  setup() {
    const settingsStore = useSettingsStore();
    const presetsStore = usePresetsStore();

    settingsStore.loadFromLocalStorage();
    presetsStore.loadFromLocalStorage();

    return {
      settingsStore,
      presetsStore,
    };
  },
};
</script>

<style>
.app {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

body {
  background: #1a1a1a;
  margin: 0;
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
