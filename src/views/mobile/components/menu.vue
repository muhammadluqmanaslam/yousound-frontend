<template>
  <div class="menu-container">
    <mobile-header
      @open-menu="$emit('close-menu')"
      menu-img="/static/images/ic_close.svg"
    />

    <div class="section">
      <div class="section__content">
        <ul>
          <li @click="goTo('/terms')">Terms of Service</li>
          <li @click="goTo('/terms#community_guidelines')">
            Community Guidlines
          </li>
          <li @click="goTo('/terms#privacy_policy')">Privacy Policy</li>
          <li @click="goTo('/terms#privacy_choice')">Privacy Choices</li>
          <li @click="goTo('/terms#copyright_policy')">
            Copyright Policy (DMCA)
          </li>
          <li @click="goTo('/terms#trademark_policy')">Trademark Policy</li>
          <li @click="goTo('/terms#gdpr')">GDPR</li>
          <li @click="goTo('/terms#cookie_policy')">Cookie Policy</li>
          <li @click="goTo('/terms#sample_clearance')">
            Sample Clearance License
          </li>
        </ul>
      </div>

      <div class="section__footer"></div>
    </div>
  </div>
</template>

<script>
import mobileHeader from './header'
export default {
  components: {
    mobileHeader,
  },

  methods: {
    closeMenu() {
      this.$emit('close-menu')
    },

    goTo(path) {
      this.$router.push({ path: path })
      this.closeMenu()
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-container {
  height: 100%;
  //background-color: #000000;

  .section {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: 80px;
    background-color: #000;
    color: #ffffff;
    text-align: center;

    &__content {
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      //align-items: center;

      ul {
        margin-top: 10%;
        list-style: none;
        li {
          font-size: 16px;
          line-height: 55px;
        }
      }
    }

    &__footer {
      height: 70px;
      flex: 0 0 auto;
    }
  }

  .header-container {
    background-color: #000;
  }
}
</style>
