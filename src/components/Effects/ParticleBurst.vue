<template>
  <div class="particle-container">
    <canvas ref="canvas" @click="triggerBurst"></canvas>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="text-overlay"
      :style="getTextStyle(index)"
      @click="triggerBurst"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParticleBurst',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      particles: [],
      animationFrame: null,
      ctx: null,
    };
  },
  mounted() {
    this.initCanvas();
    this.startAnimation();
  },
  beforeUnmount() {
    this.stopAnimation();
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.ctx = canvas.getContext('2d');

      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    },
    triggerBurst(event) {
      const x = event.clientX;
      const y = event.clientY;
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = this.settings.vibrateIntensity * 2;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          size: Math.random() * 4 + 2,
        });
      }
    },
    startAnimation() {
      const animate = () => {
        this.updateParticles();
        this.drawParticles();
        this.animationFrame = requestAnimationFrame(animate);
      };
      this.animationFrame = requestAnimationFrame(animate);
    },
    stopAnimation() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    },
    updateParticles() {
      this.particles = this.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life -= 0.01;
        return p.life > 0;
      });
    },
    drawParticles() {
      this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

      this.particles.forEach((p) => {
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = this.settings.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      });

      this.ctx.globalAlpha = 1;
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
.particle-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.text-overlay {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  z-index: 1;
  pointer-events: auto;
}
</style>
