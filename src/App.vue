<template>
  <SiteLoader v-if="showLoader" @done="onLoaderDone" />
  <SiteBackdrop />
  <SiteNav />
  <main>
    <LandingHero />
    <LandingAbout />
    <LandingSkills />
    <LandingExperience />
    <LandingWork />
    <LandingContact />
  </main>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SiteLoader from "@/components/loader/SiteLoader.vue";
import SiteBackdrop from "@/components/landing/SiteBackdrop.vue";
import SiteNav from "@/components/landing/SiteNav.vue";
import LandingHero from "@/components/landing/LandingHero.vue";
import LandingAbout from "@/components/landing/LandingAbout.vue";
import LandingSkills from "@/components/landing/LandingSkills.vue";
import LandingExperience from "@/components/landing/LandingExperience.vue";
import LandingWork from "@/components/landing/LandingWork.vue";
import LandingContact from "@/components/landing/LandingContact.vue";

const { t, locale } = useI18n();
const showLoader = ref(true);

watch(
  locale,
  () => {
    document.title = t("meta.title");
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", t("meta.description"));
    }
  },
  { immediate: true },
);

const onLoaderDone = async () => {
  showLoader.value = false;
  window.scrollTo(0, 0);
  await nextTick();
  ScrollTrigger.refresh();
};
</script>
