<template>
  <div class="vibration-demo">
    <div class="vibration" v-for="(text, index) in textLines" :key="index" :style="rootStyles"
>
      <span 
        v-for="(letter, letterIndex) in text.split('')" 
        :key="`${index}-${letterIndex}`"
        :class="{ 'vibrate': isLetterVibrating(index, letterIndex) }"
        :style="[letterStyle, rootStyles]"
      >
        {{ letter }}
      </span>
    </div>

  </div>
</template>

<script>
export default {
  name: 'TextEffect',
  props: {
    settings: {
      type: Object,
      default:  () => ({
        hue: 0,
        opacity: 100,
        color: '#ffffff',
        blendMode: 'difference',
        randomAmount: 50,
        intervalSpeed: 200
      })
    },
  },
  data() {
    return {
      textLines: ['INSERT', 'SUN\'O3.08', 'BAR OOST'],
      vibratingLetters: {},
      animationInterval: null,
      currentSettings: this.settings,
      // Default settings in case injection fails
      // defaultSettings: {
      //   hue: 0,
      //   opacity: 100,
      //   color: '#ffffff',
      //   blendMode: 'difference',
      //   randomAmount: 50,
      //   intervalSpeed: 200
      // }
    };
  },

  computed: {
    // Use injected settings or fallback to defaults
    // settings() {
    //   return this.animationSettings || this.defaultSettings;
    // },
    rootStyles() {
      return {
        '--translate-x': `${this.settings.vibrateIntensity}px`,
        '--translate-y': `${this.settings.vibrateIntensity}px`,
        '--vibrate-duration': `${this.settings.vibrateSpeed}ms`,
      // '--scale-amount': 1.2

      };
    }
,



    letterStyle() {
      return {
        filter: `hue-rotate(${this.settings.hue}deg)`,
        opacity: this.settings.opacity / 100,
        color: this.settings.color,
        mixBlendMode: this.settings.blendMode,
        '--vibrate-speed': `${this.settings.vibrateSpeed}ms`,
        '--blur-amount': `${this.settings.blurAmount}px`,

      };
    }
  },
  watch: {
    'settings.intervalSpeed': function(newSpeed) {
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
          this.randomVibrate();
        }, newSpeed);
      }
    },
    settings(newValue) {
      this.currentSettings = newValue;
            if (this.animationInterval) {
        clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
          this.randomVibrate();
        }, newValue.intervalSpeed);
      }
    }
  },
  mounted() {
    this.startRandomization();
  },
  beforeUnmount() {
    this.stopRandomization();
  },
  methods: {
    isLetterVibrating(lineIndex, letterIndex) {
      const key = `${lineIndex}-${letterIndex}`;
      return this.vibratingLetters[key] || false;
    },
    startRandomization() {
      this.animationInterval = setInterval(() => {
        this.randomVibrate();
      }, this.settings.intervalSpeed);
    },
    stopRandomization() {
      clearInterval(this.animationInterval);
    },
    randomVibrate() {
      // Reset vibrating letters
      this.vibratingLetters = {};

      // For each text line
      this.textLines.forEach((text, lineIndex) => {
        const totalLetters = text.length;
        // Use the reactive settings
        const lettersToAnimate = Math.floor(totalLetters * (this.settings.randomAmount / 100));

        // Create array of indices and shuffle
        const indices = Array.from({length: totalLetters}, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Set selected letters to vibrate
        for (let i = 0; i < lettersToAnimate; i++) {
          const key = `${lineIndex}-${indices[i]}`;
          this.vibratingLetters[key] = true;
        }
      });
    }
  }
};
</script>

<style scoped>
.vibration-demo {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.vibration {
  margin: 20px 0;
  position: relative;
}

.vibration span {
  font-size: 120px;
  font-weight: 900;
  display: inline-block;
  margin-right: 10px;
  transition: all 500ms;
  text-transform: uppercase;
  color: white;
  mix-blend-mode: difference;
}



.vibration span.vibrate {
  animation: vibrate var(--vibrate-speed) linear infinite forwards;
  filter: blur(var(--blur-amount));
}
@keyframes vibrate {
  0% {
    transform: translateX(calc(-4 * var(--translate-x)))
              translateY(calc(2 * var(--translate-y)))
              scale(1.1);
  }
  16.66% {
    transform: translateX(calc(3 * var(--translate-x)))
              translateY(calc(-3 * var(--translate-y)))
              scale(0.95);
  }
  33.33% {
    transform: translateX(calc(-2 * var(--translate-x)))
              translateY(calc(4 * var(--translate-y)))
              scale(1.05);
  }
  50% {
    transform: translateX(calc(4 * var(--translate-x)))
              translateY(calc(-2 * var(--translate-y)))
              scale(0.9);
  }
  66.66% {
    transform: translateX(calc(-3 * var(--translate-x)))
              translateY(calc(3 * var(--translate-y)))
              scale(1.15);
  }
  83.33% {
    transform: translateX(calc(2 * var(--translate-x)))
              translateY(calc(-4 * var(--translate-y)))
              scale(0.92);
  }
  100% {
    transform: translateX(calc(-4 * var(--translate-x)))
              translateY(calc(2 * var(--translate-y)))
              scale(1.1);
  }
}



</style>
