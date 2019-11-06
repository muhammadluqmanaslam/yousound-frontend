<template>
  <div class="mobile-product-page">
    <mobile-header @open-menu="openMenu"></mobile-header>
    <div class="section">
      <div class="section__content">
        <div class="section__image">
        </div>
      </div>
      <div class="section__footer">
      </div>
    </div>
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
    color: #ffffff;
    text-align: center;

    &__image {
      height: 50%;
      flex: 0 0 auto;
      background-repeat: no-repeat;
      background-size: auto 90%;
      background-position: 15px center;
    }

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
    }
  }
}
</style>
