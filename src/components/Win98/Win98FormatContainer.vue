<template>
  <div class="win98-format-container" :class="win98.format" :style="containerStyle">
    <Win98Background />
    <Win98GridOverlay />
    <Win98ZonesOverlay />
    <Win98AlignmentGuides
      :dragging-icon="dragState?.iconId"
      :drag-position="dragState?.position"
      :icon-positions="win98.iconPositions"
      :icon-sizes="win98.iconSizes"
      :default-icon-scale="win98.iconScale"
    />
    <Win98DesktopIcons @play-sound="playSound" @context-menu="showContextMenu" @drag-update="onDragUpdate" />
    <!-- <Win98Timeline @play-sound="playSound" /> -->
    <Win98Taskbar />
    <Win98Window
      v-for="windowId in win98.openWindows"
      :key="windowId"
      :window-id="windowId"
      @play-sound="playSound"
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
      :selected-icon="win98.selectedIcon"
      :selected-icon-type="selectedIconType"
      :zones-visible="win98.zonesVisible"
      :grid-visible="win98.grid?.visible"
      :timeline-visible="win98.timeline?.visible"
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
import Win98ZonesOverlay from './Win98ZonesOverlay.vue';
import Win98GridOverlay from './Win98GridOverlay.vue';
import Win98AlignmentGuides from './Win98AlignmentGuides.vue';
// import Win98Timeline from './Win98Timeline.vue';

export default {
  name: 'Win98FormatContainer',
  components: {
    Win98Background,
    Win98DesktopIcons,
    Win98Taskbar,
    Win98Window,
    Win98ContextMenu,
    Win98ZonesOverlay,
    Win98GridOverlay,
    Win98AlignmentGuides,
    // Win98Timeline,
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
      dragState: null,
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
    selectedIconType() {
      const iconId = this.win98.selectedIcon;
      if (!iconId) return null;
      if (this.win98.folders?.[iconId]) return 'folder';
      return null;
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
    onDragUpdate(state) {
      this.dragState = state;
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
        case 'align-left':
          this.settingsStore.win98AlignIconsLeft();
          break;
        case 'align-right':
          this.settingsStore.win98AlignIconsRight();
          break;
        case 'align-top':
          this.settingsStore.win98AlignIconsTop();
          break;
        case 'align-bottom':
          this.settingsStore.win98AlignIconsBottom();
          break;
        case 'align-center':
          this.settingsStore.win98AlignIconsCenter();
          break;
        case 'distribute-horizontal':
          this.settingsStore.win98DistributeIconsHorizontal();
          break;
        case 'distribute-vertical':
          this.settingsStore.win98DistributeIconsVertical();
          break;
        case 'distribute-grid':
          this.settingsStore.win98DistributeIconsGrid();
          break;
        case 'distribute-circle':
          this.settingsStore.win98DistributeIconsCircle();
          break;
        case 'size-selected-1':
          this.settingsStore.win98SetIconSize(this.win98.selectedIcon, 1);
          break;
        case 'size-selected-2':
          this.settingsStore.win98SetIconSize(this.win98.selectedIcon, 2);
          break;
        case 'size-selected-3':
          this.settingsStore.win98SetIconSize(this.win98.selectedIcon, 3);
          break;
        case 'size-selected-4':
          this.settingsStore.win98SetIconSize(this.win98.selectedIcon, 4);
          break;
        case 'size-selected-5':
          this.settingsStore.win98SetIconSize(this.win98.selectedIcon, 5);
          break;
        case 'size-all-1':
          this.settingsStore.win98SetAllIconSizes(1);
          break;
        case 'size-all-2':
          this.settingsStore.win98SetAllIconSizes(2);
          break;
        case 'size-all-3':
          this.settingsStore.win98SetAllIconSizes(3);
          break;
        case 'size-all-4':
          this.settingsStore.win98SetAllIconSizes(4);
          break;
        case 'size-all-5':
          this.settingsStore.win98SetAllIconSizes(5);
          break;
        case 'size-reset':
          this.settingsStore.win98ResetIconSizes();
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
        case 'new-folder':
          this.createNewFolder();
          break;
        case 'restore-all':
          this.settingsStore.win98RestoreAllIcons();
          break;
        case 'properties':
          this.settingsStore.win98OpenWindow('settings');
          break;
        case 'toggle-zones':
          this.settingsStore.win98ToggleZonesVisible();
          break;
        case 'toggle-grid':
          this.settingsStore.win98ToggleGrid();
          break;
        case 'toggle-timeline':
          this.settingsStore.win98ToggleTimeline();
          break;
        case 'set-folder-thumbnail':
          this.triggerFolderThumbnailUpload();
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
    createNewFolder() {
      const label = prompt('Enter folder name:', 'New Folder');
      if (label) {
        const folderId = 'folder_' + Date.now();
        this.settingsStore.win98CreateFolder(folderId, label);
      }
    },
    triggerFolderThumbnailUpload() {
      const folderId = this.win98.selectedIcon;
      if (!folderId || !this.win98.folders?.[folderId]) return;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.settingsStore.win98SetFolderThumbnail(folderId, event.target.result);
          };
          reader.readAsDataURL(file);
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
