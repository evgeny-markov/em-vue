<template>
  <section id="experience" ref="root" class="experience">
    <div class="experience__inner layout">
      <p class="experience__label section-label">{{ t("experience.label") }}</p>
      <h2 class="experience__title">{{ t("experience.title") }}</h2>

      <div class="experience__list">
        <span class="experience__line" aria-hidden="true"></span>
        <article v-for="job in JOBS" :key="job" class="experience__job">
          <div class="experience__job-meta">
            <p class="experience__company">{{ t(`experience.jobs.${job}.company`) }}</p>
            <p class="experience__period">{{ t(`experience.jobs.${job}.period`) }}</p>
          </div>
          <div class="experience__job-body">
            <h3 class="experience__role">{{ t(`experience.jobs.${job}.role`) }}</h3>
            <p class="experience__place">{{ t(`experience.jobs.${job}.place`) }}</p>
            <ul class="experience__points">
              <li
                v-for="(point, index) in jobPoints(job)"
                :key="index"
                class="experience__point"
              >
                {{ point }}
              </li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import gsap from "gsap";
import { JOBS } from "@/data/site";
import { useSectionAnimation } from "@/composables/useSectionAnimation";
import {
  addSectionMatchMedia,
  fadeOutInner,
  revealFromLeft,
} from "@/composables/sectionMotion";

const { t, tm } = useI18n();
const root = ref(null);

const jobPoints = (job) => {
  const points = tm(`experience.jobs.${job}.points`);
  return Array.isArray(points) ? points : [];
};

useSectionAnimation(root, (mm, scope) => {
  addSectionMatchMedia(mm, scope, ({ isDesktop, reduceMotion }) => {
    if (reduceMotion) {
      return;
    }

    revealFromLeft(".experience__label", scope, isDesktop);
    revealFromLeft(".experience__title", ".experience__title", isDesktop);

    gsap.fromTo(".experience__line", { scaleY: 0 }, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".experience__list",
        start: "top 75%",
        end: "bottom 55%",
        scrub: 0.5,
      },
    });

    gsap.utils.toArray(".experience__job").forEach((job) => {
      revealFromLeft(job, job, isDesktop);

      gsap.from(job.querySelectorAll(".experience__point"), {
        autoAlpha: 0,
        x: -14,
        stagger: 0.08,
        duration: 0.5,
        scrollTrigger: {
          trigger: job,
          start: "top 74%",
        },
      });
    });

    fadeOutInner(".experience__inner", scope, {
      start: "bottom bottom",
    });
  });
});
</script>
