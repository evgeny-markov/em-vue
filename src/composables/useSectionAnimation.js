import { nextTick, onUnmounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import gsap from "gsap";
import { useLoaderStore } from "@/stores/loader";

export function useSectionAnimation(root, setup) {
  const loaderStore = useLoaderStore();
  const { isReady } = storeToRefs(loaderStore);
  const { locale } = useI18n();
  let mm;

  const run = () => {
    if (!root.value) {
      return;
    }

    mm?.revert();
    mm = gsap.matchMedia();
    setup(mm, root.value);
  };

  watch(
    [isReady, locale],
    async ([ready]) => {
      if (!ready) {
        return;
      }

      await nextTick();
      await nextTick();

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      run();
    },
    { immediate: true },
  );

  onUnmounted(() => {
    mm?.revert();
  });
}
