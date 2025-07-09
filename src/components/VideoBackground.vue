<template>
  <video id="background-video" autoplay loop playsinline muted ref="videoElement">
    <source src="/assets/video/back.mp4" type="video/mp4">
  </video>
</template>

<script>
export default {
  name: 'VideoBackground',
  mounted() {
    // Try to play the video automatically
    this.$refs.videoElement.play().catch(error => {
      console.log("Video autoplay failed:", error);
    });
  }
};
</script>

<style scoped>
#background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
</style>
