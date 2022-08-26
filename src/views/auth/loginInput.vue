<template>
  <div class="login-card">
    <form
      v-on:submit.prevent="submit()"
      autocomplete="off"
      :class="{ 'mt-2': onMobile }"
    >
      <div v-if="onMobile" class="form-icon">
        <img :src="require('@/assets/mail_icon.svg')" alt="main icon" />
      </div>

      <div
        class="form-group _email text-xs-center"
        :class="{ 'has-error': errors.has('email') }"
      >
        <input
          class="email"
          v-model="user.email"
          v-validate="'required|email'"
          :class="{ input: true, 'text-danger': errors.has('email') }"
          name="email"
          type="email"
          placeholder="Email"
          autocomplete="off"
        />
        <p
          v-if="errors.has('email')"
          class="text-danger text-xs-left mb-0"
          :class="{ 'mb-2': onMobile }"
        >
          {{ errors.first("email") }}
        </p>
      </div>

      <div class="form-group _password text-xs-center">
        <div v-if="onMobile" class="form-icon">
          <img :src="require('@/assets/password_icon.svg')" alt="main icon" />
        </div>

        <input
          class="password"
          type="password"
          v-model="user.password"
          placeholder="Password"
          autocomplete="new-password"
        />
      </div>

      <div class="text-xs-center mt-4" :class="{ 'mt-0': onMobile }">
        <v-btn block round dark type="submit" class="login-button">
          Login
        </v-btn>
        <div class="mt-4">
          <router-link class="forgot-password-text" to="/forgot"
            >Forgot password?</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import AuthService from "@/services/auth.js";
import { mapGetters } from "vuex";

import { MyEvents } from "@/helper";

import LoginInput from "./loginInput";

export default {
  components: {
    LoginInput,
  },

  data() {
    return {
      remember: false,
      user: {
        email: "",
        password: "",
      },
    };
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
  },

  created() {
    let myAlert = null;
    try {
      myAlert = JSON.parse(atob(this.$route.query["alert"]));
    } catch (e) {
      myAlert = null;
    }
    // console.log('login created', myAlert)

    if (this.isAuthenticated) {
      this.$router.push({ name: "DiscoverIndex" });
      return;
    }

    const user = AuthService.loadCredential();
    if (user !== null) {
      this.user.email = user.email;
      this.user.password = user.password;
    }
    this.$store.dispatch("navigator/goNextState", { page: "login", tab: "" });

    if (myAlert) {
      switch (myAlert.type) {
        case "success":
          this.$store.dispatch("error/showSuccessToast", myAlert.messages);
          break;
        case "error":
          this.$store.dispatch("error/showErrorToast", myAlert.messages);
          break;
      }
    }

    this.$nextTick(() => {
      // console.log('after stream-player beforeDestroy ???')
      this.$root.$emit(MyEvents.AUTH_SIGNOUT);
    });
  },

  methods: {
    submit() {
      this.$store.dispatch("error/showLoadingActivity", true);
      AuthService.login(this.user)
        .then((response) => {
          if (this.remember) {
            AuthService.saveCredential(this.user);
          }
          AuthService.setTokenAndUserInfo(response.body);

          if (response.body.sign_in_count <= 1) {
            this.$store.dispatch("auth/setFirstVisit", true);
          }

          this.$root.$emit(MyEvents.AUTH_SIGNIN);

          this.$store.dispatch("error/showLoadingActivity", false);
          this.$router.push({ name: "DiscoverIndex" });
        })
        .catch((e) => {
          this.$store.dispatch("error/showLoadingActivity", false);
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
    },
  },
};
</script>