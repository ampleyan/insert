<template>
  <div
    class="win98-desktop-icons"
    @click="deselectAll"
    @contextmenu.prevent="onContextMenu"
    @touchstart="onDesktopTouchStart"
    @touchend="onDesktopTouchEnd"
    @mousemove="onResizeMove"
    @mouseup="onResizeEnd"
    @mouseleave="onResizeEnd"
  >
    <div
      v-for="(icon, iconId) in visibleIcons"
      :key="iconId + '-' + win98.activeSkin"
      class="win98-icon"
      :class="{ selected: selectedIcon === iconId, dragging: draggingIcon === iconId, resizing: resizingIcon === iconId }"
      :style="getIconStyle(iconId)"
      draggable="true"
      @click.stop="selectIcon(iconId)"
      @dblclick.stop="openIcon(iconId)"
      @dragstart="onDragStart($event, iconId)"
      @drag="onDrag"
      @dragend="onDragEnd"
      @touchstart="onIconTouchStart($event, iconId)"
      @touchend="onIconTouchEnd($event, iconId)"
    >
      <div class="icon-image-container" :style="getIconContainerStyle(iconId)">
        <div v-if="icon.iconType === 'help-book'" class="help-book-icon" :style="getIconImageStyle(iconId)"></div>
        <img v-else :src="getIconPath(iconId, icon)" :alt="icon.label" class="icon-image" :style="getIconImageStyle(iconId)" />
      </div>
      <span class="icon-label">{{ icon.label }}</span>
      <div
        v-if="selectedIcon === iconId"
        class="resize-handle"
        @mousedown.stop.prevent="onResizeStart($event, iconId)"
        @touchstart.stop.prevent="onResizeTouchStart($event, iconId)"
      ></div>
    </div>

    <Win98RecycleBin
      :has-items="win98.deletedIcons.length > 0"
      :icon-scale="win98.iconScale"
      :zoom-scale="win98.zoomScale"
      :active-skin="win98.activeSkin"
      @dragover.prevent="onTrashDragOver"
      @dragleave="onTrashDragLeave"
      @drop="onTrashDrop"
    />
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_ICONS, WIN98_FORMATS, getWin98AssetPath, getSkinIcon } from '../../constants/win98';
import { getSkin } from '../../constants/skins';
import Win98RecycleBin from './Win98RecycleBin.vue';

export default {
  name: 'Win98DesktopIcons',
  components: {
    Win98RecycleBin,
  },
  emits: ['play-sound', 'context-menu'],
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      draggingIcon: null,
      dragOffset: { x: 0, y: 0 },
      trashHighlighted: false,
      longPressTimer: null,
      longPressTarget: null,
      touchStartPos: { x: 0, y: 0 },
      lastTap: 0,
      resizingIcon: null,
      resizeStartSize: 1,
      resizeStartPos: { x: 0, y: 0 },
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    selectedIcon() {
      return this.win98.selectedIcon;
    },
    formatBounds() {
      const format = WIN98_FORMATS[this.win98.format] || WIN98_FORMATS.portrait;
      return {
        width: format.width,
        height: format.height - 36,
      };
    },
    visibleIcons() {
      const visible = {};
      Object.keys(WIN98_ICONS).forEach(id => {
        if (!this.win98.deletedIcons.includes(id)) {
          visible[id] = WIN98_ICONS[id];
        }
      });
      if (this.win98.customIcons) {
        this.win98.customIcons.forEach(icon => {
          if (!this.win98.deletedIcons.includes(icon.id)) {
            visible[icon.id] = icon;
          }
        });
      }
      if (this.win98.customVideos) {
        this.win98.customVideos.forEach(video => {
          if (!this.win98.deletedIcons.includes(video.id)) {
            visible[video.id] = video;
          }
        });
      }
      return visible;
    },
  },
  methods: {
    getIconSize(iconId) {
      const iconSizes = this.win98.iconSizes || {};
      return iconSizes[iconId] || this.win98.iconScale;
    },
    constrainPosition(x, y, iconId) {
      const scale = this.getIconSize(iconId);
      const iconWidth = 60 * scale;
      const iconHeight = 80 * scale;
      const maxX = this.formatBounds.width - iconWidth;
      const maxY = this.formatBounds.height - iconHeight;
      return {
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY)),
      };
    },
    getIconContainerStyle(iconId) {
      const scale = this.getIconSize(iconId);
      return {
        width: (48 * scale) + 'px',
        height: (48 * scale) + 'px',
      };
    },
    getIconImageStyle(iconId) {
      const scale = this.getIconSize(iconId);
      return {
        width: (48 * scale) + 'px',
        height: (48 * scale) + 'px',
      };
    },
    getIconStyle(iconId) {
      const pos = this.win98.iconPositions[iconId] || { x: 20, y: 20 };
      const scale = this.getIconSize(iconId);
      return {
        left: pos.x + 'px',
        top: pos.y + 'px',
        width: (60 * scale) + 'px',
        '--zoom-scale': this.win98.zoomScale,
      };
    },
    selectIcon(iconId) {
      this.$emit('play-sound', 'click');
      this.settingsStore.win98UpdateSettings({ selectedIcon: iconId });
    },
    deselectAll() {
      this.settingsStore.win98UpdateSettings({ selectedIcon: null });
    },
    openIcon(iconId) {
      this.$emit('play-sound', 'clink');
      const icon = this.visibleIcons[iconId];
      if (!icon) return;

      if (icon.type === 'video') {
        this.settingsStore.win98OpenWindow('video-' + iconId);
      } else if (icon.type === 'notebook') {
        this.settingsStore.win98OpenWindow('notebook');
      } else if (icon.type === 'custom') {
        // Custom icons can be configured for different actions
      }
    },
    onDragStart(e, iconId) {
      this.draggingIcon = iconId;
      const rect = e.target.getBoundingClientRect();
      this.dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      e.dataTransfer.setData('text/plain', iconId);
      e.dataTransfer.effectAllowed = 'move';
      const img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      e.dataTransfer.setDragImage(img, 0, 0);
    },
    onDrag(e) {
      if (!this.draggingIcon || e.clientX === 0 || e.clientY === 0) return;
      const parent = this.$el.getBoundingClientRect();
      const rawX = e.clientX - parent.left - this.dragOffset.x;
      const rawY = e.clientY - parent.top - this.dragOffset.y;
      const { x, y } = this.constrainPosition(rawX, rawY, this.draggingIcon);
      this.settingsStore.win98UpdateIconPosition(this.draggingIcon, x, y);
    },
    onDragEnd(e) {
      if (!this.draggingIcon) return;
      if (this.trashHighlighted) {
        this.draggingIcon = null;
        return;
      }
      const parent = this.$el.getBoundingClientRect();
      const rawX = e.clientX - parent.left - this.dragOffset.x;
      const rawY = e.clientY - parent.top - this.dragOffset.y;
      const { x, y } = this.constrainPosition(rawX, rawY, this.draggingIcon);
      this.settingsStore.win98UpdateIconPosition(this.draggingIcon, x, y);
      this.draggingIcon = null;
    },
    onTrashDragOver() {
      this.trashHighlighted = true;
    },
    onTrashDragLeave() {
      this.trashHighlighted = false;
    },
    onTrashDrop(e) {
      const iconId = e.dataTransfer.getData('text/plain');
      if (iconId && this.visibleIcons[iconId]) {
        this.$emit('play-sound', 'trash');
        this.settingsStore.win98DeleteIcon(iconId);
      }
      this.trashHighlighted = false;
      this.draggingIcon = null;
    },
    onContextMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      this.$emit('play-sound', 'click');
      this.$emit('context-menu', { x: e.clientX, y: e.clientY });
    },
    getIconPath(iconId, icon) {
      if (icon.icon && icon.icon.startsWith('data:')) {
        return icon.icon;
      }
      const skin = getSkin(this.win98.activeSkin);
      const skinIcon = getSkinIcon(iconId, icon.type, skin);
      if (skinIcon) {
        return getWin98AssetPath(skinIcon);
      }
      return getWin98AssetPath(icon.icon);
    },
    getAssetPath(path) {
      if (path && path.startsWith('data:')) {
        return path;
      }
      return getWin98AssetPath(path);
    },
    onDesktopTouchStart(e) {
      if (e.target.classList.contains('win98-desktop-icons')) {
        this.longPressTarget = null;
        this.touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.longPressTimer = setTimeout(() => {
          this.$emit('play-sound', 'click');
          this.$emit('context-menu', {
            x: this.touchStartPos.x,
            y: this.touchStartPos.y,
          });
        }, 500);
      }
    },
    onDesktopTouchEnd() {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    },
    onIconTouchStart(e, iconId) {
      e.stopPropagation();
      this.longPressTarget = iconId;
      this.touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      this.longPressTimer = setTimeout(() => {
        this.selectIcon(iconId);
        this.$emit('play-sound', 'click');
        this.$emit('context-menu', {
          x: this.touchStartPos.x,
          y: this.touchStartPos.y,
        });
      }, 500);
    },
    onIconTouchEnd(e, iconId) {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
        const currentTime = new Date().getTime();
        const tapLength = currentTime - this.lastTap;
        if (tapLength < 500 && tapLength > 0) {
          this.openIcon(iconId);
        } else {
          this.selectIcon(iconId);
        }
        this.lastTap = currentTime;
      }
    },
    onResizeStart(e, iconId) {
      this.resizingIcon = iconId;
      this.resizeStartSize = this.getIconSize(iconId);
      this.resizeStartPos = { x: e.clientX, y: e.clientY };
    },
    onResizeTouchStart(e, iconId) {
      if (e.touches.length === 1) {
        this.resizingIcon = iconId;
        this.resizeStartSize = this.getIconSize(iconId);
        this.resizeStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        document.addEventListener('touchmove', this.onResizeTouchMove);
        document.addEventListener('touchend', this.onResizeTouchEnd);
      }
    },
    onResizeMove(e) {
      if (!this.resizingIcon) return;
      const deltaX = e.clientX - this.resizeStartPos.x;
      const deltaY = e.clientY - this.resizeStartPos.y;
      const delta = Math.max(deltaX, deltaY);
      const scaleChange = delta / 48;
      let newSize = Math.round(this.resizeStartSize + scaleChange);
      newSize = Math.max(1, Math.min(newSize, 10));
      this.settingsStore.win98SetIconSize(this.resizingIcon, newSize);
    },
    onResizeTouchMove(e) {
      if (!this.resizingIcon || !e.touches.length) return;
      const deltaX = e.touches[0].clientX - this.resizeStartPos.x;
      const deltaY = e.touches[0].clientY - this.resizeStartPos.y;
      const delta = Math.max(deltaX, deltaY);
      const scaleChange = delta / 48;
      let newSize = Math.round(this.resizeStartSize + scaleChange);
      newSize = Math.max(1, Math.min(newSize, 10));
      this.settingsStore.win98SetIconSize(this.resizingIcon, newSize);
    },
    onResizeEnd() {
      if (this.resizingIcon) {
        const pos = this.win98.iconPositions[this.resizingIcon];
        if (pos) {
          const { x, y } = this.constrainPosition(pos.x, pos.y, this.resizingIcon);
          this.settingsStore.win98UpdateIconPosition(this.resizingIcon, x, y);
        }
      }
      this.resizingIcon = null;
    },
    onResizeTouchEnd() {
      document.removeEventListener('touchmove', this.onResizeTouchMove);
      document.removeEventListener('touchend', this.onResizeTouchEnd);
      this.onResizeEnd();
    },
  },
};
</script>

<style scoped>
.win98-desktop-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 28px;
  z-index: 10;
}

.win98-icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease;
}

.win98-icon:hover {
  transform: scale(var(--zoom-scale, 1.8));
  z-index: 100;
}

.win98-icon.selected {
  background: rgba(0, 0, 128, 0.3);
  outline: 1px dotted #fff;
}

.win98-icon.dragging {
  opacity: 0.7;
}

.win98-icon.resizing {
  transform: none !important;
  z-index: 100;
}

.win98-icon.resizing:hover {
  transform: none !important;
}

.resize-handle {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 12px;
  height: 12px;
  background: #000080;
  border: 1px solid #fff;
  cursor: se-resize;
  z-index: 10;
}

.resize-handle::after {
  content: '';
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 6px;
  height: 6px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.icon-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.icon-image {
  object-fit: contain;
}

.icon-label {
  font-family: var(--win98-font);
  font-size: 11px;
  color: #fff;
  text-align: center;
  text-shadow: 1px 1px 1px #000;
  word-break: break-word;
  max-width: 100%;
}

.help-book-icon {
  background: linear-gradient(135deg, #ffff00 0%, #ffd700 50%, #daa520 100%);
  border: 2px solid #808080;
  border-radius: 2px 6px 6px 2px;
  position: relative;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.5), inset -4px 0 8px rgba(0,0,0,0.2);
}

.help-book-icon::before {
  content: '?';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60%;
  font-weight: bold;
  color: #000080;
  text-shadow: 1px 1px 0 #fff;
}

.help-book-icon::after {
  content: '';
  position: absolute;
  left: 0;
  top: 8%;
  bottom: 8%;
  width: 12%;
  background: linear-gradient(to right, #b8860b, #daa520);
  border-radius: 2px 0 0 2px;
}
</style>
