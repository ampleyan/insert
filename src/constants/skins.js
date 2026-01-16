export const OS_SKINS = {
  win98: {
    id: 'win98',
    name: 'Windows 98',
    colors: {
      gray: '#c0c0c0',
      darkGray: '#808080',
      white: '#ffffff',
      black: '#000000',
      blue: '#000080',
      blueLight: '#1084d0',
      bsodBlue: '#0000aa',
      desktop: '#008080',
      borderLight: '#dfdfdf',
      borderDark: '#000000',
    },
    fonts: {
      main: "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif",
      mono: "'Courier New', monospace",
    },
    assets: {
      background: 'win98/assets/insert_logo.png',
      bootLogo: 'win98/assets/boot_screen_no_bg.png',
    },
  },
  winXP: {
    id: 'winXP',
    name: 'Windows XP (Coming Soon)',
    disabled: true,
    colors: {
      gray: '#ece9d8',
      darkGray: '#808080',
      white: '#ffffff',
      black: '#000000',
      blue: '#003399',
      blueLight: '#0a77dd',
      bsodBlue: '#0000aa',
      desktop: '#3a6ea5',
      borderLight: '#ffffff',
      borderDark: '#404040',
    },
    fonts: {
      main: "'Tahoma', 'Segoe UI', sans-serif",
      mono: "'Lucida Console', monospace",
    },
    assets: {
      background: 'win98/assets/insert_logo.png',
      bootLogo: 'win98/assets/boot_screen_no_bg.png',
    },
  },
  macOS9: {
    id: 'macOS9',
    name: 'Mac OS 9 (Coming Soon)',
    disabled: true,
    colors: {
      gray: '#dddddd',
      darkGray: '#888888',
      white: '#ffffff',
      black: '#000000',
      blue: '#3366cc',
      blueLight: '#6699ff',
      bsodBlue: '#333366',
      desktop: '#6688bb',
      borderLight: '#ffffff',
      borderDark: '#666666',
    },
    fonts: {
      main: "'Chicago', 'Geneva', 'Helvetica', sans-serif",
      mono: "'Monaco', monospace",
    },
    assets: {
      background: 'win98/assets/insert_logo.png',
      bootLogo: 'win98/assets/boot_screen_no_bg.png',
    },
  },
};

export const DEFAULT_SKIN = 'win98';

export function getSkin(skinId) {
  return OS_SKINS[skinId] || OS_SKINS[DEFAULT_SKIN];
}

export function getAvailableSkins() {
  return Object.values(OS_SKINS);
}

export function getEnabledSkins() {
  return Object.values(OS_SKINS).filter(skin => !skin.disabled);
}
