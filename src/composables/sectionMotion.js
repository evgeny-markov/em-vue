import gsap from "gsap";

export const SECTION_MQ = {
  isDesktop: "(min-width: 840px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
};

export function addSectionMatchMedia(mm, scope, setup) {
  mm.add(SECTION_MQ, (context) => setup(context.conditions, context), scope);
}

export function revealFromLeft(targets, trigger, isDesktop, options = {}) {
  const {
    reduceMotion = false,
    stagger,
    start = "clamp(top 82%)",
  } = options;

  gsap.from(targets, {
    autoAlpha: reduceMotion ? 1 : 0,
    y: reduceMotion ? 0 : 48,
    x: reduceMotion ? 0 : (isDesktop ? -28 : 0),
    duration: reduceMotion ? 0 : 0.9,
    ease: "power3.out",
    ...(stagger != null ? { stagger } : {}),
    scrollTrigger: {
      trigger,
      start,
    },
  });
}

export function revealEach(selector, isDesktop, options = {}) {
  gsap.utils.toArray(selector).forEach((el) => {
    revealFromLeft(el, el, isDesktop, options);
  });
}

export function fadeOutInner(inner, trigger, options = {}) {
  const {
    start = "top top",
    end = "bottom top",
    scrub = 0.65,
    yPercent = -24,
  } = options;

  gsap.to(inner, {
    yPercent,
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
    },
  });
}

export function animateStatCounters(selector, options = {}) {
  const { start = "top 88%", duration = 1.5 } = options;

  gsap.utils.toArray(selector).forEach((el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const counter = { value: 0 };

    gsap.to(counter, {
      value: end,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start,
      },
      onStart: () => {
        el.textContent = `0${suffix}`;
      },
      onUpdate: () => {
        el.textContent = `${Math.round(counter.value)}${suffix}`;
      },
    });
  });
}
