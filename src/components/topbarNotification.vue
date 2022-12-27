<template>
    <v-toolbar v-if="currentUser.stripe_connected" fixed app flat color="white">
      <div class="top-bar">
          <div class="top-bar-notification">
              <span v-if="content" class="top-bar__content">{{ content }}</span>
            <v-btn v-if="cta" :to="cta" outline dark class="top-bar__cta">{{ ctaTitle }}</v-btn>
          </div>
      </div>
    </v-toolbar>
</template>

<script>
export default {
  props: {
    content: '',
    ctaTitle: '',
    cta: '',
  },
  data() {
    return {
      defBody: '',
      defbodyContent: '',
    }
  },
  computed: {
    currentUser() {
      console.log(this.$store.state.auth.user)
      return this.$store.state.auth.user
    },
  },
  methods: {
    adjustForTopBar() {
      const user = this.currentUser
      const bodyContent = document.querySelector('.top-menu') || document.querySelector('.page-content') || document.querySelector('.content--wrap')

      this.defBody = document.body.style.height
      this.defbodyContent = bodyContent.style.height

      if (user) {
        if (bodyContent.classList.includes('top-menu')) {
          bodyContent.style.top = '43px'
          document.body.style.paddingTop = '40px'
        } else if (bodyContent) {
          document.body.style.paddingTop = '40px'
        }
      }
    },
    resetAdjust() {
      const bodyContent = document.querySelector('.top-menu') || document.querySelector('.page-content') || document.querySelector('.content--wrap')
      bodyContent.style.top = this.defBody
      document.body.style.paddingTop = this.defbodyContent
    },
  },
  mounted() {
    this.adjustForTopBar()
  },
  beforeDestroy() {
    this.resetAdjust()
  },
}
</script>

<style lang="scss" scoped>
.top-bar {
    background-color: #3a92ff;
    width: 100%;
    height: 100%;
    z-index: 4;
    display: flex;
    align-items: center;
    margin: 0 !important;

    .top-bar-notification {
      width: calc(100% - 40px);
    }

    &-notification {
        width: calc(100% - 358px);
        margin-left: auto;
        right: 0;
    }

    &__content {
        position: relative;
        width: 100%;
        color: #ffffff;
        font-size: 16px;
        font-weight: 400;
    }
    &__cta {
        height: 28px;
    }
}
</style>
