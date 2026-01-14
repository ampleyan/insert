<template>
  <div class="win98-settings">
    <div class="settings-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'display' }"
        @click="activeTab = 'display'"
      >Display</button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'errors' }"
        @click="activeTab = 'errors'"
      >Errors</button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'effects' }"
        @click="activeTab = 'effects'"
      >Effects</button>
    </div>

    <div class="settings-content">
      <template v-if="activeTab === 'display'">
        <div class="setting-row">
          <label class="win98-label">Icon Scale: {{ win98.iconScale.toFixed(1) }}</label>
          <input
            type="range"
            class="win98-slider"
            min="0.5"
            max="5"
            step="0.1"
            :value="win98.iconScale"
            @input="updateSetting('iconScale', parseFloat($event.target.value))"
          />
        </div>

        <div class="setting-row">
          <label class="win98-label">Zoom Scale: {{ win98.zoomScale.toFixed(1) }}</label>
          <input
            type="range"
            class="win98-slider"
            min="1.2"
            max="3"
            step="0.1"
            :value="win98.zoomScale"
            @input="updateSetting('zoomScale', parseFloat($event.target.value))"
          />
        </div>

        <div class="setting-row">
          <label class="win98-label">Text Scale: {{ win98.textScale.toFixed(1) }}</label>
          <input
            type="range"
            class="win98-slider"
            min="0.5"
            max="5"
            step="0.1"
            :value="win98.textScale"
            @input="updateSetting('textScale', parseFloat($event.target.value))"
          />
        </div>

        <div class="setting-row">
          <label class="win98-label">
            <input
              type="checkbox"
              class="win98-checkbox"
              :checked="win98.soundEnabled"
              @change="updateSetting('soundEnabled', $event.target.checked)"
            />
            Enable Sounds
          </label>
        </div>

        <div class="setting-row">
          <label class="win98-label">Volume: {{ Math.round(win98.volume * 100) }}%</label>
          <input
            type="range"
            class="win98-slider"
            min="0"
            max="1"
            step="0.01"
            :value="win98.volume"
            @input="updateSetting('volume', parseFloat($event.target.value))"
          />
        </div>

        <div class="setting-row">
          <label class="win98-label">Format:</label>
          <select
            class="win98-select"
            :value="win98.format"
            @change="updateSetting('format', $event.target.value)"
          >
            <option value="reels">Stories/Reels (9:16)</option>
            <option value="square">Square (1:1)</option>
            <option value="portrait">Portrait (4:5)</option>
            <option value="landscape">Landscape (1.91:1)</option>
          </select>
        </div>

        <div class="setting-row">
          <label class="win98-label">
            <input
              type="checkbox"
              class="win98-checkbox"
              :checked="win98.showFormatInfo"
              @change="updateSetting('showFormatInfo', $event.target.checked)"
            />
            Show Format Boundary
          </label>
        </div>
      </template>

      <template v-if="activeTab === 'errors'">
        <div class="setting-row">
          <label class="win98-label">
            <input
              type="checkbox"
              class="win98-checkbox"
              :checked="win98.errorsEnabled"
              @change="updateSetting('errorsEnabled', $event.target.checked)"
            />
            Enable Auto Errors
          </label>
        </div>

        <div class="setting-row">
          <label class="win98-label">Interval: {{ (win98.errorInterval / 1000).toFixed(0) }}s</label>
          <input
            type="range"
            class="win98-slider"
            min="3000"
            max="60000"
            step="1000"
            :value="win98.errorInterval"
            @input="updateSetting('errorInterval', parseInt($event.target.value))"
          />
        </div>

        <div class="setting-row">
          <label class="win98-label">Probability: {{ Math.round(win98.errorProbability * 100) }}%</label>
          <input
            type="range"
            class="win98-slider"
            min="0"
            max="1"
            step="0.1"
            :value="win98.errorProbability"
            @input="updateSetting('errorProbability', parseFloat($event.target.value))"
          />
        </div>

        <div class="setting-row">
          <label class="win98-label">Max Concurrent: {{ win98.maxErrors }}</label>
          <input
            type="range"
            class="win98-slider"
            min="1"
            max="10"
            step="1"
            :value="win98.maxErrors"
            @input="updateSetting('maxErrors', parseInt($event.target.value))"
          />
        </div>

        <div class="setting-row">
          <label class="win98-label">Error Messages:</label>
          <div class="error-messages-list">
            <div
              v-for="(msg, index) in win98.errorMessages"
              :key="index"
              class="error-message-item"
            >
              <input
                type="text"
                class="win98-input"
                :value="msg.title"
                @input="updateErrorMessage(index, 'title', $event.target.value)"
                placeholder="Title"
              />
              <input
                type="text"
                class="win98-input message-input"
                :value="msg.message"
                @input="updateErrorMessage(index, 'message', $event.target.value)"
                placeholder="Message"
              />
              <button class="win98-button delete-btn" @click="removeErrorMessage(index)">X</button>
            </div>
            <button class="win98-button add-btn" @click="addErrorMessage">+ Add Message</button>
          </div>
        </div>
      </template>

      <template v-if="activeTab === 'effects'">
        <div class="setting-row">
          <label class="win98-label">
            <input
              type="checkbox"
              class="win98-checkbox"
              :checked="win98.cursorTrailEnabled"
              @change="updateSetting('cursorTrailEnabled', $event.target.checked)"
            />
            Cursor Trail
          </label>
        </div>

        <div class="setting-row">
          <label class="win98-label">Screensaver Timeout: {{ (win98.screensaverTimeout / 1000).toFixed(0) }}s</label>
          <input
            type="range"
            class="win98-slider"
            min="5000"
            max="120000"
            step="5000"
            :value="win98.screensaverTimeout"
            @input="updateSetting('screensaverTimeout', parseInt($event.target.value))"
          />
        </div>

        <div class="setting-row button-row">
          <button class="win98-button" @click="triggerScreensaver">
            Trigger Screensaver (S)
          </button>
        </div>

        <div class="setting-row button-row">
          <button class="win98-button bsod-button" @click="triggerBSOD">
            Trigger BSOD (B)
          </button>
        </div>

        <div class="setting-row button-row">
          <button class="win98-button" @click="triggerError">
            Trigger Error (E)
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '../../stores/settings';

export default {
  name: 'Win98Settings',
  setup() {
    const settingsStore = useSettingsStore();
    return { settingsStore };
  },
  data() {
    return {
      activeTab: 'display',
    };
  },
  computed: {
    win98() {
      return this.settingsStore.win98;
    },
  },
  methods: {
    updateSetting(key, value) {
      this.settingsStore.win98UpdateSettings({ [key]: value });
    },
    updateErrorMessage(index, field, value) {
      const messages = [...this.win98.errorMessages];
      messages[index] = { ...messages[index], [field]: value };
      this.settingsStore.win98UpdateSettings({ errorMessages: messages });
    },
    addErrorMessage() {
      const messages = [...this.win98.errorMessages, { title: 'New Error', message: 'Error message text' }];
      this.settingsStore.win98UpdateSettings({ errorMessages: messages });
    },
    removeErrorMessage(index) {
      const messages = this.win98.errorMessages.filter((_, i) => i !== index);
      this.settingsStore.win98UpdateSettings({ errorMessages: messages });
    },
    triggerBSOD() {
      this.settingsStore.win98TriggerBSOD();
    },
    triggerScreensaver() {
      this.settingsStore.win98ActivateScreensaver();
    },
    triggerError() {
      const messages = this.win98.errorMessages;
      if (messages.length === 0) return;
      const randomError = messages[Math.floor(Math.random() * messages.length)];
      this.settingsStore.win98ShowError(randomError);
    },
  },
};
</script>

<style scoped>
.win98-settings {
  background: var(--win98-gray);
  min-width: 350px;
}

.settings-tabs {
  display: flex;
  border-bottom: 2px solid var(--win98-dark-gray);
  padding: 4px 4px 0;
  background: var(--win98-gray);
}

.tab-btn {
  padding: 4px 12px;
  background: var(--win98-gray);
  border: 2px solid;
  border-color: var(--win98-border-light) var(--win98-border-dark) var(--win98-gray) var(--win98-border-light);
  border-bottom: none;
  margin-right: 2px;
  font-family: var(--win98-font);
  font-size: 11px;
  cursor: pointer;
  position: relative;
  top: 2px;
}

.tab-btn.active {
  background: var(--win98-gray);
  border-bottom: 2px solid var(--win98-gray);
  z-index: 1;
}

.settings-content {
  padding: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.setting-row {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.win98-slider {
  width: 100%;
}

.win98-select {
  width: 100%;
  padding: 4px;
}

.button-row {
  margin-top: 8px;
}

.button-row .win98-button {
  width: 100%;
}

.bsod-button {
  background: #aa0000;
  color: white;
}

.bsod-button:hover {
  background: #cc0000;
}

.error-messages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.error-message-item {
  display: flex;
  gap: 4px;
  align-items: center;
}

.error-message-item .win98-input {
  flex: 1;
}

.error-message-item .message-input {
  flex: 2;
}

.delete-btn {
  padding: 2px 8px;
  min-width: auto;
}

.add-btn {
  margin-top: 4px;
}
</style>
