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
      background: 'gnome/assets/gnome-logo.png',
      bootLogo: 'gnome/assets/gnome-foot.png',
      cursor: 'gnome/assets/cursor.svg',
      icons: {
        computer: 'gnome/assets/computer.png',
        home: 'gnome/assets/home.png',
        folder: 'gnome/assets/folder.png',
        trash: 'gnome/assets/trash.png',
        floppy: 'gnome/assets/floppy.png',
        textEditor: 'gnome/assets/text-editor.png',
        settings: 'gnome/assets/settings.png',
        video: 'gnome/assets/video.png',
        gnomeFoot: 'gnome/assets/gnome-foot.png',
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
  macOSX1: {
    id: 'macOSX1',
    name: 'Mac OS X Server',
    colors: {
      gray: '#cccccc',
      darkGray: '#666666',
      white: '#ffffff',
      black: '#000000',
      blue: '#6b5b95',
      blueLight: '#8b7bb5',
      bsodBlue: '#4a4063',
      desktop: '#669980',
      desktopGradientStart: '#5a8a70',
      desktopGradientEnd: '#4a7a80',
      borderLight: '#e8e8e8',
      borderDark: '#888888',
      titleBar: '#b8a8c8',
      titleBarInactive: '#d0d0d0',
      titleBarText: '#000000',
      menuBar: '#a898b8',
      menuBarText: '#ffffff',
      windowChrome: '#d8d0e0',
      selection: '#6b5b95',
      accent: '#8878a8',
      stripe1: '#b0a0c0',
      stripe2: '#a898b8',
    },
    fonts: {
      main: "'Charcoal', 'Geneva', 'Lucida Grande', 'Helvetica Neue', Helvetica, sans-serif",
      mono: "'Monaco', 'Menlo', monospace",
    },
    assets: {
      background: null,
      bootLogo: 'mac/images/applications-other.png',
      icons: {
        computer: 'mac/images/video-display.png',
        home: 'mac/images/user-home.png',
        folder: 'mac/images/folder.png',
        trash: 'mac/images/user-trash.png',
        trashFull: 'mac/images/user-trash-full.png',
        documents: 'mac/images/folder-documents.png',
        video: 'mac/images/multimedia-player.png',
        music: 'mac/images/folder-music.png',
        pictures: 'mac/images/folder-pictures.png',
        harddisk: 'mac/images/drive-harddisk.png',
        applications: 'mac/images/applications-other.png',
        utilities: 'mac/images/applications-utilities.png',
        settings: 'mac/images/preferences-system-parental-controls.png',
      },
    },
    sounds: {
      click: 'win98/sounds/Single Click.wav',
      error: 'win98/sounds/clink.wav',
      notification: 'win98/sounds/thump.wav',
    },
    ui: {
      borderRadius: '5px',
      titleBarStyle: 'striped',
      buttonStyle: 'aqua-platinum',
      windowControls: 'left',
      menuBarPosition: 'top',
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
