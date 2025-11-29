<template>
  <div class="wave-container">
    <div
      v-for="(text, lineIndex) in settings.textLines"
      :key="lineIndex"
      class="wave-text"
      :style="getLineStyle(lineIndex)"
    >
      <span
        v-for="(letter, letterIndex) in text.split('')"
        :key="`${lineIndex}-${letterIndex}`"
        class="wave-letter"
        :style="getLetterStyle(lineIndex, letterIndex)"
      >
        {{ letter }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WaveEffect',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      time: 0,
      animationFrame: null,
    };
  },
  mounted() {
    this.startAnimation();
  },
  beforeUnmount() {
    this.stopAnimation();
  },
  methods: {
    startAnimation() {
      const animate = () => {
        this.time += 0.05;
        this.animationFrame = requestAnimationFrame(animate);
      };
      this.animationFrame = requestAnimationFrame(animate);
    },
    stopAnimation() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    },
    getLineStyle(index) {
      const marginRight = this.settings.margin?.[index] || 0;
      const marginTop = this.settings.marginTop?.[index] || 0;
      const letterSpacing = this.settings.letterSpacing?.[index] || 0;

      return {
        marginRight: `${marginRight}px`,
        marginTop: `${marginTop}px`,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
      };
    },
    getLetterStyle(lineIndex, letterIndex) {
      const fontSize = this.settings.fontSize?.[lineIndex] || 120;
      const frequency = 0.5;
      const amplitude = this.settings.vibrateIntensity * 10;
      const offset = letterIndex * 0.3;
      const y = Math.sin(this.time * frequency + offset) * amplitude;

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        transform: `translateY(${y}px)`,
        filter: `hue-rotate(${this.settings.hue}deg) blur(${this.settings.blurAmount}px)`,
      };
    },
  },
};
</script>

<style scoped>
.wave-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.wave-text {
  position: relative;
  overflow: visible;
}

.wave-letter {
  font-weight: 900;
  display: inline-block;
  text-transform: uppercase;
  will-change: transform;
  transition: transform 0.1s ease-out;
}
</style>
