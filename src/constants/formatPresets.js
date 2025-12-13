export const FORMAT_PRESETS = [
  {
    value: 'vertical',
    label: 'Vertical (1080x1920)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Instagram Stories/Reels'
  },
  {
    value: 'square',
    label: 'Square (1080x1080)',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Instagram Feed Square'
  },
  {
    value: 'portrait',
    label: 'Portrait (1080x1350)',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    description: 'Instagram Feed Portrait'
  },
  {
    value: 'landscape',
    label: 'Landscape (1080x566)',
    width: 1080,
    height: 566,
    aspectRatio: '1.91:1',
    description: 'Instagram Feed Landscape'
  }
];

export const DEFAULT_FORMAT = 'vertical';
