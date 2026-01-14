<template>
  <div class="win98-cursor-trail-container">
    <div
      v-for="trail in trails"
      :key="trail.id"
      class="trail-dot"
      :style="trail.style"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'Win98CursorTrail',
  data() {
    return {
      trails: [],
      trailId: 0,
    };
  },
  mounted() {
    document.addEventListener('mousemove', this.onMouseMove);
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
  },
  methods: {
    onMouseMove(e) {
      const id = this.trailId++;
      const trail = {
        id,
        style: {
          left: e.clientX + 'px',
          top: e.clientY + 'px',
        },
      };

      this.trails.push(trail);

      setTimeout(() => {
        const index = this.trails.findIndex(t => t.id === id);
        if (index > -1) {
          this.trails.splice(index, 1);
        }
      }, 800);

      if (this.trails.length > 20) {
        this.trails.shift();
      }
    },
  },
};
</script>

<style scoped>
.win98-cursor-trail-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}

.trail-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #00f, #0ff);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: win98-trail-fade 0.8s ease-out forwards;
  pointer-events: none;
}
</style>
