<template>
  <div class="liquid-container">
    <svg width="0" height="0" style="position: absolute">
      <defs>
        <filter :id="`liquid-${uid}`">
          <feTurbulence type="fractalNoise" :baseFrequency="baseFrequency" numOctaves="5">
            <animate
              attributeName="baseFrequency"
              :from="baseFrequency"
              :to="animatedFrequency"
              :dur="`${settings.vibrateSpeed * 20}ms`"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" :scale="settings.vibrateIntensity * 10" />
        </filter>
      </defs>
    </svg>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="liquid-text"
      :style="getTextStyle(index)"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
let uidCounter = 0;

export default {
  name: 'LiquidDistortion',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uid: `uid-${uidCounter++}`,
      baseFrequency: '0.01 0.03',
      animatedFrequency: '0.03 0.01',
    };
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
        filter: `url(#liquid-${this.uid}) hue-rotate(${this.settings.hue}deg)`,
      };
    },
  },
};
</script>

<style scoped>
.liquid-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.liquid-text {
  font-weight: 900;
  text-transform: uppercase;
  will-change: filter;
}
</style>
