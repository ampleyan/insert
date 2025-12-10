import {
  calculateLetterPositions,
  getLetterStyle,
  splitTextIntoLetters,
} from '@/utils/textPathUtils';

export default {
  data() {
    return {
      containerWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
      containerHeight: typeof window !== 'undefined' ? window.innerHeight : 1080,
      letterPositions: {},
    };
  },
  mounted() {
    this.updateContainerDimensions();
    this.calculateAllPaths();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    'settings.textPaths': {
      handler() {
        this.calculateAllPaths();
      },
      deep: true,
    },
    'settings.textLines': {
      handler() {
        this.calculateAllPaths();
      },
      deep: true,
    },
  },
  methods: {
    updateContainerDimensions() {
      if (typeof window !== 'undefined') {
        this.containerWidth = window.innerWidth;
        this.containerHeight = window.innerHeight;
      }
    },
    handleResize() {
      this.updateContainerDimensions();
      this.calculateAllPaths();
    },
    calculateAllPaths() {
      const newPositions = {};
      const textPaths = this.settings.textPaths || [];

      this.settings.textLines.forEach((text, lineIndex) => {
        const pathConfig = textPaths[lineIndex];
        if (pathConfig && pathConfig.enabled) {
          const positions = calculateLetterPositions(
            text,
            pathConfig,
            this.containerWidth,
            this.containerHeight
          );
          newPositions[lineIndex] = positions;
        } else {
          newPositions[lineIndex] = null;
        }
      });

      this.letterPositions = newPositions;
    },
    getLettersForLine(lineIndex) {
      const text = this.settings.textLines[lineIndex] || '';
      return splitTextIntoLetters(text);
    },
    getLetterPositionStyle(lineIndex, letterIndex, baseStyle = {}) {
      const positions = this.letterPositions[lineIndex];
      if (!positions || !positions[letterIndex]) {
        return baseStyle;
      }
      return getLetterStyle(positions[letterIndex], baseStyle);
    },
    isPathEnabled(lineIndex) {
      const textPaths = this.settings.textPaths || [];
      const pathConfig = textPaths[lineIndex];
      return pathConfig && pathConfig.enabled && pathConfig.type !== 'none';
    },
  },
};
