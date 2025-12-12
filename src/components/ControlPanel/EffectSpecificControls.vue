<template>
  <div class="effect-controls" v-if="effectConfig">
    <div class="section-header">
      <h3>{{ effectConfig.name }} Settings</h3>
    </div>

    <div class="controls-grid">
      <div
        v-for="control in effectConfig.controls"
        :key="control.key"
        class="control-group"
      >
        <label class="control-label">
          <span>{{ control.label }}</span>
          <span v-if="control.type === 'range'" class="value-display">
            {{ getCurrentValue(control.key) }}{{ control.unit || '' }}
          </span>
        </label>

        <input
          v-if="control.type === 'range'"
          type="range"
          :min="control.min"
          :max="control.max"
          :step="control.step || 1"
          :value="getCurrentValue(control.key)"
          @input="updateValue(control.key, Number($event.target.value))"
          class="range-input"
        />

        <input
          v-else-if="control.type === 'color'"
          type="color"
          :value="getCurrentValue(control.key)"
          @input="updateValue(control.key, $event.target.value)"
          class="color-input"
        />

        <select
          v-else-if="control.type === 'select'"
          :value="getCurrentValue(control.key)"
          @change="updateValue(control.key, $event.target.value)"
          class="select-input"
        >
          <option v-for="option in control.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <label v-else-if="control.type === 'toggle'" class="toggle-wrapper">
          <input
            type="checkbox"
            :checked="getCurrentValue(control.key)"
            @change="updateValue(control.key, $event.target.checked)"
            class="toggle-input"
          />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
const EFFECT_CONFIGS = {
  vibration: {
    name: 'Vibration',
    controls: [
      { key: 'vibrateSpeed', label: 'Animation Speed', type: 'range', min: 10, max: 500, unit: 'ms', global: true },
      { key: 'vibrateIntensity', label: 'Intensity', type: 'range', min: 1, max: 10, unit: 'x', global: true },
      { key: 'blurAmount', label: 'Blur Amount', type: 'range', min: 0, max: 10, step: 0.5, unit: 'px', global: true },
      { key: 'globalRandomAmount', label: 'Random Letters', type: 'range', min: 1, max: 100, unit: '%', global: true },
      { key: 'intervalSpeed', label: 'Effect Interval', type: 'range', min: 50, max: 1000, unit: 'ms', global: true },
      { key: 'jitterMode', label: 'Jitter Mode', type: 'select', options: [
        { value: 'random', label: 'Random' },
        { value: 'smooth', label: 'Smooth' },
        { value: 'chaotic', label: 'Chaotic' }
      ]},
      { key: 'damping', label: 'Damping', type: 'range', min: 0, max: 1, step: 0.1 },
      { key: 'shakeAxis', label: 'Shake Axis', type: 'select', options: [
        { value: 'both', label: 'Both' },
        { value: 'x', label: 'Horizontal' },
        { value: 'y', label: 'Vertical' }
      ]},
    ]
  },
  glitch: {
    name: 'Glitch',
    controls: [
      { key: 'glitchIntensity', label: 'Intensity', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'glitchSpeed', label: 'Speed', type: 'range', min: 50, max: 2000, unit: 'ms' },
      { key: 'colorSeparation', label: 'Color Separation', type: 'range', min: 0, max: 20, unit: 'px' },
      { key: 'scanlineFrequency', label: 'Scanlines', type: 'range', min: 0, max: 10 },
      { key: 'globalRandomAmount', label: 'Letter Movement', type: 'range', min: 0, max: 100, unit: '%', global: true },
      { key: 'intervalSpeed', label: 'Movement Speed', type: 'range', min: 50, max: 1000, unit: 'ms', global: true },
      { key: 'glitchType', label: 'Type', type: 'select', options: [
        { value: 'digital', label: 'Digital' },
        { value: 'analog', label: 'Analog' },
        { value: 'corrupted', label: 'Corrupted' }
      ]},
    ]
  },
  wave: {
    name: 'Wave',
    controls: [
      { key: 'waveAmplitude', label: 'Amplitude', type: 'range', min: 0, max: 100, unit: 'px' },
      { key: 'waveFrequency', label: 'Frequency', type: 'range', min: 0.1, max: 5, step: 0.1 },
      { key: 'waveSpeed', label: 'Speed', type: 'range', min: 0.1, max: 10, step: 0.1 },
      { key: 'waveDirection', label: 'Direction', type: 'select', options: [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'radial', label: 'Radial' }
      ]},
      { key: 'wavePhase', label: 'Phase', type: 'range', min: 0, max: 360, unit: '°' },
    ]
  },
  particle: {
    name: 'Particle Burst',
    controls: [
      { key: 'particleCount', label: 'Particle Count', type: 'range', min: 10, max: 200 },
      { key: 'burstSpeed', label: 'Burst Speed', type: 'range', min: 0.5, max: 10, step: 0.5 },
      { key: 'particleSize', label: 'Particle Size', type: 'range', min: 1, max: 10, unit: 'px' },
      { key: 'gravity', label: 'Gravity', type: 'range', min: 0, max: 2, step: 0.1 },
      { key: 'particleLife', label: 'Lifetime', type: 'range', min: 500, max: 5000, unit: 'ms' },
      { key: 'autoTrigger', label: 'Auto Trigger', type: 'toggle' },
    ]
  },
  rotation3d: {
    name: '3D Rotation',
    controls: [
      { key: 'rotationSpeed', label: 'Speed', type: 'range', min: 0.1, max: 10, step: 0.1 },
      { key: 'rotationAxis', label: 'Axis', type: 'select', options: [
        { value: 'all', label: 'All' },
        { value: 'x', label: 'X Axis' },
        { value: 'y', label: 'Y Axis' },
        { value: 'z', label: 'Z Axis' }
      ]},
      { key: 'perspective', label: 'Perspective', type: 'range', min: 100, max: 2000, unit: 'px' },
      { key: 'tiltAngle', label: 'Tilt Angle', type: 'range', min: 0, max: 90, unit: '°' },
      { key: 'rotationMode', label: 'Mode', type: 'select', options: [
        { value: 'continuous', label: 'Continuous' },
        { value: 'bounce', label: 'Bounce' },
        { value: 'pendulum', label: 'Pendulum' }
      ]},
    ]
  },
  neon: {
    name: 'Neon Glow',
    controls: [
      { key: 'glowBlur', label: 'Glow Blur', type: 'range', min: 0, max: 50, unit: 'px' },
      { key: 'glowIntensity', label: 'Intensity', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'glowColor', label: 'Glow Color', type: 'color' },
      { key: 'glowLayers', label: 'Glow Layers', type: 'range', min: 1, max: 10 },
      { key: 'pulseSpeed', label: 'Pulse Speed', type: 'range', min: 500, max: 5000, unit: 'ms' },
      { key: 'flickerAmount', label: 'Flicker', type: 'range', min: 0, max: 50, unit: '%' },
    ]
  },
  liquid: {
    name: 'Liquid Distortion',
    controls: [
      { key: 'turbulenceScale', label: 'Turbulence', type: 'range', min: 0, max: 100 },
      { key: 'baseFrequency', label: 'Frequency', type: 'range', min: 0.001, max: 0.1, step: 0.001 },
      { key: 'flowSpeed', label: 'Flow Speed', type: 'range', min: 0.1, max: 5, step: 0.1 },
      { key: 'viscosity', label: 'Viscosity', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ]},
      { key: 'distortionType', label: 'Type', type: 'select', options: [
        { value: 'goo', label: 'Goo' },
        { value: 'water', label: 'Water' },
        { value: 'oil', label: 'Oil' }
      ]},
    ]
  },
  typewriter: {
    name: 'Typewriter',
    controls: [
      { key: 'typingSpeed', label: 'Typing Speed', type: 'range', min: 20, max: 300, unit: 'ms' },
      { key: 'cursorBlink', label: 'Cursor Blink', type: 'toggle' },
      { key: 'cursorStyle', label: 'Cursor Style', type: 'select', options: [
        { value: 'line', label: 'Line' },
        { value: 'block', label: 'Block' },
        { value: 'underline', label: 'Underline' }
      ]},
      { key: 'deleteSpeed', label: 'Delete Speed', type: 'range', min: 20, max: 200, unit: 'ms' },
      { key: 'loopMode', label: 'Loop Mode', type: 'select', options: [
        { value: 'loop', label: 'Loop' },
        { value: 'once', label: 'Once' },
        { value: 'pingpong', label: 'Ping Pong' }
      ]},
      { key: 'initialDelay', label: 'Initial Delay', type: 'range', min: 0, max: 3000, unit: 'ms' },
    ]
  },
  chromatic: {
    name: 'Chromatic Aberration',
    controls: [
      { key: 'aberrationDistance', label: 'Distance', type: 'range', min: 0, max: 30, unit: 'px' },
      { key: 'aberrationAngle', label: 'Angle', type: 'range', min: 0, max: 360, unit: '°' },
      { key: 'redOffset', label: 'Red Offset', type: 'range', min: 0, max: 20, unit: 'px' },
      { key: 'blueOffset', label: 'Blue Offset', type: 'range', min: 0, max: 20, unit: 'px' },
      { key: 'aberrationMode', label: 'Mode', type: 'select', options: [
        { value: 'static', label: 'Static' },
        { value: 'animated', label: 'Animated' },
        { value: 'mouse-follow', label: 'Mouse Follow' }
      ]},
    ]
  },
  goo: {
    name: 'Goo',
    controls: [
      { key: 'turbulenceIntensity', label: 'Intensity', type: 'range', min: 0, max: 100 },
      { key: 'noiseScale', label: 'Noise Scale', type: 'range', min: 0.001, max: 0.1, step: 0.001 },
      { key: 'morphSpeed', label: 'Morph Speed', type: 'range', min: 0.1, max: 5, step: 0.1 },
      { key: 'gooAmount', label: 'Goo Amount', type: 'range', min: 0, max: 50 },
    ]
  },
  split: {
    name: 'Split',
    controls: [
      { key: 'splitDistance', label: 'Distance', type: 'range', min: 0, max: 200, unit: 'px' },
      { key: 'splitSpeed', label: 'Speed', type: 'range', min: 100, max: 2000, unit: 'ms' },
      { key: 'splitDirection', label: 'Direction', type: 'select', options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
        { value: 'diagonal', label: 'Diagonal' }
      ]},
      { key: 'rotationAmount', label: 'Rotation', type: 'range', min: 0, max: 180, unit: '°' },
      { key: 'splitMode', label: 'Mode', type: 'select', options: [
        { value: 'all-at-once', label: 'All at Once' },
        { value: 'sequential', label: 'Sequential' },
        { value: 'random', label: 'Random' }
      ]},
    ]
  },
  wavy: {
    name: 'Wavy',
    controls: [
      { key: 'waveHeight', label: 'Wave Height', type: 'range', min: 0, max: 100, unit: 'px' },
      { key: 'wavelength', label: 'Wavelength', type: 'range', min: 0.1, max: 5, step: 0.1 },
      { key: 'waveSpeed', label: 'Speed', type: 'range', min: 0.1, max: 10, step: 0.1 },
      { key: 'waveDelay', label: 'Letter Delay', type: 'range', min: 0, max: 200, unit: 'ms' },
    ]
  },
  flicker: {
    name: 'Flicker',
    controls: [
      { key: 'flickerSpeed', label: 'Speed', type: 'range', min: 50, max: 1000, unit: 'ms' },
      { key: 'flickerIntensity', label: 'Intensity', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'flickerPattern', label: 'Pattern', type: 'select', options: [
        { value: 'random', label: 'Random' },
        { value: 'regular', label: 'Regular' },
        { value: 'morse', label: 'Morse Code' }
      ]},
      { key: 'minOpacity', label: 'Min Opacity', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'maxOpacity', label: 'Max Opacity', type: 'range', min: 0, max: 100, unit: '%' },
    ]
  },
  stroke: {
    name: 'Stroke',
    controls: [
      { key: 'strokeWidth', label: 'Width', type: 'range', min: 0, max: 10, unit: 'px' },
      { key: 'strokeColor', label: 'Color', type: 'color' },
      { key: 'fillOpacity', label: 'Fill Opacity', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'strokeDash', label: 'Dash Length', type: 'range', min: 0, max: 50 },
      { key: 'strokeAnimate', label: 'Animate', type: 'toggle' },
    ]
  },
  gradient: {
    name: 'Gradient',
    controls: [
      { key: 'gradientAngle', label: 'Angle', type: 'range', min: 0, max: 360, unit: '°' },
      { key: 'gradientColor1', label: 'Color 1', type: 'color' },
      { key: 'gradientColor2', label: 'Color 2', type: 'color' },
      { key: 'gradientColor3', label: 'Color 3', type: 'color' },
      { key: 'gradientAnimate', label: 'Animate', type: 'toggle' },
      { key: 'gradientSpeed', label: 'Speed', type: 'range', min: 1000, max: 10000, unit: 'ms' },
    ]
  },
  scanlines: {
    name: 'Scanlines / VHS',
    controls: [
      { key: 'scanlineIntensity', label: 'Intensity', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'scanlineCount', label: 'Line Count', type: 'range', min: 50, max: 500 },
      { key: 'vhsNoise', label: 'VHS Noise', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'chromaticShift', label: 'Chromatic Shift', type: 'range', min: 0, max: 10, unit: 'px' },
      { key: 'trackingError', label: 'Tracking Error', type: 'range', min: 0, max: 20 },
      { key: 'vintageTint', label: 'Vintage Tint', type: 'color' },
    ]
  },
  holographic: {
    name: 'Holographic',
    controls: [
      { key: 'holoLayers', label: 'Layers', type: 'range', min: 1, max: 10 },
      { key: 'holoShift', label: 'Shift Amount', type: 'range', min: 0, max: 20, unit: 'px' },
      { key: 'holoSpeed', label: 'Speed', type: 'range', min: 500, max: 5000, unit: 'ms' },
      { key: 'holoOpacity', label: 'Layer Opacity', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'rainbowIntensity', label: 'Rainbow', type: 'range', min: 0, max: 100, unit: '%' },
    ]
  },
  perspective: {
    name: 'Perspective Tilt',
    controls: [
      { key: 'perspectiveDepth', label: 'Depth', type: 'range', min: 100, max: 2000, unit: 'px' },
      { key: 'tiltSensitivity', label: 'Sensitivity', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'maxTiltX', label: 'Max Tilt X', type: 'range', min: 0, max: 90, unit: '°' },
      { key: 'maxTiltY', label: 'Max Tilt Y', type: 'range', min: 0, max: 90, unit: '°' },
      { key: 'resetSpeed', label: 'Reset Speed', type: 'range', min: 100, max: 2000, unit: 'ms' },
      { key: 'tiltMode', label: 'Mode', type: 'select', options: [
        { value: 'mouse', label: 'Mouse' },
        { value: 'gyroscope', label: 'Gyroscope' },
        { value: 'auto', label: 'Auto' }
      ]},
    ]
  },
  shatter: {
    name: 'Shatter',
    controls: [
      { key: 'fragmentCount', label: 'Fragments', type: 'range', min: 5, max: 50 },
      { key: 'explosionForce', label: 'Force', type: 'range', min: 0, max: 100, unit: '%' },
      { key: 'gravity', label: 'Gravity', type: 'range', min: 0, max: 2, step: 0.1 },
      { key: 'rotationSpeed', label: 'Rotation', type: 'range', min: 0, max: 20 },
      { key: 'shatterDelay', label: 'Delay', type: 'range', min: 0, max: 2000, unit: 'ms' },
      { key: 'reassemble', label: 'Reassemble', type: 'toggle' },
    ]
  },
};

export default {
  name: 'EffectSpecificControls',
  props: {
    effectType: {
      type: String,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
  },
  emits: ['update'],
  computed: {
    effectConfig() {
      return EFFECT_CONFIGS[this.effectType] || null;
    },
  },
  methods: {
    getCurrentValue(key) {
      const control = this.effectConfig?.controls.find(c => c.key === key);
      if (control?.global) {
        return this.settings[key];
      }
      const effectSettings = this.settings[this.effectType];
      return effectSettings?.[key];
    },
    updateValue(key, value) {
      const control = this.effectConfig?.controls.find(c => c.key === key);
      if (control?.global) {
        this.$emit('update', { [key]: value });
      } else {
        const effectSettings = { ...this.settings[this.effectType] };
        effectSettings[key] = value;
        this.$emit('update', { [this.effectType]: effectSettings });
      }
    },
  },
};
</script>

<style scoped>
.effect-controls {
  padding: 16px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.controls-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.value-display {
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
}

.range-input {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.range-input::-webkit-slider-thumb:hover {
  background: #4A9EFF;
  box-shadow: 0 0 0 4px rgba(74, 158, 255, 0.2);
}

.range-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.range-input::-moz-range-thumb:hover {
  background: #4A9EFF;
  box-shadow: 0 0 0 4px rgba(74, 158, 255, 0.2);
}

.color-input {
  width: 100%;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  padding: 2px;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

.select-input {
  width: 100%;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.select-input:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.select-input:focus {
  border-color: #4A9EFF;
  box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2);
}

.toggle-wrapper {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  cursor: pointer;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 22px;
  transition: 0.3s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle-input:checked + .toggle-slider {
  background-color: #4A9EFF;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(22px);
}

.toggle-wrapper:hover .toggle-slider {
  background-color: rgba(255, 255, 255, 0.3);
}

.toggle-input:checked + .toggle-slider:hover {
  background-color: #5AAEFF;
}
</style>
