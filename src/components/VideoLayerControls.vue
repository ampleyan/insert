<template>
  <div class="video-controls">
    <div class="control-header">
      <h3>Video Layers</h3>
      <button @click="videoStore.addLayer()" class="add-layer-btn">+ Add Layer</button>
    </div>

    <div class="layers-list">
      <div
        v-for="(layer, index) in videoStore.layers"
        :key="layer.id"
        class="layer-item"
        :class="{ active: expandedLayer === layer.id }"
      >
        <div class="layer-header" @click="toggleLayer(layer.id)">
          <div class="layer-info">
            <button @click.stop="videoStore.toggleLayerVisibility(layer.id)" class="visibility-btn">
              {{ layer.visible ? '👁' : '👁‍🗨' }}
            </button>
            <input
              v-model="layer.name"
              @click.stop
              class="layer-name-input"
              placeholder="Layer name"
            />
            <span class="layer-blend">{{ layer.blendMode }}</span>
          </div>
          <div class="layer-actions">
            <button @click.stop="moveLayerUp(index)" :disabled="index === 0" class="move-btn">
              ▲
            </button>
            <button
              @click.stop="moveLayerDown(index)"
              :disabled="index === videoStore.layers.length - 1"
              class="move-btn"
            >
              ▼
            </button>
            <button @click.stop="videoStore.duplicateLayer(layer.id)" class="duplicate-btn">
              📋
            </button>
            <button
              @click.stop="videoStore.removeLayer(layer.id)"
              :disabled="videoStore.layers.length === 1"
              class="remove-btn"
            >
              ✕
            </button>
          </div>
        </div>

        <div v-if="expandedLayer === layer.id" class="layer-controls">
          <div class="control-section">
            <h4>Source</h4>
            <div class="url-input-group">
              <input
                type="text"
                v-model="layer.src"
                placeholder="Enter video URL or YouTube link"
                class="url-input"
              />
              <button @click="loadVideo(layer.id)" class="load-btn">Load</button>
            </div>
            <input type="file" @change="handleFileUpload($event, layer.id)" accept="video/*" class="file-input" />
          </div>

          <div class="control-section">
            <h4>Blend Mode</h4>
            <select v-model="layer.blendMode">
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="color-dodge">Color Dodge</option>
              <option value="color-burn">Color Burn</option>
              <option value="hard-light">Hard Light</option>
              <option value="soft-light">Soft Light</option>
              <option value="difference">Difference</option>
              <option value="exclusion">Exclusion</option>
              <option value="hue">Hue</option>
              <option value="saturation">Saturation</option>
              <option value="color">Color</option>
              <option value="luminosity">Luminosity</option>
            </select>
          </div>

          <div class="control-section">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4>Opacity</h4>
              <button @click="resetLayerSettings(layer.id)" class="reset-layer-btn" title="Reset opacity, filters, and transform">
                Reset Layer
              </button>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <input
                type="range"
                v-model.number="layer.opacity"
                min="0"
                max="100"
                class="slider"
              />
              <span>{{ layer.opacity }}%</span>
            </div>
          </div>

          <div class="control-section">
            <h4>Filters</h4>
            <div class="filter-grid">
              <div class="filter-item">
                <label>Blur</label>
                <input type="range" v-model.number="layer.filters.blur" min="0" max="50" />
                <span>{{ layer.filters.blur }}px</span>
              </div>
              <div class="filter-item">
                <label>Brightness</label>
                <input type="range" v-model.number="layer.filters.brightness" min="0" max="200" />
                <span>{{ layer.filters.brightness }}%</span>
              </div>
              <div class="filter-item">
                <label>Contrast</label>
                <input type="range" v-model.number="layer.filters.contrast" min="0" max="200" />
                <span>{{ layer.filters.contrast }}%</span>
              </div>
              <div class="filter-item">
                <label>Saturation</label>
                <input type="range" v-model.number="layer.filters.saturate" min="0" max="200" />
                <span>{{ layer.filters.saturate }}%</span>
              </div>
              <div class="filter-item">
                <label>Hue Rotate</label>
                <input type="range" v-model.number="layer.filters.hue" min="0" max="360" />
                <span>{{ layer.filters.hue }}°</span>
              </div>
              <div class="filter-item">
                <label>Grayscale</label>
                <input type="range" v-model.number="layer.filters.grayscale" min="0" max="100" />
                <span>{{ layer.filters.grayscale }}%</span>
              </div>
              <div class="filter-item">
                <label>Sepia</label>
                <input type="range" v-model.number="layer.filters.sepia" min="0" max="100" />
                <span>{{ layer.filters.sepia }}%</span>
              </div>
              <div class="filter-item">
                <label>Invert</label>
                <input type="range" v-model.number="layer.filters.invert" min="0" max="100" />
                <span>{{ layer.filters.invert }}%</span>
              </div>
            </div>
          </div>

          <div class="control-section">
            <h4>Transform</h4>
            <div class="filter-grid">
              <div class="filter-item">
                <label>Scale</label>
                <input type="range" v-model.number="layer.transform.scale" min="50" max="200" />
                <span>{{ layer.transform.scale }}%</span>
              </div>
              <div class="filter-item">
                <label>Rotate</label>
                <input type="range" v-model.number="layer.transform.rotate" min="0" max="360" />
                <span>{{ layer.transform.rotate }}°</span>
              </div>
              <div class="filter-item">
                <label>X Position</label>
                <input type="range" v-model.number="layer.transform.x" min="-500" max="500" />
                <span>{{ layer.transform.x }}px</span>
              </div>
              <div class="filter-item">
                <label>Y Position</label>
                <input type="range" v-model.number="layer.transform.y" min="-500" max="500" />
                <span>{{ layer.transform.y }}px</span>
              </div>
            </div>
          </div>

          <div class="control-section">
            <h4>Effects</h4>
            <div class="effects-grid">
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.kaleidoscope" />
                  Kaleidoscope
                </label>
                <input
                  v-if="layer.effects.kaleidoscope"
                  type="range"
                  v-model.number="layer.effects.kaleidoscopeSegments"
                  min="3"
                  max="12"
                />
                <span v-if="layer.effects.kaleidoscope"
                  >{{ layer.effects.kaleidoscopeSegments }} segments</span
                >
              </div>
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.mirror" />
                  Mirror
                </label>
                <select v-if="layer.effects.mirror" v-model="layer.effects.mirrorAxis">
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.pixelate" />
                  Pixelate
                </label>
                <input
                  v-if="layer.effects.pixelate"
                  type="range"
                  v-model.number="layer.effects.pixelSize"
                  min="2"
                  max="50"
                />
                <span v-if="layer.effects.pixelate">{{ layer.effects.pixelSize }}px</span>
              </div>
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.edgeDetect" />
                  Edge Detect
                </label>
              </div>
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.trails" />
                  Motion Trails
                </label>
              </div>
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.feedbackLoop" />
                  Feedback Loop
                </label>
              </div>
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.voronoi" />
                  Voronoi Cells
                </label>
                <input
                  v-if="layer.effects.voronoi"
                  type="range"
                  v-model.number="layer.effects.voronoiCells"
                  min="10"
                  max="200"
                />
                <span v-if="layer.effects.voronoi">{{ layer.effects.voronoiCells }} cells</span>
              </div>
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.rgbSplit" />
                  RGB Split
                </label>
              </div>
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.datamosh" />
                  Datamosh Glitch
                </label>
              </div>
              <div class="effect-toggle">
                <label>
                  <input type="checkbox" v-model="layer.effects.chromaKey" />
                  Chroma Key
                </label>
                <input
                  v-if="layer.effects.chromaKey"
                  type="range"
                  v-model.number="layer.effects.chromaKeyThreshold"
                  min="10"
                  max="100"
                />
                <span v-if="layer.effects.chromaKey"
                  >Threshold: {{ layer.effects.chromaKeyThreshold }}</span
                >
              </div>
            </div>
          </div>

          <div class="control-section">
            <h4>Playback</h4>
            <div class="playback-controls">
              <button @click="togglePlayback(layer.id)">
                {{ layer.playback.isPlaying ? '⏸ Pause' : '▶ Play' }}
              </button>
              <label>
                <input type="checkbox" v-model="layer.playback.loop" />
                Loop
              </label>
              <label>
                <input type="checkbox" v-model="layer.playback.isMuted" />
                Mute
              </label>
              <div class="filter-item">
                <label>Speed</label>
                <input
                  type="range"
                  v-model.number="layer.playback.playbackRate"
                  min="0.25"
                  max="2"
                  step="0.25"
                />
                <span>{{ layer.playback.playbackRate }}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVideoStore } from '@/stores/videos';

export default {
  name: 'VideoLayerControls',
  data() {
    return {
      expandedLayer: null,
    };
  },
  setup() {
    const videoStore = useVideoStore();
    return { videoStore };
  },
  mounted() {
    if (this.videoStore.layers.length > 0) {
      this.expandedLayer = this.videoStore.layers[0].id;
    }
  },
  methods: {
    toggleLayer(id) {
      this.expandedLayer = this.expandedLayer === id ? null : id;
    },
    loadVideo(layerId) {
      const layer = this.videoStore.layers.find((l) => l.id === layerId);
      console.log('[VideoLayerControls] Load button clicked', {
        layerId,
        layer,
        src: layer?.src,
      });
      if (layer && layer.src) {
        console.log('[VideoLayerControls] Calling updateLayer with src:', layer.src);
        this.videoStore.updateLayer(layerId, { src: layer.src, file: null });
      } else {
        console.warn('[VideoLayerControls] No layer or src found', { layer, src: layer?.src });
      }
    },
    handleFileUpload(event, layerId) {
      const file = event.target.files[0];
      console.log('[VideoLayerControls] File selected', {
        layerId,
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
      });
      if (file) {
        console.log('[VideoLayerControls] Calling updateLayer with file');
        this.videoStore.updateLayer(layerId, { file, src: '' });
      }
    },
    togglePlayback(layerId) {
      const layer = this.videoStore.layers.find((l) => l.id === layerId);
      if (layer) {
        this.videoStore.updateLayer(layerId, {
          playback: {
            ...layer.playback,
            isPlaying: !layer.playback.isPlaying,
          },
        });
      }
    },
    moveLayerUp(index) {
      if (index > 0) {
        this.videoStore.moveLayer(index, index - 1);
      }
    },
    moveLayerDown(index) {
      if (index < this.videoStore.layers.length - 1) {
        this.videoStore.moveLayer(index, index + 1);
      }
    },
    resetLayerSettings(layerId) {
      console.log('[VideoLayerControls] Resetting layer settings', { layerId });
      this.videoStore.updateLayer(layerId, {
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
      });
    },
  },
};
</script>

<style scoped>
.video-controls {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  max-height: 600px;
  overflow-y: auto;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.control-header h3 {
  margin: 0;
  color: white;
  font-size: 16px;
}

.add-layer-btn {
  background: rgba(0, 122, 255, 0.7);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-layer-btn:hover {
  background: rgba(0, 122, 255, 0.9);
}

.layers-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.layer-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.layer-item.active {
  border-color: rgba(0, 122, 255, 0.5);
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
}

.layer-header:hover {
  background: rgba(0, 0, 0, 0.5);
}

.layer-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.visibility-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
}

.layer-name-input {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  flex: 1;
  max-width: 200px;
}

.layer-blend {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.layer-actions {
  display: flex;
  gap: 5px;
}

.move-btn,
.duplicate-btn,
.remove-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.remove-btn:hover {
  background: rgba(255, 59, 48, 0.5);
}

.layer-controls {
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
}

.control-section {
  margin-bottom: 20px;
}

.control-section h4 {
  color: white;
  font-size: 14px;
  margin: 0 0 10px 0;
}

.url-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.url-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px;
  border-radius: 4px;
}

.load-btn {
  background: rgba(0, 122, 255, 0.7);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.load-btn:hover {
  background: rgba(0, 122, 255, 0.9);
}

.file-input {
  width: 100%;
  margin-top: 5px;
}

select {
  width: 100%;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px;
  border-radius: 4px;
}

select option {
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 8px;
}

.slider {
  width: 100%;
  margin-right: 10px;
}

.filter-grid,
.effects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-item label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.filter-item input[type='range'] {
  width: 100%;
}

.filter-item span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.effect-toggle {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.effect-toggle label {
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.playback-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.playback-controls button {
  background: rgba(0, 122, 255, 0.7);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.playback-controls label {
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
}

.reset-layer-btn {
  background: rgba(255, 149, 0, 0.7);
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.reset-layer-btn:hover {
  background: rgba(255, 149, 0, 0.9);
}
</style>
