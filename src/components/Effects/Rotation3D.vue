<template>
  <div class="rotation3d-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="rotation3d-text"
      :style="getTextStyle(index)"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rotation3D',
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
        filter: `hue-rotate(${this.settings.hue}deg) blur(${this.settings.blurAmount}px)`,
        '--rotation-speed': `${this.settings.vibrateSpeed * 10}ms`,
      };
    },
  },
};
</script>

<style scoped>
.rotation3d-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  perspective: 1000px;
}

.rotation3d-text {
  font-weight: 900;
  text-transform: uppercase;
  transform-style: preserve-3d;
  animation: rotate3d var(--rotation-speed) infinite linear;
  will-change: transform;
}

@keyframes rotate3d {
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  33% {
    transform: rotateX(360deg) rotateY(0deg) rotateZ(0deg);
  }
  66% {
    transform: rotateX(360deg) rotateY(360deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
  }
}
</style>
