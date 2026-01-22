<template>
  <div class="win98-taskbar win98-frame" :class="{ 'mac-dock': isMacTheme }">
    <button v-if="!isMacTheme" class="win98-start-button win98-button" @click="toggleStartMenu">
      <span class="start-icon">&#9733;</span>
      <span>Start</span>
    </button>
    <div v-if="showStartMenu && !isMacTheme" class="start-menu win98-frame">
      <div class="start-menu-item" @click="openSettings">Settings</div>
      <div class="start-menu-divider"></div>
      <div class="start-menu-item" @click="closeAllWindows">Close All Windows</div>
      <div class="start-menu-item" @click="clearCustomIcons">Clear Custom Icons</div>
    </div>
    <div class="taskbar-windows" :class="{ 'dock-items': isMacTheme }">
      <button
        v-for="windowId in minimizedWindows"
        :key="windowId"
        class="taskbar-window-btn"
        :class="{ 'dock-item': isMacTheme }"
        @click="restoreWindow(windowId)"
        :title="getWindowTitle(windowId)"
      >
        <img v-if="getWindowIcon(windowId)" :src="getWindowIcon(windowId)" class="taskbar-window-icon" />
        <span v-if="!isMacTheme" class="taskbar-window-title">{{ getWindowTitle(windowId) }}</span>
      </button>
    </div>
    <div class="taskbar-spacer"></div>
    <div v-if="isMacTheme" class="mac-dock-actions">
      <button class="dock-action-btn" @click="closeAllWindows" title="Close All Windows">
        <span>&#10005;</span>
      </button>
      <button class="dock-action-btn" @click="clearCustomIcons" title="Clear Custom Icons">
        <span>&#128465;</span>
      </button>
    </div>
    <div class="taskbar-tray win98-frame-sunken" :class="{ 'mac-tray': isMacTheme }">
      <span class="clock">{{ time }}</span>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_ICONS, getWin98AssetPath } from '../../constants/win98';

export default {
  name: 'Win98Taskbar',
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      time: '',
      clockInterval: null,
      showStartMenu: false,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    isMacTheme() {
      return this.win98.activeSkin === 'macOSX1' || this.win98.activeSkin === 'macOS9';
    },
    minimizedWindows() {
      return this.win98.minimizedWindows || [];
    },
  },
  mounted() {
    this.updateClock();
    this.clockInterval = setInterval(this.updateClock, 1000);
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    updateClock() {
      const now = new Date();
      this.time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    },
    toggleStartMenu() {
      this.showStartMenu = !this.showStartMenu;
    },
    handleClickOutside(e) {
      if (this.showStartMenu && !e.target.closest('.win98-start-button') && !e.target.closest('.start-menu')) {
        this.showStartMenu = false;
      }
    },
    openSettings() {
      this.showStartMenu = false;
      this.settingsStore.win98OpenWindow('settings');
    },
    closeAllWindows() {
      this.showStartMenu = false;
      this.settingsStore.win98CloseAllWindows();
    },
    clearCustomIcons() {
      this.showStartMenu = false;
      if (confirm('Remove all custom icons and videos from the desktop?')) {
        this.settingsStore.win98ClearCustomIcons();
      }
    },
    restoreWindow(windowId) {
      this.settingsStore.win98RestoreWindow(windowId);
    },
    getWindowTitle(windowId) {
      if (windowId === 'notebook') return 'Notebook';
      if (windowId === 'settings') return 'Settings';
      if (windowId.startsWith('video-')) {
        const videoId = windowId.replace('video-', '');
        const icon = WIN98_ICONS[videoId];
        if (icon) return icon.label;
        const customVideo = this.win98.customVideos?.find(v => v.id === videoId);
        return customVideo?.label || videoId;
      }
      if (windowId.startsWith('folder-')) {
        const folderId = windowId.replace('folder-', '');
        const folder = this.win98.folders?.[folderId];
        return folder?.label || folderId;
      }
      return windowId;
    },
    getWindowIcon(windowId) {
      if (windowId.startsWith('video-')) {
        const videoId = windowId.replace('video-', '');
        const icon = WIN98_ICONS[videoId];
        return icon ? getWin98AssetPath(icon.icon) : null;
      }
      if (windowId === 'notebook') {
        return getWin98AssetPath('win98/assets/notepad.png');
      }
      if (windowId.startsWith('folder-')) {
        return getWin98AssetPath('win98/assets/folder_open.png');
      }
      return null;
    },
  },
};
</script>

<style scoped>
.win98-taskbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  display: flex;
  align-items: center;
  padding: 2px 4px;
  z-index: 500;
}

.win98-start-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-weight: bold;
  position: relative;
}

.start-icon {
  font-size: 16px;
}

.start-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: var(--win98-gray);
  min-width: 150px;
  padding: 2px;
  z-index: 1000;
}

.start-menu-item {
  padding: 4px 12px;
  cursor: pointer;
  font-family: var(--win98-font);
  font-size: 11px;
}

.start-menu-item:hover {
  background: var(--win98-blue);
  color: white;
}

.start-menu-divider {
  height: 1px;
  background: var(--win98-dark);
  margin: 2px 0;
}

.taskbar-windows {
  display: flex;
  gap: 2px;
  margin-left: 4px;
  overflow: hidden;
}

.taskbar-window-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: var(--win98-gray);
  border: 1px outset var(--win98-gray);
  cursor: pointer;
  max-width: 150px;
  font-family: var(--win98-font);
  font-size: 11px;
}

.taskbar-window-btn:hover {
  background: var(--win98-light);
}

.taskbar-window-icon {
  width: 16px;
  height: 16px;
}

.taskbar-window-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.taskbar-spacer {
  flex: 1;
}

.taskbar-tray {
  padding: 2px 8px;
  font-family: var(--win98-font);
  font-size: 11px;
}

.clock {
  color: var(--win98-black);
}

/* Mac Dock Style */
.mac-dock {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(200, 200, 200, 0.6) 100%);
  backdrop-filter: blur(10px);
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  height: 50px;
  padding: 4px 12px;
  border-radius: 0;
}

.dock-items {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex: 1;
}

.dock-item {
  width: 40px;
  height: 40px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(200, 200, 200, 0.6) 100%);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dock-item:hover {
  transform: scale(1.2) translateY(-8px);
}

.dock-item .taskbar-window-icon {
  width: 32px;
  height: 32px;
}

.mac-dock-actions {
  display: flex;
  gap: 4px;
  margin-right: 8px;
}

.dock-action-btn {
  width: 32px;
  height: 32px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(180, 180, 180, 0.6) 100%);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.dock-action-btn:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(200, 200, 200, 0.8) 100%);
  transform: scale(1.1);
}

.mac-tray {
  background: transparent;
  border: none;
  color: #333;
  font-family: 'Lucida Grande', 'Helvetica Neue', sans-serif;
}

.mac-tray .clock {
  color: #333;
}
</style>
