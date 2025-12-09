<template>
  <div class="split-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="split-text"
      :style="getTextStyle(index)"
    >
      <span
        v-for="(letter, letterIndex) in text.split('')"
        :key="`${index}-${letterIndex}`"
        class="split-letter"
        :style="getLetterStyle(letterIndex)"
      >
        {{ letter }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SplitText',
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
      const delay = index * 0.1;
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
.split-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.split-text {
  font-weight: 900;
  text-transform: uppercase;
  perspective: 1000px;
}

.split-letter {
  display: inline-block;
  animation: split-reveal 1s ease forwards;
  transform: translateY(100px) rotateX(-90deg);
  opacity: 0;
}

@keyframes split-reveal {
  to {
    transform: translateY(0) rotateX(0deg);
    opacity: 1;
  }
}
</style>
