<template>
  <div
    class="win98-window win98-frame"
    :class="{ 'is-resizing': isResizing }"
    :style="windowStyle"
    @mousedown="bringToFront"
  >
    <div class="win98-titlebar" @mousedown.stop="startDrag">
      <div class="win98-titlebar-title">
        <img v-if="windowIcon" :src="windowIcon" class="win98-titlebar-icon" />
        <span>{{ windowTitle }}</span>
      </div>
      <button class="win98-close" @click.stop="closeWindow">X</button>
    </div>
    <div class="win98-window-content">
      <Win98VideoPlayer v-if="isVideoWindow" :video-id="videoId" />
      <Win98Notebook v-else-if="windowId === 'notebook'" />
      <Win98Settings v-else-if="windowId === 'settings'" />
    </div>
    <div v-if="isVideoWindow" class="resize-handle" @mousedown.stop="startResize"></div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_ICONS, getWin98AssetPath } from '../../constants/win98';
import Win98VideoPlayer from './Win98VideoPlayer.vue';
import Win98Notebook from './Win98Notebook.vue';
import Win98Settings from './Win98Settings.vue';

export default {
  name: 'Win98Window',
  components: {
    Win98VideoPlayer,
    Win98Notebook,
    Win98Settings,
  },
  props: {
    windowId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      position: null,
      isResizing: false,
      size: null,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    isVideoWindow() {
      return this.windowId.startsWith('video-');
    },
    videoId() {
      return this.isVideoWindow ? this.windowId.replace('video-', '') : null;
    },
    windowTitle() {
      if (this.windowId === 'notebook') return 'Notebook';
      if (this.windowId === 'settings') return 'Settings';
      if (this.isVideoWindow) {
        const icon = WIN98_ICONS[this.videoId];
        return icon ? icon.label : this.videoId;
      }
      return this.windowId;
    },
    windowIcon() {
      if (this.isVideoWindow) {
        const icon = WIN98_ICONS[this.videoId];
        return icon ? getWin98AssetPath(icon.icon) : null;
      }
      if (this.windowId === 'notebook') {
        return getWin98AssetPath('win98/assets/notepad.png');
      }
      return null;
    },
    windowStyle() {
      const savedPos = this.win98.windowPositions[this.windowId];
      const zIndex = this.win98.windowZIndex[this.windowId] || 1000;
      const sizeStyle = this.size ? {
        width: this.size.width + 'px',
        height: this.size.height + 'px',
      } : {};

      if (this.position) {
        return {
          left: this.position.x + 'px',
          top: this.position.y + 'px',
          zIndex,
          ...sizeStyle,
        };
      }

      if (savedPos && savedPos.x !== null) {
        return {
          left: savedPos.x + 'px',
          top: savedPos.y + 'px',
          zIndex,
          ...sizeStyle,
        };
      }

      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex,
        ...sizeStyle,
      };
    },
  },
  mounted() {
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mousemove', this.onResize);
    document.addEventListener('mouseup', this.stopDrag);
    document.addEventListener('mouseup', this.stopResize);
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mousemove', this.onResize);
    document.removeEventListener('mouseup', this.stopDrag);
    document.removeEventListener('mouseup', this.stopResize);
  },
  methods: {
    bringToFront() {
      this.settingsStore.win98BringToFront(this.windowId);
      if (this.isVideoWindow) {
        this.settingsStore.win98SetAudioFocus(this.videoId);
        this.settingsStore.win98.videoStates[this.videoId].playing = true;
      }
    },
    closeWindow() {
      this.settingsStore.win98CloseWindow(this.windowId);
    },
    startDrag(e) {
      this.isDragging = true;
      const rect = this.$el.getBoundingClientRect();
      this.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      this.bringToFront();
    },
    onDrag(e) {
      if (!this.isDragging) return;
      const parent = this.$el.parentElement.getBoundingClientRect();
      const x = e.clientX - parent.left - this.dragOffset.x;
      const y = e.clientY - parent.top - this.dragOffset.y;
      this.position = { x, y };
    },
    stopDrag() {
      if (this.isDragging && this.position) {
        this.settingsStore.win98UpdateWindowPosition(this.windowId, this.position.x, this.position.y);
      }
      this.isDragging = false;
    },
    startResize(e) {
      this.isResizing = true;
      const rect = this.$el.getBoundingClientRect();
      this.resizeStart = {
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height,
      };
      this.bringToFront();
    },
    onResize(e) {
      if (!this.isResizing) return;
      const deltaX = e.clientX - this.resizeStart.x;
      const deltaY = e.clientY - this.resizeStart.y;
      const newWidth = Math.max(200, this.resizeStart.width + deltaX);
      const newHeight = Math.max(150, this.resizeStart.height + deltaY);
      this.size = { width: newWidth, height: newHeight };
    },
    stopResize() {
      this.isResizing = false;
    },
  },
};
</script>

<style scoped>
.win98-window {
  position: absolute;
  width: 500px;
  min-height: 200px;
  animation: win98-window-open 0.15s ease-out;
  display: flex;
  flex-direction: column;
}

.win98-window.video-window {
  width: 640px;
}

.win98-window.is-resizing {
  user-select: none;
}

.win98-window-content {
  background: var(--win98-gray);
  padding: 2px;
  min-height: 150px;
  flex: 1;
  overflow: hidden;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: se-resize;
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 50%,
    var(--win98-dark) 50%,
    var(--win98-dark) 60%,
    transparent 60%,
    transparent 70%,
    var(--win98-dark) 70%,
    var(--win98-dark) 80%,
    transparent 80%,
    transparent 90%,
    var(--win98-dark) 90%
  );
}

.resize-handle:hover {
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 50%,
    var(--win98-black) 50%,
    var(--win98-black) 60%,
    transparent 60%,
    transparent 70%,
    var(--win98-black) 70%,
    var(--win98-black) 80%,
    transparent 80%,
    transparent 90%,
    var(--win98-black) 90%
  );
}
</style>
