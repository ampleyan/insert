// const GOOGLE_FONTS_API_KEY = 'AIzaSyBEwq9aVq1qQdcGqFqZqN6B8h6rEBa6Z5Q';
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

class GoogleFontsService {
  constructor() {
    this.loadedFonts = new Set();
    this.recentFonts = this.loadRecentFonts();
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
}

export default new GoogleFontsService();
