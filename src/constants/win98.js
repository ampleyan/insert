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
  sweat: { id: 'sweat', label: 'SWEAT.mp4', type: 'video', src: 'win98/videos/sweat.mp4', icon: 'win98/assets/sweat.png' }
};

export const WIN98_SOUNDS = {
  click: 'win98/sounds/Single Click.wav',
  trash: 'win98/sounds/crumple.mp3',
  clink: 'win98/sounds/clink.wav'
};

export const WIN98_IDLE_TIMEOUT = 30000;
export const WIN98_ERROR_INTERVAL = 15000;
export const WIN98_ERROR_PROBABILITY = 0.7;

export const WIN98_DEFAULT_STATE = {
  bootComplete: false,
  desktopActive: false,
  selectedIcon: null,
  deletedIcons: [],
  iconPositions: {
    computer: { x: 20, y: 20 },
    notebook: { x: 20, y: 220 },
    constant: { x: 220, y: 20 },
    graftak: { x: 220, y: 220 },
    sweat: { x: 420, y: 20 }
  },
  openWindows: [],
  windowPositions: {
    notebook: { x: null, y: null },
    'video-constant': { x: 100, y: 100 },
    'video-graftak': { x: 150, y: 150 },
    'video-sweat': { x: 200, y: 200 },
    settings: { x: null, y: 50 }
  },
  windowZIndex: {},
  topZIndex: 1000,
  activeAudioVideo: null,
  videoStates: {
    constant: { playing: false, currentTime: 0, muted: true },
    graftak: { playing: false, currentTime: 0, muted: true },
    sweat: { playing: false, currentTime: 0, muted: true }
  },
  iconScale: 3,
  zoomScale: 1.8,
  soundEnabled: true,
  volume: 0.5,
  cursorTrailEnabled: true,
  format: 'reels',
  showFormatInfo: true,
  screensaverActive: false,
  screensaverTimeout: 30000,
  bsodActive: false,
  errorsEnabled: true,
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
<p>Date: [YOUR DATE HERE]</p>
<p>Time: [YOUR TIME HERE]</p>
<p>Location: [YOUR LOCATION HERE]</p>
<br>
<p>DJ Lineup:</p>
<p>- [DJ NAME 1]</p>
<p>- [DJ NAME 2]</p>
<p>- [DJ NAME 3]</p>
<br>
<p>Tickets: [TICKET LINK]</p>`,
  bsodContent: {
    location: '[YOUR LOCATION HERE]',
    date: '[YOUR DATE HERE]',
    time: '[YOUR TIME HERE]'
  }
};
