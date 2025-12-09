<template>
  <div class="gradient-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="gradient-text"
      :style="getTextStyle(index)"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradientText',
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
        marginRight: `${marginRight}px`,
        marginTop: `${marginTop}px`,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        filter: `hue-rotate(${this.settings.hue}deg)`,
        opacity: this.settings.opacity / 100,
        '--gradient-color': this.settings.color,
      };
    },
  },
};
</script>

<style scoped>
.gradient-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.gradient-text {
  font-weight: 900;
  text-transform: uppercase;
  background: linear-gradient(
    45deg,
    var(--gradient-color),
    #ff00ff,
    #00ffff,
    var(--gradient-color)
  );
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
