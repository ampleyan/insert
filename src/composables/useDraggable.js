import { ref, onMounted, onBeforeUnmount } from 'vue';
import { debounce } from 'lodash-es';

export function useDraggable(emit) {
  const dragging = ref({
    active: false,
    index: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const updatePositionDebounced = debounce((margins, marginTops) => {
    emit('update', {
      margin: margins,
      marginTop: marginTops,
    });
  }, 16);

  const startDrag = (event, index, currentMargins, currentMarginTops) => {
    const e = event.touches ? event.touches[0] : event;

    dragging.value = {
      active: true,
      index,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: currentMargins[index] || 0,
      offsetY: currentMarginTops[index] || 0,
    };

    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const onDrag = (event, currentMargins, currentMarginTops, snapToGrid = false) => {
    if (!dragging.value.active) return;

    event.preventDefault();
    const e = event.touches ? event.touches[0] : event;

    const deltaX = e.clientX - dragging.value.startX;
    const deltaY = e.clientY - dragging.value.startY;

    let newX = dragging.value.offsetX + deltaX;
    let newY = dragging.value.offsetY + deltaY;

    if (snapToGrid) {
      const gridSize = event.shiftKey ? 10 : 5;
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    const newMargins = currentMargins.map((v, i) => (i === dragging.value.index ? newX : v));
    const newMarginTops = currentMarginTops.map((v, i) => (i === dragging.value.index ? newY : v));

    updatePositionDebounced(newMargins, newMarginTops);
  };

  const stopDrag = () => {
    if (dragging.value.active) {
      dragging.value.active = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (event, currentMargins, currentMarginTops, snapToGrid) => {
    onDrag(event, currentMargins, currentMarginTops, snapToGrid);
  };

  const handleMouseUp = () => {
    stopDrag();
  };

  onMounted(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchend', handleMouseUp);
  });

  return {
    dragging,
    startDrag,
    onDrag: handleMouseMove,
    stopDrag,
  };
}
