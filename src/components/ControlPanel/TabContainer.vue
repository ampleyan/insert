<template>
  <div class="tab-container">
    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
        :aria-selected="activeTab === tab.name"
        role="tab"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>
    <div class="tab-content">
      <slot :name="activeTab"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabContainer',
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    defaultTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeTab: this.defaultTab || this.tabs[0]?.name || '',
    };
  },
};
</script>

<style scoped>
.tab-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab-nav {
  display: flex;
  gap: 2px;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-nav button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  min-width: 60px;
}

.tab-nav button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

.tab-nav button.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.tab-icon {
  font-size: 18px;
  line-height: 1;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
}
</style>
