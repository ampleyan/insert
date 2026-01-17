<template>
  <div class="win98-screensaver" @click="dismiss">
    <div
      v-for="logo in logos"
      :key="logo.id"
      class="flying-logo"
      :style="logo.style"
    >
      <img :src="logo.imageSrc" alt="Logo" />
    </div>
    <div class="screensaver-text">Click anywhere to continue...</div>
  </div>
</template>

<script>
import { getWin98AssetPath } from '../../constants/win98';

export default {
  name: 'Win98Screensaver',
  emits: ['dismiss'],
  data() {
    return {
      logos: [],
      animationFrame: null,
      logoImages: [
        getWin98AssetPath('win98/assets/insert_logo.png'),
        getWin98AssetPath('gnome/assets/white gaw logo.PNG'),
      ],
    };
  },
  mounted() {
    this.createLogos();
    this.animate();
  },
  beforeUnmount() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  },
  methods: {
    createLogos() {
      for (let i = 0; i < 6; i++) {
        this.logos.push({
          id: i,
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 100),
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          style: {},
          imageSrc: this.logoImages[i % this.logoImages.length],
        });
      }
    },
    animate() {
      this.logos.forEach(logo => {
        logo.x += logo.vx;
        logo.y += logo.vy;

        if (logo.x <= 0 || logo.x >= window.innerWidth - 80) {
          logo.vx *= -1;
          logo.x = Math.max(0, Math.min(window.innerWidth - 80, logo.x));
        }
        if (logo.y <= 0 || logo.y >= window.innerHeight - 80) {
          logo.vy *= -1;
          logo.y = Math.max(0, Math.min(window.innerHeight - 80, logo.y));
        }

        logo.style = {
          left: logo.x + 'px',
          top: logo.y + 'px',
        };
      });

      this.animationFrame = requestAnimationFrame(this.animate);
    },
    dismiss() {
      this.$emit('dismiss');
    },
  },
};
</script>

<style scoped>
.win98-screensaver {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 9000;
  cursor: pointer;
}

.flying-logo {
  position: absolute;
  width: 80px;
  height: 80px;
}

.flying-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.screensaver-text {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--win98-font);
  font-size: 14px;
  color: #666;
}
</style>
