<template>
  <div class="login-input auth-login-page">
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
        <v-btn
          depressed
          block
          round
          dark
          type="submit"
          class="login-button"
          :loading="loading"
        >
          Login
        </v-btn>
        <div class="mt-4">
          <span
            class="forgot-password-text cursor-pointer"
            @click="!showForgotPassword ? $route.push('/forgot') : showForgotPassword()"
          >
            Forgot password?
          </span>
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
  props: {
    showForgotPassword: Function,
  },
  components: {
    LoginInput,
  },

  data() {
    return {
      loading: false,
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
      // this.$router.push({ name: "DiscoverIndex" });
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
      this.loading = true;

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
          this.loading = false;

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

<style lang="scss" scoped>
.auth-login-page {
  // margin: 0 auto;
  input[type='text'],
  input[type='email'],
  input[type='password'] {
    background: #ffffff;
    border: 0.75px solid #d2d2d2;
    border-radius: 3.75px;
    height: 45px;
    width: 100%;
    font-size: 16px;
    color: #4a4a4a;
    letter-spacing: 0;
    padding: 0 15px;
  }
  .email {
    margin-top: 22.5px;
  }
  .password {
    margin-top: 7.5px;
  }
  .regular-checkbox {
    margin-top: 14px;
    margin-bottom: 0p;
    margin-left: 0;
  }
  
  .forgot-password-text {
    color: #000000;
    font-size: 13px;
    font-weight: 600;
  }

  .login-button {
    height: 40.5px;
    width: 100%;
    margin: 0 auto;
    background: #000000 !important;
    border-radius: 75px;
    box-shadow: none;
    font-weight: 600;
    font-size: 15px;
    color: #ffffff;
    letter-spacing: 0;
    text-transform: none;
  }
  .or-divider {
    margin-top: 30px;
  }
  .or {
    font-size: 13.5px;
    color: #262626;
    letter-spacing: 0;
    margin-bottom: 0px;
  }
  .divider {
    margin: 9px 0px;
    background-color: #d0d0d0;
  }

  .create-account {
    margin-top: 11.25px;
    cursor: pointer;
  }
}
</style>