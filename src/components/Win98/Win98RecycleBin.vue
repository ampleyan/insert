<template>
  <div
    class="win98-recycle-bin win98-icon"
    :class="{ 'drag-over': isDragOver }"
    :style="iconStyle"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="icon-image-container" :style="containerStyle">
      <img :src="trashIcon" alt="Recycle Bin" class="icon-image" :style="imageStyle" />
    </div>
    <span class="icon-label">Recycle Bin</span>
  </div>
</template>

<script>
import { getWin98AssetPath } from '../../constants/win98';

export default {
  name: 'Win98RecycleBin',
  props: {
    hasItems: {
      type: Boolean,
      default: false,
    },
    iconScale: {
      type: Number,
      default: 3,
    },
    zoomScale: {
      type: Number,
      default: 1.8,
    },
  },
  emits: ['dragover', 'dragleave', 'drop'],
  data() {
    return {
      isDragOver: false,
    };
  },
  computed: {
    trashIcon() {
      return this.hasItems
        ? getWin98AssetPath('win98/assets/insert_trash.png')
        : getWin98AssetPath('win98/assets/insert_trash_empty.png');
    },
    iconStyle() {
      return {
        width: (60 * this.iconScale) + 'px',
        '--zoom-scale': this.zoomScale,
      };
    },
    containerStyle() {
      return {
        width: (48 * this.iconScale) + 'px',
        height: (48 * this.iconScale) + 'px',
      };
    },
    imageStyle() {
      return {
        width: (48 * this.iconScale) + 'px',
        height: (48 * this.iconScale) + 'px',
      };
    },
  },
  methods: {
    onDragOver(e) {
      this.isDragOver = true;
      this.$emit('dragover', e);
    },
    onDragLeave(e) {
      this.isDragOver = false;
      this.$emit('dragleave', e);
    },
    onDrop(e) {
      this.isDragOver = false;
      this.$emit('drop', e);
    },
  },
};
</script>

<style scoped>
.win98-recycle-bin {
  position: absolute !important;
  bottom: 40px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease, background 0.15s ease;
}

.win98-recycle-bin:hover {
  transform: scale(var(--zoom-scale, 1.8));
  z-index: 100;
}

.win98-recycle-bin.drag-over {
  background: rgba(255, 0, 0, 0.3);
  transform: scale(1.2);
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
}
</style>
