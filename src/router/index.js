import { createRouter, createWebHistory } from "vue-router";
// import HomePage from "../views/HomePage.vue";
// import AboutPage from "../views/AboutPage.vue";
// import ManagePage from "../views/ManagePage.vue";
// import SongPage from "../views/SongPage.vue";
import useUserStore from "../stores/user";

const HomePage = () => import("../views/HomePage.vue");
const AboutPage = () => import("../views/AboutPage.vue");
const ManagePage = () => import("../views/ManagePage.vue");
const SongPage = () => import("../views/SongPage.vue");

const routes = [
  {
    name: "home",
    path: "/",
    component: HomePage
  },
  {
    name: "about",
    path: "/about",
    component: AboutPage
  },
  {
    name: "manage",
    path: "/manage-music",
    // alias: "/manage",
    component: ManagePage,
    beforeEnter: (to, from, next) => {
      console.log("Manage Route Guard");
      next();
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/manage",
    redirect: { name: "manage" }
  },
  {
    name: "song",
    path: "/song/:id",
    component: SongPage
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500"
});

router.beforeEach((to, from, next) => {
  // console.log("Global Guard");

  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const store = useUserStore();

  if (store.userLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
});

export default router;
