<template>
  <div class="audio-controls">
    <h3>Audio Sync</h3>

    <div class="control-group">
      <label>
        <input type="file" accept="audio/*" @change="handleAudioUpload" ref="audioInput" />
        <span>Upload Audio File</span>
      </label>

      <div v-if="audioFileName" class="audio-info">
        <span>{{ audioFileName }}</span>
        <button @click="clearAudio" class="btn-small">Remove</button>
      </div>
    </div>

    <div v-if="audioFileName" class="control-group">
      <label>
        <input
          type="checkbox"
          :checked="settings.audioSync?.enabled"
          @change="updateAudioSync({ enabled: $event.target.checked })"
        />
        <span>Enable Audio Sync</span>
      </label>
    </div>

    <div v-if="settings.audioSync?.enabled" class="control-group">
      <label>
        Audio Influence
        <input
          type="range"
          min="0"
          max="100"
          :value="settings.audioSync?.influence || 50"
          @input="updateAudioSync({ influence: parseInt($event.target.value) })"
        />
        <span class="value">{{ settings.audioSync?.influence || 50 }}%</span>
      </label>
    </div>

    <div v-if="settings.audioSync?.enabled" class="control-group">
      <label>Sync Target</label>
      <select
        :value="settings.audioSync?.target || 'amplitude'"
        @change="updateAudioSync({ target: $event.target.value })"
      >
        <option value="amplitude">Amplitude (Overall)</option>
        <option value="bass">Bass</option>
        <option value="mid">Mid</option>
        <option value="treble">Treble</option>
        <option value="beat">Beat Detection</option>
      </select>
    </div>

    <div v-if="settings.audioSync?.enabled" class="control-group">
      <label>Apply To</label>
      <select
        :value="settings.audioSync?.applyTo || 'intensity'"
        @change="updateAudioSync({ applyTo: $event.target.value })"
      >
        <option value="intensity">Animation Intensity</option>
        <option value="scale">Scale</option>
        <option value="color">Color Shift</option>
        <option value="glitch">Glitch Amount</option>
      </select>
    </div>

    <div v-if="audioFileName && settings.audioSync?.enabled" class="playback-controls">
      <button @click="$emit('play')" class="btn-play">▶</button>
      <button @click="$emit('pause')" class="btn-pause">⏸</button>
      <button @click="$emit('stop')" class="btn-stop">⏹</button>
      <label>
        Volume
        <input
          type="range"
          min="0"
          max="100"
          :value="(settings.audioSync?.volume || 1) * 100"
          @input="updateAudioSync({ volume: parseFloat($event.target.value) / 100 })"
        />
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AudioControls',
  emits: ['update', 'play', 'pause', 'stop', 'audioFile'],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      audioFileName: null,
    };
  },
  methods: {
    handleAudioUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.audioFileName = file.name;
        this.$emit('audioFile', file);
        this.updateAudioSync({ enabled: true });
      }
    },
    clearAudio() {
      this.audioFileName = null;
      this.$refs.audioInput.value = '';
      this.$emit('audioFile', null);
      this.updateAudioSync({ enabled: false });
    },
    updateAudioSync(partial) {
      const audioSync = {
        ...(this.settings.audioSync || {}),
        ...partial,
      };
      this.$emit('update', { audioSync });
    },
  },
};
</script>

<style scoped>
.audio-controls {
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 15px;
}

h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #fff;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 14px;
}

.control-group input[type="file"] {
  display: none;
}

.control-group label[for] {
  cursor: pointer;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.control-group label[for]:hover {
  background: rgba(255, 255, 255, 0.2);
}

.audio-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-top: 8px;
}

.audio-info span {
  color: #fff;
  font-size: 13px;
}

.btn-small {
  padding: 4px 12px;
  background: rgba(255, 0, 0, 0.3);
  border: 1px solid rgba(255, 0, 0, 0.5);
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
}

.btn-small:hover {
  background: rgba(255, 0, 0, 0.5);
}

input[type="range"] {
  flex: 1;
  margin: 0 10px;
}

select {
  flex: 1;
  padding: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
}

.value {
  min-width: 40px;
  text-align: right;
}

.playback-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 10px;
}

.playback-controls button {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
}

.playback-controls button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.playback-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  font-size: 13px;
}
</style>
