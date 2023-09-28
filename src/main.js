import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VeeValidatePlugin from "./includes/validation";
import { auth } from "./includes/firebase";
import Icon from "./directives/icon";
import i18n from "./includes/i18n";
import progressBar from "./includes/progress-bar";
// import { registerSW } from "virtual:pwa-register";

import "./assets/base.css";
import "./assets/main.css";
import "nprogress/nprogress.css";

// registerSW({ immediate: true });

progressBar(router);

let app;

auth.onAuthStateChanged((user = auth.currentUser) => {
  if (user) console.log({ user });
  else console.log("No user found!");

  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(i18n);
    app.directive("icon", Icon);

    app.mount("#app");
  }
});
