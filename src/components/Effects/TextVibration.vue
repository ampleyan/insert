<template>
  <!--  <div class="vibration-wrapper">-->
  <!--    <div class="backdrop-layer" :style="backdropFilterStyle"></div>-->

  <div class="vibration-demo">
    <div class="vibration" v-for="(text, index) in textLinesVar" :key="index" :style="rootStyles">
      <span
        v-for="(letter, letterIndex) in text.split('')"
        :key="`${index}-${letterIndex}`"
        :class="{ vibrate: isLetterVibrating(index, letterIndex) }"
        :style="getFullStyle(index, letterIndex)"
      >
        {{ letter }}
      </span>
    </div>
  </div>
  <!--  </div>-->
</template>

<script>
  export default {
    name: 'TextVibration',
    props: {
      settings: {
        type: Object,
        default: () => ({
          hue: 0,
          opacity: 100,
          color: '#ffffff',
          blendMode: 'difference',
          randomAmount: 50,
          intervalSpeed: 200,
          blurAmount: 2,
          vibrateIntensity: 2,
          vibrateSpeed: 200,
          textLines: ['TEXT'],
          fontSize: 80,
          backdropBlur: 0,
          backdropBrightness: 100,
          backdropContrast: 100,
          backdropSaturate: 100,
        }),
      },
    },
    data() {
      return {
        textLinesVar: this.settings.textLines,
        textLineFontSize: Array.isArray(this.settings.fontSize)
          ? this.settings.fontSize
          : this.settings.textLines.map(() => this.settings.fontSize),
        vibratingLetters: {},
        animationInterval: null,
        translateX: '2px',
        translateY: '2px',
      };
    },
    computed: {
      rootStyles() {
        return {
          '--translate-x': `${this.settings.vibrateIntensity}px`,
          '--translate-y': `${this.settings.vibrateIntensity}px`,
          '--vibrate-speed': `${this.settings.vibrateSpeed}ms`,
          mixBlendMode: this.settings.blendMode, // Fixed property name
        };
      },
    },
    watch: {
      'settings.textLines'(newValue) {
        this.textLinesVar = newValue;
      },
      'settings.fontSize'(newValue) {
        this.textLineFontSize = Array.isArray(newValue)
          ? newValue
          : this.settings.textLines.map(() => newValue);
      },
      'settings.intervalSpeed'(newSpeed) {
        if (this.animationInterval) {
          clearInterval(this.animationInterval);
          this.animationInterval = setInterval(() => {
            this.randomVibrate();
          }, newSpeed);
        }
      },
      settings: {
        handler(newValue) {
          if (this.animationInterval) {
            clearInterval(this.animationInterval);
          }
          this.animationInterval = setInterval(() => {
            this.randomVibrate();
          }, newValue.intervalSpeed);
        },
        deep: true,
      },
    },
    mounted() {
      this.startRandomization();
    },
    beforeUnmount() {
      this.stopRandomization();
    },
    methods: {
      getFullStyle(lineIndex, letterIndex) {
        const isVibrating = this.isLetterVibrating(lineIndex, letterIndex);
        const fontSize = this.textLineFontSize[lineIndex] || this.settings.fontSize;

        const hue = `hue-rotate(${this.settings.hue}deg)`;
        const blur = isVibrating ? `blur(${this.settings.blurAmount}px)` : '';
        const glow = isVibrating
          ? `drop-shadow(0 0 ${this.settings.blurAmount * 1.5}px ${this.settings.color})`
          : '';
        const filter = [hue, blur, glow].filter(Boolean).join(' ');

        const scale = isVibrating ? 1.05 : 1;

        return {
          fontSize: `${fontSize}px`,
          color: this.settings.color,
          // mixBlendMode: this.settings.blendMode,
          opacity: this.settings.opacity / 100,
          filter,
          transform: `scale(${scale})`,
          transition: 'all 300ms ease',
        };
      },
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
        this.vibratingLetters = {};
        this.textLinesVar.forEach((text, lineIndex) => {
          const totalLetters = text.length;
          const lettersToAnimate = Math.floor(totalLetters * (this.settings.randomAmount / 100));

          const indices = Array.from({ length: totalLetters }, (_, i) => i);
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }

          for (let i = 0; i < lettersToAnimate; i++) {
            const key = `${lineIndex}-${indices[i]}`;
            this.vibratingLetters[key] = true;
          }
        });
      },
    },
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
    overflow: visible;
  }

  .vibration span {
    font-weight: 900;
    display: inline-block;
    margin-right: 10px;
    text-transform: uppercase;
    color: white;
    mix-blend-mode: difference;
    will-change: transform, filter;
    overflow: visible;
  }

  .vibration span.vibrate {
    animation: vibrate var(--vibrate-speed) linear infinite forwards;
  }

  @keyframes vibrate {
    0% {
      transform: translateX(calc(-4 * var(--translate-x))) translateY(calc(2 * var(--translate-y)))
        scale(1.1);
    }
    16.66% {
      transform: translateX(calc(3 * var(--translate-x))) translateY(calc(-3 * var(--translate-y)))
        scale(0.95);
    }
    33.33% {
      transform: translateX(calc(-2 * var(--translate-x))) translateY(calc(4 * var(--translate-y)))
        scale(1.05);
    }
    50% {
      transform: translateX(calc(4 * var(--translate-x))) translateY(calc(-2 * var(--translate-y)))
        scale(0.9);
    }
    66.66% {
      transform: translateX(calc(-3 * var(--translate-x))) translateY(calc(3 * var(--translate-y)))
        scale(1.15);
    }
    83.33% {
      transform: translateX(calc(2 * var(--translate-x))) translateY(calc(-4 * var(--translate-y)))
        scale(0.92);
    }
    100% {
      transform: translateX(calc(-4 * var(--translate-x))) translateY(calc(2 * var(--translate-y)))
        scale(1.1);
    }
  }
</style>
