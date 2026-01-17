<template>
  <div class="win98-timeline" :class="{ visible: visible }">
    <div class="timeline-header">
      <span class="timeline-title">Timeline / Lineup Order</span>
      <button class="timeline-toggle" @click="toggleTimeline">
        {{ visible ? 'Hide' : 'Show' }}
      </button>
    </div>
    <div v-if="visible" class="timeline-content">
      <div class="timeline-toolbar">
        <button class="win98-btn" @click="addToTimeline">Add Selected</button>
        <button class="win98-btn" @click="toggleShowOrder">{{ showOrder ? 'Hide #' : 'Show #' }}</button>
        <button class="win98-btn" @click="clearTimeline">Clear All</button>
      </div>
      <div class="timeline-items" @dragover.prevent @drop="onDrop">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="timeline-item"
          :class="{ dragging: draggingIndex === index }"
          draggable="true"
          @dragstart="onItemDragStart($event, index)"
          @dragover.prevent="onItemDragOver(index)"
          @dragend="onItemDragEnd"
        >
          <span v-if="showOrder" class="item-order">{{ index + 1 }}</span>
          <img v-if="getItemIcon(item)" :src="getItemIcon(item)" class="item-icon" />
          <span class="item-label">{{ getItemLabel(item) }}</span>
          <span class="item-importance" :style="{ color: getImportanceColor(item) }">
            {{ getImportanceLabel(item) }}
          </span>
          <button class="item-remove" @click="removeItem(index)">&times;</button>
        </div>
        <div v-if="items.length === 0" class="timeline-empty">
          Drag icons here or click "Add Selected"
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_ICONS, getWin98AssetPath, getSkinIcon, IMPORTANCE_LEVELS } from '../../constants/win98';
import { getSkin } from '../../constants/skins';

export default {
  name: 'Win98Timeline',
  emits: ['play-sound'],
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      draggingIndex: null,
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    visible() {
      return this.win98.timeline?.visible;
    },
    items() {
      return this.win98.timeline?.items || [];
    },
    showOrder() {
      return this.win98.timeline?.showOrder === true;
    },
  },
  methods: {
    toggleTimeline() {
      this.$emit('play-sound', 'click');
      this.settingsStore.win98ToggleTimeline();
    },
    toggleShowOrder() {
      this.$emit('play-sound', 'click');
      this.settingsStore.win98UpdateSettings({
        timeline: { ...this.win98.timeline, showOrder: !this.showOrder }
      });
    },
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
    getItemLabel(item) {
      const iconData = this.getIconData(item.iconId);
      return item.label || iconData?.label || item.iconId;
    },
    getItemIcon(item) {
      const iconData = this.getIconData(item.iconId);
      if (!iconData) return null;
      if (iconData.icon?.startsWith('data:')) return iconData.icon;
      const skin = getSkin(this.win98.activeSkin);
      const skinIcon = getSkinIcon(item.iconId, iconData.type, skin);
      if (skinIcon) return getWin98AssetPath(skinIcon);
      return getWin98AssetPath(iconData.icon);
    },
    getImportanceLabel(item) {
      const level = IMPORTANCE_LEVELS[item.importance];
      return level?.label || '';
    },
    getImportanceColor(item) {
      const level = IMPORTANCE_LEVELS[item.importance];
      return level?.color || '#808080';
    },
    addToTimeline() {
      const selectedIcon = this.win98.selectedIcon;
      if (!selectedIcon) return;
      this.$emit('play-sound', 'click');
      const importance = this.win98.iconImportance?.[selectedIcon] || 'info';
      this.settingsStore.win98AddToTimeline({
        id: Date.now(),
        iconId: selectedIcon,
        importance: importance,
      });
    },
    removeItem(index) {
      this.$emit('play-sound', 'click');
      this.settingsStore.win98RemoveFromTimeline(index);
    },
    clearTimeline() {
      this.$emit('play-sound', 'click');
      this.settingsStore.win98UpdateSettings({
        timeline: { ...this.win98.timeline, items: [] }
      });
    },
    onItemDragStart(e, index) {
      this.draggingIndex = index;
      e.dataTransfer.effectAllowed = 'move';
    },
    onItemDragOver(index) {
      if (this.draggingIndex === null || this.draggingIndex === index) return;
      this.settingsStore.win98ReorderTimeline(this.draggingIndex, index);
      this.draggingIndex = index;
    },
    onItemDragEnd() {
      this.draggingIndex = null;
    },
    onDrop(e) {
      const iconId = e.dataTransfer.getData('text/plain');
      if (!iconId) return;
      this.$emit('play-sound', 'click');
      const importance = this.win98.iconImportance?.[iconId] || 'info';
      this.settingsStore.win98AddToTimeline({
        id: Date.now(),
        iconId: iconId,
        importance: importance,
      });
    },
  },
};
</script>

<style scoped>
.win98-timeline {
  position: absolute;
  bottom: 28px;
  left: 0;
  right: 0;
  background: var(--win98-gray);
  border-top: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  z-index: 200;
  transition: transform 0.2s ease;
  transform: translateY(calc(100% - 24px));
}

.win98-timeline.visible {
  transform: translateY(0);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  background: linear-gradient(to right, #000080, #1084d0);
  color: #fff;
  font-family: var(--win98-font);
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.timeline-toggle {
  background: var(--win98-gray);
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  padding: 1px 8px;
  font-family: var(--win98-font);
  font-size: 10px;
  cursor: pointer;
}

.timeline-toggle:active {
  border-color: #808080 #fff #fff #808080;
}

.timeline-content {
  padding: 4px;
  max-height: 150px;
  overflow-y: auto;
}

.timeline-toolbar {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.win98-btn {
  background: var(--win98-gray);
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  padding: 2px 8px;
  font-family: var(--win98-font);
  font-size: 11px;
  cursor: pointer;
}

.win98-btn:active {
  border-color: #808080 #fff #fff #808080;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 40px;
  background: #fff;
  border: 1px solid #808080;
  padding: 4px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: var(--win98-gray);
  border: 1px solid;
  border-color: #fff #808080 #808080 #fff;
  cursor: move;
}

.timeline-item.dragging {
  opacity: 0.5;
}

.item-order {
  font-family: var(--win98-font);
  font-size: 11px;
  font-weight: bold;
  color: #000080;
  min-width: 20px;
}

.item-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.item-label {
  flex: 1;
  font-family: var(--win98-font);
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-importance {
  font-family: var(--win98-font);
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
}

.item-remove {
  background: none;
  border: none;
  color: #808080;
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
}

.item-remove:hover {
  color: #ff0000;
}

.timeline-empty {
  padding: 12px;
  text-align: center;
  color: #808080;
  font-family: var(--win98-font);
  font-size: 11px;
  font-style: italic;
}
</style>
