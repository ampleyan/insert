<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
import { useSettingsStore } from './stores/settings';
import { usePresetsStore } from './stores/presets';
import { useBrandStore } from './stores/brand';

export default {
  name: 'App',
  setup() {
    const settingsStore = useSettingsStore();
    const presetsStore = usePresetsStore();
    const brandStore = useBrandStore();

    settingsStore.loadFromLocalStorage();
    presetsStore.loadFromLocalStorage();
    brandStore.loadFromLocalStorage();

    return {
      settingsStore,
      presetsStore,
      brandStore,
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
  background: var(--identity-paper);
  color: var(--identity-ink);
  font-family: var(--font-ui);
  margin: 0;
  padding: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
