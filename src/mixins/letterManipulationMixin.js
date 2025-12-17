export default {
  data() {
    return {
      selectedLetter: { lineIndex: null, letterIndex: null },
      manipulating: { active: false, type: null, startX: 0, startY: 0, startValue: 0 },
      keyboardManipulation: { pending: false, type: null },
    };
  },

  computed: {
    keyboardModeLabel() {
      if (this.keyboardManipulation.pending) {
        const labels = {
          scale: 'Scale Mode (move mouse)',
          rotate: 'Rotate Mode (move mouse)',
          skewX: 'Skew X Mode (move mouse)',
          skewY: 'Skew Y Mode (move mouse)',
        };
        return labels[this.keyboardManipulation.type] || '';
      }
      return '';
    },
  },

  mounted() {
    window.addEventListener('mouseup', this.stopManipulation);
    window.addEventListener('touchend', this.stopManipulation);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('mousemove', this.handleMouseMoveForKeyboard);
  },

  beforeUnmount() {
    window.removeEventListener('mouseup', this.stopManipulation);
    window.removeEventListener('touchend', this.stopManipulation);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('mousemove', this.handleMouseMoveForKeyboard);
  },

  methods: {
    selectLetter(lineIndex, letterIndex) {
      this.selectedLetter = { lineIndex, letterIndex };
    },

    deselectLetter() {
      this.selectedLetter = { lineIndex: null, letterIndex: null };
    },

    isLetterSelected(lineIndex, letterIndex) {
      return (
        this.selectedLetter.lineIndex === lineIndex &&
        this.selectedLetter.letterIndex === letterIndex
      );
    },

    handleLetterClick(lineIndex, letterIndex) {
      if (!this.settings.letterEditMode) return;
      if (this.isLetterSelected(lineIndex, letterIndex)) {
        this.deselectLetter();
      } else {
        this.selectLetter(lineIndex, letterIndex);
      }
    },

    startManipulation(event, type, currentValue) {
      event.stopPropagation();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      this.manipulating = {
        active: true,
        type,
        startX: clientX,
        startY: clientY,
        startValue: currentValue,
      };
    },

    onManipulate(event, letterTransforms) {
      if (!this.manipulating.active || this.selectedLetter.lineIndex === null) return;

      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      const { lineIndex, letterIndex } = this.selectedLetter;
      const { type, startX, startY, startValue } = this.manipulating;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      const transforms = letterTransforms[lineIndex] || {};
      const currentTransform = transforms[letterIndex] || {
        scale: 1,
        rotate: 0,
        skewX: 0,
        skewY: 0,
      };

      let newValue = startValue;

      switch (type) {
        case 'scale':
          newValue = Math.max(0.1, startValue + deltaY * -0.01);
          currentTransform.scale = newValue;
          break;
        case 'rotate':
          newValue = startValue + deltaX * 0.5;
          currentTransform.rotate = newValue;
          break;
        case 'skewX':
          newValue = startValue + deltaX * 0.2;
          currentTransform.skewX = Math.max(-45, Math.min(45, newValue));
          break;
        case 'skewY':
          newValue = startValue + deltaY * 0.2;
          currentTransform.skewY = Math.max(-45, Math.min(45, newValue));
          break;
      }

      const newTransforms = [...letterTransforms];
      if (!newTransforms[lineIndex]) {
        newTransforms[lineIndex] = {};
      }
      newTransforms[lineIndex][letterIndex] = currentTransform;

      this.$emit('update', { letterTransforms: newTransforms });
    },

    stopManipulation() {
      this.manipulating = { active: false, type: null, startX: 0, startY: 0, startValue: 0 };
    },

    handleManipulationStart(event, type, lineIndex, letterIndex) {
      const letterTransforms = this.settings.letterTransforms || [{}, {}, {}];
      const letterTransform = letterTransforms[lineIndex]?.[letterIndex] || {
        scale: 1,
        rotate: 0,
        skewX: 0,
        skewY: 0,
      };
      this.startManipulation(event, type, letterTransform[type]);
    },

    getLetterTransform(lineIndex, letterIndex) {
      const letterTransforms = this.settings.letterTransforms || [{}, {}, {}];
      return letterTransforms[lineIndex]?.[letterIndex] || {
        scale: 1,
        rotate: 0,
        skewX: 0,
        skewY: 0,
      };
    },

    applyLetterTransform(baseStyle, lineIndex, letterIndex) {
      const letterTransform = this.getLetterTransform(lineIndex, letterIndex);
      const scaleX = this.settings.scaleX?.[lineIndex] || 1;
      const scaleY = this.settings.scaleY?.[lineIndex] || 1;
      const finalScale = scaleX * scaleY * letterTransform.scale;

      return {
        ...baseStyle,
        transform: `scale(${finalScale}) rotate(${letterTransform.rotate}deg) skew(${letterTransform.skewX}deg, ${letterTransform.skewY}deg)`,
        '--letter-scale': finalScale,
        '--letter-rotate': `${letterTransform.rotate}deg`,
        '--letter-skew-x': `${letterTransform.skewX}deg`,
        '--letter-skew-y': `${letterTransform.skewY}deg`,
        position: 'relative',
      };
    },

    onMouseMoveWithManipulation(event) {
      if (this.manipulating.active) {
        this.onManipulate(event, this.settings.letterTransforms || [{}, {}, {}]);
      }
    },

    onTouchMoveWithManipulation(event) {
      if (this.manipulating.active) {
        this.onManipulate(event, this.settings.letterTransforms || [{}, {}, {}]);
      }
    },

    handleKeyDown(event) {
      if (this.selectedLetter.lineIndex === null) return;

      if (event.key === 'Escape') {
        if (this.manipulating.active) {
          this.stopManipulation();
        } else {
          this.deselectLetter();
        }
        this.keyboardManipulation = { pending: false, type: null };
        return;
      }

      if (!event.ctrlKey && !event.metaKey) return;

      let manipulationType = null;

      switch (event.key.toLowerCase()) {
        case 's':
          manipulationType = 'scale';
          break;
        case 'r':
          manipulationType = 'rotate';
          break;
        case 'x':
          manipulationType = 'skewX';
          break;
        case 'y':
          manipulationType = 'skewY';
          break;
        default:
          return;
      }

      event.preventDefault();

      this.keyboardManipulation = { pending: true, type: manipulationType };
    },

    handleMouseMoveForKeyboard(event) {
      if (!this.keyboardManipulation.pending) return;

      const { lineIndex, letterIndex } = this.selectedLetter;
      const manipulationType = this.keyboardManipulation.type;

      if (lineIndex === null || !manipulationType) return;

      const letterTransforms = this.settings.letterTransforms || [{}, {}, {}];
      const letterTransform = letterTransforms[lineIndex]?.[letterIndex] || {
        scale: 1,
        rotate: 0,
        skewX: 0,
        skewY: 0,
      };

      const fakeEvent = {
        clientX: event.clientX,
        clientY: event.clientY,
        stopPropagation: () => {},
      };

      this.startManipulation(fakeEvent, manipulationType, letterTransform[manipulationType]);
      this.keyboardManipulation = { pending: false, type: null };
    },
  },
};
