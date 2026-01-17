export const WIN98_BASE_PATH = process.env.BASE_URL || '/';

export const WIN98_FORMATS = {
  square: { width: 1080, height: 1080, name: 'Instagram Square Post', ratio: '1:1' },
  portrait: { width: 1080, height: 1350, name: 'Instagram Portrait Post', ratio: '4:5' },
  landscape: { width: 1080, height: 566, name: 'Instagram Landscape Post', ratio: '1.91:1' },
  reels: { width: 1080, height: 1920, name: 'Instagram Stories/Reels', ratio: '9:16' }
};

export const WIN98_ERROR_MESSAGES = [
  { title: 'Party Alert', message: 'This system has detected an excessive amount of CHAOS. Please proceed to the nearest dancefloor immediately.' },
  { title: 'Warning', message: 'Your calendar is missing a critical event. Update required.' },
  { title: 'System Notification', message: 'Dance.exe is not responding. Would you like to wait or force quit your inhibitions?' },
  { title: 'Error', message: 'FOMO levels critically high. Attendance recommended.' }
];

export const WIN98_ICONS = {
  computer: { id: 'computer', label: 'My Computer', type: 'notebook', icon: 'win98/assets/my_computer.png' },
  notebook: { id: 'notebook', label: 'Notebook', type: 'notebook', icon: 'win98/assets/notepad.png' },
  constant: { id: 'constant', label: 'IN_CONSTANT.mp4', type: 'video', src: 'win98/videos/in_constant.mp4', icon: 'win98/assets/constant.png' },
  graftak: { id: 'graftak', label: 'GRAFTAK.mp4', type: 'video', src: 'win98/videos/graftak.mp4', icon: 'win98/assets/graftak.png' },
  sweat: { id: 'sweat', label: 'SWEAT.mp4', type: 'video', src: 'win98/videos/sweat.mp4', icon: 'win98/assets/sweat.png' },
  insert_vibe: { id: 'insert_vibe', label: 'INSERT_VIBE.mp4', type: 'video', src: 'win98/videos/insert_vibe.mp4', icon: 'win98/assets/vibe1.png' },
  het_bos_vibe: { id: 'het_bos_vibe', label: 'HET_BOS_VIBE.mp4', type: 'video', src: 'win98/videos/het_bos_vibe.mp4', icon: 'win98/assets/vibe2.png' }
};

export const WIN98_SOUNDS = {
  click: 'win98/sounds/Single Click.wav',
  trash: 'win98/sounds/crumple.mp3',
  clink: 'win98/sounds/clink.wav'
};

export function getWin98AssetPath(relativePath) {
  const base = WIN98_BASE_PATH.endsWith('/') ? WIN98_BASE_PATH : WIN98_BASE_PATH + '/';
  return base + relativePath;
}

const ICON_TYPE_MAP = {
  computer: 'computer',
  notebook: 'textEditor',
  video: 'video',
  folder: 'folder',
  trash: 'trash',
  floppy: 'floppy',
  settings: 'settings',
  home: 'home',
};

export function getSkinIcon(iconId, iconType, skin) {
  if (!skin?.assets?.icons) return null;
  const skinIcons = skin.assets.icons;
  if (skinIcons[iconId]) return skinIcons[iconId];
  const mappedType = ICON_TYPE_MAP[iconType] || ICON_TYPE_MAP[iconId];
  if (mappedType && skinIcons[mappedType]) return skinIcons[mappedType];
  return null;
}

export const WIN98_IDLE_TIMEOUT = 30000;
export const WIN98_ERROR_INTERVAL = 15000;
export const WIN98_ERROR_PROBABILITY = 0.7;

export const IMPORTANCE_LEVELS = {
  headliner: { label: 'Headliner', scale: 5, color: '#ffd700' },
  support: { label: 'Support', scale: 3, color: '#c0c0c0' },
  opener: { label: 'Opener', scale: 2, color: '#cd7f32' },
  info: { label: 'Info', scale: 1, color: '#808080' }
};

export const DEFAULT_ZONES = {
  header: { y: 0, heightPercent: 15, label: 'Header', color: 'rgba(255,215,0,0.1)' },
  lineup: { y: 15, heightPercent: 70, label: 'Lineup', color: 'rgba(100,149,237,0.1)' },
  footer: { y: 85, heightPercent: 15, label: 'Footer', color: 'rgba(128,128,128,0.1)' }
};

export const DEFAULT_GRID = {
  enabled: true,
  visible: false,
  cellWidth: 80,
  cellHeight: 100,
  style: 'dots',
  snapOnRelease: true
};

export const DEFAULT_TIMELINE = {
  visible: false,
  height: 80,
  items: [],
  showOrder: false
};

export const WIN98_DEFAULT_STATE = {
  bootComplete: true,
  desktopActive: true,
  selectedIcon: null,
  deletedIcons: [],
  iconPositions: {
    computer: { x: 20, y: 20 },
    notebook: { x: 20, y: 220 },
    constant: { x: 220, y: 20 },
    graftak: { x: 220, y: 220 },
    sweat: { x: 420, y: 20 },
    insert_vibe: { x: 420, y: 220 },
    het_bos_vibe: { x: 20, y: 420 }
  },
  openWindows: [],
  windowPositions: {
    notebook: { x: null, y: null },
    'video-constant': { x: 100, y: 100 },
    'video-graftak': { x: 150, y: 150 },
    'video-sweat': { x: 200, y: 200 },
    'video-insert_vibe': { x: 250, y: 250 },
    'video-het_bos_vibe': { x: 300, y: 300 },
    settings: { x: null, y: 50 }
  },
  windowZIndex: {},
  topZIndex: 1000,
  activeAudioVideo: null,
  videoStates: {
    constant: { playing: false, currentTime: 0, muted: true },
    graftak: { playing: false, currentTime: 0, muted: true },
    sweat: { playing: false, currentTime: 0, muted: true },
    insert_vibe: { playing: false, currentTime: 0, muted: true },
    het_bos_vibe: { playing: false, currentTime: 0, muted: true }
  },
  iconScale: 3,
  iconSizes: {},
  zoomScale: 1.8,
  textScale: 2,
  autoArrange: false,
  soundEnabled: true,
  volume: 0.5,
  cursorTrailEnabled: true,
  format: 'portrait',
  showFormatInfo: true,
  screensaverActive: false,
  screensaverTimeout: 30000,
  bsodActive: false,
  errorsEnabled: false,
  errorInterval: 15000,
  errorProbability: 0.7,
  maxErrors: 5,
  errorMessages: [
    { title: 'Party Alert', message: 'This system has detected an excessive amount of CHAOS. Please proceed to the nearest dancefloor immediately.' },
    { title: 'Warning', message: 'Your calendar is missing a critical event. Update required.' },
    { title: 'System Notification', message: 'Dance.exe is not responding. Would you like to wait or force quit your inhibitions?' },
    { title: 'Error', message: 'FOMO levels critically high. Attendance recommended.' }
  ],
  errorPopups: [],
  notebookContent: `<p><strong>PARTY INFORMATION</strong></p>
<br>
      <p>Date: <b>30 JANUARY 2026</b></p>
      <p>Time: <b>TBA</b></p>
      <p>Location: <b>TRAUM</b></p>
      <br>
      <p>DJ Lineup:</p>
      <p>- INSERT CREW</p>
      <p>- BASHKKA </p>
      <p>- DANA MONTANA feat BABU</p>
      <br>
      <p>*<small><small>INSERT CREW represented by sweatlana, graftak, in_constant</small></small></p>`,
  bsodContent: {
    location: '[YOUR LOCATION HERE]',
    date: '[YOUR DATE HERE]',
    time: '[YOUR TIME HERE]'
  },
  activeSkin: 'win98',
  backgroundLayers: [],
  backgroundColor: '#008080',
  customBootLogo: null,
  folders: {},
  iconImportance: {},
  zones: { ...DEFAULT_ZONES },
  zonesVisible: false,
  grid: { ...DEFAULT_GRID },
  alignmentGuides: {
    enabled: true,
    showEdges: true,
    showCenters: true,
    threshold: 5
  },
  timeline: { ...DEFAULT_TIMELINE }
};
