<template>
  <footer>
    <v-container grid-list-xs px-0 class="inner-footer">
      <v-layout wrap row class="mb-15">
        <v-flex xs12 md3>
          <div class="logo-container">
            <img
              style="width: 130px"
              class="footer-logo"
              src="/static/images/nav_logo_primary.png"
            />
          </div>
          <a
            class="appstore-logo-wrapper mt-6 mx-auto mx-md-0 d-flex d-md-block justify-center"
            target="_blank"
            style="width: 140px"
            href="https://apps.apple.com/us/app/yousound/id1452078262"
          >
            <img
              style="width: 100%"
              class="appstore-logo"
              src="/static/images/store.png"
            />
          </a>
        </v-flex>
        <v-flex xs12 md2>
          <h3 class="mb-6">About</h3>
          <v-list flat>
            <v-list-tile
              v-for="link in aboutLinks"
              :key="link.text"
              router
              :href="link.route"
              :target="link.ext ? '_blank' : ''"
              class="pl-md-0"
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
              class="pl-md-0"
              color="dark"

            >
              <v-list-tile-title class="black--text">{{ link.text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex xs12 md5>
          <h3 class="mb-6">Subscribe our Newsletter</h3>
          <form action="" class="d-flex align-center">
            <input type="email" placeholder="Your email" />
            <v-btn class="subscribe_btn"> Subscribe</v-btn>
          </form>
        </v-flex>
      </v-layout>
    </v-container>
    <p class="text-center mt-md-15">© 2021 YouSound, Inc.</p>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      aboutLinks: [
        { text: "Podcast", route: "/yousound#video" },
        { text: "Career", ext: true, route: "https://support.yousound.com/en/collections/2401816-careers" },
      ],
      companyLinks: [
        { text: "Privacy", route: "/terms#privacy_policy" },
        { text: "Terms", route: "/terms#terms_of_use" },
        { text: "Support", ext: true, route: "https://support.yousound.com/" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
footer {
  .inner-footer {
    max-width: 1200px;
    width: 100%;
    margin: auto;
  }
  padding-top: 80px;
  padding-bottom: 34px;
  p {
    border-top: 2px solid rgba(235, 234, 237, 0.5);
    padding-top: 40px;
    margin: 0 !important;
    font-size: 14px;
    line-height: 26px;
    color: rgba(21, 20, 57, 0.41);
  }
  h3 {
    font-weight: 700 !important;
    font-size: 18px;
    line-height: 28px;
    color: #000000;
  }
  .v-list-item {
    min-height: 35px !important;
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
    form {
      flex-direction: column !important;
    }
    input {
      width: 100%;
      margin-bottom: 14px;
      margin-right: 0px;
    }
    .subscribe_btn {
      max-width: 100%;
      font-size: 14px !important;
    }
  }
}
</style>
