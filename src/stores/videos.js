import { defineStore } from 'pinia';

export const useVideoStore = defineStore('videos', {
  state: () => ({
    layers: [
      {
        id: 1,
        name: 'Video Layer 1',
        src: require('@/assets/video/back.mp4'),
        file: null,
        blendMode: 'normal',
        opacity: 100,
        filters: {
          blur: 0,
          brightness: 100,
          contrast: 100,
          saturate: 100,
          hue: 0,
          grayscale: 0,
          sepia: 0,
          invert: 0,
        },
        transform: {
          scale: 100,
          x: 0,
          y: 0,
          rotate: 0,
        },
        effects: {
          kaleidoscope: false,
          kaleidoscopeSegments: 6,
          mirror: false,
          mirrorAxis: 'horizontal',
          pixelate: false,
          pixelSize: 10,
          edgeDetect: false,
          trails: false,
          feedbackLoop: false,
          voronoi: false,
          voronoiCells: 50,
          rgbSplit: false,
          datamosh: false,
          chromaKey: false,
          chromaKeyColor: [0, 255, 0],
          chromaKeyThreshold: 40,
        },
        playback: {
          isPlaying: true,
          isMuted: true,
          playbackRate: 1,
          loop: true,
        },
        visible: true,
      },
    ],
    nextId: 2,
  }),

  actions: {
    addLayer() {
      this.layers.push({
        id: this.nextId++,
        name: `Video Layer ${this.nextId}`,
        src: '',
        file: null,
        blendMode: 'normal',
        opacity: 100,
        filters: {
          blur: 0,
          brightness: 100,
          contrast: 100,
          saturate: 100,
          hue: 0,
          grayscale: 0,
          sepia: 0,
          invert: 0,
        },
        transform: {
          scale: 100,
          x: 0,
          y: 0,
          rotate: 0,
        },
        effects: {
          kaleidoscope: false,
          kaleidoscopeSegments: 6,
          mirror: false,
          mirrorAxis: 'horizontal',
          pixelate: false,
          pixelSize: 10,
          edgeDetect: false,
          trails: false,
          feedbackLoop: false,
          voronoi: false,
          voronoiCells: 50,
          rgbSplit: false,
          datamosh: false,
          chromaKey: false,
          chromaKeyColor: [0, 255, 0],
          chromaKeyThreshold: 40,
        },
        playback: {
          isPlaying: true,
          isMuted: true,
          playbackRate: 1,
          loop: true,
        },
        visible: true,
      });
    },

    removeLayer(id) {
      const index = this.layers.findIndex((layer) => layer.id === id);
      if (index !== -1 && this.layers.length > 1) {
        this.layers.splice(index, 1);
      }
    },

    updateLayer(id, updates) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        Object.assign(layer, updates);
      }
    },

    updateLayerFilters(id, filters) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        Object.assign(layer.filters, filters);
      }
    },

    updateLayerEffects(id, effects) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        Object.assign(layer.effects, effects);
      }
    },

    updateLayerTransform(id, transform) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        Object.assign(layer.transform, transform);
      }
    },

    moveLayer(fromIndex, toIndex) {
      const layer = this.layers.splice(fromIndex, 1)[0];
      this.layers.splice(toIndex, 0, layer);
    },

    duplicateLayer(id) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        const duplicate = JSON.parse(JSON.stringify(layer));
        duplicate.id = this.nextId++;
        duplicate.name = `${layer.name} (Copy)`;
        this.layers.push(duplicate);
      }
    },

    toggleLayerVisibility(id) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        layer.visible = !layer.visible;
      }
    },
  },
});
