<template>
  <div class="gooey-container">
    <div
      class="marquee"
      v-for="(line, index) in settings.textLines"
      :key="index"
      role="marquee"
      :aria-label="`Scrolling text: ${line}`"
    >
      <div class="marquee_blur" aria-hidden="true">
        <p class="marquee_text">{{ line }}</p>
      </div>
      <div class="marquee_clear">
        <p class="marquee_text">{{ line }}</p>
      </div>
    </div>

    <p class="description">
      I wanted to make a Gooey Marquee type effect, tried a couple of things, and ended up using two
      layers of text, one with the effect, and a clean one on top so that the text remains readable.
    </p>
  </div>
</template>

<script>
  export default {
    name: 'TextGoo',
    props: {
      settings: {
        type: Object,
        required: true,
        validator: (settings) => {
          return (
            Array.isArray(settings.textLines) &&
            typeof settings.hue === 'number' &&
            typeof settings.opacity === 'number' &&
            typeof settings.blendMode === 'string' &&
            (typeof settings.fontSize === 'number' || Array.isArray(settings.fontSize)) &&
            typeof settings.blurAmount === 'number'
          );
        },
        default: () => ({
          textLines: ['Gooey Text Effect'],
          hue: 0,
          opacity: 80,
          blendMode: 'screen',
          fontSize: 48,
          blurAmount: 4,
        }),
      },
    },
  };
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Raleway:400,400i,700');

  *,
  *::before,
  *::after {
    padding: 0;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .gooey-container {
    font-family: Raleway, sans-serif;
    background-color: #000;
    color: #fff;
    font-size: 24px;
    width: 95%;
    max-width: 40ch;
    padding: 3em 1em;
  }

  .marquee {
    //position: relative;
    width: 100%;
    height: 2em;
    font-size: 5em;
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .marquee_text {
    position: fixed;
    min-width: 100%;
    white-space: nowrap;
    animation: marquee 16s infinite linear;
  }

  @keyframes marquee {
    from {
      transform: translateX(70%);
    }
    to {
      transform: translateX(-70%);
    }
  }

  .marquee_blur {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    background-image: linear-gradient(to right, black 1rem, transparent 50%),
      linear-gradient(to left, black 1rem, transparent 50%);
    filter: contrast(15);
  }

  .marquee_blur p {
    filter: blur(0.07em);
  }

  .marquee_clear {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
  }

  .description {
    margin-block: 2em;
  }
</style>
