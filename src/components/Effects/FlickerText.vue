<template>
  <div class="flicker-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="flicker-text"
      :style="getTextStyle(index)"
      :data-text="text"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlickerText',
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
      };
    },
  },
};
</script>

<style scoped>
.flicker-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.flicker-text {
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  animation: flicker 3s linear infinite;
  text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
}

.flicker-text::before,
.flicker-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
}

.flicker-text::before {
  animation: glitch-1 0.3s infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-2px, -2px);
}

.flicker-text::after {
  animation: glitch-2 0.3s infinite;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  transform: translate(2px, 2px);
}

@keyframes flicker {
  0%,
  19%,
  21%,
  23%,
  25%,
  54%,
  56%,
  100% {
    opacity: 1;
    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
  }
  20%,
  24%,
  55% {
    opacity: 0.4;
    text-shadow: none;
  }
}

@keyframes glitch-1 {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-5px, 2px);
  }
  40% {
    transform: translate(-5px, -2px);
  }
  60% {
    transform: translate(5px, 2px);
  }
  80% {
    transform: translate(5px, -2px);
  }
}

@keyframes glitch-2 {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(5px, -2px);
  }
  40% {
    transform: translate(5px, 2px);
  }
  60% {
    transform: translate(-5px, -2px);
  }
  80% {
    transform: translate(-5px, 2px);
  }
}
</style>
