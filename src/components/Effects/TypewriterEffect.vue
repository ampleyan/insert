<template>
  <div class="typewriter-container">
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="typewriter-text"
      :style="getTextStyle(index)"
    >
      {{ visibleText[index] }}<span class="cursor" v-if="isTyping[index]">|</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypewriterEffect',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      visibleText: [],
      isTyping: [],
      intervals: [],
    };
  },
  mounted() {
    this.startTyping();
  },
  beforeUnmount() {
    this.stopTyping();
  },
  watch: {
    'settings.textLines': {
      handler() {
        this.stopTyping();
        this.startTyping();
      },
      deep: true,
    },
  },
  methods: {
    startTyping() {
      this.visibleText = this.settings.textLines.map(() => '');
      this.isTyping = this.settings.textLines.map(() => true);

      this.settings.textLines.forEach((text, lineIndex) => {
        let charIndex = 0;
        const interval = setInterval(() => {
          if (charIndex < text.length) {
            this.visibleText[lineIndex] = text.slice(0, charIndex + 1);
            charIndex++;
          } else {
            this.isTyping[lineIndex] = false;
            clearInterval(interval);
            setTimeout(() => {
              charIndex = 0;
              this.visibleText[lineIndex] = '';
              this.isTyping[lineIndex] = true;
            }, 2000);
          }
        }, this.settings.intervalSpeed || 100);

        this.intervals.push(interval);
      });
    },
    stopTyping() {
      this.intervals.forEach((interval) => clearInterval(interval));
      this.intervals = [];
    },
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
.typewriter-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.typewriter-text {
  font-weight: 900;
  text-transform: uppercase;
  white-space: nowrap;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
