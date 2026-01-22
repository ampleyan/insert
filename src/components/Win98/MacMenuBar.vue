<template>
  <div class="mac-menubar">
    <div class="menubar-left">
      <div class="menu-item apple-menu" @click="toggleAppleMenu">
        <img :src="appleLogoSrc" alt="Apple" class="apple-logo" />
        <div v-if="showAppleMenu" class="dropdown-menu apple-dropdown">
          <div class="dropdown-item about" @click.stop="showAbout">About This Computer...</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click.stop="openSettings">
            <img :src="getIconPath('settings')" class="dropdown-icon" />
            Control Panels
          </div>
          <div class="dropdown-item" @click.stop="closeAllWindows">
            <img :src="getIconPath('folder')" class="dropdown-icon" />
            Close All Windows
          </div>
          <div class="dropdown-item" @click.stop="clearCustomIcons">
            <img :src="getIconPath('trash')" class="dropdown-icon" />
            Clear Custom Icons
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click.stop="restoreMinimized">
            <img :src="getIconPath('folder')" class="dropdown-icon" />
            Restore All Windows
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click.stop="goToInsert">Quit to INSERT</div>
        </div>
      </div>
      <div class="menu-item" @click="toggleMenu('file')">
        File
        <div v-if="activeMenu === 'file'" class="dropdown-menu">
          <div class="dropdown-item" @click.stop="openNotebook">New Note</div>
          <div class="dropdown-item disabled">Open...</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item disabled">Close Window</div>
        </div>
      </div>
      <div class="menu-item" @click="toggleMenu('edit')">
        Edit
        <div v-if="activeMenu === 'edit'" class="dropdown-menu">
          <div class="dropdown-item disabled">Undo</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item disabled">Cut</div>
          <div class="dropdown-item disabled">Copy</div>
          <div class="dropdown-item disabled">Paste</div>
        </div>
      </div>
      <div class="menu-item" @click="toggleMenu('view')">
        View
        <div v-if="activeMenu === 'view'" class="dropdown-menu">
          <div class="dropdown-item" :class="{ checked: win98.grid?.visible }" @click.stop="toggleGrid">Show Grid</div>
          <div class="dropdown-item" :class="{ checked: win98.zonesVisible }" @click.stop="toggleZones">Show Zones</div>
          <div class="dropdown-item" :class="{ checked: win98.showFormatInfo }" @click.stop="toggleFormatInfo">Show Format Info</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click.stop="cycleFormat">Change Format</div>
        </div>
      </div>
      <div class="menu-item" @click="toggleMenu('special')">
        Special
        <div v-if="activeMenu === 'special'" class="dropdown-menu">
          <div class="dropdown-item" @click.stop="triggerBoot">Restart</div>
          <div class="dropdown-item" @click.stop="triggerBSOD">Force Quit</div>
          <div class="dropdown-item" @click.stop="triggerScreensaver">Start Screensaver</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click.stop="showLogin">Show Login</div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item danger" @click.stop="resetAll">Reset All Settings...</div>
        </div>
      </div>
      <div class="menu-item" @click="toggleMenu('help')">
        Help
        <div v-if="activeMenu === 'help'" class="dropdown-menu">
          <div class="dropdown-item">Keyboard Shortcuts</div>
          <div class="dropdown-item disabled">Mac OS Help</div>
        </div>
      </div>
    </div>
    <div class="menubar-right">
      <span class="clock">{{ time }}</span>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { getWin98AssetPath } from '../../constants/win98';
import { getSkin } from '../../constants/skins';

export default {
  name: 'MacMenuBar',
  emits: ['action'],
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      time: '',
      clockInterval: null,
      showAppleMenu: false,
      activeMenu: null,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    appleLogoSrc() {
      return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="rainbow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#61BB46"/><stop offset="20%" style="stop-color:#FDB827"/><stop offset="40%" style="stop-color:#F5821F"/><stop offset="60%" style="stop-color:#E03A3E"/><stop offset="80%" style="stop-color:#963D97"/><stop offset="100%" style="stop-color:#009DDC"/></linearGradient></defs><path fill="url(#rainbow)" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>`);
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
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    },
    handleClickOutside(e) {
      if (!e.target.closest('.menu-item')) {
        this.showAppleMenu = false;
        this.activeMenu = null;
      }
    },
    toggleAppleMenu() {
      this.showAppleMenu = !this.showAppleMenu;
      this.activeMenu = null;
    },
    toggleMenu(menu) {
      this.showAppleMenu = false;
      this.activeMenu = this.activeMenu === menu ? null : menu;
    },
    closeMenus() {
      this.showAppleMenu = false;
      this.activeMenu = null;
    },
    getIconPath(iconType) {
      const skin = getSkin(this.win98.activeSkin);
      if (skin?.assets?.icons?.[iconType]) {
        return getWin98AssetPath(skin.assets.icons[iconType]);
      }
      return getWin98AssetPath('win98/assets/folder.png');
    },
    showAbout() {
      this.closeMenus();
      alert('Mac OS Studio\nVersion 1.0\n\nA nostalgic desktop experience');
    },
    openSettings() {
      this.closeMenus();
      this.settingsStore.win98OpenWindow('settings');
    },
    openNotebook() {
      this.closeMenus();
      this.settingsStore.win98OpenWindow('notebook');
    },
    closeAllWindows() {
      this.closeMenus();
      this.settingsStore.win98CloseAllWindows();
    },
    clearCustomIcons() {
      this.closeMenus();
      if (confirm('Remove all custom icons and videos from the desktop?')) {
        this.settingsStore.win98ClearCustomIcons();
      }
    },
    restoreMinimized() {
      this.closeMenus();
      const minimized = [...(this.win98.minimizedWindows || [])];
      minimized.forEach(windowId => {
        this.settingsStore.win98RestoreWindow(windowId);
      });
    },
    goToInsert() {
      this.closeMenus();
      this.$router?.push('/insert');
    },
    toggleGrid() {
      this.closeMenus();
      this.settingsStore.win98ToggleGrid();
    },
    toggleZones() {
      this.closeMenus();
      this.settingsStore.win98ToggleZonesVisible();
    },
    toggleFormatInfo() {
      this.closeMenus();
      this.settingsStore.win98UpdateSettings({ showFormatInfo: !this.win98.showFormatInfo });
    },
    cycleFormat() {
      this.closeMenus();
      const formats = ['square', 'portrait', 'landscape', 'reels'];
      const currentIndex = formats.indexOf(this.win98.format);
      const nextIndex = (currentIndex + 1) % formats.length;
      this.settingsStore.win98UpdateSettings({ format: formats[nextIndex] });
    },
    triggerBoot() {
      this.closeMenus();
      this.settingsStore.win98TriggerBoot();
    },
    triggerBSOD() {
      this.closeMenus();
      this.settingsStore.win98TriggerBSOD();
    },
    triggerScreensaver() {
      this.closeMenus();
      this.settingsStore.win98ActivateScreensaver();
    },
    showLogin() {
      this.closeMenus();
      this.settingsStore.win98UpdateSettings({ showMacLoginScreen: true });
    },
    resetAll() {
      this.closeMenus();
      this.$emit('action', 'reset-all');
    },
  },
};
</script>

<style scoped>
.mac-menubar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 50%, #d0d0d0 100%);
  border-bottom: 1px solid #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  font-family: 'Charcoal', 'Chicago', 'Geneva', 'Lucida Grande', sans-serif;
  font-size: 12px;
  z-index: 1000;
  user-select: none;
}

.menubar-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.menubar-right {
  display: flex;
  align-items: center;
}

.menu-item {
  position: relative;
  padding: 2px 10px;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.1);
}

.apple-menu {
  padding: 2px 8px;
}

.apple-logo {
  width: 14px;
  height: 14px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #888;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  padding: 2px 0;
  z-index: 1001;
}

.apple-dropdown {
  min-width: 200px;
}

.dropdown-item {
  padding: 4px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: #316ac5;
  color: white;
}

.dropdown-item.disabled {
  color: #999;
  cursor: default;
}

.dropdown-item.disabled:hover {
  background: transparent;
  color: #999;
}

.dropdown-item.checked::before {
  content: '✓';
  position: absolute;
  left: 6px;
}

.dropdown-item.danger {
  color: #c00;
}

.dropdown-item.danger:hover {
  background: #c00;
  color: white;
}

.dropdown-item.about {
  font-weight: 500;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
}

.dropdown-divider {
  height: 1px;
  background: #ccc;
  margin: 4px 0;
}

.clock {
  font-size: 11px;
  color: #000;
  font-weight: 500;
}
</style>
