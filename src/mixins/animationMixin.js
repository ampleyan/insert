export default {
  data() {
    return {
      // Animation settings
      animationSettings: {
        vibrateSpeed: 50,
        vibrateIntensity: 1,
        blurAmount: 2,
        randomAmount: 50,
        intervalSpeed: 200
      },
      animationInterval: null
    };
  },
  
  computed: {
    cssVars() {
      return {
        '--vibrate-speed': `${this.animationSettings.vibrateSpeed}ms`,
        '--vibrate-intensity': this.animationSettings.vibrateIntensity,
        '--blur-amount': `${this.animationSettings.blurAmount}px`
      };
    }
  },
  
  watch: {
    cssVars: {
      handler(newVars) {
        const root = document.documentElement;
        Object.entries(newVars).forEach(([key, value]) => {
          root.style.setProperty(key, value);
        });
      },
      immediate: true
    }
  },
  
  methods: {
    // Start/restart animation with new interval
    restartAnimation() {
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
      }
      // The actual interval implementation will be in the component that uses this mixin
    }
  }
};