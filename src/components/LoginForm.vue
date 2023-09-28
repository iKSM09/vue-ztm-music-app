<template>
  <div v-if="show_alert" class="p-4 mb-4 font-bold text-center text-white" :class="alert_variant">
    {{ alert_msg }}
  </div>
  <vee-form @submit="login" :validation-schema="loginSchema">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field name="email" type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
      <error-message name="email" class="text-red-600" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password" />
      <error-message name="password" class="text-red-600" />
    </div>
    <button type="submit" :disabled="in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700">
      Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia';

import useModelStore from "../stores/modal";
import useUserStore from "../stores/user";

export default {
  name: "LoginForm",
  data() {
    return {
      loginSchema: {
        email: "required|email",
        password: "required"
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_msg: "Please wait! We are logging you in.",
    }
  },
  computed: {
    ...mapWritableState(useModelStore, ["isOpen"])
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),
    async login(values) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = "bg-blue-500";
      this.alert_msg = "Please wait! We are logging you in.";

      try {
        await this.authenticate(values);
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_msg = "Invalid login details.";
        console.error("login", error);
        return;
      }

      this.alert_variant = "bg-green-500";
      this.alert_msg = "Success! You are now logged in.";

      setTimeout(() => (this.isOpen = false), 2000);
      // window.location.reload();
    }
  }
}
</script>

