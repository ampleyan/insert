import { useDraggable } from '@/composables/useDraggable';
import { useResizable } from '@/composables/useResizable';

export default {
  emits: ['update'],
  setup(props, { emit }) {
    const { dragging, startDrag, onDrag } = useDraggable(emit);
    const { resizing, startResize, onResize } = useResizable(emit);

    return {
      dragging,
      startDrag,
      onDrag,
      resizing,
      startResize,
      onResize,
    };
  },
  methods: {
    handleMouseDown(event, index) {
      if (!this.settings.dragMode) return;
      this.startDrag(event, index, this.settings.margin, this.settings.marginTop);
    },

    handleTouchStart(event, index) {
      if (!this.settings.dragMode) return;
      this.startDrag(event, index, this.settings.margin, this.settings.marginTop);
    },

    handleResizeStart(event, index) {
      if (!this.settings.dragMode) return;
      this.startResize(event, index, this.settings.fontSize);
    },

    handleMouseMove(event) {
      if (!this.settings.dragMode) return;
      if (this.resizing.active) {
        this.onResize(event, this.settings.fontSize);
      } else {
        this.onDrag(event, this.settings.margin, this.settings.marginTop, true);
      }
    },

    handleTouchMove(event) {
      if (!this.settings.dragMode) return;
      if (this.resizing.active) {
        this.onResize(event, this.settings.fontSize);
      } else {
        this.onDrag(event, this.settings.margin, this.settings.marginTop, true);
      }
    },

    getDraggableStyle(index) {
      if (this.settings.dragMode) {
        let cursor = 'grab';
        if (this.dragging.active && this.dragging.index === index) {
          cursor = 'grabbing';
        } else if (this.resizing.active && this.resizing.index === index) {
          cursor = 'nwse-resize';
        }

        return {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${this.settings.margin[index]}px), calc(-50% + ${
            this.settings.marginTop[index]
          }px))`,
          cursor,
          userSelect: 'none',
        };
      } else {
        return {
          marginRight: `${this.settings.margin?.[index] || 0}px`,
          marginTop: `${this.settings.marginTop?.[index] || 0}px`,
        };
      }
    },
  },
};
