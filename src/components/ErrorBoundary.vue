<template>
  <div v-if="error" class="error-boundary">
    <div class="error-message">
      <h2>Something went wrong</h2>
      <p>{{ error.message }}</p>
      <button @click="reset">Try Again</button>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script>
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      error: null,
    };
  },
  errorCaptured(err, vm, info) {
    this.error = err;
    console.error('Error captured:', err, info);
    return false;
  },
  methods: {
    reset() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
.error-boundary {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
}

.error-message {
  background: rgba(255, 59, 48, 0.2);
  border: 1px solid rgba(255, 59, 48, 0.5);
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  color: white;
  max-width: 500px;
}

.error-message h2 {
  margin: 0 0 15px 0;
  color: #ff3b30;
}

.error-message p {
  margin: 0 0 20px 0;
  font-family: monospace;
}

.error-message button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.error-message button:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
