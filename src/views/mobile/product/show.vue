<template>
  <div class="mobile-product-page">
    <mobile-header theme="dark" @open-menu="openMenu"></mobile-header>
    <div class="section">
      <div class="section__header">
        <div class="media">
          <div class="media__cover">
            <div class="image"></div>
            <div class="tag">$40</div>
          </div>
          <div class="media__footer">
            <div class="media__title">
              Austral Pulse Double Vinlyl Austral Pulse Double Vinlyl
            </div>
            <div class="media__subtitle">
              George Clinton
            </div>
          </div>
        </div>
      </div>
      <div class="section__content">
        <h3>
          Share to earn money.<br>
          Shop artists and brands.
        </h3>
      </div>
      <div class="section__footer">
        <img src="/static/images/img_download_ios.svg">
      </div>
    </div>

    <v-dialog v-model="showMenu" fullscreen transition="slide-x-reverse-transition">
      <mobile-menu @close-menu="closeMenu"></mobile-menu>
    </v-dialog>
  </div>
</template>

<script type="text/javascript">
import mobileHeader from '@/views/mobile/components/header'
import mobileMenu from '@/views/mobile/components/menu'

export default {
  components: {
    mobileHeader,
    mobileMenu
  },

  data () {
    return {
      showMenu: false
    }
  },

  methods: {
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
.mobile-product-page {
  .section {
    display: flex;
    flex-direction: column;
    height: 100vh;
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
      height: 70px;
      flex: 0 0 auto;
      img {
        height: 40px;
      }
    }
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
      }
      .tag {
        position: absolute;
        bottom: 15px;
        right: 15px;
        padding: 4px 12px;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
        font-weight: 500;
      }
    }
    &__title {
      width: 100%;
      padding-top: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      white-space: nowrap;
      line-height: 16px;
      font-size: 14px;
      font-weight: 600;
    }
    &__subtitle {
      width: 100%;
      padding-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      white-space: nowrap;
      line-height: 16px;
      font-size: 14px; 
      font-weight: 300;
    }
  }
}
</style>
