<template>
  <div class="menu-container">
    <mobile-header
      @open-menu="$emit('close-menu')"
      menu-img="/static/images/ic_close.svg"
    />

    <div class="section">
      <div class="section__content">
        <ul>
          <li @click="goTo('/terms')">Terms</li>
          <li @click="goTo('/terms#privacy_policy')">Privacy</li>
        </ul>
      </div>

      <div class="section__footer">
      </div>
    </div>
  </div>
</template>

<script>
import mobileHeader from './header'
export default {
  components: {
    mobileHeader
  },

  methods: {
    closeMenu () {
      this.$emit('close-menu')
    },

    goTo (path) {
      this.$router.push({ path: path })
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-container {
  height: 100%;
  background-color: #000000;

  .header-container {
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    background: transparent;
    box-shadow: none;

    img {
      height: 24px;
    }

    .btn {
      position: absolute !important;
      min-width: auto;
      margin: 0;
      right: 15px;
      &__content {
        padding: 8px;
        &:before {
          background-color: transparent;
        }
        img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .section {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding-top: 80px;
    color: #ffffff;
    text-align: center;

    &__content {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      //align-items: center;

      ul {
        margin-top: 20%;
        list-style: none;
        li {
          font-size: 24px;
          line-height: 64px;
        }
      }
    }

    &__footer {
      height: 70px;
      flex: 0 0 auto;
    }
  }
}
</style>
