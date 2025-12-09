<template>
  <div class="video-layer" v-show="layer.visible" :style="layerContainerStyle">
    <iframe
      v-if="isYouTubeUrl && youtubeEmbedUrl"
      :src="youtubeEmbedUrl"
      class="youtube-iframe"
      :style="videoStyle"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <canvas
      v-else-if="needsCanvas"
      ref="effectCanvas"
      class="video-canvas"
      :style="canvasStyle"
    ></canvas>
    <video
      v-else
      ref="video"
      class="background-video"
      :src="videoSrc"
      :loop="layer.playback.loop"
      :muted="layer.playback.isMuted"
      :playbackRate="layer.playback.playbackRate"
      :style="videoStyle"
      autoplay
      playsinline
    ></video>
    <video
      v-if="!isYouTubeUrl"
      ref="sourceVideo"
      v-show="false"
      :src="videoSrc"
      :loop="layer.playback.loop"
      :muted="layer.playback.isMuted"
      :playbackRate="layer.playback.playbackRate"
      autoplay
      playsinline
    ></video>
  </div>
</template>

<script>
export default {
  name: 'VideoLayer',
  props: {
    layer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      videoSrc: null,
      animationFrame: null,
      isYouTubeUrl: false,
    };
  },
  computed: {
    youtubeEmbedUrl() {
      if (!this.isYouTubeUrl || !this.layer.src) return null;
      const videoId = this.extractYouTubeId(this.layer.src);
      if (!videoId) return null;
      const autoplay = this.layer.playback.isPlaying ? 1 : 0;
      const mute = this.layer.playback.isMuted ? 1 : 0;
      const loop = this.layer.playback.loop ? 1 : 0;
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${mute}&loop=${loop}&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0`;
    },
    needsCanvas() {
      return (
        !this.isYouTubeUrl &&
        (this.layer.effects.kaleidoscope ||
          this.layer.effects.mirror ||
          this.layer.effects.pixelate ||
          this.layer.effects.edgeDetect ||
          this.layer.effects.trails ||
          this.layer.effects.feedbackLoop ||
          this.layer.effects.voronoi ||
          this.layer.effects.rgbSplit ||
          this.layer.effects.datamosh ||
          this.layer.effects.chromaKey)
      );
    },
    layerContainerStyle() {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: this.layer.id,
        pointerEvents: 'none',
      };
    },
    filterString() {
      const f = this.layer.filters;
      return [
        `blur(${f.blur}px)`,
        `brightness(${f.brightness}%)`,
        `contrast(${f.contrast}%)`,
        `saturate(${f.saturate}%)`,
        `hue-rotate(${f.hue}deg)`,
        `grayscale(${f.grayscale}%)`,
        `sepia(${f.sepia}%)`,
        `invert(${f.invert}%)`,
      ].join(' ');
    },
    transformString() {
      const t = this.layer.transform;
      return `translate(${t.x}px, ${t.y}px) scale(${t.scale / 100}) rotate(${t.rotate}deg)`;
    },
    videoStyle() {
      return {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        mixBlendMode: this.layer.blendMode,
        opacity: this.layer.opacity / 100,
        filter: this.filterString,
        transform: this.transformString,
      };
    },
    canvasStyle() {
      return {
        width: '100%',
        height: '100%',
        mixBlendMode: this.layer.blendMode,
        opacity: this.layer.opacity / 100,
      };
    },
  },
  watch: {
    'layer.file'(newFile) {
      if (newFile) {
        this.videoSrc = URL.createObjectURL(newFile);
      }
    },
    'layer.src'(newSrc) {
      if (newSrc && !this.layer.file) {
        if (this.checkYouTubeUrl(newSrc)) {
          this.isYouTubeUrl = true;
          this.videoSrc = null;
        } else {
          this.isYouTubeUrl = false;
          this.videoSrc = newSrc;
        }
      }
    },
    'layer.playback.isPlaying'(playing) {
      if (this.isYouTubeUrl) return;
      if (this.$refs.video) {
        if (playing) {
          this.$refs.video.play().catch(() => {});
        } else {
          this.$refs.video.pause();
        }
      }
      if (this.$refs.sourceVideo) {
        if (playing) {
          this.$refs.sourceVideo.play().catch(() => {});
        } else {
          this.$refs.sourceVideo.pause();
        }
      }
    },
    'layer.effects': {
      handler() {
        this.stopEffect();
        this.startActiveEffect();
      },
      deep: true,
    },
  },
  mounted() {
    if (this.layer.file) {
      this.videoSrc = URL.createObjectURL(this.layer.file);
      this.isYouTubeUrl = false;
    } else if (this.layer.src) {
      if (this.checkYouTubeUrl(this.layer.src)) {
        this.isYouTubeUrl = true;
        this.videoSrc = null;
      } else {
        this.isYouTubeUrl = false;
        this.videoSrc = this.layer.src;
      }
    }

    this.$nextTick(() => {
      this.startActiveEffect();
    });
  },
  beforeUnmount() {
    this.stopEffect();
    if (this.videoSrc && this.layer.file) {
      URL.revokeObjectURL(this.videoSrc);
    }
  },
  methods: {
    checkYouTubeUrl(url) {
      if (!url) return false;
      return (
        url.includes('youtube.com') ||
        url.includes('youtu.be') ||
        url.includes('youtube-nocookie.com')
      );
    },
    extractYouTubeId(url) {
      if (!url) return null;
      let videoId = null;
      if (url.includes('youtube.com/watch?v=')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1].split('?')[0];
      }
      return videoId;
    },
    stopEffect() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    },
    startActiveEffect() {
      const effects = this.layer.effects;
      if (effects.kaleidoscope) this.startKaleidoscope();
      else if (effects.mirror) this.startMirror();
      else if (effects.pixelate) this.startPixelate();
      else if (effects.edgeDetect) this.startEdgeDetect();
      else if (effects.trails) this.startTrails();
      else if (effects.feedbackLoop) this.startFeedbackLoop();
      else if (effects.voronoi) this.startVoronoi();
      else if (effects.rgbSplit) this.startRGBSplit();
      else if (effects.datamosh) this.startDatamosh();
      else if (effects.chromaKey) this.startChromaKey();
    },
    startKaleidoscope() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const draw = () => {
        const segments = this.layer.effects.kaleidoscopeSegments;
        const angle = (2 * Math.PI) / segments;
        const radius = Math.min(canvas.width, canvas.height) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        for (let i = 0; i < segments; i++) {
          ctx.save();
          ctx.rotate(angle * i);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, radius, 0, angle);
          ctx.closePath();
          ctx.clip();

          if (i % 2 === 0) {
            ctx.scale(-1, 1);
          }

          ctx.drawImage(video, -radius, -radius, radius * 2, radius * 2);
          ctx.restore();
        }

        ctx.restore();
        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
    startMirror() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.layer.effects.mirrorAxis === 'horizontal') {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height / 2);
          ctx.save();
          ctx.scale(1, -1);
          ctx.drawImage(video, 0, -canvas.height, canvas.width, canvas.height / 2);
          ctx.restore();
        } else if (this.layer.effects.mirrorAxis === 'vertical') {
          ctx.drawImage(video, 0, 0, canvas.width / 2, canvas.height);
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(video, -canvas.width, 0, canvas.width / 2, canvas.height);
          ctx.restore();
        } else if (this.layer.effects.mirrorAxis === 'both') {
          const hw = canvas.width / 2;
          const hh = canvas.height / 2;

          ctx.drawImage(video, 0, 0, hw, hh);

          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(video, -canvas.width, 0, hw, hh);
          ctx.restore();

          ctx.save();
          ctx.scale(1, -1);
          ctx.drawImage(video, 0, -canvas.height, hw, hh);
          ctx.restore();

          ctx.save();
          ctx.scale(-1, -1);
          ctx.drawImage(video, -canvas.width, -canvas.height, hw, hh);
          ctx.restore();
        }

        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
    startPixelate() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const draw = () => {
        const size = this.layer.effects.pixelSize;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const cols = Math.ceil(w / size);
        const rows = Math.ceil(h / size);

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            ctx.drawImage(
              video,
              x * size,
              y * size,
              size,
              size,
              x * size,
              y * size,
              size,
              size
            );
          }
        }

        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
    startEdgeDetect() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const draw = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        const sobelData = new Uint8ClampedArray(pixels.length);

        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            const idx = (y * canvas.width + x) * 4;

            const gx =
              -pixels[idx - canvas.width * 4 - 4] +
              pixels[idx - canvas.width * 4 + 4] +
              -2 * pixels[idx - 4] +
              2 * pixels[idx + 4] +
              -pixels[idx + canvas.width * 4 - 4] +
              pixels[idx + canvas.width * 4 + 4];

            const gy =
              pixels[idx - canvas.width * 4 - 4] +
              2 * pixels[idx - canvas.width * 4] +
              pixels[idx - canvas.width * 4 + 4] +
              -pixels[idx + canvas.width * 4 - 4] +
              -2 * pixels[idx + canvas.width * 4] +
              -pixels[idx + canvas.width * 4 + 4];

            const mag = Math.sqrt(gx * gx + gy * gy);
            sobelData[idx] = mag;
            sobelData[idx + 1] = mag;
            sobelData[idx + 2] = mag;
            sobelData[idx + 3] = 255;
          }
        }

        const newImageData = new ImageData(sobelData, canvas.width, canvas.height);
        ctx.putImageData(newImageData, 0, 0);

        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
    startTrails() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
    startFeedbackLoop() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const draw = () => {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(1.01, 1.01);
        ctx.rotate(0.001);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        ctx.drawImage(canvas, 0, 0);
        ctx.restore();

        ctx.globalAlpha = 0.5;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
    startVoronoi() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const cellCount = this.layer.effects.voronoiCells || 50;
      const points = [];

      for (let i = 0; i < cellCount; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        });
      }

      const draw = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < canvas.height; y += 4) {
          for (let x = 0; x < canvas.width; x += 4) {
            let minDist = Infinity;
            let nearestPoint = points[0];

            for (const point of points) {
              const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
              if (dist < minDist) {
                minDist = dist;
                nearestPoint = point;
              }
            }

            const px = Math.floor(nearestPoint.x);
            const py = Math.floor(nearestPoint.y);
            const idx = (py * canvas.width + px) * 4;

            ctx.fillStyle = `rgb(${imageData.data[idx]}, ${imageData.data[idx + 1]}, ${
              imageData.data[idx + 2]
            })`;
            ctx.fillRect(x, y, 4, 4);
          }
        }

        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
    startRGBSplit() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        ctx.filter = 'contrast(200%) brightness(150%)';

        ctx.globalAlpha = 1;
        ctx.drawImage(video, -5, 0, canvas.width, canvas.height);

        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'contrast(200%) brightness(150%)';
        ctx.drawImage(video, 5, 0, canvas.width, canvas.height);

        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'lighter';
        ctx.filter = 'contrast(200%) brightness(150%)';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        ctx.restore();

        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
    startDatamosh() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let prevImageData = null;

      const draw = () => {
        if (Math.random() > 0.95) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          prevImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } else if (prevImageData) {
          const blockSize = 8;

          for (let y = 0; y < canvas.height; y += blockSize) {
            for (let x = 0; x < canvas.width; x += blockSize) {
              if (Math.random() > 0.7) {
                const offsetX = Math.floor((Math.random() - 0.5) * 20);
                const offsetY = Math.floor((Math.random() - 0.5) * 20);

                ctx.putImageData(
                  prevImageData,
                  0,
                  0,
                  x + offsetX,
                  y + offsetY,
                  blockSize,
                  blockSize
                );
              }
            }
          }
        } else {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
    startChromaKey() {
      this.stopEffect();
      const canvas = this.$refs.effectCanvas;
      const video = this.$refs.sourceVideo;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const keyColor = this.layer.effects.chromaKeyColor || [0, 255, 0];
      const threshold = this.layer.effects.chromaKeyThreshold || 40;

      const draw = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          const diff = Math.sqrt(
            (r - keyColor[0]) ** 2 + (g - keyColor[1]) ** 2 + (b - keyColor[2]) ** 2
          );

          if (diff < threshold) {
            pixels[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        this.animationFrame = requestAnimationFrame(draw);
      };

      draw();
    },
  },
};
</script>

<style scoped>
.video-layer {
  overflow: hidden;
}

.background-video,
.video-canvas,
.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}

.youtube-iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}
</style>
