<template>
  <div class="download-app">
    <v-container grid-list-lg>
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
            <img :src="iosStore" width="30%" class="ios-store mr-3" alt="ios app store icon" />
            <img :src="androidPlaystore" width="30%" class="android-store" alt="android app store icon" />
          </div>
        </v-flex>

        <v-flex xs12 sm4>
          <div class="qr-wrapper">
            <img :src="renderQR" width="100%" :alt="altText" />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
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
