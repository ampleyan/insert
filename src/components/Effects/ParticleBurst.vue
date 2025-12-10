<template>
  <div class="particle-container">
    <canvas ref="canvas" @click="triggerBurst"></canvas>
    <div class="position-guides" v-if="settings.dragMode">
      <div class="position-guide x-axis"></div>
      <div class="position-guide y-axis"></div>
    </div>
    <div
      v-for="(text, index) in settings.textLines"
      :key="index"
      class="text-overlay"
      :class="{ 'draggable': settings.dragMode, 'has-path': isPathEnabled(index) }"
      :style="[getTextStyle(index), getDraggableStyle(index)]"
      @click="triggerBurst"
      @mousedown="handleMouseDown($event, index)"
      @touchstart="handleTouchStart($event, index)"
      @contextmenu="handleContextMenu($event, index)"
    >
      <span class="drag-handle" v-if="settings.dragMode">⋮⋮</span>
      <span
        class="resize-handle"
        v-if="settings.dragMode"
        @mousedown="handleResizeStart($event, index)"
        @touchstart="handleResizeStart($event, index)"
      >◢</span>
      <span
        class="edit-icon"
        v-if="settings.dragMode"
        @click.stop="openInlineEditor(index, $event)"
      >✏</span>

      <template v-if="isPathEnabled(index)">
        <span
          v-for="(letterObj, letterIndex) in getLettersForLine(index)"
          :key="`letter-${letterIndex}`"
          class="path-letter"
          :style="getLetterPositionStyle(index, letterIndex, getTextStyle(index))"
        >
          {{ letterObj.letter }}
        </span>
      </template>

      <template v-else>
        {{ text }}
      </template>
    </div>

    <InlineTextEditor
      :visible="inlineEditor.visible"
      :lineIndex="inlineEditor.lineIndex"
      :settings="settings"
      :position="inlineEditor.position"
      @update="$emit('update', $event)"
      @close="closeInlineEditor"
    />
  </div>
</template>

<script>
import draggableTextMixin from '@/mixins/draggableTextMixin';
import textPathMixin from '@/mixins/textPathMixin';
import InlineTextEditor from '@/components/InlineTextEditor.vue';

export default {
  name: 'ParticleBurst',
  components: {
    InlineTextEditor,
  },
  mixins: [draggableTextMixin, textPathMixin],
  emits: ['update'],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      particles: [],
      animationFrame: null,
      ctx: null,
    };
  },
  mounted() {
    this.initCanvas();
    this.startAnimation();
  },
  beforeUnmount() {
    this.stopAnimation();
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.ctx = canvas.getContext('2d');

      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    },
    triggerBurst(event) {
      const particleSettings = this.settings.particle || {};
      const x = event.clientX;
      const y = event.clientY;
      const particleCount = particleSettings.particleCount || 50;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = (particleSettings.burstSpeed || 2) * 2;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          size: Math.random() * (particleSettings.particleSize || 3) + 1,
        });
      }
    },
    startAnimation() {
      const animate = () => {
        this.updateParticles();
        this.drawParticles();
        this.animationFrame = requestAnimationFrame(animate);
      };
      this.animationFrame = requestAnimationFrame(animate);
    },
    stopAnimation() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    },
    updateParticles() {
      const particleSettings = this.settings.particle || {};
      const gravity = particleSettings.gravity || 0.5;
      const particleLife = particleSettings.particleLife || 2000;
      const lifeDelta = 1 / (particleLife / 16.67);

      this.particles = this.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.life -= lifeDelta;
        return p.life > 0;
      });
    },
    drawParticles() {
      this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

      this.particles.forEach((p) => {
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = this.settings.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      });

      this.ctx.globalAlpha = 1;
    },
    getTextStyle(index) {
      const fontSize = this.settings.fontSize?.[index] || 120;
      const letterSpacing = this.settings.letterSpacing?.[index] || 0;

      return {
        fontSize: `${fontSize}px`,
        color: this.settings.color,
        opacity: this.settings.opacity / 100,
        letterSpacing: `${letterSpacing}px`,
        mixBlendMode: this.settings.blendMode,
        filter: `hue-rotate(${this.settings.hue}deg)`,
      };
    },
  },
};
</script>

<style scoped>
.particle-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.text-overlay {
  position: relative;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  z-index: 1;
  pointer-events: auto;
}

.text-overlay.has-path {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.path-letter {
  display: inline-block;
  white-space: pre;
}

.text-overlay.draggable {
  transition: none;
}

.text-overlay.draggable:hover {
  outline: 2px dashed rgba(255, 255, 255, 0.3);
  outline-offset: 10px;
}

.drag-handle {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 12px;
  cursor: grab;
  pointer-events: none;
  color: white;
  z-index: 10;
}

.text-overlay.draggable:hover .drag-handle {
  opacity: 1;
}

.resize-handle {
  position: absolute;
  bottom: -25px;
  right: -25px;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 8px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 16px;
  cursor: nwse-resize;
  color: white;
  pointer-events: all;
  z-index: 10;
}

.text-overlay.draggable:hover .resize-handle {
  opacity: 1;
}

.edit-icon {
  position: absolute;
  top: -35px;
  right: -35px;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 14px;
  cursor: pointer;
  color: white;
  pointer-events: all;
  z-index: 10;
}

.text-overlay.draggable:hover .edit-icon {
  opacity: 1;
}

.position-guides {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.position-guide {
  position: fixed;
  pointer-events: none;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.position-guide.x-axis {
  width: 100%;
  height: 1px;
  top: 50%;
  left: 0;
}

.position-guide.y-axis {
  height: 100%;
  width: 1px;
  left: 50%;
  top: 0;
}
</style>
