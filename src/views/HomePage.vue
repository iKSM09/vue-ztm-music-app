<template>
  <main>
    <!-- Introduction -->
    <section class="relative py-20 mb-8 text-center text-white">
      <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="mb-5 text-5xl font-bold">{{ $t("home.listen") }}</h1>
          <p class="w-full mx-auto md:w-8/12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis, congue
            augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
            sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img class="relative block w-auto max-w-full mx-auto mt-5 -mb-20" src="/assets/img/introduction-music.png" />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="relative flex flex-col bg-white border border-gray-200 rounded">
        <div v-icon.right="'headphones-alt'" v-icon-sec="{ icon: 'headphones-alt', right: true, }"
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">Songs</span>
          <!-- Icon -->

        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item v-for=" song  in  songs " :key="song.docId" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import SongItem from '../components/SongItem.vue';
import IconSec from "../directives/icon-sec";

import { songsCollection } from '../includes/firebase';

export default {
  name: "HomePage",
  components: {
    SongItem
  },
  directives: {
    "icon-sec": IconSec,
  },
  data() {
    return {
      songs: [],
      maxPerPage: 3,
      pendingRequest: false,
    }
  },
  methods: {
    async getSongs() {
      if (this.pendingRequest) return;

      this.pendingRequest = true;

      let snapshots;

      if (this.songs.length) {
        const lastDoc = await songsCollection
          .doc(this.songs[this.songs.length - 1].docId).get();
        snapshots = await songsCollection
          .orderBy("modified_name")
          .startAfter(lastDoc)
          .limit(this.maxPerPage).get();
      } else {
        snapshots = await songsCollection
          .orderBy("modified_name")
          .limit(this.maxPerPage).get();
      }

      snapshots.forEach(document => {
        this.songs.push({
          docId: document.id,
          ...document.data(),
        });
      });

      this.pendingRequest = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
  },
  async created() {
    this.getSongs();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style scoped></style>
