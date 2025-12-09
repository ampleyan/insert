import { defineStore } from 'pinia';

const DEFAULT_VIDEO_SRC =
  process.env.NODE_ENV === 'production'
    ? '/insert/video/back.mp4'
    : require('@/assets/video/back.mp4');

const createDefaultLayer = (id = 1) => ({
  id,
  name: `Video Layer ${id}`,
  src: id === 1 ? DEFAULT_VIDEO_SRC : '',
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

const loadFromStorage = () => {
  console.log('[VideoStore] Loading from localStorage');
  try {
    const stored = localStorage.getItem('videoLayers');
    console.log('[VideoStore] Raw stored data:', stored);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('[VideoStore] Parsed data:', parsed);
      const layers = parsed.layers.map((layer) => ({
        ...createDefaultLayer(layer.id),
        ...layer,
        file: null,
      }));
      console.log('[VideoStore] Loaded layers:', layers);
      return layers;
    }
  } catch (error) {
    console.error('[VideoStore] Failed to load video layers from storage:', error);
  }
  console.log('[VideoStore] Using default layer');
  return [createDefaultLayer()];
};

export const useVideoStore = defineStore('videos', {
  state: () => ({
    layers: loadFromStorage(),
    nextId: 2,
  }),

  actions: {
    addLayer() {
      this.layers.push(createDefaultLayer(this.nextId++));
      this.saveToStorage();
    },

    saveToStorage() {
      try {
        const layersToSave = this.layers.map((layer) => {
          // eslint-disable-next-line no-unused-vars
          const { file, ...rest } = layer;
          return rest;
        });
        console.log('[VideoStore] Saving to localStorage:', layersToSave);
        localStorage.setItem('videoLayers', JSON.stringify({ layers: layersToSave }));
        console.log('[VideoStore] Saved successfully');
      } catch (error) {
        console.error('[VideoStore] Failed to save video layers:', error);
      }
    },

    removeLayer(id) {
      const index = this.layers.findIndex((layer) => layer.id === id);
      if (index !== -1 && this.layers.length > 1) {
        this.layers.splice(index, 1);
        this.saveToStorage();
      }
    },

    updateLayer(id, updates) {
      const layer = this.layers.find((l) => l.id === id);
      console.log('[VideoStore] updateLayer called', {
        id,
        updates,
        layerBefore: layer ? { ...layer } : null,
      });
      if (layer) {
        Object.assign(layer, updates);
        console.log('[VideoStore] Layer updated', {
          id,
          layerAfter: { ...layer },
        });
        this.saveToStorage();
      } else {
        console.warn('[VideoStore] Layer not found', { id });
      }
    },

    updateLayerFilters(id, filters) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        Object.assign(layer.filters, filters);
        this.saveToStorage();
      }
    },

    updateLayerEffects(id, effects) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        Object.assign(layer.effects, effects);
        this.saveToStorage();
      }
    },

    updateLayerTransform(id, transform) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        Object.assign(layer.transform, transform);
        this.saveToStorage();
      }
    },

    moveLayer(fromIndex, toIndex) {
      const layer = this.layers.splice(fromIndex, 1)[0];
      this.layers.splice(toIndex, 0, layer);
      this.saveToStorage();
    },

    duplicateLayer(id) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        const duplicate = JSON.parse(JSON.stringify(layer));
        duplicate.id = this.nextId++;
        duplicate.name = `${layer.name} (Copy)`;
        duplicate.file = null;
        this.layers.push(duplicate);
        this.saveToStorage();
      }
    },

    toggleLayerVisibility(id) {
      const layer = this.layers.find((l) => l.id === id);
      if (layer) {
        layer.visible = !layer.visible;
        this.saveToStorage();
      }
    },
  },
});
