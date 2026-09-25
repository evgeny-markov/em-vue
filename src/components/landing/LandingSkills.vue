<template>
  <section id="skills" ref="root" class="skills">
    <div class="skills__inner layout">
      <p class="skills__label section-label">{{ t("skills.label") }}</p>
      <h2 class="skills__title">{{ t("skills.title") }}</h2>

      <div class="skills__grid">
        <article v-for="group in SKILL_GROUPS" :key="group" class="skills__group">
          <h3 class="skills__group-title">{{ t(`skills.groups.${group}.title`) }}</h3>
          <ul class="skills__list">
            <li
              v-for="item in skillItems(group)"
              :key="item"
              class="skills__item"
            >
              {{ item }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { SKILL_GROUPS } from "@/data/site";
import { useSectionAnimation } from "@/composables/useSectionAnimation";
import {
  addSectionMatchMedia,
  fadeOutInner,
  revealEach,
  revealFromLeft,
} from "@/composables/sectionMotion";

const { t, tm } = useI18n();
const root = ref(null);

const skillItems = (group) => {
  const items = tm(`skills.groups.${group}.items`);
  return Array.isArray(items) ? items : [];
};

useSectionAnimation(root, (mm, scope) => {
  addSectionMatchMedia(mm, scope, ({ isDesktop, reduceMotion }) => {
    if (reduceMotion) {
      return;
    }

    revealFromLeft(".skills__label", scope, isDesktop);
    revealFromLeft(".skills__title", ".skills__title", isDesktop);
    revealEach(".skills__group", isDesktop);
    fadeOutInner(".skills__inner", scope);
  });
});
</script>
