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
    sounds: {
      click: 'win98/sounds/Single Click.wav',
      error: 'win98/sounds/clink.wav',
      notification: 'win98/sounds/thump.wav',
    },
    ui: {
      borderRadius: '0px',
      titleBarStyle: 'gradient',
      buttonStyle: 'beveled',
    },
  },
  gnome: {
    id: 'gnome',
    name: 'GNOME Classic',
    colors: {
      gray: '#d6d6d6',
      darkGray: '#8e8e8e',
      white: '#ffffff',
      black: '#000000',
      blue: '#305080',
      blueLight: '#4a7090',
      bsodBlue: '#2e3436',
      desktop: '#347474',
      borderLight: '#ffffff',
      borderDark: '#5a5a5a',
      titleBar: '#a0a0a0',
      titleBarInactive: '#c0c0c0',
      panel: '#404040',
      panelText: '#ffffff',
      accent: '#305080',
      selection: '#305080',
    },
    fonts: {
      main: "'Helvetica', 'DejaVu Sans', 'Bitstream Vera Sans', Arial, sans-serif",
      mono: "'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', monospace",
    },
    assets: {
      background: 'win98/gnome/gnome-logo.png',
      bootLogo: 'win98/gnome/gnome-foot.png',
      cursor: 'win98/gnome/cursor.svg',
      icons: {
        computer: 'win98/gnome/computer.png',
        home: 'win98/gnome/home.png',
        folder: 'win98/gnome/folder.png',
        trash: 'win98/gnome/trash.png',
        floppy: 'win98/gnome/floppy.png',
        textEditor: 'win98/gnome/text-editor.png',
        settings: 'win98/gnome/settings.png',
        video: 'win98/gnome/video.png',
        gnomeFoot: 'win98/gnome/gnome-foot.png',
      },
    },
    sounds: {
      click: 'win98/sounds/gnome/clicked.wav',
      activate: 'win98/sounds/gnome/activate.wav',
      error: 'win98/sounds/gnome/warning.wav',
      notification: 'win98/sounds/gnome/generic.wav',
      toggle: 'win98/sounds/gnome/toggled.wav',
    },
    ui: {
      borderRadius: '0px',
      titleBarStyle: 'solid',
      buttonStyle: 'gtk',
      windowControls: 'right',
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
