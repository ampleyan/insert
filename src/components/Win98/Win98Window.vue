<template>
  <div
    class="win98-window win98-frame"
    :class="{ 'is-resizing': isResizing, 'mac-window': isMacTheme }"
    :style="windowStyle"
    @mousedown="bringToFront"
  >
    <div class="win98-titlebar" :class="{ 'mac-titlebar': isMacTheme }" @mousedown.stop="startDrag">
      <div v-if="isMacTheme" class="mac-traffic-lights">
        <button class="mac-btn mac-close" @click.stop="closeWindow" title="Close"></button>
        <button class="mac-btn mac-minimize" @click.stop="minimizeWindow" title="Minimize"></button>
        <button class="mac-btn mac-maximize" @click.stop="maximizeWindow" title="Maximize"></button>
      </div>
      <div class="win98-titlebar-title" :class="{ 'mac-title': isMacTheme }">
        <img v-if="windowIcon && !isMacTheme" :src="windowIcon" class="win98-titlebar-icon" />
        <span>{{ windowTitle }}</span>
      </div>
      <div v-if="!isMacTheme" class="win98-window-buttons">
        <button class="win98-minimize" @click.stop="minimizeWindow">_</button>
        <button class="win98-close" @click.stop="closeWindow">X</button>
      </div>
    </div>
    <div class="win98-window-content">
      <Win98VideoPlayer v-if="isVideoWindow" :video-id="videoId" />
      <Win98Notebook v-else-if="windowId === 'notebook'" />
      <Win98Settings v-else-if="windowId === 'settings'" />
      <Win98Folder v-else-if="isFolderWindow" :folder-id="folderId" @play-sound="$emit('play-sound', $event)" />
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
import Win98Folder from './Win98Folder.vue';

export default {
  name: 'Win98Window',
  components: {
    Win98VideoPlayer,
    Win98Notebook,
    Win98Settings,
    Win98Folder,
  },
  props: {
    windowId: {
      type: String,
      required: true,
    },
  },
  emits: ['play-sound'],
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
    isFolderWindow() {
      return this.windowId.startsWith('folder-');
    },
    folderId() {
      return this.isFolderWindow ? this.windowId.replace('folder-', '') : null;
    },
    windowTitle() {
      if (this.windowId === 'notebook') return 'Notebook';
      if (this.windowId === 'settings') return 'Settings';
      if (this.isVideoWindow) {
        const icon = WIN98_ICONS[this.videoId];
        return icon ? icon.label : this.videoId;
      }
      if (this.isFolderWindow) {
        const folder = this.win98.folders?.[this.folderId];
        return folder?.label || this.folderId;
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
      if (this.isFolderWindow) {
        return getWin98AssetPath('win98/assets/folder_open.png');
      }
      return null;
    },
    isMacTheme() {
      return this.win98.activeSkin === 'macOSX1' || this.win98.activeSkin === 'macOS9';
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
    minimizeWindow() {
      this.settingsStore.win98MinimizeWindow(this.windowId);
    },
    maximizeWindow() {
      // Toggle maximize - for now just reset position
      this.position = null;
      this.size = null;
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

.win98-window-buttons {
  display: flex;
  gap: 2px;
}

.win98-minimize {
  width: 16px;
  height: 14px;
  font-size: 10px;
  padding: 0;
  border: 1px outset var(--win98-gray);
  background: var(--win98-gray);
  cursor: pointer;
  font-weight: bold;
}

.win98-minimize:active {
  border-style: inset;
}

/* Mac OS X style window */
.mac-window {
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid #888;
  background: #e8e8e8;
}

.mac-window .win98-frame {
  border: none;
}

.mac-titlebar {
  background: linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 50%, #d8d8d8 100%);
  border-bottom: 1px solid #999;
  border-radius: 6px 6px 0 0;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  min-height: 22px;
}

.mac-traffic-lights {
  display: flex;
  gap: 6px;
  margin-right: 12px;
}

.mac-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 0;
}

.mac-btn:hover {
  filter: brightness(1.1);
}

.mac-close {
  background: linear-gradient(180deg, #ff5f57 0%, #e0443e 100%);
}

.mac-minimize {
  background: linear-gradient(180deg, #ffbd2e 0%, #dea123 100%);
}

.mac-maximize {
  background: linear-gradient(180deg, #28c940 0%, #1aab29 100%);
}

.mac-title {
  flex: 1;
  text-align: center;
  font-family: 'Lucida Grande', 'Helvetica Neue', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.mac-window .win98-window-content {
  background: #f5f5f5;
  border-radius: 0 0 6px 6px;
}
</style>
