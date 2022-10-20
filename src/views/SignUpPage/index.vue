<template>
    <v-container class="no-top-nav no-side-space">
      <v-layout align-center full-authTabs-wrapper justify-center row>

  
        <v-flex
          v-show="!onMobileStrict || (onMobileStrict && activeView === 'learnMoreView')" 
          xs12
          full-authTabs-twin
          full-authTabs-right
          :class="{ auth__view: toDisplayGrid, onMobileStrict }"
        >

  
          <div v-if="activeView === 'signUpView'" class="signup-view">
            <div class="sign-up_logo">
              <router-link to="/">            
              <img :src="require('@/assets/nav_logo_primary.png')" width="150">
            </router-link>
            </div>
            <Onboarding />
          </div>
        </v-flex>
      </v-layout>
      <Footer></Footer>
    </v-container>
  </template>
  
  <script>
  import Footer from "../../components/landingPages/Footer-2.vue";
  import { mapActions, mapGetters, mapState } from "vuex";
  import Onboarding from "@/views/mobile/auth/onboarding";
  
  export default {
    name: "SignUpPage",
    components: {
      
      Footer,
      Onboarding,
    },
    data() {
      return {

        activeView: "signUpView",
      };
    },
    // created() {
    //   if (this.$store.state.auth.user != null) {
    //     this.$router.push({name: 'UserSettings'})
    //   }
    // },
    computed: {
      ...mapState({
        musicFeed: (state) => state.trending.albums,
        currentSignUpStage: (state) => state.app.onboarding.current,
        signUpAccountCategory: (state) => state.app.onboarding.accountCategory,
      }),
      ...mapGetters({
        isAuthenticated: "auth/isAuthenticated",
        onMobileStrict: "app/onMobileStrict",
      }),
      
    },
    methods: {
      ...mapActions({
        getTrendingMusic: "trending/getTrendingMusic",
      }),
      isActiveTab(tab) {
        return this.activeTab === tab;
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .full-authTabs {
    &-container {
      // padding: 20px;
      position: fixed;
      width: 100%;
      top: 0;
      // min-height: 70vh;
    }
  
    &-twin {
      min-height: 100vh;
    }
  
    &-right {
      position: relative;
      padding-left: 20px;
      scrollbar-width: none;
  
      &::-webkit-scrollbar {
        width: 2px;
        display: none;
      }
  
      &::-webkit-scrollbar-track {
        display: none;
      }
  
      &::-webkit-scrollbar-thumb {
        display: none;
      }
  
      &.onMobileStrict {
        padding-left: 0;
      }
  
      .cancel-icon-round {
        top: 26px;
      }
  
      &.auth__view {
        display: grid;
      }
  
      .trending {
        &-top {
          position: sticky;
          top: 0;
          z-index: 9;
          background-color: #ffffff;
  
          .trending-title {
            font-weight: 700;
            font-size: 24px;
            line-height: 40px;
            letter-spacing: -1px;
          }
  
          .top-menu {
            width: fit-content;
            width: -moz-fit-content;
          }
        }
  
        &-music {
          padding-right: 10px;
          padding-left: 10px;
        }
      }
      
      .login-view {
        margin: 0 auto;
        padding-top: 10%;
  
        .sign-up_logo{
          display: flex;
          justify-content: center;
          margin-bottom: 25%;
        }
  
        .intro-text h2 {
          font-size: 28px;
          font-weight: 500;
        }
      }
  
      .signup-view {
        width: 100%;
        height: 55%;
        padding-top: 10px;
        margin: 0 auto;
  
  
        .intro-text h2 {
          font-size: 28px;
        }
  
  
        .sign-up_logo{
          display: flex;
          justify-content: center;
          margin-bottom: 80px;
        }
  
        .onboarding {
          min-height: 100%;
          justify-content: space-around;
  
          /deep/ .stager {
            position: relative;
          }
  
          /deep/ &_comp {
            &.profile-image {
              .profile-image-holder {
                margin-top: 40px;
                width: 200px;
                height: 200px;
              }
            }
          }
  
          /deep/ .auth-plan {
            position: relative;
            top: 0;
            left: 0;
            padding: 10px;
            width: 100%;
          }
        }
      }
      .login-view {
        width: 50%;
      }
    }
  }
  </style>
  