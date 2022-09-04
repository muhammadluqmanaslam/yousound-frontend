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
        </v-flex>

        <v-flex xs12 sm4>
          <div class="qr-wrapper">
            <img :src="renderQR" width="100%" :alt="altText" />
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container v-else-if="type === 'type2'" grid-list-lg :class="[`_${type}`]">
      <v-layout row wrap align-center qrsection-card>
        <v-flex xs12 sm8>
          <div class="_title">Spotlight video</div>

          <hr class="my-3" />

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

          <hr />

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

        <v-flex xs12 sm4 artist-card>
          <!-- <div class="qr-wrapper">
            <img :src="renderQR" width="100%" :alt="altText" />
          </div> -->
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    type: {
      default: "type1",
      type: String,
    },
  },
  data() {
    return {
      iosStore: require("@/assets/img_download_app_store.svg"),
      androidPlaystore: require("@/assets/img_download_play_store.svg"),
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
  },
};
</script>

<style lang="scss" scoped>
.download-app {
  background-color: #ffffff;
  padding: 40px;
  color: #000000;

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
      line-height: 1.2;
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
          line-height: 1.2;
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
        width: 30%;
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

    .artist-card {
      background: linear-gradient(159.57deg, #72718A 3.75%, #1F1F21 95.84%);
      padding: 20px 50px;
    }
  }
}
</style>

<style lang="scss">
.dialog.download-app-dialog {
  width: auto;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.9);

  //   .download-app {
  //     width: 1203px
  //   }
}
.overlay.overlay--active {
  width: auto;
  background-color: rgba(0, 0, 0, 0.9);
}
</style>
