# Video Blend Text Effect

A Vue.js application that creates a text effect with vibration/animation over a video background.

## Project Structure

```
video-blend-text/
├── src/
│   ├── App.vue                  # Main application component
│   ├── main.js                  # Application entry point
│   ├── assets/
│   │   ├── video/
│   │   │   └── back.mp4         # Background video
│   │   └── styles/
│   │       ├── main.css         # Main styles
│   │       ├── controls.css     # Control panel styles
│   │       └── animation.css    # Animation styles
│   ├── components/
│   │   ├── VideoBackground.vue  # Video background component
│   │   ├── TextEffect.vue       # Text effect component
│   │   └── ControlPanel/        # Control panel components
│   │       ├── ControlPanel.vue # Main control panel
│   │       ├── BlendControls.vue # Blend mode controls
│   │       ├── ColorControls.vue # Color controls
│   │       └── AnimationControls.vue # Animation controls
│   ├── composables/
│   │   ├── useAnimation.js      # Animation logic
│   │   └── useControls.js       # Control panel logic
│   └── constants/
│       └── blendModes.js        # Blend mode constants
├── public/
│   └── index.html               # HTML template
├── package.json                 # Project dependencies
└── vue.config.js                # Vue configuration
```

## Features

- Video background with text overlay
- Customizable blend modes
- Adjustable color settings (hue, opacity, color)
- Animation controls (speed, intensity, blur, randomness)
- Responsive design
- Keyboard shortcuts for toggling controls

## Project Setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

## Usage

- Double-click anywhere to toggle the control panel
- Press 'H' key to toggle the control panel
- Use the control panel to adjust the text effect settings