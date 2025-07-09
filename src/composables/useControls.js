import { reactive, provide } from 'vue';
import { DEFAULT_BLEND_MODE } from '@/constants/blendModes';

export function useControls() {
  // Control settings
  const controlSettings = reactive({
    // Blend settings
    blendMode: DEFAULT_BLEND_MODE,
    
    // Color settings
    hue: 0,
    color: '#ffffff',
    opacity: 100,
    
    // Animation settings (will be merged with animation settings from useAnimation)
    vibrateSpeed: 50,
    vibrateIntensity: 1,
    blurAmount: 2,
    randomAmount: 50,
    intervalSpeed: 200
  });

  // Provide settings to child components
  provide('controlSettings', controlSettings);
  
  // Update blend mode
  function updateBlendMode(mode) {
    controlSettings.blendMode = mode;
  }
  
  // Update color settings
  function updateColorSettings(settings) {
    if (settings.hue !== undefined) controlSettings.hue = settings.hue;
    if (settings.color !== undefined) controlSettings.color = settings.color;
    if (settings.opacity !== undefined) controlSettings.opacity = settings.opacity;
  }
  
  // Update animation settings
  function updateAnimationSettings(settings) {
    if (settings.vibrateSpeed !== undefined) controlSettings.vibrateSpeed = settings.vibrateSpeed;
    if (settings.vibrateIntensity !== undefined) controlSettings.vibrateIntensity = settings.vibrateIntensity;
    if (settings.blurAmount !== undefined) controlSettings.blurAmount = settings.blurAmount;
    if (settings.randomAmount !== undefined) controlSettings.randomAmount = settings.randomAmount;
    if (settings.intervalSpeed !== undefined) controlSettings.intervalSpeed = settings.intervalSpeed;
  }

  return {
    controlSettings,
    updateBlendMode,
    updateColorSettings,
    updateAnimationSettings
  };
}