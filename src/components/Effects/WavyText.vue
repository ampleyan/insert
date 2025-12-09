<template>
  <div class="wavy-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="wavy-text"
      :style="getTextStyle(index)"
    >
      <span
        v-for="(letter, letterIndex) in text.split('')"
        :key="`${index}-${letterIndex}`"
        class="wavy-letter"
        :style="getLetterStyle(letterIndex)"
      >
        {{ letter }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WavyText',
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
      };
    },
    getLetterStyle(index) {
      const delay = index * 0.05;
      return {
        animationDelay: `${delay}s`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
      };
    },
  },
};
</script>

<style scoped>
.wavy-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.wavy-text {
  font-weight: 900;
  text-transform: uppercase;
}

.wavy-letter {
  display: inline-block;
  animation: wavy 2s ease-in-out infinite;
}

@keyframes wavy {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
