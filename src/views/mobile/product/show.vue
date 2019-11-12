<template>
  <div class="mobile-product-page">
    <mobile-header theme="dark" @open-menu="openMenu"></mobile-header>
    <div class="section" v-if="!loading">
      <div class="section__header">
        <div class="media">
          <div class="media__cover">
            <div class="image" :style="{'background-image': 'url(' + product.covers[0].cover.url + ')'}"></div>
            <div class="tag">${{ product.price | formatNumber }}</div>
          </div>
          <div class="media__footer">
            <div class="media__title">
              {{ product.name }}
            </div>
            <div class="media__subtitle">
              {{ product.merchant.display_name }}
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

import ProductService from '@/services/product'

export default {
  components: {
    mobileHeader,
    mobileMenu
  },

  data () {
    return {
      slug: null,
      product: null,
      showMenu: false,
      loading: true
    }
  },

  methods: {
    openMenu () {
      this.showMenu = true
    },

    closeMenu () {
      this.showMenu = false
    }
  },

  created () {
    this.slug = this.$route.params.slug
    this.loading = true
    ProductService.getProduct(this.slug).then(res => {
      this.product = res.body
      this.loading = false
    })
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
        background-size: contain;
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
