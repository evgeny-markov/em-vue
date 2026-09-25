import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoaderStore = defineStore("loader", () => {
  const isReady = ref(false);

  const complete = () => {
    isReady.value = true;
  };

  return {
    isReady,
    complete,
  };
});
