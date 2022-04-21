<template>
  <div class="navbar" :class="{drawerActive: drawer}">
    <v-toolbar app fixed flat height="94" color="white">
      <v-container navbar-container>
        <v-toolbar-items class="align-center width100">
          <span
            class="toggle-icon"
            @click.stop="drawer = !drawer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 12H23"
                stroke="black"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 5H23"
                stroke="black"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 19H12"
                stroke="black"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <v-toolbar-title class="ml-0 cursor-pointer">
            <img
              class="logo "
              style="width: 142px; height: auto"
              src="/static/images/nav_logo_primary.png"
              @click="$router.push('/')"
            />
          </v-toolbar-title>

          <div class="link-text-wrapper">
            <v-btn
              :to="{name: link.route}"
              class="nav_text no-Btn-bg"
              v-for="link in links"
              :key="link.text"
            >
              {{ link.text }}
            </v-btn>
          </div>

          <!-- <v-spacer class="d-md-block d-none"></v-spacer> -->
          <v-spacer class=""></v-spacer>

          <v-btn 
            v-if="!isAuthenticated"
            class="login_text"
            elevation="0"
            :to="{name: 'Login'}"
          >
            Sign in
          </v-btn>

          <v-btn
            v-else
            class="login_text"
            elevation="0"
            :to="{name: 'DiscoverIndex'}"
          >
            Discover
          </v-btn>
        </v-toolbar-items>
      </v-container>
    </v-toolbar>

    <v-navigation-drawer
      v-model="drawer"
      v-if="$vuetify.breakpoint.smAndDown"
      app
      fixed
      dark
      class="landing-sidebar"
      :disable-resize-watcher="true"
    >
      <v-list flat>
        <v-list-tile to="/" class="mb-6">
          <img
            style="width: 142px; height: auto"
            class="mobile-logo"
            src="/static/images/nav_logo_white.png"
          />
        </v-list-tile>
        <v-list-tile
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-tile-title>{{ link.text }}</v-list-tile-title>
        </v-list-tile>
      </v-list>

      <v-btn
        v-if="!isAuthenticated"
        class="login_text_mobile d-sm-flex d-none justify-md-center align-md-center"
        elevation="0"
        :to="{name: 'Login'}"
      >
        Sign in
      </v-btn>
      <v-btn
        v-else
        class="login_text_mobile d-sm-flex d-none justify-md-center align-md-center"
        elevation="0"
        :to="{name: 'DiscoverIndex'}"
      >
        Discover
      </v-btn>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// import Popup from './Popup.vue'
export default {
  data: () => ({
    drawer: false,
    links: [
      { text: "Artists & Brands", route: "Creators" },
      { text: "Go Ad-Free", route: "AdFree" },
    ],
  }),
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  .landing-sidebar {
    z-index: 13;
    background: #000000;
    padding: 10px 20px;
  }
  header {
    background: #fff !important;
  }

  &-container {
    margin: 0 auto !important;
    display: flex;
    padding-left: 0;
    padding-right: 0;

    .toggle-icon {
      cursor: pointer;
      max-width: 36px;
      width: 100%;
      display: none;
    }

    .toolbar__title {
      display: block;
      width: auto;
    }
  }
}
.nav_text {
  box-shadow: none;
  outline: none;
  font-style: normal;
  font-weight: 400;
  font-size: 16px !important;
  line-height: 26px !important;
  padding: 0;
  text-transform: capitalize;
  background: transparent !important;
  color: #000000 !important;
  margin-left: 40px;
  margin-right: -20px;

  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
  .v-btn__content {
    color: #000000 !important;
  }

  &:active {
    box-shadow: none !important;
  }
}

.login_text,
.login_text_mobile {
  max-width: 100px;
  width: 100%;
  height: 40px;
  box-shadow: none !important;
  text-transform: capitalize;
  background: #2965ff !important;
  box-sizing: border-box;
  border-radius: 100px;
  font-style: normal;
  font-weight: 700 !important;
  font-size: 16px !important;
  line-height: 22px !important;
  color: #ffffff !important;
  letter-spacing: normal;

  @media (max-width: 960px) {
    // display: none;
  }
  &:hover {
    border: none;
  }
}
.login_text_mobile {
  @media (max-width: 960px) {
    display: flex;
    max-width: 90%;
    width: 100%;
    margin-left: 16px;
    font-size: 16px !important;
  }
}
.v-btn.logo {
  &::before {
    display: none;
  }
  background-color: transparent !important;
  box-shadow: none !important;
}
@media (max-width: 960px) {
  .navbar {
    &-container {
      padding: 4px 16px;

      .toggle-icon {
        display: flex;
      }

      .link-text-wrapper {
        display: none;
      }

      .toolbar__title {
        display: flex;
        width: 100%;
        justify-content: center;
      }
    }
  }
  .v-toolbar__title {
    // flex: 8;
  }
  .v-navigation-drawer {
    background: #000000 !important;
    .v-navigation-drawer__content {
      padding: 60px 10px;
      .v-list-item {
        .v-list-item__title {
          font-weight: bold;
          font-size: 16px !important;
          line-height: 20px !important;
          letter-spacing: -0.4px;
          color: #ffffff !important;
        }
      }
    }
  }
  .login_text {
    max-width: 71px;
    font-size: 14px !important;
  }
  .logo {
    // flex: 1;
    padding: 0px !important;
    .v-btn__content {
      width: 100% !important;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
