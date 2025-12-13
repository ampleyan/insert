<template>
  <div class="image-overlay-controls">
    <div class="section-header">
      <h4>Image Overlays</h4>
      <button class="add-image-button" @click="triggerFileInput">+ Add Image</button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
      multiple
      @change="handleFileUpload"
      style="display: none"
    />

    <div v-if="images.length === 0" class="empty-state">
      <p>No images added yet. Click "+ Add Image" to upload.</p>
    </div>

    <div v-for="(image, index) in images" :key="index" class="image-item">
      <div class="image-header">
        <div class="image-preview">
          <img :src="image.src" :alt="image.name" />
        </div>
        <div class="image-info">
          <span class="image-name">{{ image.name }}</span>
          <div class="image-actions">
            <button
              :class="['visibility-button', { hidden: !image.visible }]"
              @click="toggleVisibility(index)"
              :title="image.visible ? 'Hide image' : 'Show image'"
            >
              {{ image.visible ? '👁' : '👁‍🗨' }}
            </button>
            <button class="remove-button" @click="removeImage(index)" title="Remove image">
              ✕
            </button>
          </div>
        </div>
      </div>

      <div class="image-controls-expanded">
        <div class="control-row">
          <label>Opacity</label>
          <div class="range-control">
            <input
              type="range"
              :value="image.opacity !== undefined ? image.opacity : 100"
              @input="updateImage(index, 'opacity', parseInt($event.target.value))"
              min="0"
              max="100"
            />
            <input
              type="number"
              class="value-input"
              :value="image.opacity !== undefined ? image.opacity : 100"
              @input="updateImage(index, 'opacity', parseInt($event.target.value))"
              min="0"
              max="100"
            />
            <span class="unit">%</span>
          </div>
        </div>

        <div class="control-row">
          <label>Scale</label>
          <div class="range-control">
            <input
              type="range"
              :value="image.scale || 1"
              @input="updateImage(index, 'scale', parseFloat($event.target.value))"
              min="0.1"
              max="5"
              step="0.1"
            />
            <input
              type="number"
              class="value-input"
              :value="image.scale || 1"
              @input="updateImage(index, 'scale', parseFloat($event.target.value))"
              min="0.1"
              max="5"
              step="0.1"
            />
            <span class="unit">×</span>
          </div>
        </div>

        <div class="control-row">
          <label>Rotation</label>
          <div class="range-control">
            <input
              type="range"
              :value="image.rotation || 0"
              @input="updateImage(index, 'rotation', parseInt($event.target.value))"
              min="0"
              max="360"
            />
            <input
              type="number"
              class="value-input"
              :value="image.rotation || 0"
              @input="updateImage(index, 'rotation', parseInt($event.target.value))"
              min="0"
              max="360"
            />
            <span class="unit">°</span>
          </div>
        </div>

        <div class="control-row">
          <label>Hue</label>
          <div class="range-control">
            <input
              type="range"
              :value="image.hue || 0"
              @input="updateImage(index, 'hue', parseInt($event.target.value))"
              min="0"
              max="360"
            />
            <input
              type="number"
              class="value-input"
              :value="image.hue || 0"
              @input="updateImage(index, 'hue', parseInt($event.target.value))"
              min="0"
              max="360"
            />
            <span class="unit">°</span>
          </div>
        </div>

        <div class="control-row">
          <label>Blend Mode</label>
          <select
            :value="image.blendMode || 'normal'"
            @change="updateImage(index, 'blendMode', $event.target.value)"
          >
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

        <div class="control-row">
          <label>Layer Order</label>
          <div class="layer-order-controls">
            <button @click="moveImageUp(index)" :disabled="index === 0" title="Move up">↑</button>
            <button @click="moveImageDown(index)" :disabled="index === images.length - 1" title="Move down">↓</button>
            <span class="layer-number">Layer {{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageOverlayControls',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update'],
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async handleFileUpload(event) {
      const files = Array.from(event.target.files);

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newImages = [...this.images];
            newImages.push({
              src: e.target.result,
              name: file.name,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 100,
              hue: 0,
              blendMode: 'normal',
              visible: true,
              zIndex: newImages.length + 10
            });
            this.$emit('update', { imageOverlays: newImages });
          };
          reader.readAsDataURL(file);
        }
      }

      event.target.value = '';
    },

    removeImage(index) {
      const newImages = [...this.images];
      newImages.splice(index, 1);
      this.$emit('update', { imageOverlays: newImages });
    },

    toggleVisibility(index) {
      const newImages = [...this.images];
      newImages[index] = {
        ...newImages[index],
        visible: !newImages[index].visible
      };
      this.$emit('update', { imageOverlays: newImages });
    },

    updateImage(index, property, value) {
      const newImages = [...this.images];
      newImages[index] = {
        ...newImages[index],
        [property]: value
      };
      this.$emit('update', { imageOverlays: newImages });
    },

    moveImageUp(index) {
      if (index === 0) return;
      const newImages = [...this.images];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      this.$emit('update', { imageOverlays: newImages });
    },

    moveImageDown(index) {
      if (index === this.images.length - 1) return;
      const newImages = [...this.images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      this.$emit('update', { imageOverlays: newImages });
    }
  }
};
</script>

<style scoped>
.image-overlay-controls {
  background: rgba(255, 105, 180, 0.1);
  border: 1px solid rgba(255, 105, 180, 0.3);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h4 {
  color: white;
  margin: 0;
  font-size: 13px;
  font-weight: 500;
}

.add-image-button {
  background: rgba(255, 105, 180, 0.3);
  border: 1px solid rgba(255, 105, 180, 0.5);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.add-image-button:hover {
  background: rgba(255, 105, 180, 0.5);
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.image-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.image-item:last-child {
  margin-bottom: 0;
}

.image-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.image-preview {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.image-actions {
  display: flex;
  gap: 4px;
}

.visibility-button {
  background: rgba(255, 105, 180, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.visibility-button.hidden {
  background: rgba(255, 59, 48, 0.3) !important;
  opacity: 0.6;
}

.remove-button {
  background: rgba(255, 59, 48, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.remove-button:hover {
  background: rgba(255, 59, 48, 0.5);
}

.image-controls-expanded {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 10px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.control-row:last-child {
  margin-bottom: 0;
}

.control-row label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  min-width: 70px;
}

.control-row select {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.range-control {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
}

.range-control input[type="range"] {
  width: 100%;
}

.value-input {
  width: 60px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 11px;
  text-align: center;
}

.value-input:focus {
  outline: none;
  border-color: rgba(255, 105, 180, 0.5);
}

.unit {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  min-width: 25px;
}

.layer-order-controls {
  flex: 1;
  display: flex;
  gap: 4px;
  align-items: center;
}

.layer-order-controls button {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.layer-order-controls button:hover:not(:disabled) {
  background: rgba(255, 105, 180, 0.3);
}

.layer-order-controls button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.layer-number {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  margin-left: auto;
}
</style>
