<template>
  <div class="mobile-user-page">
    <mobile-header theme="light" :show-menu="false" @open-menu="openMenu" />

    <div class="section" v-if="!loading">
      <div class="section__header">
        <div class="media">
          <div class="media__cover">
            <div
              class="image"
              :style="{
                'background-image': 'url(' + user.avatar.url + ')',
              }"
            ></div>
            <div class="media__tag">
              <img src="/static/images/ic_cart.svg" />
            </div>
          </div>
          <div class="media__footer">
            <div class="media__subtitle">
              <label>{{ user.display_name }}</label>
              <v-icon v-if="isUserVerified">fa-check-circle</v-icon>
            </div>
            <div class="media__title">@{{ user.username }}</div>
            <div class="media__description">
              {{ user.user_type }}
            </div>
          </div>
        </div>
      </div>

      <div class="section__content">
        <h3>
          Connect.<br />
          Find your community.
        </h3>
      </div>
      <div class="section__footer">
        <a href="//apps.apple.com/us/app/id1452078262" target="_blank"
          ><img src="/static/images/img_download_ios.svg"
        /></a>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import _ from 'lodash'
import mobileHeader from '@/views/mobile/components/header'
import mobileFooter from '@/views/mobile/components/footer'
import mobileMenu from '@/views/mobile/components/menu'

import UserService from '@/services/user'

export default {
  components: {
    mobileHeader,
    mobileFooter,
    mobileMenu,
  },

  data() {
    return {
      slug: null,
      user: null,
      showMenu: false,
      loading: true,
    }
  },

  computed: {
    isUserVerified() {
      const userType = _.get(this.user, 'user_type')
      return ['artist', 'label', 'brand'].indexOf(userType) > -1
    },
  },

  methods: {
    openMenu() {
      this.showMenu = true
    },

    closeMenu() {
      this.showMenu = false
    },
  },

  created() {
    this.slug = this.$route.params.slug
    const self = this
    document.location = `ys://user/${this.slug}`
    setTimeout(function () {
      self.loading = true
      UserService.getUserInfo(self.slug).then((res) => {
        self.user = res.body
        self.loading = false
      })
    }, 300)
  },
}
</script>

<style lang="scss" scoped>
.mobile-user-page {
  .section {
    //display: flex;
    //height: 100vh;
    //flex-direction: column;
    display: block;
    padding-top: 80px;
    color: #000;
    text-align: center;
    font-family: Montserrat, serif;

    &__header {
      flex: 0 0 auto;
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
      img {
        height: 60px;
      }
    }
  }

  h3 {
    margin: 40px 0;
    font-size: 22px;
    line-height: 26px;
  }

  .media {
    width: 100%;
    //height: 50%;
    //flex: 0 0 auto;
    padding: 0 20px;
    &__cover {
      position: relative;
      //width: 80%;
      //padding-top: 80%;
      width: 100%;
      padding-top: 100%;
      margin: 0 auto;
      border-radius: 5px;
      overflow: hidden;
      .image {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: url('/static/images/album.jpg') no-repeat center center;
        background-size: contain;
      }
    }
    &__footer {
      position: relative;
      padding: 0 0 15px 0;
      border-bottom: 1px solid #0000001f;
    }
    &__title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      white-space: nowrap;
      line-height: 24px;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.3px;
    }
    &__subtitle {
      display: flex;
      padding-top: 14px;
      text-align: center;
      justify-content: center;
      align-items: center;
      label {
        line-height: 24px;
        font-size: 24px;
        font-weight: 300;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: -4px;
        letter-spacing: -0.2px;
        padding-right: 1px;
      }
      .icon {
        margin-top: -10px;
        font-size: 20px;
        color: #5cb338;
      }
    }
    &__description {
      width: 100%;
      padding-top: 10px;
      padding-bottom: 4px;
      text-align: center;
      text-transform: capitalize;
      line-height: 24px;
      font-size: 20px;
      font-weight: 500;
    }
    &__tag {
      position: absolute;
      bottom: 20px;
      right: 20px;
      height: 40px;
      width: 40px;
      //padding: 4px 8px;
      border-radius: 20px;
      //background-color: rgba(0, 0, 0, 0.1);
      background-color: #000;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.2px;
      display: none;
      img {
        width: 24px;
        height: 40px;
      }
    }
  }

  .header-container {
    position: absolute;
  }

  .footer-container {
    border-top: 1px solid #0000001f;
    padding: 15px 0 5px 0;
  }
}
</style>
