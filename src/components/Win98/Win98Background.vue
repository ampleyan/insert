<template>
  <div class="win98-background">
    <img src="/win98/assets/insert_logo.png" alt="Logo" class="background-logo" />
  </div>
</template>

<script>
export default {
  name: 'Win98Background',
};
</script>

<style scoped>
.win98-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #008080;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.background-logo {
  //max-width: 100%;
  //max-height: 100%;
  opacity: 0.6;
  pointer-events: none;
}
</style>
