<template>
  <div class="mobile-page mobile-dashboard-landing-page">
    <landing-header @open-menu="openMenu"></landing-header>
    <v-tabs v-model="activeTab" centered>
      <v-tabs-bar>
        <v-tabs-item href="#tab-1">1</v-tabs-item>
        <v-tabs-item href="#tab-2">2</v-tabs-item>
        <v-tabs-item href="#tab-3">3</v-tabs-item>
        <v-tabs-item href="#tab-4">4</v-tabs-item>
      </v-tabs-bar>

      <v-tabs-items>
        <v-tabs-content id="tab-1">
          <div class="section-wrapper step-1">
            <div class="section">
              <div class="section__image"></div>
              <div class="section__content">
                <h3>
                  Free streaming.<br>
                  Free downloads.<br>
                  No ads.
                </h3>
              </div>
              <div class="section__footer">
                <stepper :step-size="4" :active-index="1"></stepper>
                <v-btn @click.native="nextTab">
                  Next
                  <v-icon>arrow_forward</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-tabs-content>

        <v-tabs-content id="tab-2">
          <div class="section-wrapper step-2">
            <div class="section">
              <div class="section__image"></div>
              <div class="section__content">
                <h3>
                  Share music<br>
                  and earn money.<br>
                  Shop Artists & Brands.
                </h3>
              </div>
              <div class="section__footer">
                <stepper :step-size="4" :active-index="2"></stepper>
                <v-btn @click.native="nextTab">
                  Next
                  <v-icon>arrow_forward</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-tabs-content>

        <v-tabs-content id="tab-3">
          <div class="section-wrapper step-3">
            <div class="section">
              <div class="section__image"></div>
              <div class="section__content">
                <h3>
                  Live Video Chart with<br>
                  Artists & Friends.
                </h3>
              </div>
              <div class="section__footer">
                <stepper :step-size="4" :active-index="3"></stepper>
                <v-btn @click.native="nextTab">
                  Next
                  <v-icon>arrow_forward</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-tabs-content>

        <v-tabs-content id="tab-4">
          <div class="section-wrapper step-4">
            <div class="section">
              <div class="section__image"></div>
              <div class="section__content">
                <h3>
                  Powered by Verified<br>
                  Artists & Brands.
                </h3>
              </div>
              <div class="section__footer">
                <stepper :step-size="4" :active-index="4"></stepper>
                <img src="/static/images/img_download_ios.svg" height="40">
              </div>
            </div>
          </div>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>

    <v-dialog v-model="showMenu" fullscreen transition="slide-x-reverse-transition">
      <landing-menu @close-menu="closeMenu"></landing-menu>
    </v-dialog>
  </div>
</template>

<script>
import landingHeader from './components/header'
import landingMenu from './components/menu'
import stepper from './components/stepper'

export default {
  components: {
    landingHeader,
    landingMenu,
    stepper
  },

  data () {
    return {
      activeTab: 'tab-1',
      tabs: ['tab-1', 'tab-2', 'tab-3', 'tab-4'],
      showMenu: false
    }
  },

  methods: {
    nextTab () {
      console.log('nextTab', this.activeTab)
      this.activeTab = this.tabs[(this.tabs.indexOf(this.activeTab) + 1) % this.tabs.length]
    },

    openMenu () {
      this.showMenu = true
    },

    closeMenu () {
      this.showMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-page {
  .section {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding-top: 80px;
    color: #ffffff;
    text-align: center;

    &__image {
      height: 50%;
      flex: 0 0 auto;
      background-repeat: no-repeat;
      background-size: auto 90%;
      background-position: 15px center;
    }

    &__content {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__footer {
      height: 120px;
      flex: 0 0 auto;
      .step-container {
        margin-bottom: 20px;
      }
    }

    h3 {
      font-size: 24px;
    }

    .btn {
      height: 40px;
      margin: 0;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.2);
      box-shadow: none;
      color: #ffffff;
      font-size: 12px;
      /deep/ &__content {
        position: relative;
        height: 40px;
        padding: 0 80px;
        text-transform: initial;
        &:before {
          background-color: transparent;
        }
        i {
          position: absolute;
          right: 15px;
          font-size: 14px;
        }
      }
    }
  }

  .section-wrapper.step-1 {
    background-image: linear-gradient(#7152FF, #3908FF);
    .section__image {
      background-image: url('/static/images/img_land_albums.png');
    }
  }

  .section-wrapper.step-2 {
    background-image: linear-gradient(#DD5675, #FF5C44);
    .section__image {
      background-image: url('/static/images/img_land_products.png');
      background-position: -90px center;
    }
  }

  .section-wrapper.step-3 {
    background: url('/static/images/bg_land_videos.jpg') no-repeat center center;
    background-size: cover;
  }

  .section-wrapper.step-4 {
    background-image: linear-gradient(#5155FF, #62A3FF);
    .section__image {
      background-image: url('/static/images/img_land_artists.png');
      background-position: center center;
    }
  }

  .tabs {
    &__bar {
      z-index: 1;
      position: fixed;
      display: none;
      bottom: 0px;
    }
  }

  .header-container {
    z-index: 1;
    position: fixed;
    top: 0;
    width: 100%;
  }
}
</style>
