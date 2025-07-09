<template>
  <div class="control-group">
    <h3>Blend Settings</h3>
    <label for="text-blend">Blend Mode:</label>
    <select id="text-blend" v-model="blendMode" @input="updateValue">
      <option v-for="mode in blendModes" :key="mode.value" :value="mode.value">
        {{ mode.label }}
      </option>
    </select>
  </div>
</template>

<script>
import { BLEND_MODES, DEFAULT_BLEND_MODE } from '@/constants/blendModes';

export default {
  name: 'BlendControls',
  props: {
    modelValue: {
      type: String,
      default: DEFAULT_BLEND_MODE
    }
  },
  emits: ['update'],
  data() {
    return {
      controlSettings: {
        // Blend settings
        blendMode: 'difference',
      },
      blendMode: DEFAULT_BLEND_MODE,
      blendModes: BLEND_MODES
    };
  },
  // inject: ['controlSettings'],
  mounted() {
    // Initialize with value from controlSettings or default
    this.blendMode = this.controlSettings.blendMode || DEFAULT_BLEND_MODE;
    // this.updateValue(this.blendMode);
  },
  methods: {
    updateValue(event) {
      this.controlSettings.blendMode =  event.target.value;
      this.$emit('update', this.controlSettings);

      // this.updateBlendMode(newValue);
    },
    // updateBlendMode(mode) {
    //   // Access parent component's method through $parent
    //      this.controlSettings.blendMode = mode;
    //      this.$emit('update', mode);
    //
    // }
  }
};
</script>
