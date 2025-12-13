<template>
  <div class="video-overlay-container">
    <div
      v-for="(video, index) in videos"
      :key="`video-${index}`"
      v-show="video.visible !== false"
      class="video-overlay"
      :class="[
        { draggable: dragMode },
        getAnimationClass(video)
      ]"
      :style="[getVideoStyle(video, index), getAnimationStyle(video)]"
      @mousedown="handleMouseDown($event, index)"
      @touchstart="handleTouchStart($event, index)"
    >
      <video
        :ref="el => videoRefs[index] = el"
        :src="video.src"
        :style="getVideoTransform(video)"
        :loop="video.loop || false"
        :muted="video.muted !== false"
        playsinline
        @loadedmetadata="handleVideoLoaded(index)"
      />
      <div v-if="dragMode" class="video-controls">
        <span class="drag-handle">⋮⋮</span>
        <span class="play-handle" @mousedown.stop="togglePlay(index)">{{ video.playing ? '⏸' : '▶' }}</span>
        <span class="rotate-handle" @mousedown.stop="handleRotateStart($event, index)">↻</span>
        <span class="scale-handle" @mousedown.stop="handleScaleStart($event, index)">◢</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'VideoOverlay',
  props: {
    videos: {
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
    const videoRefs = ref([]);

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
        startPosX: props.videos[index].x || 0,
        startPosY: props.videos[index].y || 0
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
        startPosX: props.videos[index].x || 0,
        startPosY: props.videos[index].y || 0
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    const handleMouseMove = (event) => {
      if (!dragging.value.active) return;

      const deltaX = event.clientX - dragging.value.startX;
      const deltaY = event.clientY - dragging.value.startY;

      const newVideos = [...props.videos];
      newVideos[dragging.value.index] = {
        ...newVideos[dragging.value.index],
        x: dragging.value.startPosX + deltaX,
        y: dragging.value.startPosY + deltaY
      };

      emit('update', { videoOverlays: newVideos });
    };

    const handleTouchMove = (event) => {
      if (!dragging.value.active) return;
      const touch = event.touches[0];

      const deltaX = touch.clientX - dragging.value.startX;
      const deltaY = touch.clientY - dragging.value.startY;

      const newVideos = [...props.videos];
      newVideos[dragging.value.index] = {
        ...newVideos[dragging.value.index],
        x: dragging.value.startPosX + deltaX,
        y: dragging.value.startPosY + deltaY
      };

      emit('update', { videoOverlays: newVideos });
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
      const rect = event.target.closest('.video-overlay').getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);

      rotating.value = {
        active: true,
        index,
        startAngle,
        startRotation: props.videos[index].rotation || 0,
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

      const newVideos = [...props.videos];
      newVideos[rotating.value.index] = {
        ...newVideos[rotating.value.index],
        rotation: newRotation
      };

      emit('update', { videoOverlays: newVideos });
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
        startScale: props.videos[index].scale || 1
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

      const newVideos = [...props.videos];
      newVideos[scaling.value.index] = {
        ...newVideos[scaling.value.index],
        scale: newScale
      };

      emit('update', { videoOverlays: newVideos });
    };

    const handleScaleEnd = () => {
      scaling.value.active = false;
      document.removeEventListener('mousemove', handleScaleMove);
      document.removeEventListener('mouseup', handleScaleEnd);
    };

    const togglePlay = (index) => {
      const video = videoRefs.value[index];
      if (!video) return;

      const newVideos = [...props.videos];
      if (video.paused) {
        video.play();
        newVideos[index] = { ...newVideos[index], playing: true };
      } else {
        video.pause();
        newVideos[index] = { ...newVideos[index], playing: false };
      }

      emit('update', { videoOverlays: newVideos });
    };

    const handleVideoLoaded = (index) => {
      const video = videoRefs.value[index];
      if (!video) return;

      if (props.videos[index].playing) {
        video.play();
      }
    };

    watch(() => props.videos, (newVideos) => {
      newVideos.forEach((video, index) => {
        const videoEl = videoRefs.value[index];
        if (!videoEl) return;

        if (video.playing && videoEl.paused) {
          videoEl.play();
        } else if (!video.playing && !videoEl.paused) {
          videoEl.pause();
        }

        if (video.playbackRate) {
          videoEl.playbackRate = video.playbackRate;
        }
      });
    }, { deep: true });

    const getVideoStyle = (video, index) => {
      const style = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${video.x || 0}px), calc(-50% + ${video.y || 0}px))`,
        zIndex: video.zIndex || index + 20,
        pointerEvents: props.dragMode ? 'auto' : 'none'
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

    const getVideoTransform = (video) => {
      const rotation = video.rotation || 0;
      const scale = video.scale || 1;
      const opacity = (video.opacity !== undefined ? video.opacity : 100) / 100;
      const hue = video.hue || 0;
      const blendMode = video.blendMode || 'normal';

      return {
        transform: `rotate(${rotation}deg) scale(${scale})`,
        opacity,
        filter: `hue-rotate(${hue}deg)`,
        mixBlendMode: blendMode,
        maxWidth: '400px',
        maxHeight: '400px',
        objectFit: 'contain'
      };
    };

    const getAnimationClass = (video) => {
      const animation = video.animation;
      if (!animation || animation.preset === 'none') {
        return '';
      }
      return `text-animation-${animation.preset}`;
    };

    const getAnimationStyle = (video) => {
      const animation = video.animation;
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
      videoRefs,
      dragging,
      rotating,
      scaling,
      handleMouseDown,
      handleTouchStart,
      handleRotateStart,
      handleScaleStart,
      togglePlay,
      handleVideoLoaded,
      getVideoStyle,
      getVideoTransform,
      getAnimationClass,
      getAnimationStyle
    };
  }
};
</script>

<style scoped>
.video-overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 6;
}

.video-overlay {
  position: absolute;
  user-select: none;
  transition: outline 0.2s;
}

.video-overlay.draggable:hover {
  outline: 2px dashed rgba(0, 255, 255, 0.3);
  outline-offset: 10px;
}

.video-overlay video {
  display: block;
  will-change: transform;
}

.video-controls {
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

.video-overlay.draggable:hover .video-controls {
  opacity: 1;
}

.drag-handle,
.play-handle,
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

.play-handle {
  cursor: pointer;
}

.rotate-handle {
  cursor: crosshair;
}

.scale-handle {
  cursor: nwse-resize;
}
</style>
