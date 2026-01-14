<template>
  <div class="win98-desktop-icons" @click="deselectAll" @contextmenu.prevent="onContextMenu">
    <div
      v-for="(icon, iconId) in visibleIcons"
      :key="iconId"
      class="win98-icon"
      :class="{ selected: selectedIcon === iconId, dragging: draggingIcon === iconId }"
      :style="getIconStyle(iconId)"
      draggable="true"
      @click.stop="selectIcon(iconId)"
      @dblclick.stop="openIcon(iconId)"
      @dragstart="onDragStart($event, iconId)"
      @drag="onDrag"
      @dragend="onDragEnd"
    >
      <div class="icon-image-container" :style="iconContainerStyle">
        <div v-if="icon.iconType === 'help-book'" class="help-book-icon" :style="iconImageStyle"></div>
        <img v-else :src="getAssetPath(icon.icon)" :alt="icon.label" class="icon-image" :style="iconImageStyle" />
      </div>
      <span class="icon-label">{{ icon.label }}</span>
    </div>

    <Win98RecycleBin
      :has-items="win98.deletedIcons.length > 0"
      @dragover.prevent="onTrashDragOver"
      @dragleave="onTrashDragLeave"
      @drop="onTrashDrop"
    />
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_ICONS, getWin98AssetPath } from '../../constants/win98';
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
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    selectedIcon() {
      return this.win98.selectedIcon;
    },
    visibleIcons() {
      const visible = {};
      Object.keys(WIN98_ICONS).forEach(id => {
        if (!this.win98.deletedIcons.includes(id)) {
          visible[id] = WIN98_ICONS[id];
        }
      });
      return visible;
    },
    iconContainerStyle() {
      const scale = this.win98.iconScale;
      return {
        width: (48 * scale) + 'px',
        height: (48 * scale) + 'px',
      };
    },
    iconImageStyle() {
      const scale = this.win98.iconScale;
      return {
        width: (48 * scale) + 'px',
        height: (48 * scale) + 'px',
      };
    },
  },
  methods: {
    getIconStyle(iconId) {
      const pos = this.win98.iconPositions[iconId] || { x: 20, y: 20 };
      const scale = this.win98.iconScale;
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
      const icon = WIN98_ICONS[iconId];
      if (!icon) return;

      if (icon.type === 'video') {
        this.settingsStore.win98OpenWindow('video-' + iconId);
      } else if (icon.type === 'notebook') {
        this.settingsStore.win98OpenWindow('notebook');
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
    },
    onDrag() {
    },
    onDragEnd(e) {
      if (!this.draggingIcon || this.trashHighlighted) {
        this.draggingIcon = null;
        return;
      }

      const parent = this.$el.getBoundingClientRect();
      const x = e.clientX - parent.left - this.dragOffset.x;
      const y = e.clientY - parent.top - this.dragOffset.y;

      if (x > 0 && y > 0) {
        this.settingsStore.win98UpdateIconPosition(this.draggingIcon, x, y);
      }
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
      if (iconId && WIN98_ICONS[iconId]) {
        this.$emit('play-sound', 'trash');
        this.settingsStore.win98DeleteIcon(iconId);
      }
      this.trashHighlighted = false;
      this.draggingIcon = null;
    },
    onContextMenu(e) {
      this.$emit('play-sound', 'click');
      this.$emit('context-menu', { x: e.clientX, y: e.clientY });
    },
    getAssetPath(path) {
      return getWin98AssetPath(path);
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
