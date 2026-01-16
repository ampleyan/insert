<template>
  <div class="win98-format-container" :class="win98.format" :style="containerStyle">
    <Win98Background />
    <Win98DesktopIcons @play-sound="playSound" @context-menu="showContextMenu" />
    <Win98Taskbar />
    <Win98Window
      v-for="windowId in win98.openWindows"
      :key="windowId"
      :window-id="windowId"
    />
    <div v-if="win98.showFormatInfo" class="format-info">
      {{ formatInfo }}
    </div>
    <Win98ContextMenu
      :visible="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :auto-arrange="win98.autoArrange"
      :has-deleted-icons="win98.deletedIcons.length > 0"
      @action="handleContextAction"
      @close="closeContextMenu"
    />
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_FORMATS, WIN98_SOUNDS, getWin98AssetPath } from '../../constants/win98';
import { getSkin } from '../../constants/skins';
import Win98Background from './Win98Background.vue';
import Win98DesktopIcons from './Win98DesktopIcons.vue';
import Win98Taskbar from './Win98Taskbar.vue';
import Win98Window from './Win98Window.vue';
import Win98ContextMenu from './Win98ContextMenu.vue';

export default {
  name: 'Win98FormatContainer',
  components: {
    Win98Background,
    Win98DesktopIcons,
    Win98Taskbar,
    Win98Window,
    Win98ContextMenu,
  },
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      sounds: {},
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    containerStyle() {
      const format = WIN98_FORMATS[this.win98.format];
      return {
        width: format.width + 'px',
        height: format.height + 'px',
      };
    },
    formatInfo() {
      const format = WIN98_FORMATS[this.win98.format];
      return `${format.name} - ${format.width}x${format.height} (${format.ratio})`;
    },
  },
  watch: {
    'win98.activeSkin'() {
      this.preloadSounds();
    },
  },
  mounted() {
    this.preloadSounds();
  },
  methods: {
    preloadSounds() {
      const skin = getSkin(this.win98.activeSkin);
      const skinSounds = skin?.sounds || {};
      const soundMap = {
        click: skinSounds.click || WIN98_SOUNDS.click,
        trash: skinSounds.trash || WIN98_SOUNDS.trash,
        clink: skinSounds.error || WIN98_SOUNDS.clink,
      };
      Object.keys(soundMap).forEach(key => {
        const audio = new Audio(getWin98AssetPath(soundMap[key]));
        audio.preload = 'auto';
        this.sounds[key] = audio;
      });
    },
    playSound(soundName) {
      if (!this.win98.soundEnabled) return;
      const sound = this.sounds[soundName];
      if (sound) {
        sound.volume = this.win98.volume;
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    },
    showContextMenu({ x, y }) {
      this.contextMenu = { visible: true, x, y };
    },
    closeContextMenu() {
      this.contextMenu.visible = false;
    },
    handleContextAction(action) {
      this.closeContextMenu();
      this.playSound('click');

      switch (action) {
        case 'arrange-name':
          this.settingsStore.win98ArrangeIconsByName();
          break;
        case 'arrange-type':
          this.settingsStore.win98ArrangeIconsByType();
          break;
        case 'auto-arrange':
          this.settingsStore.win98ToggleAutoArrange();
          break;
        case 'align-grid':
          this.settingsStore.win98AlignIconsToGrid();
          break;
        case 'line-up':
          this.settingsStore.win98LineUpIcons();
          break;
        case 'refresh':
          window.location.reload();
          break;
        case 'add-icon':
          this.triggerIconUpload();
          break;
        case 'add-video':
          this.triggerVideoUpload();
          break;
        case 'restore-all':
          this.settingsStore.win98RestoreAllIcons();
          break;
        case 'properties':
          this.settingsStore.win98OpenWindow('settings');
          break;
      }
    },
    triggerIconUpload() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const label = prompt('Enter icon label:', file.name.replace(/\.[^/.]+$/, ''));
            if (label) {
              const icon = {
                id: 'custom_icon_' + Date.now(),
                label: label,
                icon: event.target.result,
                type: 'custom',
              };
              const win98AssetsService = (await import('../../services/win98Assets')).default;
              await win98AssetsService.addCustomIcon(icon);
              this.settingsStore.win98AddCustomIcon(icon);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
    triggerVideoUpload() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const label = prompt('Enter video label:', file.name.replace(/\.[^/.]+$/, ''));
          if (label) {
            const win98AssetsService = (await import('../../services/win98Assets')).default;
            const video = await win98AssetsService.addCustomVideo(file, null);
            video.label = label;
            this.settingsStore.win98AddCustomVideo(video);
          }
        }
      };
      input.click();
    },
  },
};
</script>

<style scoped>
.win98-format-container {
  position: relative;
  margin: 0 auto;
  background: #008080;
  overflow: hidden;
}

.format-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px 10px;
  font-family: var(--win98-font);
  font-size: 11px;
  z-index: 100;
}
</style>
