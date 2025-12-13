# WebSocket Bridge Quick Start

## What is this?
The WebSocket bridge lets you send real-time parameter updates from the web app to TouchDesigner for live control of text effects.

## Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install ws osc
```

### 2. Start the Bridge Server

```bash
node websocket-bridge.js
```

You should see:
```
============================================================
WebSocket to OSC Bridge for TouchDesigner
============================================================
WebSocket server: ws://localhost:8080
OSC forwarding to: 127.0.0.1:9000
Waiting for connections...
```

### 3. Configure TouchDesigner

**Add OSC In CHOP:**
1. In TouchDesigner, create `OSC In CHOP`
2. Set **Network Port** to `9000`
3. Set **Active** to `ON`

**Test Connection:**
1. Add `Monitor DAT` and connect to OSC In CHOP
2. You should see incoming `/text/*` messages when you change settings in the web app

### 4. Enable WebSocket in Web App

**Option A: Automatic (Future Feature)**
- Add WebSocket toggle to Settings tab
- Connect/disconnect button

**Option B: Manual Integration**

Add to `src/stores/settings.js`:

```javascript
import websocket from '@/services/websocket';

// In mounted/created hook:
websocket.connect('ws://localhost:8080');

// In updateSettings action:
updateSettings(settings) {
  Object.assign(this.$state, settings);
  this.saveToLocalStorageDebounced();

  // Send to TouchDesigner
  websocket.send(this.$state);
}
```

## Usage

1. **Start Bridge:** `node websocket-bridge.js`
2. **Open Web App:** Browser loads and auto-connects
3. **Adjust Parameters:** Changes instantly sent to TouchDesigner
4. **Map in TD:** Use Select CHOP to grab specific parameters

## OSC Message Format

Parameters are sent as:
```
/text/hue → 180 (float)
/text/opacity → 85 (float)
/text/fontSize0 → 120 (float)
/text/text0 → "INSERT" (string)
```

Arrays get indexed:
```
textLines: ["Line 1", "Line 2"]
→ /text/textLines0 = "Line 1"
→ /text/textLines1 = "Line 2"
```

## Example TouchDesigner Network

```
OSC In CHOP (port 9000)
    ↓
Select CHOP (chan: /text/hue)
    ↓
Math CHOP (range 0-360 → 0-1)
    ↓
Constant TOP (colorize parameter)
```

## Troubleshooting

**"Connection refused"**
- Bridge server not running → Run `node websocket-bridge.js`

**"No messages in TouchDesigner"**
- Check OSC In CHOP port = 9000
- Add Monitor DAT to see incoming messages
- Check firewall isn't blocking UDP port 9000

**"Bridge crashes on message"**
- Check Node.js version (14+ required)
- Verify `ws` and `osc` packages installed

## Advanced Configuration

**Change Ports:**

Edit `websocket-bridge.js`:
```javascript
const WS_PORT = 8080;          // WebSocket port
const TOUCHDESIGNER_OSC_PORT = 9000;  // TouchDesigner OSC In port
```

**Network Deployment:**

To run bridge on different machine:
```javascript
const TOUCHDESIGNER_HOST = '192.168.1.100';  // TD computer IP
```

In web app, connect to bridge IP:
```javascript
websocket.connect('ws://192.168.1.50:8080');
```

**Debug Mode:**

Enable verbose logging:
```bash
DEBUG=1 node websocket-bridge.js
```

## Next Steps

See `TOUCHDESIGNER_INTEGRATION.md` for:
- Complete parameter mapping reference
- Advanced TouchDesigner examples
- Spout/Syphon integration
- Video export workflows
