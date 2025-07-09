import { DEFAULT_BLEND_MODE } from '@/constants/blendModes';

export default {
  data() {
    return {
      // Control settings
      controlSettings: {
        // Blend settings
        blendMode: DEFAULT_BLEND_MODE,
        
        // Color settings
        hue: 0,
        color: '#ffffff',
        opacity: 100,
        
        // Animation settings
        vibrateSpeed: 50,
        vibrateIntensity: 1,
        blurAmount: 2,
        randomAmount: 50,
        intervalSpeed: 200
      }
    };
  },
  
  provide() {
    return {
      controlSettings: this.controlSettings
    };
  },
  
  methods: {
    // Update blend mode
    updateBlendMode(mode) {
      this.controlSettings.blendMode = mode;
    },
    
    // Update color settings
    updateColorSettings(settings) {
      if (settings.hue !== undefined) this.controlSettings.hue = settings.hue;
      if (settings.color !== undefined) this.controlSettings.color = settings.color;
      if (settings.opacity !== undefined) this.controlSettings.opacity = settings.opacity;
    },
    
    // Update animation settings
    updateAnimationSettings(settings) {
      if (settings.vibrateSpeed !== undefined) this.controlSettings.vibrateSpeed = settings.vibrateSpeed;
      if (settings.vibrateIntensity !== undefined) this.controlSettings.vibrateIntensity = settings.vibrateIntensity;
      if (settings.blurAmount !== undefined) this.controlSettings.blurAmount = settings.blurAmount;
      if (settings.randomAmount !== undefined) this.controlSettings.randomAmount = settings.randomAmount;
      if (settings.intervalSpeed !== undefined) this.controlSettings.intervalSpeed = settings.intervalSpeed;
    }
  }
};