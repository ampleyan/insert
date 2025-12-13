# TouchDesigner Integration Guide

## Overview
This guide explains how to integrate the Video Blend Text app with TouchDesigner for real-time parameter control and advanced compositing workflows.

## Export Methods

### 1. Transparent PNG Export (Static Frame)
**Use Case:** Single frame text overlay for compositing

**Steps:**
1. In the app, go to Settings tab
2. Click "Export PNG (Current Frame)"
3. PNG file downloads with transparent background
4. In TouchDesiner: Use `Movie File In TOP` → Load PNG → Composite over your content

**Best For:** Static titles, overlays, graphics

---

### 2. Transparent Video Recording
**Use Case:** Animated text sequences with transparency

**Steps:**
1. Settings tab → Set duration (e.g., 10 seconds)
2. Select "WebM (Transparent)" format
3. Click "Record Video (Transparent)"
4. WebM file downloads after recording completes

**TouchDesigner Import:**
```
Movie File In TOP → Load .webm file
↓
Composite TOP (Layer over your visuals)
```

**Format:** VP9 codec with alpha channel (transparency preserved)

---

### 3. Settings JSON Export
**Use Case:** Recreate effects manually in TouchDesigner

**Steps:**
1. Click "Export Settings (JSON)"
2. JSON file contains all parameters:
   - Text content, positions, font sizes
   - Animation speeds, intensities, intervals
   - Colors, blend modes, effects
   - Backdrop filters

**TouchDesigner Workflow:**
1. Load JSON using `Text DAT` or `File In DAT`
2. Parse with `Convert DAT` (JSON → Table)
3. Map values to Text TOP parameters using CHOPs

**Example JSON Structure:**
```json
{
  "version": "1.0",
  "timestamp": "2025-12-13T...",
  "settings": {
    "textLines": ["INSERT", "YOUR TEXT"],
    "fontSize": [120, 120],
    "blendMode": "difference",
    "vibrateSpeed": 50,
    "vibrateIntensity": 1,
    "hue": 180,
    "opacity": 100,
    ...
  }
}
```

---

## WebSocket Bridge (Real-Time Control)

### Architecture
```
Web App (Browser) ←→ WebSocket Server ←→ TouchDesigner (OSC/WebSocket In)
```

### Option A: Node.js WebSocket Server

**1. Install Dependencies**
```bash
npm install ws osc
```

**2. Create `websocket-bridge.js`:**
```javascript
const WebSocket = require('ws');
const osc = require('osc');

const WS_PORT = 8080;
const OSC_PORT = 7000;
const TOUCHDESIGNER_HOST = '127.0.0.1';
const TOUCHDESIGNER_OSC_PORT = 9000;

const wss = new WebSocket.Server({ port: WS_PORT });

const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: OSC_PORT,
  remoteAddress: TOUCHDESIGNER_HOST,
  remotePort: TOUCHDESIGNER_OSC_PORT,
  metadata: true
});

udpPort.open();

wss.on('connection', (ws) => {
  console.log('Web app connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      for (const [key, value] of Object.entries(data)) {
        udpPort.send({
          address: `/text/${key}`,
          args: [
            {
              type: typeof value === 'number' ? 'f' : 's',
              value: value
            }
          ]
        });
      }

      console.log('Forwarded to TouchDesigner:', data);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Web app disconnected');
  });
});

console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);
console.log(`Forwarding OSC to TouchDesigner at ${TOUCHDESIGNER_HOST}:${TOUCHDESIGNER_OSC_PORT}`);
```

**3. Run Server:**
```bash
node websocket-bridge.js
```

**4. Add WebSocket Client to Web App:**

Create `src/services/websocket.js`:
```javascript
class WebSocketBridge {
  constructor() {
    this.ws = null;
    this.connected = false;
  }

  connect(url = 'ws://localhost:8080') {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.connected = true;
      console.log('Connected to WebSocket bridge');
    };

    this.ws.onclose = () => {
      this.connected = false;
      console.log('Disconnected from WebSocket bridge');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(settings) {
    if (this.connected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(settings));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default new WebSocketBridge();
```

**5. Integrate in Settings Store:**

Add to `src/stores/settings.js`:
```javascript
import websocket from '@/services/websocket';

// In updateSettings action:
updateSettings(settings) {
  Object.assign(this.$state, settings);
  this.saveToLocalStorageDebounced();

  // Send to TouchDesigner via WebSocket
  websocket.send(this.$state);
},
```

---

### Option B: Direct WebSocket (No Server)

**TouchDesigner Setup:**
1. Add `Web Server DAT`
2. Set Port: 8080
3. Enable WebSocket
4. Add `DAT Execute` to parse incoming messages

**Python in DAT Execute:**
```python
def onReceiveText(dat, rowIndex, message):
    import json
    try:
        data = json.loads(message)

        # Map to CHOPs
        op('settings_chop')['hue'] = data.get('hue', 0)
        op('settings_chop')['opacity'] = data.get('opacity', 100) / 100.0
        op('settings_chop')['vibrateSpeed'] = data.get('vibrateSpeed', 50)

        # Update text
        op('text1').par.text = data.get('textLines', [''])[0]

    except Exception as e:
        print(f'Error parsing WebSocket message: {e}')
```

---

## TouchDesigner OSC Receiver Setup

**1. Add OSC In CHOP:**
- Network Port: 9000
- Active: ON

**2. Add Select CHOP:**
- Select patterns to extract specific parameters:
  - `/text/hue` → Hue value
  - `/text/opacity` → Opacity value
  - `/text/vibrateSpeed` → Animation speed

**3. Add Math CHOP (for scaling):**
- Map ranges (e.g., opacity 0-100 to 0-1)

**4. Connect to Text TOP:**
```
OSC In CHOP → Select CHOP → Math CHOP → Text TOP parameters
```

---

## TouchDesigner Network Example

```
[OSC In CHOP]
    ↓
[Select CHOP] (/text/*)
    ↓
[Math CHOP] (scale values)
    ↓ ↓ ↓
[Text TOP]  [Constant TOP]  [Transform TOP]
    \           |               /
     \          |              /
      [Composite TOP] ← Your text effect
```

---

## Parameter Mapping Reference

| Web App Parameter | OSC Address | TouchDesigner Use | Range |
|------------------|-------------|-------------------|-------|
| `hue` | `/text/hue` | Color shift | 0-360 |
| `opacity` | `/text/opacity` | Alpha channel | 0-100 → 0-1 |
| `vibrateSpeed` | `/text/vibrateSpeed` | Speed multiplier | 10-500 |
| `vibrateIntensity` | `/text/vibrateIntensity` | Movement scale | 1-10 |
| `blurAmount` | `/text/blurAmount` | Blur radius | 0-10 |
| `fontSize[0]` | `/text/fontSize0` | Text size | 12-200 |
| `textLines[0]` | `/text/text0` | Text content | String |
| `blendMode` | `/text/blendMode` | Comp mode | String |

---

## Advanced: Spout/Syphon Integration

**Windows (Spout):**
1. Install Spout: https://spout.zeal.co/
2. Use browser extension or Electron wrapper to send WebGL context
3. In TouchDesigner: `Spout In TOP`

**Mac (Syphon):**
1. Install Syphon: http://syphon.v002.info/
2. Similar to Spout workflow
3. In TouchDesigner: `Syphon Spout In TOP`

**Note:** Requires desktop app build, not pure browser solution

---

## Tips & Best Practices

1. **Use JSON Export First:** Get familiar with parameter structure before building real-time bridge

2. **Normalize Values:** TouchDesigner often expects 0-1 ranges; scale accordingly

3. **Debounce Updates:** Send WebSocket messages every 50-100ms to avoid flooding TouchDesigner

4. **Test Locally:** Start with localhost before network deployment

5. **Error Handling:** Add try/catch in TouchDesigner Python scripts to prevent crashes

6. **Frame Rate:** Match web app and TouchDesigner project frame rates (60fps recommended)

---

## Troubleshooting

**WebSocket Won't Connect:**
- Check firewall settings
- Verify server is running (`node websocket-bridge.js`)
- Confirm port isn't already in use

**OSC Not Receiving:**
- Check TouchDesigner OSC In CHOP port matches server config
- Use `Monitor DAT` to debug incoming OSC messages
- Verify UDP firewall rules

**Video Export Missing Alpha:**
- Ensure "WebM (Transparent)" format selected
- Some video players don't show alpha; test in TouchDesigner directly

**JSON Import Issues:**
- Validate JSON with online validator
- Check for special characters in text content
- Ensure numeric values aren't quoted strings

---

## Example Workflows

### Workflow 1: Pre-rendered Overlay
1. Design text effect in web app
2. Export as transparent WebM (10 seconds)
3. Import to TouchDesigner Movie File In TOP
4. Composite over live video feed

### Workflow 2: Real-time Typography Control
1. Start WebSocket bridge server
2. Connect web app to bridge
3. Set up OSC In CHOP in TouchDesigner
4. Adjust web app parameters → instant TouchDesigner updates
5. Use for live performances/VJ sets

### Workflow 3: Batch Processing
1. Export multiple JSON presets with different settings
2. Load in TouchDesigner with Table DAT
3. Trigger preset changes with Timeline CHOP
4. Render animation sequence

---

## Resources

- TouchDesigner Docs: https://docs.derivative.ca/
- OSC Specification: https://opensoundcontrol.stanford.edu/
- WebSocket API: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- Spout: https://spout.zeal.co/
- Syphon: http://syphon.v002.info/

---

**Questions?** Check the web app's Settings tab for export buttons and test each method!
