<template>
  <div
    v-if="visible"
    class="win98-context-menu"
    :style="menuStyle"
    @click.stop
  >
    <div
      class="menu-item has-submenu"
      @mouseenter="openSubmenu = 'arrange'"
      @mouseleave="openSubmenu = null"
    >
      <span>Arrange Icons</span>
      <span class="arrow">&#9654;</span>
      <div v-if="openSubmenu === 'arrange'" class="submenu">
        <div class="menu-item" @click="$emit('action', 'arrange-name')">
          <span class="check">{{ autoArrange ? '' : '' }}</span>
          by Name
        </div>
        <div class="menu-item" @click="$emit('action', 'arrange-type')">
          <span class="check"></span>
          by Type
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item" @click="$emit('action', 'auto-arrange')">
          <span class="check">{{ autoArrange ? '&#10003;' : '' }}</span>
          Auto Arrange
        </div>
        <div class="menu-item" @click="$emit('action', 'align-grid')">
          <span class="check"></span>
          Align to Grid
        </div>
      </div>
    </div>
    <div class="menu-item" @click="$emit('action', 'line-up')">
      Line up Icons
    </div>
    <div class="menu-separator"></div>
    <div class="menu-item" @click="$emit('action', 'refresh')">
      Refresh
    </div>
    <div class="menu-separator"></div>
    <div
      class="menu-item has-submenu"
      @mouseenter="openSubmenu = 'new'"
      @mouseleave="openSubmenu = null"
    >
      <span>New</span>
      <span class="arrow">&#9654;</span>
      <div v-if="openSubmenu === 'new'" class="submenu">
        <div class="menu-item disabled">
          Folder
        </div>
        <div class="menu-item disabled">
          Shortcut
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item disabled">
          Text Document
        </div>
      </div>
    </div>
    <div class="menu-separator"></div>
    <div
      class="menu-item"
      :class="{ disabled: !hasDeletedIcons }"
      @click="hasDeletedIcons && $emit('action', 'restore-all')"
    >
      Restore All Icons
    </div>
    <div class="menu-separator"></div>
    <div class="menu-item" @click="$emit('action', 'properties')">
      Properties
    </div>
  </div>
</template>

<script>
export default {
  name: 'Win98ContextMenu',
  props: {
    visible: Boolean,
    x: Number,
    y: Number,
    autoArrange: Boolean,
    hasDeletedIcons: Boolean,
  },
  emits: ['action', 'close'],
  data() {
    return {
      openSubmenu: null,
    };
  },
  computed: {
    menuStyle() {
      return {
        left: this.x + 'px',
        top: this.y + 'px',
      };
    },
  },
  watch: {
    visible(val) {
      if (val) {
        document.addEventListener('click', this.handleOutsideClick);
        document.addEventListener('contextmenu', this.handleOutsideClick);
      } else {
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('contextmenu', this.handleOutsideClick);
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('contextmenu', this.handleOutsideClick);
  },
  methods: {
    handleOutsideClick() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.win98-context-menu {
  position: fixed;
  background: var(--win98-gray);
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
  padding: 2px;
  min-width: 180px;
  z-index: 10000;
  font-family: var(--win98-font);
  font-size: 11px;
}

.menu-item {
  padding: 4px 24px 4px 24px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.menu-item:hover:not(.disabled) {
  background: #000080;
  color: #fff;
}

.menu-item.disabled {
  color: #808080;
  cursor: default;
}

.menu-item.has-submenu {
  padding-right: 20px;
}

.menu-item .arrow {
  position: absolute;
  right: 6px;
  font-size: 8px;
}

.menu-item .check {
  position: absolute;
  left: 6px;
  width: 12px;
  font-size: 10px;
}

.menu-separator {
  height: 1px;
  background: #808080;
  margin: 3px 2px;
  border-bottom: 1px solid #fff;
}

.submenu {
  position: absolute;
  left: 100%;
  top: -2px;
  background: var(--win98-gray);
  border: 2px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
  padding: 2px;
  min-width: 150px;
}
</style>
