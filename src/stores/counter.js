import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const usingCompositionAPI = defineStore("counter", () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

export const usingOptionsAPI = defineStore("counter", {
  state: () => ({ counter: 0 }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    increment() {
      this.counter++;
    }
  }
});
