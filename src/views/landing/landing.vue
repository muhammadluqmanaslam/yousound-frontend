<template>
  <div class="landing-page">
    <landing-header></landing-header>
    <full-page ref="fullpage" :options="options">
      <div class="section">
        <!-- <button class="next" @click="$refs.fullpage.api.moveSectionDown()">Next</button> -->
        <div class="section__content">
          <section>
            <div>
              <h3>
                Free streaming.<br>
                Free downloads.<br>
                No ads.
              </h3>
              <v-btn @click="$refs.fullpage.api.moveSectionDown()">
                Next
                <v-icon>arrow_forward</v-icon>
              </v-btn>
            </div>
          </section>
        </div>
      </div>

      <div class="section">
        <!-- <button class="prev" @click="$refs.fullpage.api.moveSectionUp()">Prev</button> -->
        <div class="section__content">
          <section>
            <div>
              <h3>
                Share music<br>
                & earn money.<br>
                Shop artists & brands.
              </h3>
              <v-btn @click="$refs.fullpage.api.moveSectionDown()">
                Next
                <v-icon>arrow_forward</v-icon>
              </v-btn>
            </div>
          </section>
        </div>
      </div>

      <div class="section">
        <div class="section__content">
          <section>
            <div>
              <h3>
                Live video<br>
                with artists & brands<br>
                Chat with friends.
              </h3>
              <v-btn @click="$refs.fullpage.api.moveSectionDown()">
                Next
                <v-icon>arrow_forward</v-icon>
              </v-btn>
            </div>
          </section>
        </div>
      </div>

      <div class="section">
        <div class="section__content">
          <section>
            <div>
              <h3>
                Powered by<br>
                verified artists<br>
                & brands.
              </h3>
              <v-btn to="/register">
                Create Account
                <v-icon>arrow_forward</v-icon>
              </v-btn>
            </div>
          </section>
        </div>
      </div>
    </full-page>
    <landing-footer></landing-footer>
    <!-- <v-layout row wrap>
      <v-flex xs12><landing-content></landing-content></v-flex>
      <v-flex xs12><landing-footer></landing-footer></v-flex>
    </v-layout> -->
  </div>
</template>

<script>
import landingHeader from './components/header'
import landingFooter from './components/footer'

export default {
  components: {
    landingHeader,
    landingFooter
  },

  data () {
    return {
      options: {
        afterLoad: this.afterLoad
      }
    }
  },

  methods: {
    afterLoad () {
      console.log("Emitted 'after load' event.")
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'landing', tab: '' })
  }
}
</script>

<style lang="scss" scoped>
.landing-page {
  .toolbar {
    z-index: 1;
    position: fixed;
    top: 0;
    background-color: transparent;
    box-shadow: none;
  }

  .section {
    &__content{
      height: 100vh;
      padding-bottom: 230px;

      section {
        display: flex;
        height: 100%;
        align-items: center;
        color: #ffffff;
        div {
          padding-left: 120px;
          //width: 400px;
        }
        h3 {
          font-family: 'Montserrat', 'Work Sans';
          font-size: 50px;
          line-height: 58px;
        }
        .btn {
          height: 30px;
          margin-top: 30px;
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.2);
          box-shadow: none;
          color: #ffffff;
          font-size: 10px;
          /deep/ &__content {
            position: relative;
            height: 30px;
            padding: 0 60px;
            i {
              position: absolute;
              right: 15px;
              font-size: 14px;
            }
          }
        }
      }
    }

    .toolbar__items {
    margin-right: 0;
    font-size: 18px !important;
    }

    &:nth-child(1) {
      background-image: linear-gradient(#7152FF, #3908FF);
      // /deep/ .fp-tableCell {
      //   background: url('/static/images/img_land_albums.png') no-repeat center center;
      //   background-size: auto 50%;
      //   background-position: 30% 50%;
      // }
      section {
        background-image: url('/static/images/img_land_albums.png');
        background-repeat: no-repeat;
        background-size: auto 60%;
        background-position: 420px 50%;
      }
    }

    &:nth-child(2) {
      background-image: linear-gradient(#DD5675, #FF5C44);
      section {
        background-image: url('/static/images/img_land_products.png');
        background-repeat: no-repeat;
        background-size: auto 70%;
        background-position: 500px 50%;
      }
    }

    &:nth-child(3) {
      background: url('/static/images/bg_land_videos.jpg') no-repeat center center;
      background-size: cover;
    }

    &:nth-child(4) {
      background-image: linear-gradient(#5155FF, #62A3FF);
      section {
        background-image: url('/static/images/img_land_artists.png');
        background-repeat: no-repeat;
        background-size: auto 70%;
        background-position: 500px 50%;
        .btn {
          background-color: #000000;
        }
      }
    }
  }

  .footer-container {
    z-index: 1;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
</style>
