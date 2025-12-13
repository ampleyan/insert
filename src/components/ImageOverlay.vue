<template>
  <div class="image-overlay-container">
    <div
      v-for="(image, index) in images"
      :key="`image-${index}`"
      v-show="image.visible !== false"
      class="image-overlay"
      :class="[
        { draggable: dragMode },
        getAnimationClass(image)
      ]"
      :style="[getImageStyle(image, index), getAnimationStyle(image)]"
      @mousedown="handleMouseDown($event, index)"
      @touchstart="handleTouchStart($event, index)"
    >
      <img
        :src="image.src"
        :alt="image.name || `Image ${index + 1}`"
        :style="getImageTransform(image)"
        draggable="false"
      />
      <div v-if="dragMode" class="image-controls">
        <span class="drag-handle">⋮⋮</span>
        <span class="rotate-handle" @mousedown.stop="handleRotateStart($event, index)">↻</span>
        <span class="scale-handle" @mousedown.stop="handleScaleStart($event, index)">◢</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ImageOverlay',
  props: {
    images: {
      type: Array,
      default: () => []
    },
    dragMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const dragging = ref({
      active: false,
      index: -1,
      startX: 0,
      startY: 0,
      startPosX: 0,
      startPosY: 0
    });

    const rotating = ref({
      active: false,
      index: -1,
      startAngle: 0,
      startRotation: 0,
      centerX: 0,
      centerY: 0
    });

    const scaling = ref({
      active: false,
      index: -1,
      startX: 0,
      startY: 0,
      startScale: 1
    });

    const handleMouseDown = (event, index) => {
      if (!props.dragMode) return;
      event.preventDefault();

      dragging.value = {
        active: true,
        index,
        startX: event.clientX,
        startY: event.clientY,
        startPosX: props.images[index].x || 0,
        startPosY: props.images[index].y || 0
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (event, index) => {
      if (!props.dragMode) return;
      const touch = event.touches[0];

      dragging.value = {
        active: true,
        index,
        startX: touch.clientX,
        startY: touch.clientY,
        startPosX: props.images[index].x || 0,
        startPosY: props.images[index].y || 0
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    const handleMouseMove = (event) => {
      if (!dragging.value.active) return;

      const deltaX = event.clientX - dragging.value.startX;
      const deltaY = event.clientY - dragging.value.startY;

      const newImages = [...props.images];
      newImages[dragging.value.index] = {
        ...newImages[dragging.value.index],
        x: dragging.value.startPosX + deltaX,
        y: dragging.value.startPosY + deltaY
      };

      emit('update', { imageOverlays: newImages });
    };

    const handleTouchMove = (event) => {
      if (!dragging.value.active) return;
      const touch = event.touches[0];

      const deltaX = touch.clientX - dragging.value.startX;
      const deltaY = touch.clientY - dragging.value.startY;

      const newImages = [...props.images];
      newImages[dragging.value.index] = {
        ...newImages[dragging.value.index],
        x: dragging.value.startPosX + deltaX,
        y: dragging.value.startPosY + deltaY
      };

      emit('update', { imageOverlays: newImages });
    };

    const handleMouseUp = () => {
      dragging.value.active = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchEnd = () => {
      dragging.value.active = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleRotateStart = (event, index) => {
      event.preventDefault();
      const rect = event.target.closest('.image-overlay').getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);

      rotating.value = {
        active: true,
        index,
        startAngle,
        startRotation: props.images[index].rotation || 0,
        centerX,
        centerY
      };

      document.addEventListener('mousemove', handleRotateMove);
      document.addEventListener('mouseup', handleRotateEnd);
    };

    const handleRotateMove = (event) => {
      if (!rotating.value.active) return;

      const currentAngle = Math.atan2(
        event.clientY - rotating.value.centerY,
        event.clientX - rotating.value.centerX
      ) * (180 / Math.PI);

      const angleDiff = currentAngle - rotating.value.startAngle;
      const newRotation = rotating.value.startRotation + angleDiff;

      const newImages = [...props.images];
      newImages[rotating.value.index] = {
        ...newImages[rotating.value.index],
        rotation: newRotation
      };

      emit('update', { imageOverlays: newImages });
    };

    const handleRotateEnd = () => {
      rotating.value.active = false;
      document.removeEventListener('mousemove', handleRotateMove);
      document.removeEventListener('mouseup', handleRotateEnd);
    };

    const handleScaleStart = (event, index) => {
      event.preventDefault();

      scaling.value = {
        active: true,
        index,
        startX: event.clientX,
        startY: event.clientY,
        startScale: props.images[index].scale || 1
      };

      document.addEventListener('mousemove', handleScaleMove);
      document.addEventListener('mouseup', handleScaleEnd);
    };

    const handleScaleMove = (event) => {
      if (!scaling.value.active) return;

      const deltaX = event.clientX - scaling.value.startX;
      const deltaY = event.clientY - scaling.value.startY;
      const delta = (deltaX + deltaY) / 200;

      const newScale = Math.max(0.1, Math.min(5, scaling.value.startScale + delta));

      const newImages = [...props.images];
      newImages[scaling.value.index] = {
        ...newImages[scaling.value.index],
        scale: newScale
      };

      emit('update', { imageOverlays: newImages });
    };

    const handleScaleEnd = () => {
      scaling.value.active = false;
      document.removeEventListener('mousemove', handleScaleMove);
      document.removeEventListener('mouseup', handleScaleEnd);
    };

    const getImageStyle = (image, index) => {
      const blendMode = image.blendMode || 'normal';
      const style = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${image.x || 0}px), calc(-50% + ${image.y || 0}px))`,
        zIndex: image.zIndex || index + 10,
        pointerEvents: props.dragMode ? 'auto' : 'none',
        mixBlendMode: blendMode
      };

      if (props.dragMode) {
        if (dragging.value.active && dragging.value.index === index) {
          style.cursor = 'grabbing';
        } else {
          style.cursor = 'grab';
        }
      }

      return style;
    };

    const getImageTransform = (image) => {
      const rotation = image.rotation || 0;
      const scale = image.scale || 1;
      const opacity = (image.opacity !== undefined ? image.opacity : 100) / 100;
      const hue = image.hue || 0;

      return {
        transform: `rotate(${rotation}deg) scale(${scale})`,
        opacity,
        filter: `hue-rotate(${hue}deg)`,
        maxWidth: '300px',
        maxHeight: '300px',
        objectFit: 'contain'
      };
    };

    const getAnimationClass = (image) => {
      const animation = image.animation;
      if (!animation || animation.preset === 'none') {
        return '';
      }
      return `text-animation-${animation.preset}`;
    };

    const getAnimationStyle = (image) => {
      const animation = image.animation;
      if (!animation || animation.preset === 'none') {
        return {};
      }

      const iterationCount = animation.loop ? 'infinite' : '1';

      return {
        '--animation-duration': `${animation.duration || 1000}ms`,
        '--animation-delay': `${animation.delay || 0}ms`,
        '--animation-iteration': iterationCount,
        '--animation-timing': 'ease-out',
      };
    };

    return {
      dragging,
      rotating,
      scaling,
      handleMouseDown,
      handleTouchStart,
      handleRotateStart,
      handleScaleStart,
      getImageStyle,
      getImageTransform,
      getAnimationClass,
      getAnimationStyle
    };
  }
};
</script>

<style scoped>
.image-overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.image-overlay {
  position: absolute;
  user-select: none;
  transition: outline 0.2s;
}

.image-overlay.draggable:hover {
  outline: 2px dashed rgba(255, 255, 255, 0.3);
  outline-offset: 10px;
}

.image-overlay img {
  display: block;
  will-change: transform;
}

.image-controls {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: all;
}

.image-overlay.draggable:hover .image-controls {
  opacity: 1;
}

.drag-handle,
.rotate-handle,
.scale-handle {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  pointer-events: all;
}

.drag-handle {
  cursor: grab;
  pointer-events: none;
}

.rotate-handle {
  cursor: crosshair;
}

.scale-handle {
  cursor: nwse-resize;
}
</style>
