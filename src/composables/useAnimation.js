import { ref, reactive, computed, watch } from 'vue';

export function useAnimation() {
  // Animation settings
  const animationSettings = reactive({
    vibrateSpeed: 50,
    vibrateIntensity: 1,
    blurAmount: 2,
    randomAmount: 50,
    intervalSpeed: 200
  });

  // CSS variables for animation
  const cssVars = computed(() => {
    return {
      '--vibrate-speed': `${animationSettings.vibrateSpeed}ms`,
      '--vibrate-intensity': animationSettings.vibrateIntensity,
      '--blur-amount': `${animationSettings.blurAmount}px`
    };
  });

  // Apply CSS variables to root element
  watch(cssVars, (newVars) => {
    const root = document.documentElement;
    Object.entries(newVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, { immediate: true });

  // Animation interval reference
  const animationInterval = ref(null);

  // Start/restart animation with new interval
  function restartAnimation() {
    if (animationInterval.value) {
      clearInterval(animationInterval.value);
    }
    // The actual interval implementation will be in the component that uses this composable
  }

  return {
    animationSettings,
    cssVars,
    restartAnimation
  };
}