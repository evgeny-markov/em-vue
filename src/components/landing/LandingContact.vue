<template>
  <section id="contact" ref="root" class="contact">
    <div class="contact__inner layout">
      <p class="contact__label section-label">{{ t("contact.label") }}</p>
      <h2 class="contact__title">{{ t("contact.title") }}</h2>
      <p class="contact__text">{{ t("contact.text") }}</p>

      <ul class="contact__links">
        <li
          v-for="link in CONTACT_LINKS"
          :key="link.id"
          class="contact__links-item"
        >
          <a
            class="contact__link"
            :href="link.href"
            target="_blank"
            rel="noreferrer"
          >
            {{ t(`contact.links.${link.id}`) }}
          </a>
        </li>
      </ul>

      <p class="contact__note">{{ t("contact.note") }}</p>
    </div>

    <footer class="contact__footer layout">
      <span>{{ t("footer.copy") }}</span>
      <span>{{ t("footer.stack") }}</span>
    </footer>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { CONTACT_LINKS } from "@/data/site";
import { useSectionAnimation } from "@/composables/useSectionAnimation";
import {
  addSectionMatchMedia,
  revealFromLeft,
} from "@/composables/sectionMotion";

const { t } = useI18n();
const root = ref(null);

useSectionAnimation(root, (mm, scope) => {
  addSectionMatchMedia(mm, scope, ({ isDesktop, reduceMotion }) => {
    if (reduceMotion) {
      return;
    }

    revealFromLeft(".contact__label", scope, isDesktop);
    revealFromLeft(".contact__title", ".contact__title", isDesktop);
    revealFromLeft(".contact__text", ".contact__text", isDesktop);
    revealFromLeft(".contact__links-item", ".contact__links", isDesktop, {
      stagger: 0.1,
    });
    revealFromLeft(".contact__note", ".contact__note", isDesktop);
  });
});
</script>
