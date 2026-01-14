<template>
  <div class="win98-boot-screen">
    <div class="boot-content">
      <img src="/win98/assets/boot_screen_no_bg.png" alt="Logo" class="background-logo" />

      <div class="boot-logo">Windows 69</div>
      <div class="boot-progress-container">
        <div class="boot-progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="boot-text">Starting Windows...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Win98BootScreen',
  emits: ['boot-complete'],
  data() {
    return {
      progress: 0,
    };
  },
  mounted() {
    this.startBoot();
  },
  methods: {
    startBoot() {
      const bootInterval = setInterval(() => {
        const increment = Math.random() * 8 + 2;
        this.progress = Math.min(100, this.progress + increment);
        if (this.progress >= 100) {
          clearInterval(bootInterval);
          setTimeout(() => {
            this.$emit('boot-complete');
          }, 500);
        }
      }, 150);
    },
  },
};
</script>

<style scoped>
.win98-boot-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.boot-content {
  text-align: center;
}

.boot-logo {
  font-family: 'Times New Roman', serif;
  font-size: 72px;
  font-weight: bold;
  font-style: italic;
  color: #fff;
  margin-bottom: 60px;
  animation: win98-boot-pulse 1.5s ease-in-out infinite;
}

.boot-progress-container {
  width: 400px;
  height: 20px;
  background: #000;
  border: 2px solid;
  border-color: #808080 #fff #fff #808080;
  margin: 0 auto 20px;
}

.boot-progress-bar {
  height: 100%;
  background: linear-gradient(90deg,
    #000080 0%,
    #000080 25%,
    #fff 25%,
    #fff 50%,
    #000080 50%,
    #000080 75%,
    #fff 75%,
    #fff 100%
  );
  background-size: 20px 100%;
  transition: width 0.15s ease-out;
}

.boot-text {
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 14px;
  color: #c0c0c0;
}
</style>
