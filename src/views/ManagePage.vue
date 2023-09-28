<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-songs ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="relative flex flex-col bg-white border border-gray-200 rounded">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t("manage.my_songs") }}</span>
            <i class="float-right text-2xl text-green-400 fa fa-compact-disc"></i>
          </div>
          <div class="p-6">
            <composition-item v-for="(song, idx) in songs" :key="song.docId" :song="song" :updateSong="updateSong"
              :index="idx" :removeSong="removeSong" :updateUnsavedFlag="updateUnsavedFlag" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { auth, songsCollection } from "../includes/firebase";
import UploadSongs from "../components/UploadSongs.vue";
import CompositionItem from "../components/CompositionItem.vue";
// import useUserStore from "../stores/user";

export default {
  name: "ManagePage",
  components: {
    UploadSongs, CompositionItem
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    }
  },
  methods: {
    updateSong(idx, values) {
      this.songs[idx].modified_name = values.modified_name;
      this.songs[idx].genre = values.genre;
    },
    removeSong(idx) {
      this.songs.splice(idx, 1);
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docId: document.id,
      }

      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    }
  },
  async created() {
    const snapshot = await songsCollection.where("uid", "==", auth.currentUser.uid).get();
    snapshot.forEach(this.addSong)
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      next(leave);
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads();
  //   next();
  // },
  // beforeRouteEnter(to, from, next) {
  //   const store = useUserStore();

  //   if (store.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: "home" });
  //   }
  // },
}
</script>

<style scoped></style>