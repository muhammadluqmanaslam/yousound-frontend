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
                <v-icon>arrow_downward</v-icon>
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
                <v-icon>arrow_downward</v-icon>
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
                <v-icon>arrow_downward</v-icon>
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
                <label>Sign Up</label>
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
        navigation: true,
        navigationPosition: 'left',
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

<style lang="scss">
#fp-nav.fp-left {
  left: 40px !important;
  top: auto !important;
  bottom: 260px !important;
}

#fp-nav ul li {
  margin: 10px 0 !important;
  a {
    span {
      height: 12px !important;
      width: 12px !important;
      margin: 0 !important;
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    &.active {
      span {
        margin: 0 !important;
        background-color: #ffffff !important;
      }
    }
  }

  &:hover {
    a {
      span {
        height: 12px !important;
        width: 12px !important;
        margin: 0 !important;
      }
    }
  }
}
</style>

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
      padding: 120px 0 230px 0;
      section {
        display: flex;
        //align-items: center;
        height: 100%;
        color: #ffffff;
        background-repeat: no-repeat;
        background-size: auto 90%;
        background-position: 400px 0;
        div {
          padding: 50px 0 0 120px;
          //width: 400px;
        }
        h3 {
          font-family: 'Montserrat', 'Work Sans';
          font-size: 40px;
          line-height: 48px;
        }
        .btn {
          min-width: 60px;
          height: 60px;
          margin-top: 30px;
          border-radius: 40px;
          background: rgba(0, 0, 0, 0.2);
          box-shadow: none;
          color: #ffffff;
          /deep/ &__content {
            padding: 0;
            i {
              font-size: 40px;
            }
          }
        }
      }
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
        background-position-x: 420px;
      }
    }

    &:nth-child(2) {
      background-image: linear-gradient(#DD5675, #FF5C44);
      section {
        background-image: url('/static/images/img_land_products.png');
        background-position-x: 500px;
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
        background-position-x: 500px;
        .btn {
          height: 48px;
          background-color: #000000;
          /deep/ &__content {
            label {
              padding: 0 30px;
              font-size: 18px;
            }
          }
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
