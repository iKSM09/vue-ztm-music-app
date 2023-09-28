<template>
  <header id="header" class="bg-gray-700">
    <nav class="container flex items-center justify-start px-4 py-5 mx-auto">
      <!-- App Name -->
      <router-link :to="{ name: 'home' }" exact-active-class="no-active"
        class="mr-4 text-2xl font-bold text-white uppercase">Music</router-link>

      <div class="flex items-center flex-grow">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link :to="{ name: 'about' }" class="px-2 text-white">About</router-link>
          </li>
          <li v-if="!userStore.userLoggedIn">
            <a href="#" @click.prevent="toggleAuthModal" class="px-2 text-white">Login / Register</a>
          </li>
          <template v-else>
            <li>
              <router-link :to="{ name: 'manage' }" class="px-2 text-white">Manage</router-link>
            </li>
            <li>
              <a href="#" @click.prevent="signOut" class="px-2 text-white">Logout</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li><a @click.prevent="changeLocale" href="#" class="px-2 text-white">{{ currentLocale }}</a></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from 'pinia';

import useModalStore from "../stores/modal";
import useUserStore from "../stores/user";

export default {
  name: "AppHeader",
  computed: {
    ...mapStores(useModalStore, useUserStore),
    currentLocale() {
      return this.$i18n.locale === "fr" ? "French" : "English";
    }
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
      console.log(this.modalStore.isOpen);
    },
    signOut() {
      this.userStore.signOut();
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === "fr" ? "en" : "fr";
    }
  },
}
</script>
