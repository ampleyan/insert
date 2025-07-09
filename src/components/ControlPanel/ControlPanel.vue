<template>
  <div class="controls">
    <BlendControls  @update="onUpdate"/>
    <ColorControls  @update="onUpdate" />
    <AnimationControls   @update="onUpdate" />
  </div>
</template>

<script>
import BlendControls from './BlendControls.vue';
import ColorControls from './ColorControls.vue';
import AnimationControls from './AnimationControls.vue';
// import controlsMixin from '@/mixins/controlsMixin';
// import animationMixin from '@/mixins/animationMixin';

export default {
  name: 'ControlPanel',
  components: {
    BlendControls,
    ColorControls,
    AnimationControls
  },
  // mixins: [controlsMixin, animationMixin],
  emit: ['update'],
  data() {
    return {
      settings:{ blendMode: 'difference',

    // Color settings
    hue: 0,
    color: '#ffffff',
    opacity: 100,

    // Animation settings (will be merged with animation settings from useAnimation)
    vibrateSpeed: 50,
    vibrateIntensity: 1,
    blurAmount: 2,
    randomAmount: 50,
    intervalSpeed: 200
  }
    };
  },
  // provide() {
  //   return {
  //     animationSettings: this.mergedSettings
  //   };
  // },
  methods: {
    onUpdate(val) {
      console.log(val);
      // this.blendMode = val;
      // this.controlSettings.blendMode = val;
      Object.keys(this.settings).forEach(key => {
    if (key in val) {
        this.settings[key] = val[key];
    }
});
            console.log(this.settings)

      this.$emit('update', this.settings);
    }
  }
};
</script>
