<template>
  <app-header />
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>
  <song-player />
  <app-auth />
</template>

<script>
import { mapWritableState } from "pinia";

import AppHeader from "./components/AppHeader.vue";
import AppAuth from "./components/AppAuth.vue";
import SongPlayer from "./components/SongPlayer.vue";

import { auth } from "./includes/firebase";
import useUserStore from "./stores/user";

export default {
  name: "App",
  components: { AppHeader, AppAuth, SongPlayer },
  computed: {
    ...mapWritableState(useUserStore, ["userLoggedIn"]),
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  },
}
</script>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>