<template>
  <div class="win98-folder-content">
    <div class="folder-toolbar">
      <span class="folder-path">{{ folderLabel }}</span>
      <span class="folder-count">{{ children.length }} items</span>
    </div>
    <div
      class="folder-icons"
      @dragover.prevent="onDragOver"
      @drop="onDrop"
    >
      <div
        v-for="iconId in children"
        :key="iconId"
        class="folder-icon"
        :class="{ selected: selectedChild === iconId, dragging: draggingChild === iconId }"
        draggable="true"
        @click.stop="selectChild(iconId)"
        @dblclick.stop="openChild(iconId)"
        @dragstart="onChildDragStart($event, iconId)"
        @dragend="onChildDragEnd"
      >
        <div class="folder-icon-image">
          <img :src="getIconPath(iconId)" :alt="getIconLabel(iconId)" />
        </div>
        <span class="folder-icon-label">{{ getIconLabel(iconId) }}</span>
      </div>
      <div v-if="children.length === 0" class="folder-empty">
        Drag icons here
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_ICONS, getWin98AssetPath, getSkinIcon } from '../../constants/win98';
import { getSkin } from '../../constants/skins';

export default {
  name: 'Win98Folder',
  props: {
    folderId: {
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
      selectedChild: null,
      draggingChild: null,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    folder() {
      return this.win98.folders?.[this.folderId] || { label: 'Folder', children: [] };
    },
    folderLabel() {
      return this.folder.label || this.folderId;
    },
    children() {
      return this.folder.children || [];
    },
  },
  methods: {
    getIconData(iconId) {
      if (WIN98_ICONS[iconId]) return WIN98_ICONS[iconId];
      if (this.win98.customIcons) {
        const custom = this.win98.customIcons.find(i => i.id === iconId);
        if (custom) return custom;
      }
      if (this.win98.customVideos) {
        const video = this.win98.customVideos.find(v => v.id === iconId);
        if (video) return video;
      }
      return null;
    },
    getIconLabel(iconId) {
      const icon = this.getIconData(iconId);
      return icon?.label || iconId;
    },
    getIconPath(iconId) {
      const icon = this.getIconData(iconId);
      if (!icon) return '';
      if (icon.icon?.startsWith('data:')) return icon.icon;
      const skin = getSkin(this.win98.activeSkin);
      const skinIcon = getSkinIcon(iconId, icon.type, skin);
      if (skinIcon) return getWin98AssetPath(skinIcon);
      return getWin98AssetPath(icon.icon);
    },
    selectChild(iconId) {
      this.$emit('play-sound', 'click');
      this.selectedChild = iconId;
    },
    openChild(iconId) {
      this.$emit('play-sound', 'clink');
      const icon = this.getIconData(iconId);
      if (!icon) return;
      if (icon.type === 'video') {
        this.settingsStore.win98OpenWindow('video-' + iconId);
      } else if (icon.type === 'notebook') {
        this.settingsStore.win98OpenWindow('notebook');
      }
    },
    onChildDragStart(e, iconId) {
      this.draggingChild = iconId;
      e.dataTransfer.setData('text/plain', iconId);
      e.dataTransfer.setData('application/x-folder-source', this.folderId);
      e.dataTransfer.effectAllowed = 'move';
    },
    onChildDragEnd() {
      this.draggingChild = null;
    },
    onDragOver(e) {
      e.preventDefault();
    },
    onDrop(e) {
      const iconId = e.dataTransfer.getData('text/plain');
      const sourceFolder = e.dataTransfer.getData('application/x-folder-source');
      if (!iconId) return;
      if (sourceFolder && sourceFolder !== this.folderId) {
        this.settingsStore.win98RemoveFromFolder(sourceFolder, iconId);
      }
      if (!sourceFolder || sourceFolder !== this.folderId) {
        this.settingsStore.win98AddToFolder(this.folderId, iconId);
        this.$emit('play-sound', 'click');
      }
    },
  },
};
</script>

<style scoped>
.win98-folder-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.folder-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: var(--win98-gray);
  border-bottom: 1px solid var(--win98-dark);
  font-family: var(--win98-font);
  font-size: 11px;
}

.folder-path {
  font-weight: bold;
}

.folder-count {
  color: var(--win98-dark);
}

.folder-icons {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
  padding: 8px;
  overflow-y: auto;
  min-height: 100px;
}

.folder-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 72px;
  padding: 4px;
  cursor: pointer;
  border: 1px solid transparent;
}

.folder-icon:hover {
  background: rgba(0, 0, 128, 0.1);
}

.folder-icon.selected {
  background: rgba(0, 0, 128, 0.3);
  border: 1px dotted #000;
}

.folder-icon.dragging {
  opacity: 0.5;
}

.folder-icon-image {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.folder-icon-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.folder-icon-label {
  font-family: var(--win98-font);
  font-size: 11px;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  color: #000;
}

.folder-empty {
  width: 100%;
  text-align: center;
  padding: 20px;
  color: var(--win98-dark);
  font-family: var(--win98-font);
  font-size: 11px;
  font-style: italic;
}
</style>
