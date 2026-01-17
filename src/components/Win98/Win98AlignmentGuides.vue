<template>
  <div v-if="guides.length > 0" class="alignment-guides">
    <div
      v-for="(guide, index) in guides"
      :key="index"
      class="guide"
      :class="guide.type"
      :style="getGuideStyle(guide)"
    />
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';
import { WIN98_FORMATS } from '../../constants/win98';

export default {
  name: 'Win98AlignmentGuides',
  props: {
    draggingIcon: String,
    dragPosition: Object,
    iconPositions: Object,
    iconSizes: Object,
    defaultIconScale: Number,
  },
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
    alignmentSettings() {
      return this.win98.alignmentGuides || {};
    },
    enabled() {
      return this.alignmentSettings.enabled !== false;
    },
    threshold() {
      return this.alignmentSettings.threshold || 5;
    },
    formatHeight() {
      const format = WIN98_FORMATS[this.win98.format] || WIN98_FORMATS.portrait;
      return format.height - 36;
    },
    formatWidth() {
      const format = WIN98_FORMATS[this.win98.format] || WIN98_FORMATS.portrait;
      return format.width;
    },
    guides() {
      if (!this.enabled || !this.draggingIcon || !this.dragPosition) return [];

      const guides = [];
      const dragIconScale = (this.iconSizes?.[this.draggingIcon] || this.defaultIconScale) || 3;
      const dragWidth = 60 * dragIconScale;
      const dragHeight = 80 * dragIconScale;
      const dragLeft = this.dragPosition.x;
      const dragRight = dragLeft + dragWidth;
      const dragTop = this.dragPosition.y;
      const dragBottom = dragTop + dragHeight;
      const dragCenterX = dragLeft + dragWidth / 2;
      const dragCenterY = dragTop + dragHeight / 2;

      Object.keys(this.iconPositions || {}).forEach(iconId => {
        if (iconId === this.draggingIcon) return;

        const pos = this.iconPositions[iconId];
        const scale = (this.iconSizes?.[iconId] || this.defaultIconScale) || 3;
        const width = 60 * scale;
        const height = 80 * scale;
        const left = pos.x;
        const right = left + width;
        const top = pos.y;
        const bottom = top + height;
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        if (this.alignmentSettings.showEdges !== false) {
          if (Math.abs(dragLeft - left) <= this.threshold) {
            guides.push({ type: 'vertical', x: left, y1: Math.min(dragTop, top), y2: Math.max(dragBottom, bottom) });
          }
          if (Math.abs(dragRight - right) <= this.threshold) {
            guides.push({ type: 'vertical', x: right, y1: Math.min(dragTop, top), y2: Math.max(dragBottom, bottom) });
          }
          if (Math.abs(dragLeft - right) <= this.threshold) {
            guides.push({ type: 'vertical', x: right, y1: Math.min(dragTop, top), y2: Math.max(dragBottom, bottom) });
          }
          if (Math.abs(dragRight - left) <= this.threshold) {
            guides.push({ type: 'vertical', x: left, y1: Math.min(dragTop, top), y2: Math.max(dragBottom, bottom) });
          }
          if (Math.abs(dragTop - top) <= this.threshold) {
            guides.push({ type: 'horizontal', y: top, x1: Math.min(dragLeft, left), x2: Math.max(dragRight, right) });
          }
          if (Math.abs(dragBottom - bottom) <= this.threshold) {
            guides.push({ type: 'horizontal', y: bottom, x1: Math.min(dragLeft, left), x2: Math.max(dragRight, right) });
          }
          if (Math.abs(dragTop - bottom) <= this.threshold) {
            guides.push({ type: 'horizontal', y: bottom, x1: Math.min(dragLeft, left), x2: Math.max(dragRight, right) });
          }
          if (Math.abs(dragBottom - top) <= this.threshold) {
            guides.push({ type: 'horizontal', y: top, x1: Math.min(dragLeft, left), x2: Math.max(dragRight, right) });
          }
        }

        if (this.alignmentSettings.showCenters !== false) {
          if (Math.abs(dragCenterX - centerX) <= this.threshold) {
            guides.push({ type: 'vertical center', x: centerX, y1: Math.min(dragTop, top), y2: Math.max(dragBottom, bottom) });
          }
          if (Math.abs(dragCenterY - centerY) <= this.threshold) {
            guides.push({ type: 'horizontal center', y: centerY, x1: Math.min(dragLeft, left), x2: Math.max(dragRight, right) });
          }
        }
      });

      return guides;
    },
  },
  methods: {
    getGuideStyle(guide) {
      if (guide.type.includes('vertical')) {
        return {
          left: guide.x + 'px',
          top: guide.y1 + 'px',
          height: (guide.y2 - guide.y1) + 'px',
          width: '1px',
        };
      } else {
        return {
          top: guide.y + 'px',
          left: guide.x1 + 'px',
          width: (guide.x2 - guide.x1) + 'px',
          height: '1px',
        };
      }
    },
  },
};
</script>

<style scoped>
.alignment-guides {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 28px;
  pointer-events: none;
  z-index: 50;
}

.guide {
  position: absolute;
  background: rgba(255, 0, 255, 0.8);
}

.guide.center {
  background: rgba(0, 255, 255, 0.8);
}
</style>
