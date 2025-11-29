<template>
  <div class="chromatic-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="chromatic-text"
      :data-text="text"
      :style="getTextStyle(index)"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChromaticAberration',
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
        filter: `hue-rotate(${this.settings.hue}deg)`,
        '--aberration-offset': `${this.settings.vibrateIntensity}px`,
      };
    },
  },
};
</script>

<style scoped>
.chromatic-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.chromatic-text {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  color: transparent;
}

.chromatic-text::before,
.chromatic-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chromatic-text::before {
  color: #ff0000;
  transform: translateX(calc(-1 * var(--aberration-offset)));
  opacity: 0.7;
  animation: aberration-shift 2s infinite alternate;
}

.chromatic-text::after {
  color: #00ffff;
  transform: translateX(var(--aberration-offset));
  opacity: 0.7;
  animation: aberration-shift 2s infinite alternate-reverse;
}

@keyframes aberration-shift {
  0% {
    transform: translateX(calc(-1 * var(--aberration-offset)));
  }
  100% {
    transform: translateX(calc(-2 * var(--aberration-offset)));
  }
}
</style>
