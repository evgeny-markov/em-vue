<template>
  <div
    ref="root"
    class="backdrop"
    aria-hidden="true"
    :class="{ 'is-ready': isReady }"
  >
    <canvas ref="canvas" class="backdrop__canvas"></canvas>
  </div>
</template>

<script setup>
import { onUnmounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import gsap from "gsap";
import { useLoaderStore } from "@/stores/loader";
import { SECTION_MQ } from "@/composables/sectionMotion";

const GAP = 56;
const CURSOR_RADIUS = 160;
const CURSOR_FORCE = 22;
const desktopMq = window.matchMedia(SECTION_MQ.isDesktop);

const loaderStore = useLoaderStore();
const { isReady } = storeToRefs(loaderStore);

const root = ref(null);
const canvas = ref(null);

let ctx2d = null;
let points = [];
let cols = 0;
let rows = 0;
let offsetX = 0;
let offsetY = 0;
let tickerFn = null;
let pointerCleanup = null;
let running = false;
let pointer = { x: -9999, y: -9999, active: false };
let smooth = { x: -9999, y: -9999 };

const buildGrid = (width, height) => {
  cols = Math.ceil(width / GAP) + 2;
  rows = Math.ceil(height / GAP) + 2;
  offsetX = (width - (cols - 1) * GAP) / 2;
  offsetY = (height - (rows - 1) * GAP) / 2;
  points = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      points.push({
        x: offsetX + col * GAP,
        y: offsetY + row * GAP,
        col,
        row,
      });
    }
  }
};

const warpPoint = (point) => {
  if (!pointer.active) {
    return { x: point.x, y: point.y, influence: 0 };
  }

  const dx = point.x - smooth.x;
  const dy = point.y - smooth.y;
  const dist = Math.hypot(dx, dy) || 1;
  const influence = Math.max(0, 1 - dist / CURSOR_RADIUS) ** 1.6;

  return {
    x: point.x + (dx / dist) * influence * CURSOR_FORCE,
    y: point.y + (dy / dist) * influence * CURSOR_FORCE,
    influence,
  };
};

const clearCanvas = () => {
  if (!canvas.value) {
    return;
  }

  const context = canvas.value.getContext("2d");
  context?.clearRect(0, 0, canvas.value.width, canvas.value.height);
  canvas.value.width = 0;
  canvas.value.height = 0;
  ctx2d = null;
  points = [];
};

const resize = () => {
  if (!canvas.value || !desktopMq.matches) {
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.value.width = Math.floor(width * dpr);
  canvas.value.height = Math.floor(height * dpr);
  canvas.value.style.width = `${width}px`;
  canvas.value.style.height = `${height}px`;

  ctx2d = canvas.value.getContext("2d");
  ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildGrid(width, height);
};

const drawGrid = () => {
  if (!ctx2d || !running) {
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  smooth.x += (pointer.x - smooth.x) * 0.12;
  smooth.y += (pointer.y - smooth.y) * 0.12;

  const warped = points.map(warpPoint);

  ctx2d.clearRect(0, 0, width, height);
  ctx2d.lineWidth = 1;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col;
      const current = warped[index];

      if (col < cols - 1) {
        const right = warped[index + 1];
        const alpha = 0.05 + Math.max(current.influence, right.influence) * 0.18;
        ctx2d.strokeStyle = `rgba(243, 239, 230, ${alpha})`;
        ctx2d.beginPath();
        ctx2d.moveTo(current.x, current.y);
        ctx2d.lineTo(right.x, right.y);
        ctx2d.stroke();
      }

      if (row < rows - 1) {
        const below = warped[index + cols];
        const alpha = 0.05 + Math.max(current.influence, below.influence) * 0.18;
        ctx2d.strokeStyle = `rgba(243, 239, 230, ${alpha})`;
        ctx2d.beginPath();
        ctx2d.moveTo(current.x, current.y);
        ctx2d.lineTo(below.x, below.y);
        ctx2d.stroke();
      }
    }
  }

  warped.forEach((point) => {
    const radius = 1.1 + point.influence * 2.2;
    const useAccent = point.influence > 0.35;
    ctx2d.beginPath();
    ctx2d.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx2d.fillStyle = useAccent
      ? `rgba(198, 255, 61, ${0.25 + point.influence * 0.55})`
      : `rgba(243, 239, 230, ${0.16 + point.influence * 0.45})`;
    ctx2d.fill();
  });
};

const bindPointer = () => {
  const onMove = (event) => {
    if (event.pointerType === "touch") {
      pointer.active = false;
      return;
    }

    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  };

  const onLeave = () => {
    pointer.active = false;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave);

  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerleave", onLeave);
  };
};

const stop = () => {
  running = false;
  pointer.active = false;

  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }

  pointerCleanup?.();
  pointerCleanup = null;
};

const teardown = () => {
  stop();
  clearCanvas();
  window.removeEventListener("resize", resize);
};

const setup = () => {
  if (!canvas.value || !isReady.value) {
    return;
  }

  stop();
  window.removeEventListener("resize", resize);

  if (!desktopMq.matches) {
    clearCanvas();
    return;
  }

  resize();
  window.addEventListener("resize", resize);

  const reduceMotion = window.matchMedia(SECTION_MQ.reduceMotion).matches;

  if (reduceMotion) {
    running = true;
    pointer.active = false;
    drawGrid();
    running = false;
    return;
  }

  running = true;
  pointerCleanup = bindPointer();
  tickerFn = drawGrid;
  gsap.ticker.add(tickerFn);
};

const onDesktopChange = () => {
  setup();
};

watch(
  isReady,
  (ready) => {
    if (!ready) {
      return;
    }

    requestAnimationFrame(() => {
      setup();
    });
  },
  { immediate: true },
);

desktopMq.addEventListener("change", onDesktopChange);

onUnmounted(() => {
  desktopMq.removeEventListener("change", onDesktopChange);
  teardown();
});
</script>
