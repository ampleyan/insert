<template>
  <div class="font-controls">
    <h4>Typography</h4>

    <div class="font-upload">
      <label class="upload-btn">
        <input
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          @change="uploadFont"
          hidden
        />
        + Upload Font
      </label>
    </div>

    <div class="font-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search Google Fonts..."
        @input="onSearchInput"
      />
      <span v-if="isSearching" class="search-spinner"></span>
    </div>

    <div v-if="customFonts.length > 0" class="font-section">
      <label class="section-label">Custom Fonts</label>
      <div class="font-grid">
        <div v-for="font in customFonts" :key="font" class="custom-font-item">
          <button
            :class="['font-option', { active: isActiveFontFamily(font) }]"
            :style="{ fontFamily: font }"
            @click="selectFont(font)"
          >
            {{ font }}
          </button>
          <button class="delete-font" @click="removeFont(font)">×</button>
        </div>
      </div>
    </div>

    <div v-if="recentFonts.length > 0" class="font-section">
      <label class="section-label">Recently Used</label>
      <div class="font-grid">
        <button
          v-for="font in recentFonts"
          :key="font"
          :class="['font-option', { active: isActiveFontFamily(font) }]"
          :style="{ fontFamily: font }"
          @click="selectFont(font)"
        >
          {{ font }}
        </button>
      </div>
    </div>

    <div class="font-section">
      <label class="section-label">{{ searchQuery ? 'Search Results' : 'Popular Fonts' }}</label>
      <div class="font-grid">
        <button
          v-for="font in displayedFonts"
          :key="font"
          :class="['font-option', { active: isActiveFontFamily(font) }]"
          :style="{ fontFamily: font }"
          @click="selectFont(font)"
        >
          {{ font }}
        </button>
      </div>
      <div v-if="searchQuery && displayedFonts.length === 0 && !isSearching" class="no-results">
        No fonts found
      </div>
    </div>

    <div class="font-weights">
      <label>Font Weight</label>
      <select :value="currentFontWeight" @change="updateFontWeight($event.target.value)">
        <option value="100">Thin (100)</option>
        <option value="200">Extra Light (200)</option>
        <option value="300">Light (300)</option>
        <option value="400">Regular (400)</option>
        <option value="500">Medium (500)</option>
        <option value="600">Semi Bold (600)</option>
        <option value="700">Bold (700)</option>
        <option value="800">Extra Bold (800)</option>
        <option value="900">Black (900)</option>
      </select>
    </div>

    <div class="font-style">
      <label>
        <input
          type="checkbox"
          :checked="currentFontStyle === 'italic'"
          @change="toggleItalic"
        />
        <span>Italic</span>
      </label>
    </div>

    <div class="preview-text">
      <label>Preview</label>
      <div
        class="preview-box"
        :style="{
          fontFamily: currentFontFamily,
          fontWeight: currentFontWeight,
          fontStyle: currentFontStyle
        }"
      >
        {{ previewText }}
      </div>
      <input
        v-model="previewText"
        type="text"
        placeholder="Type to preview..."
        class="preview-input"
      />
    </div>
  </div>
</template>

<script>
import googleFontsService from '@/services/googleFonts';

export default {
  name: 'FontControls',
  props: {
    fontFamily: {
      type: String,
      default: 'Arial'
    },
    fontWeight: {
      type: [String, Number],
      default: '400'
    },
    fontStyle: {
      type: String,
      default: 'normal'
    }
  },
  emits: ['update'],
  data() {
    return {
      searchQuery: '',
      previewText: 'The quick brown fox jumps over the lazy dog',
      popularFonts: [],
      recentFonts: [],
      customFonts: [],
      searchResults: [],
      isSearching: false,
      searchTimeout: null,
      currentFontFamily: this.fontFamily || 'Arial',
      currentFontWeight: String(this.fontWeight) || '400',
      currentFontStyle: this.fontStyle || 'normal'
    };
  },
  computed: {
    displayedFonts() {
      if (this.searchQuery && this.searchQuery.length >= 2) {
        return this.searchResults;
      }
      if (this.searchQuery) {
        return googleFontsService.searchFonts(this.searchQuery);
      }
      return this.popularFonts;
    }
  },
  mounted() {
    this.popularFonts = googleFontsService.getPopularFonts();
    this.recentFonts = googleFontsService.getRecentFonts();
    this.customFonts = googleFontsService.getCustomFonts();
    this.loadInitialFonts();
    googleFontsService.restoreCustomFonts();
  },
  watch: {
    fontFamily(newVal) {
      if (newVal && newVal !== this.currentFontFamily) {
        this.currentFontFamily = newVal;
        this.loadFont(newVal);
      }
    },
    fontWeight(newVal) {
      if (newVal) {
        this.currentFontWeight = String(newVal);
      }
    },
    fontStyle(newVal) {
      if (newVal) {
        this.currentFontStyle = newVal;
      }
    }
  },
  methods: {
    async loadInitialFonts() {
      const fontsToLoad = [
        ...this.recentFonts.slice(0, 5),
        ...this.popularFonts.slice(0, 10)
      ];

      try {
        await googleFontsService.loadFonts(fontsToLoad);
      } catch (error) {
        console.error('Failed to load fonts:', error);
      }
    },

    async loadFont(fontFamily) {
      try {
        await googleFontsService.loadFont(fontFamily, [100, 200, 300, 400, 500, 600, 700, 800, 900]);
        this.recentFonts = googleFontsService.getRecentFonts();
      } catch (error) {
        console.error('Failed to load font:', error);
      }
    },

    async selectFont(fontFamily) {
      this.currentFontFamily = fontFamily;
      await this.loadFont(fontFamily);
      this.$emit('update', {
        fontFamily,
        fontWeight: this.currentFontWeight,
        fontStyle: this.currentFontStyle
      });
    },

    updateFontWeight(weight) {
      this.currentFontWeight = weight;
      this.$emit('update', {
        fontFamily: this.currentFontFamily,
        fontWeight: weight,
        fontStyle: this.currentFontStyle
      });
    },

    toggleItalic(event) {
      this.currentFontStyle = event.target.checked ? 'italic' : 'normal';
      this.$emit('update', {
        fontFamily: this.currentFontFamily,
        fontWeight: this.currentFontWeight,
        fontStyle: this.currentFontStyle
      });
    },

    onSearchInput() {
      clearTimeout(this.searchTimeout);
      if (this.searchQuery.length < 2) {
        this.searchResults = [];
        this.isSearching = false;
        return;
      }
      this.isSearching = true;
      this.searchTimeout = setTimeout(async () => {
        const results = await googleFontsService.searchGoogleFontsAPI(this.searchQuery);
        this.searchResults = results;
        this.isSearching = false;
        this.preloadSearchResults(results.slice(0, 5));
      }, 300);
    },

    async preloadSearchResults(fonts) {
      try {
        await googleFontsService.loadFonts(fonts);
      } catch (error) {
        console.error('Failed to preload fonts:', error);
      }
    },

    async uploadFont(event) {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const fontName = await googleFontsService.loadCustomFont(file);
        this.customFonts = googleFontsService.getCustomFonts();
        this.selectFont(fontName);
      } catch (error) {
        alert(error.message);
      }
      event.target.value = '';
    },

    removeFont(fontName) {
      googleFontsService.removeCustomFont(fontName);
      this.customFonts = googleFontsService.getCustomFonts();
      if (this.currentFontFamily === fontName) {
        this.selectFont('Arial');
      }
    },

    isActiveFontFamily(font) {
      return this.currentFontFamily === font;
    }
  }
};
</script>

<style scoped>
.font-controls {
  background: rgba(0, 149, 255, 0.1);
  border: 1px solid rgba(0, 149, 255, 0.3);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 15px;
}

.font-controls h4 {
  color: white;
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 500;
}

.font-upload {
  margin-bottom: 12px;
}

.upload-btn {
  display: inline-block;
  background: rgba(0, 149, 255, 0.3);
  border: 1px dashed rgba(0, 149, 255, 0.5);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.upload-btn:hover {
  background: rgba(0, 149, 255, 0.5);
  border-color: rgba(0, 149, 255, 0.7);
}

.font-search {
  margin-bottom: 12px;
  position: relative;
}

.font-search input {
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.font-search input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.font-search input:focus {
  outline: none;
  border-color: rgba(0, 149, 255, 0.5);
}

.search-spinner {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

.font-section {
  margin-bottom: 12px;
}

.section-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 8px;
}

.font-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.custom-font-item {
  display: flex;
  gap: 4px;
}

.custom-font-item .font-option {
  flex: 1;
  min-width: 0;
}

.delete-font {
  background: rgba(255, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 0, 0.5);
  color: white;
  width: 28px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.delete-font:hover {
  background: rgba(255, 0, 0, 0.5);
}

.font-option {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.font-option:hover {
  background: rgba(0, 149, 255, 0.3);
  border-color: rgba(0, 149, 255, 0.5);
}

.font-option.active {
  background: rgba(0, 149, 255, 0.5);
  border-color: rgba(0, 149, 255, 0.7);
}

.no-results {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  text-align: center;
  padding: 12px;
}

.font-weights {
  margin-bottom: 12px;
}

.font-weights label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  display: block;
  margin-bottom: 6px;
}

.font-weights select {
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.font-style {
  margin-bottom: 12px;
}

.font-style label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  cursor: pointer;
}

.font-style input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.preview-text {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-text > label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  display: block;
  margin-bottom: 6px;
}

.preview-box {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;
  min-height: 60px;
  display: flex;
  align-items: center;
  word-break: break-word;
  margin-bottom: 8px;
}

.preview-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
}

.preview-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
</style>
