<template>
  <div v-if="show_alert" class="p-4 mb-4 font-bold text-center text-white rounded" :class="alert_variant">
    {{ alert_msg }}
  </div>
  <vee-form @submit="register" :validation-schema="schema" :initial-values="userData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field name="name" type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name" />
      <error-message name="name" class="text-red-600" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field name="email" type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
      <error-message name="email" class="text-red-600" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field name="age" type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" />
      <error-message name="age" class="text-red-600" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input type="password" v-bind="field"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password">
        <div v-for="error in errors" :key="error" class="text-red-600">{{ error }}</div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field name="confirm_password" type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password" />
      <error-message name="confirm_password" class="text-red-600" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field name="country" as="select"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Mars">Mars</option>
      </vee-field>
      <error-message name="country" class="text-red-600" />
    </div>
    <!-- TOS -->
    <div class="pl-6 mb-3">
      <vee-field name="tos" type="checkbox" value="1" class="float-left w-4 h-4 mt-1 -ml-6 rounded" />
      <i18n-t keypath="register.accept" tag="label" class="inline-block">
        <a href="#">{{ $t("register.tos") }}</a>
      </i18n-t>
      <error-message name="tos" class="block text-red-600" />
    </div>
    <button type="submit" class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="in_submission">
      Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";

import useUserStore from "../stores/user";

export default {
  name: "RegisterationForm",
  data() {
    return {
      tab: "login",
      schema: {
        name: "required|min:3|max:30|alpha_spaces",
        email: "required|email|min:10|max:30",
        age: "required|min_value:18|max_value:100",
        password: "required|min:5|max:30|excluded:password",
        confirm_password: "passwords_mismatch:@password",
        country: "required|country_excluded:Mars",
        tos: "tos",
      },
      userData: {
        country: "USA",
      },
      in_submission: false,
      show_alert: false,
      alert_variant: "bg-blue-500",
      alert_msg: "Please wait! Your account is being created.",
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: "register",
    }),
    async register(values) {
      this.show_alert = true;
      this.in_submission = true;
      this.alert_variant = "bg-blue-500";
      this.alert_msg = "Please wait! Your account is being created.";

      try {
        await this.createUser(values)
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = "bg-red-500";
        this.alert_msg = "An unexpected error occured. Please try again later.";
        console.error("registration_error", error);
        return;
      }

      this.alert_variant = "bg-green-500";
      this.alert_msg = "Success! Your account has been created."
      // window.location.reload();
    },
  }
}
</script>

