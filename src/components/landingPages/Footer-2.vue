<template>
  <footer>
    <v-container grid-list-xs px-0 class="inner-footer">
      <v-layout wrap row class="mb-15">
        <v-flex xs12 md5>
          <div class="logo-container">
            <img
              style="width: 165px"
              class="footer-logo"
              src="/static/images/nav_logo_primary.png"
            />
          </div>
          <div class="flex-app">
            <a
              class="appstore-logo-wrapper mt-6 mx-auto mx-md-0 d-flex d-md-block justify-center"
              target="_blank"
              style="width: 150px"
              href="https://apps.apple.com/us/app/yousound/id1452078262"
            >
              <img
                style="width: 100%"
                class="appstore-logo"
                src="/static/images/app-store.svg"
              />
            </a>
            <a
              class="appstore-logo-wrapper mt-6 mx-auto mx-md-0 d-flex d-md-block justify-center"
              target="_blank"
              style="width: 150px"
              href="https://apps.apple.com/us/app/yousound/id1452078262"
            >
              <img
                style="width: 100%"
                class="appstore-logo"
                src="/static/images/play-store.svg"
              />
            </a>

          </div>
        </v-flex>
        <v-flex xs12 md1>
        </v-flex>
        <v-flex xs12 md2>
          <h3 class="mb-6">Product</h3>
          <v-list flat>
            <v-list-tile
              v-for="link in aboutLinks"
              :key="link.text"
              router
              :href="link.route"
              :target="link.ext ? '_blank' : ''"
              class="pl-md-0 height-normal"
            >
                <!-- {{ link.text }} -->
                <v-list-tile-title class="black--text">{{ link.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex xs12 md2>
          <h3 class="mb-6">Company</h3>
          <v-list flat>
            <v-list-tile
              v-for="link in companyLinks"
              :key="link.text"
              router
              :href="link.route"
              :target="link.ext ? '_blank' : ''"
              class="pl-md-0 height-normal"
              color="dark"

            >
              <v-list-tile-title class="black--text">{{ link.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex xs12 md2>
          <h3 class="mb-6">Support</h3>
          <v-list flat>
            <v-list-tile
              v-for="link in supportLinks"
              :key="link.text"
              router
              :href="link.route"
              :target="link.ext ? '_blank' : ''"
              class="pl-md-0 height-normal"
              color="dark"

            >
              <v-list-tile-title class="black--text">{{ link.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <div class="divider-div dflex justify-space-between">

        <p>© 2021 YouSound, Inc.</p>
        <div class="footer-icons">
          <div class="footer-social-icon">
            <img src="/static/images/Twitter.svg" width="100%">
          </div>
          <div class="footer-social-icon">
            <img src="/static/images/Instagram.svg" width="100%">
          </div>
          <div class="footer-social-icon">
            <img src="/static/images/YouTube.svg" width="100%">
          </div>

        </div>

      </div>
      
    </v-container>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      aboutLinks: [
        { text: "Discover", route: "/yousound#video" },
        { text: "Download apps", route: "/yousound#video" },
        { text: "Case studies", ext: true, route: "https://support.yousound.com/en/collections/2401816-careers" },
      ],
      companyLinks: [
        { text: "About", route: "/terms#privacy_policy" },
        { text: "Careers", route: "/terms#terms_of_use" },
        { text: "Terms", ext: true, route: "https://support.yousound.com/" },
        { text: "Privacy", ext: true, route: "https://support.yousound.com/" },

      ],
      supportLinks: [
        { text: "Help Center", route: "/terms#privacy_policy" },
        { text: "FAQ", route: "/terms#terms_of_use" },
        { text: "Server Status", ext: true, route: "https://support.yousound.com/" },
        { text: "Report a bug", ext: true, route: "https://support.yousound.com/" },

      ],
    };
  },
};
</script>

<style lang="scss" scoped>
footer {

  .height-normal{
    font-size: 16px;
    height: 34px !important;
  }
  .inner-footer {
    max-width: 1200px;
    width: 100%;
    margin: 60px auto 50px;

      .flex-app{
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      margin-top: 25px;
    }

  }
  border-top: 1px solid #eff0f6;


  .divider-div{

    border-top: 1px solid #eff0f6;
    padding-top: 30px;
    margin: 0 !important;
    font-size: 16px;
    line-height: 26px;
    color: #424242;
  }

  h3 {
    font-weight: 700 !important;
    font-size: 20px;
    line-height: 28px;
    color: #000000;
    letter-spacing: -0.3px;
  }
  .v-list-item {
    .v-list-item__title {
      color: #000000 !important;
    }
  }

  /deep/.list__tile--link {
    &:hover {
      background: transparent;
    }
  }


  .subscribe_btn {
    max-width: 130px;
    width: 100%;
    height: 40px;
    box-shadow: none !important;
    text-transform: capitalize;
    box-sizing: border-box;
    border-radius: 100px;
    font-style: normal;
    font-weight: 700 !important;
    font-size: 16px !important;
    line-height: 22px !important;
    color: #ffffff !important;
    letter-spacing: normal;
    background: #000000 !important;
    border: 2px solid #000000;
  }
  input {
    border: 2px solid #cbcbcb;
    box-sizing: border-box;
    border-radius: 100px;
    height: 40px;
    margin-right: 10px;
    padding: 8px 18px;
    &:focus {
      outline: none;
    }
  }

  .footer-icons{
    display: flex;
    gap: 20px;

    .footer-social-icon{
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

    }
  }
}

@media (max-width: 960px) {
  footer {
    padding-top: 10px;
    .inner-footer {
      padding: 55px 44px;
    }
    h3 {
      text-align: center;
    }
    .list__tile {
      font-size: 14px;
      color: #424242;
      .list__tile__title {
        text-align: center;
      }
    }
    .logo-container {
      display: flex;
      justify-content: center;
      max-height: 30px;
      img {
        height: 25px;
      }
    }
    .appstore-logo-wrapper {
      margin: 20px auto !important;

      .appstore-logo {
        height: 47px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
