<template>
  <div class="neon-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="neon-text"
      :style="getTextStyle(index)"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'NeonGlow',
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
        '--glow-intensity': `${this.settings.vibrateIntensity * 10}px`,
        '--pulse-speed': `${this.settings.vibrateSpeed * 10}ms`,
      };
    },
  },
};
</script>

<style scoped>
.neon-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background: #000;
}

.neon-text {
  font-weight: 900;
  text-transform: uppercase;
  animation: neon-pulse var(--pulse-speed) ease-in-out infinite;
  will-change: text-shadow;
}

@keyframes neon-pulse {
  0%,
  100% {
    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor,
      0 0 var(--glow-intensity) currentColor, 0 0 calc(var(--glow-intensity) * 2) currentColor;
  }
  50% {
    text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor,
      0 0 calc(var(--glow-intensity) * 0.5) currentColor,
      0 0 calc(var(--glow-intensity) * 1) currentColor;
  }
}
</style>
