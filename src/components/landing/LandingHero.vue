<template>
  <section id="hero" ref="root" class="hero">
    <div class="hero__inner layout">
      <p class="hero__kicker">{{ t("hero.kicker") }}</p>

      <h1 class="hero__title">
        <span
          v-for="part in nameParts"
          :key="`${locale}-${part}`"
          class="hero__title-line"
        >
          {{ part }}
        </span>
      </h1>

      <div class="hero__meta">
        <p class="hero__role">{{ t("hero.role") }}</p>
        <p class="hero__years">{{ t("hero.years") }}</p>
      </div>

      <p class="hero__lead">{{ t("hero.lead") }}</p>

      <button class="hero__cta" type="button" @click="scrollToWork">
        {{ t("hero.cta") }}
      </button>
    </div>

    <button class="hero__scroll" type="button" @click="scrollToAbout">
      <span class="hero__scroll-label">{{ t("hero.scroll") }}</span>
      <span class="hero__scroll-line" aria-hidden="true"></span>
    </button>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useSectionAnimation } from "@/composables/useSectionAnimation";
import { fadeOutInner, SECTION_MQ } from "@/composables/sectionMotion";

const CURSOR_RADIUS = 220;
const CURSOR_FORCE = 48;

const { t, locale } = useI18n();
const root = ref(null);

const nameParts = computed(() => t("hero.name").split(" "));

const scrollToAbout = () => {
  gsap.to(window, {
    duration: 1,
    ease: "power3.inOut",
    scrollTo: { y: "#about" },
  });
};

const scrollToWork = () => {
  gsap.to(window, {
    duration: 1.15,
    ease: "power3.inOut",
    scrollTo: { y: "#work" },
  });
};

const bindCursor = (scope, letterEls) => {
  const movers = letterEls.map((el) => ({
    el,
    xTo: gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" }),
    yTo: gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" }),
  }));

  const onMove = (event) => {
    movers.forEach(({ el, xTo, yTo }) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - event.clientX;
      const dy = cy - event.clientY;
      const dist = Math.hypot(dx, dy) || 1;
      const force = Math.max(0, 1 - dist / CURSOR_RADIUS) ** 1.35;

      xTo((dx / dist) * force * CURSOR_FORCE);
      yTo((dy / dist) * force * CURSOR_FORCE);
    });
  };

  const onLeave = () => {
    movers.forEach(({ xTo, yTo }) => {
      xTo(0);
      yTo(0);
    });
  };

  scope.addEventListener("pointermove", onMove);
  scope.addEventListener("pointerleave", onLeave);

  return () => {
    scope.removeEventListener("pointermove", onMove);
    scope.removeEventListener("pointerleave", onLeave);
    onLeave();
  };
};

useSectionAnimation(root, (mm, scope) => {
  mm.add(
    {
      isDesktop: SECTION_MQ.isDesktop,
      reduceMotion: SECTION_MQ.reduceMotion,
    },
    (context) => {
      const { isDesktop, reduceMotion } = context.conditions;
      const split = SplitText.create(".hero__title-line", {
        type: "chars",
      });

      gsap.set(split.chars, {
        display: "inline-block",
        willChange: "transform",
      });

      if (reduceMotion) {
        return () => split.revert();
      }

      const unbindCursor = isDesktop
        ? bindCursor(scope, split.chars)
        : null;

      fadeOutInner(".hero__inner", scope);

      return () => {
        unbindCursor?.();
        split.revert();
      };
    },
    scope,
  );
});
</script>
