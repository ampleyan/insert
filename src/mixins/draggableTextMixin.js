import { debounce } from 'lodash-es';

export default {
  emits: ['update'],
  data() {
    return {
      dragging: {
        active: false,
        index: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
      },
      resizing: {
        active: false,
        index: null,
        axis: null, // 'x' | 'y'
        startX: 0,
        startY: 0,
        initialSize: 0,
      },
      inlineEditor: {
        visible: false,
        lineIndex: null,
        position: { x: 0, y: 0 },
      },
    };
  },
  methods: {
    updatePositionDebounced: debounce(function (margins, marginTops) {
      this.$emit('update', {
        margin: margins,
        marginTop: marginTops,
      });
    }, 16),

    updateSizeDebounced: debounce(function (fontSizes) {
      this.$emit('update', {
        fontSize: fontSizes,
      });
    }, 16),

    startDrag(event, index, currentMargins, currentMarginTops) {
      const e = event.touches ? event.touches[0] : event;

      this.dragging = {
        active: true,
        index,
        startX: e.clientX,
        startY: e.clientY,
        offsetX: currentMargins[index] || 0,
        offsetY: currentMarginTops[index] || 0,
      };

      console.log('[Drag] Drag started:', this.dragging);

      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    },

    onDrag(event, currentMargins, currentMarginTops, snapToGrid = false) {
      if (!this.dragging.active) {
        console.log('[Drag] onDrag called but dragging not active');
        return;
      }

      event.preventDefault();
      const e = event.touches ? event.touches[0] : event;

      const deltaX = e.clientX - this.dragging.startX;
      const deltaY = e.clientY - this.dragging.startY;

      let newX = this.dragging.offsetX + deltaX;
      let newY = this.dragging.offsetY + deltaY;

      if (snapToGrid) {
        const gridSize = event.shiftKey ? 10 : 5;
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }

      const newMargins = currentMargins.map((v, i) => (i === this.dragging.index ? newX : v));
      const newMarginTops = currentMarginTops.map((v, i) => (i === this.dragging.index ? newY : v));

      console.log('[Drag] Position update:', { newX, newY, deltaX, deltaY });

      this.updatePositionDebounced(newMargins, newMarginTops);
    },

    stopDrag() {
      if (this.dragging.active) {
        this.dragging.active = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    },

    startResize(event, index, currentFontSizes, axis) {
      event.stopPropagation();
      const e = event.touches ? event.touches[0] : event;

      this.resizing = {
        active: true,
        index,
            axis,

        startX: e.clientX,
        startY: e.clientY,
        initialSize: currentFontSizes[index] || 120,
      };

        document.body.style.cursor =
    axis === 'x' ? 'ew-resize' :
    axis === 'y' ? 'ns-resize' :
    'nwse-resize';
      document.body.style.userSelect = 'none';
    },

    onResize(event, currentFontSizes) {
      if (!this.resizing.active) return;

      event.preventDefault();
      const e = event.touches ? event.touches[0] : event;

      const deltaX = e.clientX - this.resizing.startX;
      const deltaY = e.clientY - this.resizing.startY;

        let delta = 0;

  if (this.resizing.axis === 'x') {
    delta = deltaX;
  } else if (this.resizing.axis === 'y') {
    delta = deltaY;
  } else {
    delta = (deltaX + deltaY) / 2;
  }

      let newSize = this.resizing.initialSize + delta;
      newSize = Math.max(12, Math.min(300, newSize));

      const newFontSizes = currentFontSizes.map((v, i) =>
        i === this.resizing.index ? Math.round(newSize) : v
      );

      this.updateSizeDebounced(newFontSizes);
    },

    stopResize() {
      if (this.resizing.active) {
        this.resizing.active = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    },

    handleMouseDown(event, index) {
      console.log('[Drag] handleMouseDown called', {
        index,
        dragMode: this.settings.dragMode,
        target: event.target.className
      });
      if (!this.settings.dragMode) {
        console.log('[Drag] Blocked: dragMode is disabled');
        return;
      }
      console.log('[Drag] Starting drag...', {
        margins: this.settings.margin,
        marginTops: this.settings.marginTop
      });
      this.startDrag(event, index, this.settings.margin, this.settings.marginTop);
    },

    handleTouchStart(event, index) {
      console.log('[Drag] handleTouchStart called', { index, dragMode: this.settings.dragMode });
      if (!this.settings.dragMode) return;
      this.startDrag(event, index, this.settings.margin, this.settings.marginTop);
    },

    handleResizeStart(event, index, axis='xy') {
      console.log('[Resize] handleResizeStart called', {
        index,
        dragMode: this.settings.dragMode,
        target: event.target.className
      });
      if (!this.settings.dragMode) {
        console.log('[Resize] Blocked: dragMode is disabled');
        return;
      }
      console.log('[Resize] Starting resize...', {
        fontSizes: this.settings.fontSize
      });
      this.startResize(event, index, this.settings.fontSize, axis);
    },

    handleMouseMove(event) {
      if (!this.settings.dragMode) return;
      if (this.resizing.active) {
        this.onResize(event, this.settings.fontSize);
      } else if (this.dragging.active) {
        this.onDrag(event, this.settings.margin, this.settings.marginTop, true);
      }
    },

    handleTouchMove(event) {
      if (!this.settings.dragMode) return;
      if (this.resizing.active) {
        this.onResize(event, this.settings.fontSize);
      } else if (this.dragging.active) {
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

    handleContextMenu(event, index) {
      console.log('[Context Menu] Right-click detected', {
        index,
        target: event.target.className,
        dragMode: this.settings.dragMode
      });
      event.preventDefault();
      event.stopPropagation();
      console.log('[Context Menu] Opening inline editor...');
      this.openInlineEditor(index, event);
    },

    openInlineEditor(index, event) {
      console.log('[Editor] openInlineEditor called', { index });
      const position = this.calculateEditorPosition(event);
      this.inlineEditor = {
        visible: true,
        lineIndex: index,
        position,
      };
      console.log('[Editor] Inline editor state:', this.inlineEditor);
    },

    closeInlineEditor() {
      this.inlineEditor.visible = false;
    },

    calculateEditorPosition(event) {
      const panelWidth = 320;
      const panelHeight = 320;
      let x = event.clientX + 10;
      let y = event.clientY + 10;

      if (x + panelWidth > window.innerWidth) {
        x = event.clientX - panelWidth - 10;
      }

      if (y + panelHeight > window.innerHeight) {
        y = window.innerHeight - panelHeight - 20;
      }

      return { x, y };
    },
  },

  mounted() {
    console.log('[Mixin] Component mounted - Adding global event listeners');
    console.log('[Mixin] Current settings:', {
      dragMode: this.settings?.dragMode,
      hasSettings: !!this.settings
    });
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('touchend', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove, { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    console.log('[Mixin] Event listeners added successfully');
  },

  beforeUnmount() {
    console.log('[Mixin] Component unmounting - Removing event listeners');
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('touchend', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('touchmove', this.handleTouchMove);
    this.stopDrag();
    this.stopResize();
  },

  created() {
    console.log('[Mixin] Component created - Initializing handleMouseUp');
    this.handleMouseUp = () => {
      console.log('[Drag] Mouse up detected');
      this.stopDrag();
      this.stopResize();
    };
  },
};
