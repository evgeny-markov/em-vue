import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import i18n from "./i18n";
import "./plugins/gsap";
import "@/assets/styles/app.scss";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const scrollToStart = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

if (window.location.hash) {
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}

scrollToStart();
window.addEventListener("load", scrollToStart);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    scrollToStart();
  }
});

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.mount("#app");
