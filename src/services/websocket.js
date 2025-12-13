class WebSocketBridge {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.url = 'ws://localhost:8080';
  }

  connect(url = this.url) {
    this.url = url;

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('[WebSocket] Connected to bridge');
      };

      this.ws.onclose = () => {
        this.connected = false;
        console.log('[WebSocket] Disconnected from bridge');

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`[WebSocket] Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          setTimeout(() => this.connect(), this.reconnectDelay);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };

      this.ws.onmessage = (event) => {
        console.log('[WebSocket] Received:', event.data);
      };
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
    }
  }

  send(settings) {
    if (this.connected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const payload = JSON.stringify(settings);
        this.ws.send(payload);
      } catch (error) {
        console.error('[WebSocket] Send failed:', error);
      }
    } else {
      console.warn('[WebSocket] Not connected, cannot send data');
    }
  }

  disconnect() {
    if (this.ws) {
      this.reconnectAttempts = this.maxReconnectAttempts;
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketBridge();
