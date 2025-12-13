import { defineStore } from 'pinia';
import { debounce } from 'lodash-es';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    blendMode: 'difference',
    effectType: 'vibration',
    hue: 0,
    color: '#ffffff',
    opacity: 100,
    vibrateSpeed: 50,
    vibrateIntensity: 1,
    blurAmount: 2,
    intervalSpeed: 200,
    textLines: ['INSERT', "SUN'O3.08", 'BAR OOST'],
    fontSize: [120, 120, 120],
    fontFamily: ['Arial', 'Arial', 'Arial'],
    fontWeight: ['900', '900', '900'],
    fontStyle: ['normal', 'normal', 'normal'],
    margin: [0, 0, 0],
    marginTop: [0, 0, 0],
    letterSpacing: [0, 0, 0],
    globalRandomAmount: 50,
    randomAmount: [0, 0, 0],
    textVisible: [true, true, true],
    backdropBlur: 0,
    backdropBrightness: 100,
    backdropContrast: 100,
    backdropSaturate: 100,
    textTypes: [],
    dragMode: true,
    videoFormat: 'vertical',
    videoWidth: 1080,
    videoHeight: 1920,
    showFormatBoundary: true,
    fitToFormat: false,
    showGrid: false,
    gridSize: 50,
    gridColor: '#00ffff',
    gridOpacity: 0.3,
    showCenterGuides: true,
    showThirdsGuides: false,
    guideColor: '#ff00ff',
    guideOpacity: 0.5,
    snapToGrid: true,

    textPaths: [
      {
        enabled: false,
        type: 'none',
        curvature: 50,
        arcRadius: 300,
        arcStart: 0,
        arcSpan: 180,
        letterAlignment: 'baseline',
        waveAmplitude: 30,
        waveFrequency: 1,
        waveOffset: 0,
        letterRotation: true,
        circleRadius: 200,
        circlePosition: 'top',
        inwardFacing: false,
      },
      {
        enabled: false,
        type: 'none',
        curvature: 50,
        arcRadius: 300,
        arcStart: 0,
        arcSpan: 180,
        letterAlignment: 'baseline',
        waveAmplitude: 30,
        waveFrequency: 1,
        waveOffset: 0,
        letterRotation: true,
        circleRadius: 200,
        circlePosition: 'top',
        inwardFacing: false,
      },
      {
        enabled: false,
        type: 'none',
        curvature: 50,
        arcRadius: 300,
        arcStart: 0,
        arcSpan: 180,
        letterAlignment: 'baseline',
        waveAmplitude: 30,
        waveFrequency: 1,
        waveOffset: 0,
        letterRotation: true,
        circleRadius: 200,
        circlePosition: 'top',
        inwardFacing: false,
      },
    ],

    textAnimations: [
      {
        preset: 'none',
        duration: 1000,
        delay: 0,
        loop: false,
      },
      {
        preset: 'none',
        duration: 1000,
        delay: 0,
        loop: false,
      },
      {
        preset: 'none',
        duration: 1000,
        delay: 0,
        loop: false,
      },
    ],

    imageOverlays: [],

    vibration: {
      jitterMode: 'random',
      damping: 0.8,
      shakeAxis: 'both',
    },
    glitch: {
      glitchIntensity: 10,
      glitchSpeed: 500,
      colorSeparation: 5,
      scanlineFrequency: 3,
      glitchType: 'digital',
    },
    wave: {
      waveAmplitude: 20,
      waveFrequency: 1,
      waveSpeed: 2,
      waveDirection: 'vertical',
      wavePhase: 0,
    },
    particle: {
      particleCount: 50,
      burstSpeed: 2,
      particleSize: 3,
      gravity: 0.5,
      particleLife: 2000,
      autoTrigger: false,
    },
    rotation3d: {
      rotationSpeed: 2,
      rotationAxis: 'all',
      perspective: 800,
      tiltAngle: 45,
      rotationMode: 'continuous',
    },
    neon: {
      glowBlur: 20,
      glowIntensity: 80,
      glowColor: '#00ffff',
      glowLayers: 3,
      pulseSpeed: 2000,
      flickerAmount: 10,
    },
    liquid: {
      turbulenceScale: 30,
      baseFrequency: 0.02,
      flowSpeed: 1,
      viscosity: 'medium',
      distortionType: 'goo',
    },
    typewriter: {
      typingSpeed: 100,
      cursorBlink: true,
      cursorStyle: 'line',
      deleteSpeed: 50,
      loopMode: 'loop',
      initialDelay: 500,
    },
    chromatic: {
      aberrationDistance: 8,
      aberrationAngle: 0,
      redOffset: 5,
      blueOffset: 5,
      aberrationMode: 'static',
    },
    goo: {
      turbulenceIntensity: 30,
      noiseScale: 0.02,
      morphSpeed: 1,
      gooAmount: 20,
    },
    split: {
      splitDistance: 50,
      splitSpeed: 800,
      splitDirection: 'horizontal',
      rotationAmount: 15,
      splitMode: 'all-at-once',
    },
    wavy: {
      waveHeight: 20,
      wavelength: 1,
      waveSpeed: 2,
      waveDelay: 50,
    },
    flicker: {
      flickerSpeed: 200,
      flickerIntensity: 40,
      flickerPattern: 'random',
      minOpacity: 30,
      maxOpacity: 100,
    },
    stroke: {
      strokeWidth: 2,
      strokeColor: '#ffffff',
      fillOpacity: 100,
      strokeDash: 0,
      strokeAnimate: false,
    },
    gradient: {
      gradientAngle: 45,
      gradientColor1: '#ff0080',
      gradientColor2: '#7928ca',
      gradientColor3: '#0070f3',
      gradientAnimate: true,
      gradientSpeed: 3000,
    },
    scanlines: {
      scanlineIntensity: 50,
      scanlineCount: 200,
      vhsNoise: 30,
      chromaticShift: 3,
      trackingError: 5,
      vintageTint: '#00ff00',
    },
    holographic: {
      holoLayers: 4,
      holoShift: 8,
      holoSpeed: 2000,
      holoOpacity: 70,
      rainbowIntensity: 80,
    },
    perspective: {
      perspectiveDepth: 500,
      tiltSensitivity: 50,
      maxTiltX: 20,
      maxTiltY: 20,
      resetSpeed: 500,
      tiltMode: 'mouse',
    },
    shatter: {
      fragmentCount: 20,
      explosionForce: 50,
      gravity: 0.8,
      rotationSpeed: 5,
      shatterDelay: 0,
      reassemble: false,
    },
  }),

  actions: {
    loadFromLocalStorage() {
      const stored = localStorage.getItem('appSettings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          Object.assign(this.$state, parsed);
        } catch (e) {
          console.error('Failed to parse stored settings:', e);
        }
      }
    },

    updateSettings(settings) {
      Object.assign(this.$state, settings);
      this.saveToLocalStorageDebounced();
    },

    saveToLocalStorageDebounced: debounce(function () {
      localStorage.setItem('appSettings', JSON.stringify(this.$state));
    }, 300),

    resetToDefaults() {
      this.$state.blendMode = 'difference';
      this.$state.effectType = 'vibration';
      this.$state.hue = 0;
      this.$state.color = '#ffffff';
      this.$state.opacity = 100;
      this.$state.vibrateSpeed = 50;
      this.$state.vibrateIntensity = 1;
      this.$state.blurAmount = 2;
      this.$state.globalRandomAmount = 50;
      this.$state.randomAmount = [0, 0, 0];
      this.$state.intervalSpeed = 200;
      this.$state.textLines = ['INSERT', "SUN'O3.08", 'BAR OOST'];
      this.$state.fontSize = [120, 120, 120];
      this.$state.margin = [0, 0, 0];
      this.$state.marginTop = [0, 0, 0];
      this.$state.letterSpacing = [0, 0, 0];
      this.$state.textVisible = [true, true, true];
      this.$state.backdropBlur = 0;
      this.$state.backdropBrightness = 100;
      this.$state.backdropContrast = 100;
      this.$state.backdropSaturate = 100;
      this.$state.textTypes = [];
      this.$state.dragMode = false;
      this.$state.videoFormat = 'vertical';
      this.$state.videoWidth = 1080;
      this.$state.videoHeight = 1920;
      this.$state.showFormatBoundary = true;
      this.$state.fitToFormat = false;
      this.$state.showGrid = false;
      this.$state.gridSize = 50;
      this.$state.gridColor = '#00ffff';
      this.$state.gridOpacity = 0.3;
      this.$state.showCenterGuides = true;
      this.$state.showThirdsGuides = false;
      this.$state.guideColor = '#ff00ff';
      this.$state.guideOpacity = 0.5;
      this.$state.snapToGrid = true;
      localStorage.removeItem('appSettings');
    },

    addTextLine() {
      this.textLines.push('');
      this.fontSize.push(120);
      this.fontFamily.push('Arial');
      this.fontWeight.push('900');
      this.fontStyle.push('normal');
      this.margin.push(0);
      this.marginTop.push(0);
      this.letterSpacing.push(0);
      this.randomAmount.push(0);
      this.textTypes.push(null);
      this.textVisible.push(true);
      this.textAnimations.push({
        preset: 'none',
        duration: 1000,
        delay: 0,
        loop: false,
      });
    },

    removeTextLine(index) {
      this.textLines.splice(index, 1);
      this.fontSize.splice(index, 1);
      this.fontFamily.splice(index, 1);
      this.fontWeight.splice(index, 1);
      this.fontStyle.splice(index, 1);
      this.margin.splice(index, 1);
      this.marginTop.splice(index, 1);
      this.letterSpacing.splice(index, 1);
      this.randomAmount.splice(index, 1);
      this.textTypes.splice(index, 1);
      this.textVisible.splice(index, 1);
      this.textAnimations.splice(index, 1);
    },

    toggleTextVisibility(index) {
      this.textVisible[index] = !this.textVisible[index];
    },

    setTextType(index, type) {
      this.textTypes[index] = type === 'paragraph' ? 'paragraph' : null;
    },

    alignText(alignmentConfig) {
      const { type, alignment, axis, videoWidth, videoHeight } = alignmentConfig;
      console.log(axis)
      if (type === 'horizontal') {
        const width = videoWidth || 1080;
        this.margin.forEach((_, index) => {
          if (this.textVisible[index] !== false) {
            if (alignment === 'left') {
              this.margin[index] = -width / 2 + 50;
            } else if (alignment === 'center') {
              this.margin[index] = 0;
            } else if (alignment === 'right') {
              this.margin[index] = width / 2 - 50;
            }
          }
        });
      } else if (type === 'vertical') {
        const height = videoHeight || 1920;
        this.marginTop.forEach((_, index) => {
          if (this.textVisible[index] !== false) {
            if (alignment === 'top') {
              this.marginTop[index] = -height / 2 + 100;
            } else if (alignment === 'middle') {
              this.marginTop[index] = 0;
            } else if (alignment === 'bottom') {
              this.marginTop[index] = height / 2 - 100;
            }
          }
        });
      } else if (type === 'distribute') {
        const height = videoHeight || 1920;
        const visibleIndices = this.textVisible
          .map((visible, index) => (visible !== false ? index : -1))
          .filter(index => index !== -1);

        if (visibleIndices.length > 1) {
          const spacing = height / (visibleIndices.length + 1);
          visibleIndices.forEach((originalIndex, i) => {
            this.marginTop[originalIndex] = -height / 2 + spacing * (i + 1);
          });
        }
      }
    },
  },
});
