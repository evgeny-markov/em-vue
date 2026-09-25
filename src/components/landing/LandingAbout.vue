<template>
  <section id="about" ref="root" class="about">
    <div class="about__inner layout">
      <p class="about__label section-label">{{ t("about.label") }}</p>
      <h2 class="about__title">{{ t("about.title") }}</h2>

      <div class="about__copy">
        <p class="about__text">{{ t("about.p1") }}</p>
        <p class="about__text">{{ t("about.p2") }}</p>
      </div>

      <ul class="about__stats">
        <li v-for="stat in STATS" :key="stat.key" class="about__stat">
          <span
            class="about__stat-value"
            :data-count="stat.count"
            :data-suffix="stat.suffix"
          >{{ t(`about.stats.${stat.key}.value`) }}</span>
          <span class="about__stat-label">{{ t(`about.stats.${stat.key}.label`) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useSectionAnimation } from "@/composables/useSectionAnimation";
import {
  addSectionMatchMedia,
  animateStatCounters,
  fadeOutInner,
  revealFromLeft,
} from "@/composables/sectionMotion";

const STATS = [
  { key: "years", count: "6", suffix: "+" },
  { key: "projects", count: "80", suffix: "+" },
  { key: "stack" },
];

const { t } = useI18n();
const root = ref(null);

useSectionAnimation(root, (mm, scope) => {
  addSectionMatchMedia(mm, scope, ({ isDesktop, reduceMotion }) => {
    if (reduceMotion) {
      return;
    }

    revealFromLeft(".about__label", scope, isDesktop);
    revealFromLeft(".about__title", ".about__title", isDesktop);
    revealFromLeft(".about__text", ".about__copy", isDesktop, { stagger: 0.1 });
    revealFromLeft(".about__stat", ".about__stats", isDesktop, { stagger: 0.1 });
    fadeOutInner(".about__inner", scope);
    animateStatCounters(".about__stat-value[data-count]");
  });
});
</script>
