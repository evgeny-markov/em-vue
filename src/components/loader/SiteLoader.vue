<template>
  <div ref="root" class="loader" role="status" :aria-label="t('loader.label')">
    <div class="loader__veil" aria-hidden="true"></div>
    <p class="loader__progress">{{ paddedProgress }}</p>

    <div class="loader__stage" aria-hidden="true">
      <p class="loader__word loader__word--outer">
        <span
          v-for="(letter, index) in letters"
          :key="`outer-${locale}-${index}-${letter}`"
          class="loader__letter"
        >
          <span class="loader__letter-glyph">{{ letter === " " ? "\u00A0" : letter }}</span>
        </span>
      </p>

      <div class="loader__clip">
        <p class="loader__word loader__word--inner">
          <span
            v-for="(letter, index) in letters"
            :key="`inner-${locale}-${index}-${letter}`"
            class="loader__letter"
          >
            <span class="loader__letter-glyph">{{ letter === " " ? "\u00A0" : letter }}</span>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import gsap from "gsap";
import { useLoaderStore } from "@/stores/loader";
import { SECTION_MQ } from "@/composables/sectionMotion";

const emit = defineEmits(["done"]);

const { t, locale } = useI18n();
const loaderStore = useLoaderStore();

const LOADER_DURATION = 3;
const CURSOR_RADIUS = 220;
const CURSOR_FORCE = 56;
const CIRCLE_START = 0.08;
const CIRCLE_AT_FULL = 1.05;

const root = ref(null);
const progress = ref(0);
let ctx;
let bounceTweens = [];
let pointerCleanup;

const paddedProgress = computed(() => String(progress.value).padStart(3, "0"));

const letters = computed(() => Array.from(t("loader.word")));

const scrollToStart = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

const unlock = () => {
  document.documentElement.classList.remove("is-locked");
};

const finish = () => {
  scrollToStart();
  unlock();
  scrollToStart();
  loaderStore.complete();
  emit("done");
};

const coverScale = (veil) => {
  const size = veil.offsetWidth || 1;
  const diagonal = Math.hypot(window.innerWidth, window.innerHeight);

  return (diagonal / size) * 1.08;
};

const syncCircle = (veil, clip, scale) => {
  gsap.set(veil, {
    scale,
    autoAlpha: 1,
  });

  const radius = (veil.offsetWidth / 2) * scale;
  gsap.set(clip, {
    clipPath: `circle(${radius}px at 50% 50%)`,
  });
};

const bindCursor = (outerLetters, innerLetters) => {
  const movers = outerLetters.map((el, index) => ({
    el,
    twin: innerLetters[index],
    xTo: gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" }),
    yTo: gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" }),
    xTwin: gsap.quickTo(innerLetters[index], "x", { duration: 0.55, ease: "power3" }),
    yTwin: gsap.quickTo(innerLetters[index], "y", { duration: 0.55, ease: "power3" }),
  }));

  const onMove = (event) => {
    movers.forEach(({ el, xTo, yTo, xTwin, yTwin }) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - event.clientX;
      const dy = cy - event.clientY;
      const dist = Math.hypot(dx, dy) || 1;
      const force = Math.max(0, 1 - dist / CURSOR_RADIUS) ** 1.35;
      const x = (dx / dist) * force * CURSOR_FORCE;
      const y = (dy / dist) * force * CURSOR_FORCE;

      xTo(x);
      yTo(y);
      xTwin(x);
      yTwin(y);
    });
  };

  const onLeave = () => {
    movers.forEach(({ xTo, yTo, xTwin, yTwin }) => {
      xTo(0);
      yTo(0);
      xTwin(0);
      yTwin(0);
    });
  };

  root.value.addEventListener("pointermove", onMove);
  root.value.addEventListener("pointerleave", onLeave);

  return () => {
    root.value?.removeEventListener("pointermove", onMove);
    root.value?.removeEventListener("pointerleave", onLeave);
    onLeave();
  };
};

const playLoader = () => {
  const veil = root.value.querySelector(".loader__veil");
  const clip = root.value.querySelector(".loader__clip");
  const outerLetters = gsap.utils.toArray(".loader__word--outer .loader__letter");
  const innerLetters = gsap.utils.toArray(".loader__word--inner .loader__letter");
  const outerGlyphs = gsap.utils.toArray(".loader__word--outer .loader__letter-glyph");
  const innerGlyphs = gsap.utils.toArray(".loader__word--inner .loader__letter-glyph");
  const counter = { value: 0 };
  const circle = { scale: CIRCLE_START };

  gsap.set(veil, {
    xPercent: -50,
    yPercent: -50,
  });
  syncCircle(veil, clip, CIRCLE_START);

  gsap.set([...outerLetters, ...innerLetters], {
    x: 0,
    y: 0,
    transformOrigin: "50% 50%",
  });
  gsap.set([...outerGlyphs, ...innerGlyphs], {
    yPercent: 120,
    rotate: 8,
    transformOrigin: "50% 100%",
  });

  pointerCleanup = window.matchMedia(SECTION_MQ.isDesktop).matches
    ? bindCursor(outerLetters, innerLetters)
    : null;

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: finish,
  });

  outerGlyphs.forEach((glyph, index) => {
    tl.to([glyph, innerGlyphs[index]], {
      yPercent: 0,
      rotate: 0,
      duration: 1.05,
      ease: "back.out(1.7)",
    }, 0.15 + index * 0.06);
  });

  tl.add(() => {
    bounceTweens = outerGlyphs.map((glyph, index) => gsap.to([glyph, innerGlyphs[index]], {
      y: -8,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.08,
    }));
  }, 1.15);

  tl.to(counter, {
    value: 100,
    duration: LOADER_DURATION,
    ease: "power1.inOut",
    onUpdate: () => {
      progress.value = Math.round(counter.value);
    },
  }, 0);

  tl.to(circle, {
    scale: CIRCLE_AT_FULL,
    duration: LOADER_DURATION,
    ease: "power1.inOut",
    onUpdate: () => {
      syncCircle(veil, clip, circle.scale);
    },
  }, 0);

  tl.from(".loader__progress", {
    autoAlpha: 0,
    y: 20,
    duration: 0.7,
    ease: "power2.out",
  }, 0);

  tl.to(".loader__progress", {
    autoAlpha: 0,
    duration: 0.35,
    ease: "power2.out",
  }, LOADER_DURATION - 0.45);

  tl.to(circle, {
    scale: () => coverScale(veil),
    duration: 1.1,
    ease: "power3.inOut",
    onUpdate: () => {
      syncCircle(veil, clip, circle.scale);
    },
  });

  tl.to(root.value, {
    autoAlpha: 0,
    duration: 0.55,
    ease: "power2.inOut",
  }, "-=0.15");
};

onMounted(() => {
  if (!root.value) {
    return;
  }

  scrollToStart();
  document.documentElement.classList.add("is-locked");

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      progress.value = 100;
      gsap.set(root.value, { autoAlpha: 0 });
      finish();
      return;
    }

    playLoader();
  }, root.value);
});

onUnmounted(() => {
  bounceTweens.forEach((tween) => tween.kill());
  bounceTweens = [];
  pointerCleanup?.();
  ctx?.revert();
  scrollToStart();
  unlock();
});
</script>
