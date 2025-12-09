<template>
  <div class="stroke-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="stroke-text"
      :style="getTextStyle(index)"
      :data-text="text"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'StrokeText',
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
        '--stroke-color': this.settings.color,
        opacity: this.settings.opacity / 100,
      };
    },
  },
};
</script>

<style scoped>
.stroke-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.stroke-text {
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  color: transparent;
  -webkit-text-stroke: 2px var(--stroke-color);
  text-stroke: 2px var(--stroke-color);
}

.stroke-text::before {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  color: var(--stroke-color);
  -webkit-text-stroke: 2px var(--stroke-color);
  text-stroke: 2px var(--stroke-color);
  animation: stroke-fill 4s ease-in-out infinite;
  clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
}

@keyframes stroke-fill {
  0%,
  100% {
    clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
  }
  50% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}
</style>
