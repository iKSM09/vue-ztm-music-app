<template>
  <div class="p-3 mb-4 border border-gray-200 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button @click.prevent="deleteSong" class="float-right px-2 py-1 ml-1 text-sm text-white bg-red-600 rounded">
        <i class="fa fa-times"></i>
      </button>
      <button @click.prevent="showForm = !showForm"
        class="float-right px-2 py-1 ml-1 text-sm text-white bg-blue-600 rounded">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div v-if="show_alert" class="p-4 mb-4 font-bold text-center text-white">{{ alert_message }}</div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field type="text" name="modified_name" @input="updateUnsavedFlag(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title" />
          <error-message class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field type="text" name="genre" @input="updateUnsavedFlag(true)"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre" />
          <error-message class="text-red-600" name="genre" />
        </div>
        <button type="submit" :disabled="in_submission" class="py-1.5 px-3 rounded text-white bg-green-600">
          Submit
        </button>
        <button type="button" @click.prevent="showForm = false" :disabled="in_submission"
          class="py-1.5 px-3 rounded text-white bg-gray-600">
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { storage, songsCollection } from "../includes/firebase";

export default {
  name: "CompositionItem",
  props: {
    song: { type: Object, required: true },
    updateSong: { type: Function, required: true },
    index: { type: Number, required: true },
    removeSong: { type: Function, required: true },
    updateUnsavedFlag: { type: Function },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: "required",
        genre: "alpha_spaces",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_message: "Please wait! Uplating song info.",
    }
  },
  methods: {
    async edit(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_message = "Please wait! Uplating song info.";

      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_message = "Something went wrong! Try again later.";
        console.error(error);
        return;
      }

      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);

      this.in_submission = false;
      this.alert_variant = "bg-green-500";
      this.alert_message = "Success!";
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      await songRef.delete()
      await songsCollection.doc(this.song.docID).delete();

      this.removeSong(this.index);
    }
  }
}
</script>

<style scoped></style>