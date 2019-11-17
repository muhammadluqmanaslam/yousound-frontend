<template>
  <div class="mobile-page mobile-dashboard-landing-page">
    <mobile-header @open-menu="openMenu"></mobile-header>
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
                  Share Music <br>
                  & Earn Money.<br>
                  Shop.
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
                  Live Video Chat with<br>
                  Artists & Brands.<br>
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
                <stepper :step-size="6" :active-index="4"></stepper>
                <img src="/static/images/img_download_ios.svg">
              </div>
            </div>
          </div>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>

    <v-dialog v-model="showMenu" fullscreen transition="slide-x-reverse-transition">
      <mobile-menu @close-menu="closeMenu"></mobile-menu>
    </v-dialog>
  </div>
</template>

<script>
import mobileHeader from '@/views/mobile/components/header'
import mobileMenu from '@/views/mobile/components/menu'
import stepper from './components/stepper'

export default {
  components: {
    mobileHeader,
    mobileMenu,
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
    font-family: Montserrat, serif;
    letter-spacing: -1px;

    &__image {
      height: 50%;
      flex: 0 0 auto;
      background-repeat: no-repeat;
      background-size: auto 90%;
      background-position: center center;
    }

    &__content {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__footer {
      height: 180px;
      flex: 0 0 auto;
      .step-container {
        margin-bottom: 20px;
      }
      img {
        height: 40px;
      }
    }

    h3 {
      font-size: 16px;
      line-height: 20px;
    }

    .btn {
      height: 40px;
      margin: 0;
      border-radius: 20px;
      background: rgba(0, 0, 0, 0.2);
      box-shadow: none;
      color: #ffffff;
      font-size: 16px;
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
      background-position: 15px center;
    }
  }

  .section-wrapper.step-2 {
    background-image: linear-gradient(#DD5675, #FF5C44);
    .section__image {
      background-image: url('/static/images/img_mobile_landing_products.png');
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

  .header-container {}
}

@media (min-width: 320px) {
  .mobile-page .section h3 {
    font-size: 22px;
    line-height: 24px;
    margin-bottom: 16px;
  }

  .mobile-page .section .btn {
  font-size: 14px;
  }

  .mobile-page .section__footer img {
    height: 45px;
  }
}

//@media (min-width: 384px) {
@media (min-width: 375px) {
  .mobile-page .section h3 {
    font-size: 24px;
    line-height: 32px;
  }

  .mobile-page .section__footer img {
    height: 50px;
  }
}

@media (min-width: 414px) {
  .mobile-page .section h3 {
    font-size: 32px;
    line-height: 36px;
    margin-top: -30px;
  }

    .mobile-page .section .btn {
  font-size: 18px;
  }

  .menu-container .section__content ul {
    font-size: 36px;
    line-height: 108px;
    font-weight: 100;
  }

  .mobile-page .section__footer {
    height: 200px;
  }

  .mobile-page .section__footer img {
    height: 60px;
  }
}

@media (min-width: 600px) {
  .mobile-page .section h3 {
    font-size: 38px;
    line-height: 42px;
  }
}

@media (min-width: 800px) {
  .mobile-page .section h3 {
    font-size: 48px;
    line-height: 55px;
  }
}
</style>
