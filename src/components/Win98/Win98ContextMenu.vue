<template>
  <div
    v-if="visible"
    class="win98-context-menu"
    :style="menuStyle"
    @click.stop
  >
    <div
      class="menu-item has-submenu"
      @mouseenter="!isTouchDevice && (openSubmenu = 'arrange')"
      @mouseleave="!isTouchDevice && (openSubmenu = null)"
      @click.stop="toggleSubmenu('arrange')"
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
    <template v-if="selectedIcon && selectedIconType === 'folder'">
      <div class="menu-separator"></div>
      <div class="menu-item" @click="$emit('action', 'set-folder-thumbnail')">
        Set Thumbnail...
      </div>
    </template>
    <div class="menu-separator"></div>
    <div
      class="menu-item has-submenu"
      @mouseenter="!isTouchDevice && (openSubmenu = 'new')"
      @mouseleave="!isTouchDevice && (openSubmenu = null)"
      @click.stop="toggleSubmenu('new')"
    >
      <span>New</span>
      <span class="arrow">&#9654;</span>
      <div v-if="openSubmenu === 'new'" class="submenu">
        <div class="menu-item" @click="$emit('action', 'add-icon')">
          Icon
        </div>
        <div class="menu-item" @click="$emit('action', 'add-video')">
          Video
        </div>
        <div class="menu-separator"></div>
        <div class="menu-item" @click="$emit('action', 'new-folder')">
          Folder
        </div>
        <div class="menu-item disabled">
          Shortcut
        </div>
      </div>
    </div>
    <div class="menu-separator"></div>
    <div
      class="menu-item has-submenu"
      @mouseenter="!isTouchDevice && (openSubmenu = 'align')"
      @mouseleave="!isTouchDevice && (openSubmenu = null)"
      @click.stop="toggleSubmenu('align')"
    >
      <span>Align Icons</span>
      <span class="arrow">&#9654;</span>
      <div v-if="openSubmenu === 'align'" class="submenu">
        <div class="menu-item" @click="$emit('action', 'align-left')">
          Align Left
        </div>
        <div class="menu-item" @click="$emit('action', 'align-right')">
          Align Right
        </div>
        <div class="menu-item" @click="$emit('action', 'align-top')">
          Align Top
        </div>
        <div class="menu-item" @click="$emit('action', 'align-bottom')">
          Align Bottom
        </div>
        <div class="menu-item" @click="$emit('action', 'align-center')">
          Center All
        </div>
      </div>
    </div>
    <div
      class="menu-item has-submenu"
      @mouseenter="!isTouchDevice && (openSubmenu = 'distribute')"
      @mouseleave="!isTouchDevice && (openSubmenu = null)"
      @click.stop="toggleSubmenu('distribute')"
    >
      <span>Distribute Icons</span>
      <span class="arrow">&#9654;</span>
      <div v-if="openSubmenu === 'distribute'" class="submenu">
        <div class="menu-item" @click="$emit('action', 'distribute-horizontal')">
          Horizontally
        </div>
        <div class="menu-item" @click="$emit('action', 'distribute-vertical')">
          Vertically
        </div>
        <div class="menu-item" @click="$emit('action', 'distribute-grid')">
          Even Grid
        </div>
        <div class="menu-item" @click="$emit('action', 'distribute-circle')">
          Circle Pattern
        </div>
      </div>
    </div>
    <div class="menu-separator"></div>
    <div
      class="menu-item has-submenu"
      @mouseenter="!isTouchDevice && (openSubmenu = 'size')"
      @mouseleave="!isTouchDevice && (openSubmenu = null)"
      @click.stop="toggleSubmenu('size')"
    >
      <span>Icon Size</span>
      <span class="arrow">&#9654;</span>
      <div v-if="openSubmenu === 'size'" class="submenu size-submenu">
        <template v-if="selectedIcon">
          <div class="menu-header">Selected Icon</div>
          <div class="menu-item" @click="$emit('action', 'size-selected-1')">1x</div>
          <div class="menu-item" @click="$emit('action', 'size-selected-2')">2x</div>
          <div class="menu-item" @click="$emit('action', 'size-selected-3')">3x</div>
          <div class="menu-item" @click="$emit('action', 'size-selected-4')">4x</div>
          <div class="menu-item" @click="$emit('action', 'size-selected-5')">5x</div>
          <div class="menu-separator"></div>
        </template>
        <div class="menu-header">All Icons</div>
        <div class="menu-item" @click="$emit('action', 'size-all-1')">1x</div>
        <div class="menu-item" @click="$emit('action', 'size-all-2')">2x</div>
        <div class="menu-item" @click="$emit('action', 'size-all-3')">3x</div>
        <div class="menu-item" @click="$emit('action', 'size-all-4')">4x</div>
        <div class="menu-item" @click="$emit('action', 'size-all-5')">5x</div>
        <div class="menu-separator"></div>
        <div class="menu-item" @click="$emit('action', 'size-reset')">Reset All</div>
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
    <div
      class="menu-item has-submenu"
      @mouseenter="!isTouchDevice && (openSubmenu = 'view')"
      @mouseleave="!isTouchDevice && (openSubmenu = null)"
      @click.stop="toggleSubmenu('view')"
    >
      <span>View</span>
      <span class="arrow">&#9654;</span>
      <div v-if="openSubmenu === 'view'" class="submenu">
        <div class="menu-item" @click="$emit('action', 'toggle-zones')">
          <span class="check">{{ zonesVisible ? '&#10003;' : '' }}</span>
          Show Zones
        </div>
        <div class="menu-item" @click="$emit('action', 'toggle-grid')">
          <span class="check">{{ gridVisible ? '&#10003;' : '' }}</span>
          Show Grid
        </div>
        <div class="menu-item" @click="$emit('action', 'toggle-timeline')">
          <span class="check">{{ timelineVisible ? '&#10003;' : '' }}</span>
          Show Timeline
        </div>
      </div>
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
    selectedIcon: String,
    selectedIconType: String,
    zonesVisible: Boolean,
    gridVisible: Boolean,
    timelineVisible: Boolean,
  },
  emits: ['action', 'close'],
  data() {
    return {
      openSubmenu: null,
    };
  },
  computed: {
    menuStyle() {
      let x = this.x;
      let y = this.y;
      const menuWidth = 200;
      const menuHeight = 400;
      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
      }
      if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 10;
      }
      if (x < 0) x = 10;
      if (y < 0) y = 10;
      return {
        left: x + 'px',
        top: y + 'px',
      };
    },
    isTouchDevice() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
  },
  watch: {
    visible(val) {
      if (val) {
        setTimeout(() => {
          document.addEventListener('click', this.handleOutsideClick);
          document.addEventListener('contextmenu', this.handleOutsideClick);
        }, 0);
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
    toggleSubmenu(submenuName) {
      if (this.isTouchDevice) {
        this.openSubmenu = this.openSubmenu === submenuName ? null : submenuName;
      }
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

.size-submenu {
  min-width: 100px;
}

.menu-header {
  padding: 4px 24px 2px 8px;
  font-weight: bold;
  color: #000080;
  font-size: 10px;
  text-transform: uppercase;
  cursor: default;
}

@media (max-width: 768px) {
  .win98-context-menu {
    font-size: 14px;
    min-width: 200px;
    max-width: calc(100vw - 20px);
  }

  .menu-item {
    padding: 10px 30px 10px 30px;
    min-height: 44px;
    display: flex;
    align-items: center;
  }

  .menu-item.has-submenu {
    padding-right: 40px;
  }

  .menu-item .arrow {
    right: 10px;
    font-size: 12px;
  }

  .submenu {
    position: fixed;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%);
    max-height: 80vh;
    overflow-y: auto;
    z-index: 10001;
  }

  .menu-header {
    padding: 8px 24px 4px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .win98-context-menu {
    font-size: 13px;
    min-width: 180px;
  }

  .menu-item {
    padding: 8px 25px 8px 25px;
  }
}
</style>
