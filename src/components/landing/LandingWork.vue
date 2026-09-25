<template>
  <section id="work" ref="root" class="work">
    <div class="work__pin">
      <div class="work__head layout">
        <div>
          <p class="work__label section-label">{{ t("work.label") }}</p>
          <h2 class="work__title">{{ t("work.title") }}</h2>
        </div>
        <p class="work__hint">{{ t("work.hint") }}</p>
      </div>

      <div class="work__track">
        <article
          v-for="(project, index) in PROJECTS"
          :key="project.id"
          class="work__card"
        >
          <p class="work__card-index">{{ String(index + 1).padStart(2, "0") }}</p>
          <p class="work__card-tag">{{ t(`work.projects.${project.id}.tag`) }}</p>
          <h3 class="work__card-title">{{ t(`work.projects.${project.id}.title`) }}</h3>
          <p class="work__card-text">{{ t(`work.projects.${project.id}.text`) }}</p>
          <a
            class="work__card-link"
            :href="project.href"
            target="_blank"
            rel="noreferrer"
          >
            {{ t("work.open") }}
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import gsap from "gsap";
import { PROJECTS } from "@/data/site";
import { useSectionAnimation } from "@/composables/useSectionAnimation";
import {
  addSectionMatchMedia,
  revealFromLeft,
} from "@/composables/sectionMotion";

const { t } = useI18n();
const root = ref(null);

useSectionAnimation(root, (mm, scope) => {
  addSectionMatchMedia(mm, scope, ({ isDesktop, reduceMotion }) => {
    const revealOpts = { reduceMotion };

    revealFromLeft(".work__label", scope, isDesktop, revealOpts);
    revealFromLeft(".work__title", ".work__title", isDesktop, revealOpts);
    revealFromLeft(".work__hint", ".work__hint", isDesktop, revealOpts);

    if (!isDesktop || reduceMotion) {
      revealFromLeft(".work__card", ".work__track", isDesktop, {
        ...revealOpts,
        stagger: 0.08,
      });
      return;
    }

    const track = scope.querySelector(".work__track");
    const pin = scope.querySelector(".work__pin");
    if (!track || !pin) {
      return;
    }

    const scrollTween = gsap.to(track, {
      x: () => Math.min(0, window.innerWidth - track.scrollWidth),
      ease: "none",
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, window.innerHeight)}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    gsap.utils.toArray(".work__card").forEach((card) => {
      gsap.fromTo(card, {
        scale: 0.92,
        autoAlpha: 0.42,
      }, {
        scale: 1,
        autoAlpha: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: "left 88%",
          end: "left 52%",
          scrub: true,
        },
      });
    });
  });
});
</script>
