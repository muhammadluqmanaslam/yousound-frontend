<template>
    
    <div class="no-top-nav no-side-space" xs12 sm6>
        <div class="login-outer">        
        <div class="login-view">
            <div class="sign-up_logo">
              <img :src="require('@/assets/nav_logo_primary.png')" width="150">
            </div>
            <div v-if="loginAuth === 'login'" class="login-input">
              <div class="intro-text text-xs-center my-4">
                <h2>Hello,</h2>
                <h2>welcome back!</h2>
              </div>
              <login-input :showForgotPassword="showForgotPassword" />
            </div>
  
            <div v-if="loginAuth === 'forgotPassword'" class="forgot-password-input">
              <div class="intro-text text-xs-center">
                <h2>Forgot Password</h2>
              </div>
  
              <forgot-password-input :showLogin="showLogin" />
            </div>
          </div>

          </div>

          <Footer></Footer>
  
    </div>

</template>
<script>

import LoginInput from "@/views/auth/loginInput";
import forgotPasswordInput from '@/views/auth/forgotPasswordInput/';
import Footer from "../../components/landingPages/Footer.vue";


export default {
  name: "LoginPage",
  components: {
    LoginInput,
    forgotPasswordInput,
    Footer
  },
  data() {
    return {
      loginAuth: "login",
      iosStore: require("@/assets/img_download_app_store.svg"),
      androidPlaystore: require("@/assets/img_download_play_store.svg"),
    };
  },
  created() {
    if (this.$store.state.auth.user != null) {
      this.$router.push({name: 'UserSettings'})
    }
  },
//   computed: {
//     ...mapGetters({
//       isAuthenticated: "auth/isAuthenticated",
//       onMobileStrict: "app/onMobileStrict",
//     }),

//   },
  methods: {
    showForgotPassword() {
      this.loginAuth = "forgotPassword"
    },
    showLogin() {
      this.loginAuth = "login"
      this.activeView = 'loginView'
    },
    
  },
};
</script>

<style lang="scss" scoped>

.login-outer{
    min-height: 85vh;
    display: flex;
    justify-content: center;
}

.login-view {
    margin: 0 auto;
    width: 50%;
    max-width: 350px;
    padding-top: 50px;

    .sign-up_logo{
      display: flex;
      justify-content: center;
      margin-bottom: 100px;
    }

    .intro-text h2 {
      font-size: 28px;
      font-weight: 500;
    }
  }
</style>