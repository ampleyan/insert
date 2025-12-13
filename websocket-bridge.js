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

console.log('='.repeat(60));
console.log('WebSocket to OSC Bridge for TouchDesigner');
console.log('='.repeat(60));
console.log(`WebSocket server: ws://localhost:${WS_PORT}`);
console.log(`OSC forwarding to: ${TOUCHDESIGNER_HOST}:${TOUCHDESIGNER_OSC_PORT}`);
console.log('Waiting for connections...\n');

wss.on('connection', (ws) => {
  console.log('[✓] Web app connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      let messageCount = 0;

      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            udpPort.send({
              address: `/text/${key}${index}`,
              args: [
                {
                  type: typeof item === 'number' ? 'f' : 's',
                  value: item
                }
              ]
            });
            messageCount++;
          });
        } else {
          udpPort.send({
            address: `/text/${key}`,
            args: [
              {
                type: typeof value === 'number' ? 'f' : 's',
                value: value
              }
            ]
          });
          messageCount++;
        }
      }

      console.log(`[→] Forwarded ${messageCount} parameters to TouchDesigner`);

      if (process.env.DEBUG) {
        console.log('Sample data:', JSON.stringify(data).substring(0, 100) + '...');
      }
    } catch (error) {
      console.error('[✗] Error parsing message:', error.message);
    }
  });

  ws.on('close', () => {
    console.log('[✗] Web app disconnected');
  });

  ws.on('error', (error) => {
    console.error('[✗] WebSocket error:', error.message);
  });
});

wss.on('error', (error) => {
  console.error('[✗] Server error:', error.message);
});

udpPort.on('error', (error) => {
  console.error('[✗] OSC error:', error.message);
});

process.on('SIGINT', () => {
  console.log('\n\n[!] Shutting down...');
  udpPort.close();
  wss.close();
  process.exit(0);
});

console.log('Press Ctrl+C to stop the bridge\n');
