import { getSkin, DEFAULT_SKIN } from '../constants/skins';

export function applySkinStyles(skinId) {
  const skin = getSkin(skinId || DEFAULT_SKIN);
  const root = document.documentElement;

  root.style.setProperty('--win98-gray', skin.colors.gray);
  root.style.setProperty('--win98-dark-gray', skin.colors.darkGray);
  root.style.setProperty('--win98-white', skin.colors.white);
  root.style.setProperty('--win98-black', skin.colors.black);
  root.style.setProperty('--win98-blue', skin.colors.blue);
  root.style.setProperty('--win98-blue-light', skin.colors.blueLight);
  root.style.setProperty('--win98-bsod-blue', skin.colors.bsodBlue);
  root.style.setProperty('--win98-desktop', skin.colors.desktop);
  root.style.setProperty('--win98-border-light', skin.colors.borderLight);
  root.style.setProperty('--win98-border-dark', skin.colors.borderDark);
  root.style.setProperty('--win98-font', skin.fonts.main);
  root.style.setProperty('--win98-font-mono', skin.fonts.mono);

  const titleBar = skin.colors.titleBar || skin.colors.blue;
  const titleBarInactive = skin.colors.titleBarInactive || skin.colors.darkGray;
  const panel = skin.colors.panel || skin.colors.gray;
  const panelText = skin.colors.panelText || skin.colors.black;
  const accent = skin.colors.accent || skin.colors.blueLight;
  const selection = skin.colors.selection || skin.colors.blue;

  root.style.setProperty('--win98-titlebar', titleBar);
  root.style.setProperty('--win98-titlebar-inactive', titleBarInactive);
  root.style.setProperty('--win98-panel', panel);
  root.style.setProperty('--win98-panel-text', panelText);
  root.style.setProperty('--win98-accent', accent);
  root.style.setProperty('--win98-selection', selection);

  const ui = skin.ui || {};
  root.style.setProperty('--win98-border-radius', ui.borderRadius || '0px');
  root.style.setProperty('--win98-button-style', ui.buttonStyle || 'beveled');

  root.setAttribute('data-skin', skinId || DEFAULT_SKIN);
}

export function applyCustomBackgroundColor(color) {
  if (color) {
    document.documentElement.style.setProperty('--win98-desktop', color);
  }
}
