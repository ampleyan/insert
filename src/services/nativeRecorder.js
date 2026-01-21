import html2canvas from 'html2canvas';

class NativeRecorder {
  constructor() {
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.canvas = null;
    this.canvasContext = null;
    this.stream = null;
    this.captureInterval = null;
    this.frameRate = 30;
    this.targetElement = null;
    this.width = 1080;
    this.height = 1920;
    this.onTimeUpdate = null;
    this.startTime = null;
  }

  async startRecording(element, width, height, options = {}) {
    if (this.isRecording) {
      throw new Error('Recording already in progress');
    }

    this.targetElement = element;
    this.width = width;
    this.height = height;
    this.frameRate = options.frameRate || 30;
    this.onTimeUpdate = options.onTimeUpdate || null;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvasContext = this.canvas.getContext('2d', { alpha: false });

    this.stream = this.canvas.captureStream(this.frameRate);

    const mimeType = this.getSupportedMimeType();
    const videoBitsPerSecond = options.videoBitsPerSecond || 8000000;

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType,
      videoBitsPerSecond,
    });

    this.recordedChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.finalizeRecording();
    };

    this.mediaRecorder.start(100);
    this.isRecording = true;
    this.startTime = Date.now();

    this.startCapturing();

    return true;
  }

  startCapturing() {
    const captureFrame = async () => {
      if (!this.isRecording) return;

      try {
        const canvas = await html2canvas(this.targetElement, {
          width: this.width,
          height: this.height,
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          windowWidth: this.width,
          windowHeight: this.height,
        });

        this.canvasContext.drawImage(canvas, 0, 0, this.width, this.height);

        if (this.onTimeUpdate) {
          const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
          this.onTimeUpdate(elapsed);
        }
      } catch (error) {
        console.error('Error capturing frame:', error);
      }
    };

    const intervalMs = 1000 / this.frameRate;
    this.captureInterval = setInterval(captureFrame, intervalMs);

    captureFrame();
  }

  stopRecording() {
    if (!this.isRecording) {
      return null;
    }

    this.isRecording = false;

    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    return new Promise((resolve) => {
      const checkAndResolve = () => {
        if (this.mediaRecorder.state === 'inactive') {
          resolve(this.getBlob());
        } else {
          setTimeout(checkAndResolve, 100);
        }
      };
      checkAndResolve();
    });
  }

  finalizeRecording() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.canvas = null;
    this.canvasContext = null;
    this.targetElement = null;
  }

  getBlob() {
    if (this.recordedChunks.length === 0) {
      return null;
    }

    return new Blob(this.recordedChunks, {
      type: this.getSupportedMimeType(),
    });
  }

  downloadRecording(filename) {
    const blob = this.getBlob();
    if (!blob) {
      console.error('No recording data available');
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `recording-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  getSupportedMimeType() {
    const types = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm;codecs=h264',
      'video/webm',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'video/webm';
  }

  getRecordingTime() {
    if (!this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }
}

export default new NativeRecorder();
