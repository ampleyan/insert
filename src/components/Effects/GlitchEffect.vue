<template>
  <div class="glitch-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="glitch-text"
      :data-text="text"
      :style="getTextStyle(index)"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlitchEffect',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getTextStyle(index) {
      const fontSize = this.settings.fontSize?.[index] || 120;
      const marginRight = this.settings.margin?.[index] || 0;
      const marginTop = this.settings.marginTop?.[index] || 0;
      const letterSpacing = this.settings.letterSpacing?.[index] || 0;

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        marginRight: `${marginRight}px`,
        marginTop: `${marginTop}px`,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        '--glitch-intensity': `${this.settings.vibrateIntensity}px`,
        '--glitch-speed': `${this.settings.vibrateSpeed}ms`,
        filter: `hue-rotate(${this.settings.hue}deg)`,
      };
    },
  },
};
</script>

<style scoped>
.glitch-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.glitch-text {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  animation: glitch-skew var(--glitch-speed) infinite;
  will-change: transform, text-shadow;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  color: #ff0000;
  z-index: -1;
  animation: glitch-anim-1 calc(var(--glitch-speed) * 2) infinite linear alternate-reverse;
}

.glitch-text::after {
  color: #00ffff;
  z-index: -2;
  animation: glitch-anim-2 calc(var(--glitch-speed) * 2) infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
  20% {
    clip-path: inset(92% 0 1% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  40% {
    clip-path: inset(43% 0 1% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  60% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
  80% {
    clip-path: inset(54% 0 7% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip-path: inset(65% 0 15% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  20% {
    clip-path: inset(30% 0 40% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
  40% {
    clip-path: inset(10% 0 80% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
  60% {
    clip-path: inset(70% 0 15% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  80% {
    clip-path: inset(20% 0 50% 0);
    transform: translate(calc(1 * var(--glitch-intensity)), calc(1 * var(--glitch-intensity)));
  }
  100% {
    clip-path: inset(45% 0 30% 0);
    transform: translate(calc(-1 * var(--glitch-intensity)), calc(-1 * var(--glitch-intensity)));
  }
}

@keyframes glitch-skew {
  0% {
    transform: skew(0deg);
  }
  10% {
    transform: skew(-2deg);
  }
  20% {
    transform: skew(2deg);
  }
  30% {
    transform: skew(-1deg);
  }
  40% {
    transform: skew(1deg);
  }
  50% {
    transform: skew(0deg);
  }
  60% {
    transform: skew(2deg);
  }
  70% {
    transform: skew(-2deg);
  }
  80% {
    transform: skew(1deg);
  }
  90% {
    transform: skew(-1deg);
  }
  100% {
    transform: skew(0deg);
  }
}
</style>
