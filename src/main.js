import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/styles/tokens.css';
import './assets/styles/main.css';
import './assets/styles/controls.css';
import './assets/styles/animation.css';
import './assets/styles/text-animations.css';
import './assets/styles/mobile.css';
import './assets/styles/win98.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    const basePath = process.env.BASE_URL || '/';
    navigator.serviceWorker
      .register(`${basePath}service-worker.js`)
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}
