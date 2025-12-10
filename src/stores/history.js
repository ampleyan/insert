import { defineStore } from 'pinia';

export const useHistoryStore = defineStore('history', {
  state: () => ({
    past: [],
    future: [],
    maxHistory: 50,
  }),

  getters: {
    canUndo: (state) => state.past.length > 0,
    canRedo: (state) => state.future.length > 0,
  },

  actions: {
    recordState(state) {
      this.past.push(JSON.parse(JSON.stringify(state)));
      if (this.past.length > this.maxHistory) {
        this.past.shift();
      }
      this.future = [];
    },

    undo(settingsStore) {
      if (this.past.length > 0) {
        this.future.push(JSON.parse(JSON.stringify(settingsStore.$state)));
        const previousState = this.past.pop();
        settingsStore.$patch(previousState);
      }
    },

    redo(settingsStore) {
      if (this.future.length > 0) {
        this.past.push(JSON.parse(JSON.stringify(settingsStore.$state)));
        const nextState = this.future.pop();
        settingsStore.$patch(nextState);
      }
    },

    clear() {
      this.past = [];
      this.future = [];
    },
  },
});
