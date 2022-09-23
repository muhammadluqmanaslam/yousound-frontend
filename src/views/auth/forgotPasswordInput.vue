<template>
  <div class="forgot-password-input auth-login-page">
    <form v-on:submit.prevent="submit()">
      <div
        class="form-group"
        :class="{ 'has-error': errors.has('email') }"
      >
        <div v-if="onMobile" class="form-icon">
          <img
            :src="require('@/assets/mail_icon_outline.svg')"
            alt="main icon"
          />
        </div>

        <input
          v-model="email"
          class="email"
          v-validate="'required|email'"
          :class="{
            input: true,
            'text-danger': errors.has('email'),
          }"
          name="email"
          type="email"
          placeholder="Email"
        />
        <p
          class="text-danger text-xs-left"
          v-if="errors.has('email')"
        >
          {{ errors.first("email") }}
        </p>
      </div>
      <v-btn block round dark type="submit" class="reset-btn">
        Reset Password
      </v-btn>
      <div
        class="
          text-xs-center
          mt-3
          dflex
          align-center
          justify-center
        "
      >
        <span
          class="terms-text mr-2 cursor-pointer app-bold"
          @click="!showLogin ? $route.push('/login') : showLogin()"
        >
          Back to login
        </span>
      </div>
    </form>
  </div>
</template>

<script>
import AuthService from "@/services/auth.js";
import { mapGetters } from "vuex";
import { MyEvents } from "@/helper";

export default {
  props: {
    showLogin: Function,
  },
  data() {
    return {
      email: null,
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
      if (!this.email) return

      var params = new FormData()
      params.append('email', this.email)
      AuthService.requestResetPassword(params)
        .then((response) => {
          // JSON responses are automatically parsed.
          // this.$store.dispatch('error/showSuccessToast', [
          //   'Email sent with password reset instructions.',
          // ])

          this.resetSuccess = true
        })
        .catch((e) => {
          this.$store.dispatch('error/showErrorToast', [
            'Email does not exist or inactivated',
          ])
        })
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