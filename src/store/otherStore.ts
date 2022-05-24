import { defineStore } from 'pinia';

export const useOtherStore = defineStore('other', {
  state: () => ({
    name: ''
  }),
  actions: {
    setName(data: string) {
      this.name = data;
    }
  }
});
