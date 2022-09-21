<template>
  <div class="download-app" :class="[`download-app_${type}`]">
    <v-container v-if="type === 'type1'" grid-list-lg :class="[`_${type}`]">
      <v-layout row wrap align-center>
        <v-flex xs12 sm8>
          <div class="_title">
            Scan QR code.
            <br />
            Download the app.
          </div>

          <div class="_subtitle">
            Point your camera at the QR code & open the link.
            <br />
            You will be redirected to the App Store or Google Play store.
          </div>

          <div class="store-badge">
            <img
              :src="iosStore"
              width="45%"
              class="ios-store mr-3"
              alt="ios app store icon"
            />
            <img
              :src="androidPlaystore"
              width="45%"
              class="android-store"
              alt="android app store icon"
            />
          </div>
        </v-flex>

        <v-flex xs12 sm4>
          <div class="qr-wrapper">
            <img :src="renderQR" width="100%" :alt="altText" />
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container v-else-if="type === 'type2'" grid-list-lg :class="[`_${type}`]">
      <v-layout v-if="!showPlan" row wrap qrsection-card>
        <v-flex xs12 sm8 details-card>
          <div class="dflex">
            <img :src="require('@/assets/ic_spotlight.svg')" width="30" class="mr-2" alt="spotlight icon">
            <div class="_title">Spotlight video</div>
          </div>

          <hr class="my-4" />

          <div class="_subtitle">
            Download the app to upload a video for your spotlight.
            <br />
            When potential subscibers preview your content they will see your
            video.
          </div>

          <div class="_highlight">
            <div class="intro">Things to mention in your video:</div>

            <ul class="_highlight-list">
              <li>Who you are</li>
              <li>The type of content you’re offering</li>
              <li>
                Run up your streams! Their subscription is shared with the
                creators they stream most!
              </li>
            </ul>
          </div>

          <hr class="mb-5" />

          <div class="store-badge">
            <div class="qr-wrapper">
              <img :src="renderQR" width="130" :alt="altText" />
            </div>

            <div class="badges">
              <div class="_title">
                Scan QR code.
                <br />
                Download the app.
              </div>

              <v-spacer></v-spacer>

              <div>
                <img
                  :src="iosStore"
                  width="30%"
                  class="ios-store mr-3"
                  alt="ios app store icon"
                />
                <img
                  :src="androidPlaystore"
                  width="30%"
                  class="android-store"
                  alt="android app store icon"
                />
              </div>
            </div>

          </div>
        </v-flex>

        <v-flex xs12 sm4 featured-card>
          <div class="card-wrapper">
            <div class="card-image" :style="`background-image: url(${userImage});}`">
              <div class="featured-artist dflex justify-space-between align-center">
                <div>
                  <div class="__label">Subscribe to support</div>
                  <div class="artist-name">
                    <user-tag :user="currentUser" />
                  </div>
                </div>

                <div class="volume allChildrenCenter">
                  <v-icon v-if="true">volume_up</v-icon>
                  <v-icon v-else>volume_off</v-icon>
                </div>

              </div>
            </div>

            <div class="card-details">
                <img :src="require('@/assets/nav_logo_primary.png')" width="100" class="mb-2" alt="yousound logo">

              <div>
                Get full access to all creators & their content.
                <br />
                <strong>50%</strong> of your subscription shared with creators you stream the most.
              </div>

              <br>

              <strong>1 month free, then $10/month.</strong>

              <v-btn depressed block dark class="mt-2 showPlanBtn" @click="showPlan = true; ">Start 30 day free trial</v-btn>
            </div>
          </div>
        </v-flex>
      </v-layout>

      <AuthPlan v-if="showPlan" />
    </v-container>


  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserTag from "@/components/user_tag";
// import AuthPlan from "@/views/mobile/auth/onboarding/authPlan"
import AuthPlan from "@/views/mobile/auth/onboarding/authPlan"

export default {
  props: {
    type: {
      default: "type1",
      type: String,
    },
  },
  components: {
    UserTag,
    AuthPlan,
  },
  data() {
    return {
      iosStore: require("@/assets/img_download_app_store.svg"),
      androidPlaystore: require("@/assets/img_download_play_store.svg"),
      showPlan: false,
    };
  },
  computed: {
    ...mapGetters({
      isiOS: "app/isiOS",
      isAndroid: "app/isAndroid",
    }),
    mobileDeviceType() {
      return this.isiOS ? "ios" : this.isAndroid ? "android" : null;
    },
    renderQR() {
      const iOSQR = require("@/assets/ios-app-link-qr.svg");
      // TODO update Androiid QR SVG
      const androidQR = require("@/assets/ios-app-link-qr.svg");

      if (this.isAndroid) {
        return androidQR;
      }

      return iOSQR;
    },
    altText() {
      if (this.isAndroid) {
        return "download yousound android qr code";
      }

      return "download yousound ios qr code";
    },
    currentUser() {
      return this.$store.state.auth.user
    },
    userImage() {
      return this.currentUser.avatar.url
    },
  },
};
</script>

<style lang="scss" scoped>
.download-app {
  background-color: #ffffff;
  padding: 40px;
  color: #000000;

  &_type2 {
    padding: 0;

    .container._type2 {
      padding: 0;

      .qrsection-card {
        margin: 0;

        .details-card {
          padding-left: 40px;
          padding-right: 40px;
          padding-top: 50px;
        }
      }
    }
  }

  ._type1 {
    ._title {
      font-size: calc(20px + 1.35vw);
      line-height: 1.2;
      font-weight: bold;
    }
    ._subtitle {
      font-size: 20px;
      margin: 20px 0 35px;
    }
  
    .qr-wrapper {
      padding: 15px;
      border: 4px solid #000000;
      border-radius: 20px;
    }
  }
  ._type2 {
    ._title {
      font-size: 24px;
      line-height: 40px;
      font-weight: bold;
    }
    ._subtitle {
      font-weight: 500;
      font-size: 16px;
    }
    ._highlight {
      font-size: 16px;
      margin: 20px 0 35px;

      &-list {
        margin-left: 15px;
        li {
          line-height: 30px;
        }
      }
      .intro {
        font-weight: 700;
        margin-bottom: 13px;
      }
    }

    hr {
      height: 1px;
      border: none;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      margin: 15px 0;
    }

    .store-badge {
      display: flex;

      .qr-wrapper {
        width: 50%;
        overflow: hidden;
        border: 4px solid #000000;
        border-radius: 20px;
        margin-right: 25px;

        img {
          width: 100%;
        }
      }

      .badges {
        display: flex;
        flex-direction: column;
      }
    }

    .featured-card {
      background: linear-gradient(159.57deg, #72718A 3.75%, #1F1F21 95.84%);
      padding: 40px 50px;

      .card-image {
        position: relative;
        min-height: 350px;
        border-radius: 7px;
        background-size: contain;
        background-repeat: no-repeat;

        .featured-artist {
          position: absolute;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          padding: 20px;
          width: 100%;
          color: #ffffff;

          .__label {
            font-weight: bold;
          }
          .artist-name {
            font-size: 1.5em;
            font-weight: bold;
          }

          .volume {
            border-radius: 200px;
            color: #000000;
            background-color: #ffffff;
            height: 30px;
            width: 30px;

            .icon {
              color: #000000;
              font-size: 15px;
              cursor: pointer;
            }
          }
        }
      }
      .card-details {
        position: relative;
        z-index: 3;
        width: 100%;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        margin-top: -10px;
        font-size: 15px;

        .showPlanBtn {
          border-radius: 7px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.dialog.download-app-dialog {
  width: auto !important;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.9);
}
.overlay.overlay--active {
  width: auto;
  background-color: rgba(0, 0, 0, 0.9);
}
</style>
