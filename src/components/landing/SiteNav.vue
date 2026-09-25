<template>
  <header ref="root" class="sitenav">
    <div class="sitenav__progress" aria-hidden="true">
      <div
        class="sitenav__progress-fill"
        :style="{ width: `${scrollProgress}%` }"
      ></div>
    </div>

    <div class="sitenav__inner layout">
      <button
        class="sitenav__logo"
        type="button"
        :aria-label="t('nav.home')"
        @click="scrollTo('#hero')"
      >
        EM
      </button>

      <nav class="sitenav__links" :aria-label="t('nav.home')">
        <button
          v-for="link in NAV_LINKS"
          :key="link.id"
          class="sitenav__link"
          type="button"
          :class="{ 'is-active': activeId === link.id }"
          @click="scrollTo(link.href)"
        >
          {{ t(link.labelKey) }}
        </button>
      </nav>

      <div class="sitenav__langs">
        <button
          class="sitenav__lang"
          type="button"
          :class="{ 'is-active': locale === 'ru' }"
          @click="setLocale('ru')"
        >
          {{ t("nav.langRu") }}
        </button>
        <button
          class="sitenav__lang"
          type="button"
          :class="{ 'is-active': locale === 'en' }"
          @click="setLocale('en')"
        >
          {{ t("nav.langEn") }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { persistLocale } from "@/i18n";
import { NAV_LINKS } from "@/data/site";
import { useLoaderStore } from "@/stores/loader";
import { useSectionAnimation } from "@/composables/useSectionAnimation";

const { t, locale } = useI18n();
const loaderStore = useLoaderStore();
const { isReady } = storeToRefs(loaderStore);

const root = ref(null);
const scrollProgress = ref(0);
const activeId = ref(null);
let sectionTriggers = [];

const setLocale = (next) => {
  locale.value = next;
  persistLocale(next);
};

const scrollTo = (target) => {
  gsap.to(window, {
    duration: 1.05,
    ease: "power3.inOut",
    scrollTo: { y: target, offsetY: 0 },
  });
};

const updateProgress = () => {
  const doc = document.documentElement;
  const max = Math.max(doc.scrollHeight - window.innerHeight, 0);

  if (max <= 0) {
    scrollProgress.value = 0;
    return;
  }

  const current = window.scrollY || doc.scrollTop || 0;
  scrollProgress.value = Math.min(100, Math.max(0, (current / max) * 100));
};

const clearSectionTriggers = () => {
  sectionTriggers.forEach((trigger) => trigger.kill());
  sectionTriggers = [];
};

const setupSectionTriggers = () => {
  clearSectionTriggers();

  sectionTriggers.push(ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: "bottom 45%",
    onToggle: (self) => {
      if (self.isActive) {
        activeId.value = null;
      }
    },
  }));

  NAV_LINKS.forEach((link) => {
    sectionTriggers.push(ScrollTrigger.create({
      trigger: `#${link.id}`,
      start: "top 45%",
      end: "bottom 45%",
      onToggle: (self) => {
        if (self.isActive) {
          activeId.value = link.id;
        }
      },
      onEnter: () => {
        activeId.value = link.id;
      },
      onEnterBack: () => {
        activeId.value = link.id;
      },
    }));
  });
};

useSectionAnimation(root, (mm, scope) => {
  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const duration = context.conditions.reduceMotion ? 0 : 0.85;

      gsap.from(scope, {
        yPercent: -100,
        autoAlpha: 0,
        duration,
        delay: context.conditions.reduceMotion ? 0 : 0.55,
        ease: "power3.out",
        onComplete: updateProgress,
      });
    },
    scope,
  );
});

watch(isReady, (ready) => {
  if (!ready) {
    return;
  }

  requestAnimationFrame(() => {
    updateProgress();
    setupSectionTriggers();
    ScrollTrigger.refresh();
  });
});

onMounted(() => {
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateProgress);
  window.removeEventListener("resize", updateProgress);
  clearSectionTriggers();
});
</script>
