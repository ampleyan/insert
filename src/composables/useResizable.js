import { ref, onMounted, onBeforeUnmount } from 'vue';
import { debounce } from 'lodash-es';

export function useResizable(emit) {
  const resizing = ref({
    active: false,
    index: null,
    startX: 0,
    startY: 0,
    initialSize: 0,
  });

  const updateSizeDebounced = debounce((fontSizes) => {
    emit('update', {
      fontSize: fontSizes,
    });
  }, 16);

  const startResize = (event, index, currentFontSizes) => {
    event.stopPropagation();
    const e = event.touches ? event.touches[0] : event;

    resizing.value = {
      active: true,
      index,
      startX: e.clientX,
      startY: e.clientY,
      initialSize: currentFontSizes[index] || 120,
    };

    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';
  };

  const onResize = (event, currentFontSizes) => {
    if (!resizing.value.active) return;

    event.preventDefault();
    const e = event.touches ? event.touches[0] : event;

    const deltaX = e.clientX - resizing.value.startX;
    const deltaY = e.clientY - resizing.value.startY;

    const delta = (deltaX + deltaY) / 2;

    let newSize = resizing.value.initialSize + delta;
    newSize = Math.max(12, Math.min(300, newSize));

    const newFontSizes = currentFontSizes.map((v, i) =>
      i === resizing.value.index ? Math.round(newSize) : v
    );

    updateSizeDebounced(newFontSizes);
  };

  const stopResize = () => {
    if (resizing.value.active) {
      resizing.value.active = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (event, currentFontSizes) => {
    onResize(event, currentFontSizes);
  };

  const handleMouseUp = () => {
    stopResize();
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
    resizing,
    startResize,
    onResize: handleMouseMove,
    stopResize,
  };
}
