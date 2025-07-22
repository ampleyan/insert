<template>
  <div class="vibration-demo">
    <h1
      v-for="(text, index) in textLinesVar"
      :key="index"
      :style="rootStyles"
      contenteditable
      :data-heading="`${text}`"
    >
      {{ text }}
    </h1>
  </div>
</template>

<script>
  export default {
    name: 'TextDistort',
    props: {
      settings: {
        type: Object,
        default: () => ({
          hue: 0,
          opacity: 100,
          color: '#ffffff',
          blendMode: 'difference',
          randomAmount: 50,
          intervalSpeed: 200,
          blurAmount: 2,
          vibrateIntensity: 2,
          vibrateSpeed: 200,
          textLines: ['TEXT'],
          fontSize: 80,
        }),
      },
    },
    computed: {
      rootStyles() {
        return {
          '--translate-x': `${this.settings.vibrateIntensity}px`,
          '--translate-y': `${this.settings.vibrateIntensity}px`,
          '--vibrate-speed': `${this.settings.vibrateSpeed}ms`,
        };
      },
    },
    data() {
      return {
        textLinesVar: this.settings.textLines,
        textLineFontSize: Array.isArray(this.settings.fontSize)
          ? this.settings.fontSize
          : this.settings.textLines.map(() => this.settings.fontSize),
        vibratingLetters: {},
        animationInterval: null,
      };
    },
    watch: {
      'settings.textLines'(newValue) {
        this.textLinesVar = newValue;
      },
    },
  };
</script>

<style scoped>
  body {
    font-family: 'Roboto', sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vibration-demo {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
  }
  h1 {
    font-size: calc(10vw + 0.5rem);
    font-weight: 900;
    text-transform: uppercase;
    color: black;
    position: relative;
    background: linear-gradient(transparent 50%, #000 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    &::after {
      content: attr(data-heading);
      position: absolute;
      left: 0;
      background: linear-gradient(#000 50%, transparent 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transform: translate(var(--translate-x), -2px);
      animation: fracture 5s infinite ease;
    }
  }

  @keyframes fracture {
    0% {
      transform: translate(var(--translate-x), var(--translate-y));
    }
    50% {
      transform: translate(var(--translate-x), var(--translate-y));
    }
  }
</style>
