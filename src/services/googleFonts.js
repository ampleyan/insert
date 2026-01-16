const POPULAR_FONTS = [
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Raleway',
  'Poppins',
  'Bebas Neue',
  'Playfair Display',
  'Merriweather',
  'Anton',
  'Righteous',
  'Bangers',
  'Permanent Marker',
  'Russo One',
  'Pacifico',
  'Lobster',
  'Dancing Script',
  'Caveat',
  'Great Vibes',
  'Inter',
  'Work Sans',
  'Nunito',
  'PT Sans',
  'Source Sans Pro',
];

const CUSTOM_FONTS_KEY = 'customFonts';
const MAX_FONT_SIZE = 5000 * 1024;

class GoogleFontsService {
  constructor() {
    this.loadedFonts = new Set();
    this.recentFonts = this.loadRecentFonts();
    this.customFonts = this.loadCustomFonts();
    this.googleFontsCache = null;
  }

  loadRecentFonts() {
    try {
      const stored = localStorage.getItem('recentGoogleFonts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveRecentFonts() {
    try {
      localStorage.setItem('recentGoogleFonts', JSON.stringify(this.recentFonts));
    } catch (error) {
      console.error('Failed to save recent fonts:', error);
    }
  }

  loadCustomFonts() {
    try {
      const stored = localStorage.getItem(CUSTOM_FONTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveCustomFonts() {
    try {
      localStorage.setItem(CUSTOM_FONTS_KEY, JSON.stringify(this.customFonts));
    } catch (error) {
      console.error('Failed to save custom fonts:', error);
    }
  }

  async loadCustomFont(file) {
    if (file.size > MAX_FONT_SIZE) {
      throw new Error(`Font file too large (max ${MAX_FONT_SIZE / 1024}KB)`);
    }

    const fontName = file.name.replace(/\.(ttf|otf|woff2?)$/i, '');
    const existing = this.customFonts.find(f => f.name === fontName);
    if (existing) {
      throw new Error(`Font "${fontName}" already exists`);
    }

    const arrayBuffer = await file.arrayBuffer();
    const fontFace = new FontFace(fontName, arrayBuffer);
    await fontFace.load();
    document.fonts.add(fontFace);
    this.loadedFonts.add(fontName);

    const base64 = await this.arrayBufferToBase64(arrayBuffer);
    const mimeType = this.getMimeType(file.name);

    this.customFonts.push({
      name: fontName,
      data: base64,
      type: mimeType
    });
    this.saveCustomFonts();

    return fontName;
  }

  async arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  getMimeType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
      ttf: 'font/ttf',
      otf: 'font/otf',
      woff: 'font/woff',
      woff2: 'font/woff2'
    };
    return types[ext] || 'font/ttf';
  }

  async restoreCustomFonts() {
    for (const font of this.customFonts) {
      try {
        const arrayBuffer = this.base64ToArrayBuffer(font.data);
        const fontFace = new FontFace(font.name, arrayBuffer);
        await fontFace.load();
        document.fonts.add(fontFace);
        this.loadedFonts.add(font.name);
      } catch (error) {
        console.error(`Failed to restore font "${font.name}":`, error);
      }
    }
  }

  removeCustomFont(fontName) {
    this.customFonts = this.customFonts.filter(f => f.name !== fontName);
    this.saveCustomFonts();
    this.loadedFonts.delete(fontName);
  }

  getCustomFonts() {
    return this.customFonts.map(f => f.name);
  }

  isCustomFont(fontName) {
    return this.customFonts.some(f => f.name === fontName);
  }

  addToRecent(fontFamily) {
    this.recentFonts = this.recentFonts.filter(f => f !== fontFamily);
    this.recentFonts.unshift(fontFamily);
    this.recentFonts = this.recentFonts.slice(0, 10);
    this.saveRecentFonts();
  }

  getRecentFonts() {
    return this.recentFonts;
  }

  getPopularFonts() {
    return POPULAR_FONTS;
  }

  loadFont(fontFamily, weights = [400, 700]) {
    if (this.loadedFonts.has(fontFamily)) {
      return Promise.resolve();
    }

    if (this.isCustomFont(fontFamily)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const weightsString = weights.join(';');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@${weightsString}&display=swap`;

      link.onload = () => {
        this.loadedFonts.add(fontFamily);
        this.addToRecent(fontFamily);
        resolve();
      };

      link.onerror = () => {
        reject(new Error(`Failed to load font: ${fontFamily}`));
      };

      document.head.appendChild(link);
    });
  }

  async loadFonts(fontFamilies) {
    const promises = fontFamilies.map(font => {
      if (typeof font === 'string') {
        return this.loadFont(font);
      } else if (font.family) {
        return this.loadFont(font.family, font.weights);
      }
      return Promise.resolve();
    });

    return Promise.all(promises);
  }

  isLoaded(fontFamily) {
    return this.loadedFonts.has(fontFamily);
  }

  searchFonts(query) {
    const lowerQuery = query.toLowerCase();
    return POPULAR_FONTS.filter(font =>
      font.toLowerCase().includes(lowerQuery)
    );
  }

  async fetchGoogleFontsList() {
    try {
      const response = await fetch(`${process.env.BASE_URL || '/'}data/googleFonts.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch Google Fonts list');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to load Google Fonts list:', error);
      return POPULAR_FONTS;
    }
  }

  async searchGoogleFontsAPI(query) {
    if (!query || query.length < 2) {
      return [];
    }

    if (!this.googleFontsCache) {
      this.googleFontsCache = await this.fetchGoogleFontsList();
    }

    const lowerQuery = query.toLowerCase();
    return this.googleFontsCache
      .filter(f => f.toLowerCase().includes(lowerQuery))
      .slice(0, 50);
  }
}

export default new GoogleFontsService();
