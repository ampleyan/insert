const DB_NAME = 'win98Assets';
const DB_VERSION = 2;
const ICONS_STORE = 'customIcons';
const VIDEOS_STORE = 'customVideos';
const THEME_STORE = 'themeAssets';
const MAX_ICON_SIZE = 2 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_THEME_ASSET_SIZE = 5 * 1024 * 1024;

class Win98AssetsService {
  constructor() {
    this.customIcons = [];
    this.customVideos = [];
    this.db = null;
    this.dbReady = this.initDB();
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        this.loadFromDB().then(resolve).catch(reject);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(ICONS_STORE)) {
          db.createObjectStore(ICONS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(VIDEOS_STORE)) {
          db.createObjectStore(VIDEOS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(THEME_STORE)) {
          db.createObjectStore(THEME_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  async loadFromDB() {
    await this.loadCustomIcons();
    await this.loadCustomVideos();
  }

  async loadCustomIcons() {
    if (!this.db) return [];
    return new Promise((resolve) => {
      const tx = this.db.transaction(ICONS_STORE, 'readonly');
      const store = tx.objectStore(ICONS_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        this.customIcons = request.result || [];
        resolve(this.customIcons);
      };
      request.onerror = () => {
        this.customIcons = [];
        resolve([]);
      };
    });
  }

  async saveCustomIcon(icon) {
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(ICONS_STORE, 'readwrite');
      const store = tx.objectStore(ICONS_STORE);
      const request = store.put(icon);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCustomIconFromDB(id) {
    if (!this.db) return;
    return new Promise((resolve) => {
      const tx = this.db.transaction(ICONS_STORE, 'readwrite');
      const store = tx.objectStore(ICONS_STORE);
      store.delete(id);
      tx.oncomplete = () => resolve();
    });
  }

  async loadCustomVideos() {
    if (!this.db) return [];
    return new Promise((resolve) => {
      const tx = this.db.transaction(VIDEOS_STORE, 'readonly');
      const store = tx.objectStore(VIDEOS_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        this.customVideos = request.result || [];
        resolve(this.customVideos);
      };
      request.onerror = () => {
        this.customVideos = [];
        resolve([]);
      };
    });
  }

  async saveCustomVideo(video) {
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(VIDEOS_STORE, 'readwrite');
      const store = tx.objectStore(VIDEOS_STORE);
      const request = store.put(video);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCustomVideoFromDB(id) {
    if (!this.db) return;
    return new Promise((resolve) => {
      const tx = this.db.transaction(VIDEOS_STORE, 'readwrite');
      const store = tx.objectStore(VIDEOS_STORE);
      store.delete(id);
      tx.oncomplete = () => resolve();
    });
  }

  async addCustomIcon(file) {
    await this.dbReady;
    if (file.size > MAX_ICON_SIZE) {
      throw new Error(`Icon file too large (max ${MAX_ICON_SIZE / (1024 * 1024)}MB)`);
    }

    const id = 'custom_icon_' + Date.now();
    const label = file.name.replace(/\.(png|jpg|jpeg|gif|ico|webp)$/i, '');
    const base64 = await this.fileToBase64(file);

    const icon = {
      id,
      label,
      type: 'custom',
      icon: base64,
      isCustom: true
    };

    this.customIcons.push(icon);
    await this.saveCustomIcon(icon);
    return icon;
  }

  async addCustomVideo(videoFile, thumbnailFile = null) {
    await this.dbReady;
    if (videoFile.size > MAX_VIDEO_SIZE) {
      throw new Error(`Video file too large (max ${MAX_VIDEO_SIZE / (1024 * 1024)}MB)`);
    }

    const id = 'custom_video_' + Date.now();
    const label = videoFile.name.replace(/\.(mp4|webm|mov)$/i, '') + '.mp4';

    const videoBlob = URL.createObjectURL(videoFile);

    let iconBase64 = null;
    if (thumbnailFile) {
      iconBase64 = await this.fileToBase64(thumbnailFile);
    } else {
      iconBase64 = await this.generateVideoThumbnail(videoBlob);
    }

    const arrayBuffer = await videoFile.arrayBuffer();

    const video = {
      id,
      label,
      type: 'video',
      src: videoBlob,
      videoData: arrayBuffer,
      icon: iconBase64,
      isCustom: true
    };

    this.customVideos.push(video);
    await this.saveCustomVideo(video);
    return video;
  }

  async generateVideoThumbnail(videoSrc) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoSrc;
      video.muted = true;

      video.onloadeddata = () => {
        video.currentTime = 1;
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        const scale = Math.max(64 / video.videoWidth, 64 / video.videoHeight);
        const w = video.videoWidth * scale;
        const h = video.videoHeight * scale;
        const x = (64 - w) / 2;
        const y = (64 - h) / 2;

        ctx.drawImage(video, x, y, w, h);
        resolve(canvas.toDataURL('image/png'));
      };

      video.onerror = () => {
        resolve(null);
      };
    });
  }

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async removeCustomIcon(id) {
    this.customIcons = this.customIcons.filter(i => i.id !== id);
    await this.deleteCustomIconFromDB(id);
  }

  async removeCustomVideo(id) {
    const video = this.customVideos.find(v => v.id === id);
    if (video && video.src && video.src.startsWith('blob:')) {
      URL.revokeObjectURL(video.src);
    }
    this.customVideos = this.customVideos.filter(v => v.id !== id);
    await this.deleteCustomVideoFromDB(id);
  }

  getCustomIcons() {
    return this.customIcons;
  }

  getCustomVideos() {
    return this.customVideos;
  }

  async restoreVideoBlobUrls() {
    await this.dbReady;
    this.customVideos = this.customVideos.map(video => {
      if (video.videoData && (!video.src || !video.src.startsWith('blob:'))) {
        const blob = new Blob([video.videoData], { type: 'video/mp4' });
        video.src = URL.createObjectURL(blob);
      }
      return video;
    });
  }

  getAllIcons() {
    return this.customIcons;
  }

  getAllVideos() {
    return this.customVideos;
  }

  async updateIconLabel(id, newLabel) {
    const icon = this.customIcons.find(i => i.id === id);
    if (icon) {
      icon.label = newLabel;
      await this.saveCustomIcon(icon);
    }
  }

  async updateVideoLabel(id, newLabel) {
    const video = this.customVideos.find(v => v.id === id);
    if (video) {
      video.label = newLabel;
      await this.saveCustomVideo(video);
    }
  }

  async updateVideoThumbnail(id, thumbnailFile) {
    const video = this.customVideos.find(v => v.id === id);
    if (video) {
      video.icon = await this.fileToBase64(thumbnailFile);
      await this.saveCustomVideo(video);
    }
  }

  async saveThemeAsset(key, data) {
    await this.dbReady;
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(THEME_STORE, 'readwrite');
      const store = tx.objectStore(THEME_STORE);
      const request = store.put({ id: key, data, updatedAt: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadThemeAsset(key) {
    await this.dbReady;
    if (!this.db) return null;
    return new Promise((resolve) => {
      const tx = this.db.transaction(THEME_STORE, 'readonly');
      const store = tx.objectStore(THEME_STORE);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => resolve(null);
    });
  }

  async deleteThemeAsset(key) {
    await this.dbReady;
    if (!this.db) return;
    return new Promise((resolve) => {
      const tx = this.db.transaction(THEME_STORE, 'readwrite');
      const store = tx.objectStore(THEME_STORE);
      store.delete(key);
      tx.oncomplete = () => resolve();
    });
  }

  async loadAllThemeAssets() {
    await this.dbReady;
    if (!this.db) return {};
    return new Promise((resolve) => {
      const tx = this.db.transaction(THEME_STORE, 'readonly');
      const store = tx.objectStore(THEME_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        const assets = {};
        (request.result || []).forEach(item => {
          assets[item.id] = item.data;
        });
        resolve(assets);
      };
      request.onerror = () => resolve({});
    });
  }

  async saveBackgroundImage(file) {
    if (file.size > MAX_THEME_ASSET_SIZE) {
      throw new Error(`Background image too large (max ${MAX_THEME_ASSET_SIZE / (1024 * 1024)}MB)`);
    }
    const base64 = await this.fileToBase64(file);
    await this.saveThemeAsset('customBackground', base64);
    return base64;
  }

  async saveBootLogo(file) {
    if (file.size > MAX_THEME_ASSET_SIZE) {
      throw new Error(`Boot logo too large (max ${MAX_THEME_ASSET_SIZE / (1024 * 1024)}MB)`);
    }
    const base64 = await this.fileToBase64(file);
    await this.saveThemeAsset('customBootLogo', base64);
    return base64;
  }

  async removeBackgroundImage() {
    await this.deleteThemeAsset('customBackground');
  }

  async removeBootLogo() {
    await this.deleteThemeAsset('customBootLogo');
  }

  async clearAllData() {
    await this.dbReady;
    if (!this.db) return;

    this.customVideos.forEach(v => {
      if (v.src && v.src.startsWith('blob:')) {
        URL.revokeObjectURL(v.src);
      }
    });

    this.customIcons = [];
    this.customVideos = [];

    const stores = [ICONS_STORE, VIDEOS_STORE, THEME_STORE];
    for (const storeName of stores) {
      await new Promise((resolve) => {
        const tx = this.db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.clear();
        tx.oncomplete = () => resolve();
      });
    }
  }
}

export default new Win98AssetsService();
