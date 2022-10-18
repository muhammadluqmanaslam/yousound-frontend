<template>
  <transition name="fade">
    <div class="learn-more" :class="{onMobile}">
      <content-top-header v-if="!onMobile" absolute>
        <template slot="topHeader">
          <ul class="pr-3">
            <li>
              <h2>Learn More</h2>
            </li>

            <v-spacer></v-spacer>

            <li
              v-for="tab in tabs"
              :key="tab.id"
              :href="`#${tab.id}`"
              class="nav-li"
              :class="[
                { 'active tab-active': isActiveTab(tab.id) },
                `nav-${tab.id}`,
              ]"
            >
              <label class="nav-label" @click="onTab(tab.id)">
                <img
                  v-if="tab.icon"
                  :src="tab.icon"
                  width="18"
                  class="li-icon"
                />
                {{ tab.title }}
              </label>
            </li>
          </ul>
        </template>
      </content-top-header>

      <transition name="fade">
        <div v-if="activeTab === 'listener'" class="learn-more-body _listener" :class="{onMobile}">
          <div v-if="onMobile" class="intro-section">
            <h1 class="intro-title">For Everyone</h1>
            <hr class="light intro-divider">
          </div>

          <v-container grid-list-lg layer-container>
            <v-layout row wrap align-center justify-space-between my-6 layer-layout :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 tiles-layer :class="[pageMode? 'sm5' : 'sm5']">
                <div class="tile1-div">
                  <img :src="require('@/assets/tile1-min.png')" width="100%">
                </div>
                <!-- <div class="tiles">
                  <div class="tile top-left tile-1 square">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile1}')`"
                    ></div>
                    <div
                      class="tile-blur"
                      :style="`background-image: url('${tile1}')`"
                    ></div>
                  </div>
                  <div class="tile top-right tile-2 square">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile2}')`"
                    ></div>
                    <div
                      class="tile-blur"
                      :style="`background-image: url('${tile2}')`"
                    ></div>
                  </div>
                  <div class="tile bottom-left tile-3 square">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile3}')`"
                    ></div>
                    <div
                      class="tile-blur"
                      :style="`background-image: url('${tile3}')`"
                    ></div>
                  </div>
                  <div class="tile bottom-right tile-4 square">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile4}')`"
                    ></div>
                    <div
                      class="tile-blur"
                      :style="`background-image: url('${tile4}')`"
                    ></div>
                  </div>
                </div> -->

                <div v-if="!pageMode && onMobile" class="app-download">
                  <img
                    :src="iosStore"
                    width="40%"
                    class="ios-store mr-3"
                    alt="ios app store icon"
                  />
                  <img
                    :src="androidPlaystore"
                    width="40%"
                    class="android-store"
                    alt="android app store icon"
                  />
                </div>
              </v-flex>

              <v-flex xs12 context-layer :class="[pageMode? 'sm7' : 'sm6']">
                <div class="tile-context">
                  <h2 v-if="!onMobile" class="_title">Listen, watch & shop</h2>
                  <h2 v-if="onMobile" class="_title">Listen, watch & shop</h2>

                  <div class="_subtitle">
                    Collect music, videos, products & create playlists. <br> Easily
                    organize everything you discover.
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between my-6 layer-layout :class="{'': onMobile}">
              <v-flex xs12 sm7 context-layer>
                <div class="tile-context">
                  <h2 class="_title">Empower creators</h2>
                  <div class="_subtitle">
                    50% of your subscription goes to creators you <br> stream most.
                    View your dashboard to see who you support.
                  </div>
                </div>
              </v-flex>

              <v-flex xs12 tiles-layer :class="[pageMode? 'sm5' : 'sm6']">
                <div>
                  <img :src="require('@/assets/tile2-min.png')" width="100%">
                </div>
                <!-- <div class="tiles">
                  <div class="tile top-right tile-5 landscape">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile5}')`"
                    ></div>
                    <div
                      class="tile-blur"
                      :style="`background-image: url('${tile5}')`"
                    ></div>
                  </div>
                  <div class="tile top-left tile-6 portrait">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile6}')`"
                    ></div>
                    <div
                      class="tile-blur"
                      :style="`background-image: url('${tile6}')`"
                    ></div>
                  </div>
                  <div class="tile bottom-left tile-7 portrait">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile7}')`"
                    ></div>
                    <div
                      class="tile-blur"
                      :style="`background-image: url('${tile7}')`"
                    ></div>
                  </div>
                  <div class="tile bottom-right tile-8 landscape">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile8}')`"
                    ></div>
                    <div
                      class="tile-blur"
                      :style="`background-image: url('${tile8}')`"
                    ></div>
                  </div>
                </div> -->
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between my-6 layer-layout :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 tiles-layer :class="[pageMode? 'sm5' : 'sm5']">
                <div class="single-tile-3">
                  <img :src="require('@/assets/tile3-min.png')" width="90%">
                </div>
                <!-- <div class="tiles single-tile">
                  <div class="tile square" :class="{pageMode}">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile9}')`"
                    ></div>
                  </div>
                </div> -->
              </v-flex>

              <v-flex xs12 context-layer :class="[pageMode? 'sm7' : 'sm6']">
                <div class="tile-context">
                  <h2 class="_title">Get paid to share</h2>
                  <div class="_subtitle">
                    Artists & brands can send DMs with content. <br> Earn money
                    helping creators reach the right audience.
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="(activeTab === 'creator') || onMobile" class="learn-more-body _creators" :class="{'mt-5': onMobile, onMobile}">
          <div v-if="onMobile" class="intro-section">
            <h1 class="intro-title pt-5">For Creators</h1>
            <hr class="light intro-divider">
          </div>
          <v-container grid-list-lg layer-container _creator>
            <v-layout row wrap align-center justify-space-between my-6 layer-layout :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 :class="[pageMode? 'sm4' : 'sm6']">
                <div class="_img-wrapper" :class="{'text-center': !pageMode}" :style="{'margin-left':`${pageMode? '-27px' : ''}`}">
                  <img
                    :src="require('@/assets/learn-creator-1.jpeg')"
                    width="100%"
                    alt="creator image"
                  />
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Upload everything</h2>
                  <div class="_subtitle">
                    Easily upload albums, videos, products. <br> Instantly available
                    worldwide.
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between layer-layout>
              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Keep 100% of sales</h2>
                  <div class="_subtitle">
                    Keep all of your digital & physical sales. <br> Split payments &
                    recoups with collaborators.
                  </div>
                </div>
              </v-flex>

              <v-flex xs12 :class="[pageMode? 'sm4' : 'sm6']">
                <div class="_img-wrapper" :class="{'text-center': !pageMode, 'text-right': pageMode}">
                  <img
                    :src="require('@/assets/learn-creator-2.jpeg')"
                    width="100%"
                    alt="creator image"
                  />
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between my-6 layer-layout :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 :class="[pageMode? 'sm4' : 'sm6']">
                <div class="_img-wrapper" :class="{'text-center': !pageMode}" :style="{'margin-left':`${pageMode? '-27px' : ''}`}">
                  <img
                    :src="require('@/assets/learn-creator-3.jpeg')"
                    width="100%"
                    alt="creator image"
                  />
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">User-centric payouts</h2>
                  <div class="_subtitle">
                    Earn up to 50% of subscriber payments.<br> As little as 20,000
                    plays can earn $5,000.
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between layer-layout>
              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Connect with text</h2>
                  <div class="_subtitle">
                    Your followers can opt-in with their cell number. <br> Grow a SMS
                    list & use text to bypass the algorithm.
                  </div>
                </div>
              </v-flex>

              <v-flex xs12 :class="[pageMode? 'sm4' : 'sm6']">
                <div class="_img-wrapper" :class="{'text-center': !pageMode, 'text-right': pageMode}">
                  <img
                    :src="require('@/assets/learn-creator-4.jpeg')"
                    width="100%"
                    alt="creator image"
                  />
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between my-6 layer-layout :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 :class="[pageMode? 'sm4' : 'sm6']">
                <div class="_img-wrapper" :class="{'text-center': !pageMode}" :style="{'margin-left':`${pageMode? '-27px' : ''}`}">
                  <img
                    :src="require('@/assets/learn-creator-5.jpeg')"
                    width="100%"
                    alt="creator image"
                  />
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Go live!</h2>
                  <div class="_subtitle">
                    Broadcast live video, sell exclusive content, <br> limit viewer
                    capacity, run pay per view & chat live.
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between layer-layout>
              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Advanced analytics</h2>
                  <div class="_subtitle">
                    Access key metrics from an extensive set of data points
                    needed to maximize your sale conversions.
                  </div>
                </div>
              </v-flex>

              <v-flex xs12 :class="[pageMode? 'sm4' : 'sm6']">
                <div class="_img-wrapper" :class="{'text-center': !pageMode, 'text-right': pageMode}">
                  <img
                    :src="require('@/assets/learn-creator-6.jpeg')"
                    width="100%"
                    alt="creator image"
                  />
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </transition>

      <hr v-if="!hideFooter" class="light mt-5 mb-3">

      <div v-if="!hideFooter" class="learn-more-footer">
        <h2 class="_title">
          Join the community.
          <br />
          Download the app.
        </h2>

        <app-footer
          v-if="onMobile"
          hideDownload
        ></app-footer>
      </div>
    </div>
  </transition>
</template>

<script>
import contentTopHeader from "@/components/contentTopHeader";
import appFooter from "@/components/footer";

export default {
  props: {
    pageMode: Boolean,
    setOnMobile: Boolean,
    hideFooter: Boolean,
  },
  components: {
    contentTopHeader,
    appFooter,
  },
  data() {
    return {
      activeTab: "listener",
      tabs: [
        { id: "listener", title: "Features for Everyone" },
        { id: "creator", title: "For Creators" },
      ],
      tile1: require("@/assets/tile1-min.png"),
      tile2: require("@/assets/tile-2.jpeg"),
      tile3: require("@/assets/tile-3.jpeg"),
      tile4: require("@/assets/tile-4.jpeg"),
      tile5: require("@/assets/tile-5.jpeg"),
      tile6: require("@/assets/tile-6.jpeg"),
      tile7: require("@/assets/tile-7.jpeg"),
      tile8: require("@/assets/tile-8.jpeg"),
      tile9: require("@/assets/tile-9.jpg"),
      iosStore: require("@/assets/img_download_app_store.svg"),
      androidPlaystore: require("@/assets/img_download_play_store.svg"),
    };
  },
  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab;
    },
    onTab(tab) {
      this.activeTab = tab;
    },
  },
  computed: {
    onMobile() {
      return this.setOnMobile || this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>

<style lang="scss" scoped>
.learn-more {
  padding: 0 25px 40px 25px;

  .my-6{
    margin: 35px 0px;
  }

  .tile1-div{
    transform: translateX(-10%);
  }

  ._img-wrapper{
    width: 100%;
    max-width: 300px;
  }

.intro-title {
    font-size: 44px;
    font-weight: bold;
    letter-spacing: -2px;
  }
  .intro-section {
    margin-bottom: 100px;
  }

  &.onMobile {
    padding: 0 0px 40px 0px;
  }

  &-body {
    .layer-container {
      .layer-layout {
        margin-top: 35px;
      }
    }
    &.onMobile {
      .intro-section {

        .intro-section {
          .intro-title {
            font-size: 44px;
            font-weight: bold;
            letter-spacing: -2px;
          }
          .intro-divider {
            margin: 60px 0;
          }
        }
      }

      .layer-container {
        padding: 0;

        &._creator {
          // padding-bottom: 100px;
        }

        .layer-layout {
          &:first-child {
            margin-top: 0;
          }

          .tiles-layer {
            &-single {
              margin-top: 100px;

              .tile {
                width: 80% !important;
                margin: 0 auto;
              }
            }
          }

          ._subtitle {
            margin-bottom: 20px;
          }
          .app-download {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            img {
              width: 45%;
            }
          }
        }
      }
    }
  }


  .tiles {
    // max-width: 70%;
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;

    .tile {
      max-width: 70%;
      height: fit-content;
      position: relative;


      &-blur {
        position: absolute;
        top: 25px;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        filter: blur(15px);
        border-radius: 10px;
        z-index: 0;
        background-size: cover;
        background-position: center;
      }


      &.bottom-left {
        margin-top: 5px;
        &.tile-7 {
          margin-top: 20px;
        }
      }
      &.bottom-right {
        margin-top: 25px;

        &.tile-8 {
          margin-top: 15px;
        }
      }
      &.top-right {
        margin-top: 20px;

        .tile-6 {
          margin-top: -50px;
        }
        .tile-7 {
          margin-top: 20px;
        }
      }

      ._img {
        display: block;
        position: relative;
        border-radius: 6px;
        background-position: center;
        background-size: cover;
        z-index: 2;
      }

      &.portrait {
        width: 40%;

        ._img {
          width: 100%;
          min-width: 140px;
          height: 155px;
        }
      }
      &.landscape {
        width: 55%;

        ._img {
          width: 100%;
          min-width: 190px;
          height: 140px;
        }
      }
      &.square {
        width: 47%;

        ._img {
          width: 160px;
          height: 160px;
        }
      }
      @media screen and (max-width: 1250px) {
        &.square {
        width: 47%;

        ._img {
          width: auto;
          height: 150px;
        }
      }

      &.portrait {
        width: 40%;

        ._img {
          width: 100%;
          min-width: auto;
          height: 115px;
        }
      }
      &.landscape {
        width: 55%;

        ._img {
          width: 100%;
          min-width: auto;
          height: 100px;
        }
      }
      }
    }
  }

  .single-tile {

    img{
      filter: drop-shadow(0px 10px 50px rgba(34, 34, 34, 0.15));
    }
    .tile {
      width: 100% !important;
      max-width: unset;
      position: relative;

      &.pageMode {
        margin-left: 0 !important;
      }

      ._img {
        width: 100% !important;
        height: 258px !important;
      }

      &::before {
        content: "";
        position: absolute;
        top: -16px;
        width: calc(100% - 23px);
        height: 53%;
        right: -23px;
        background: linear-gradient(180deg, #0f9aff 0%, #1a91ff 100%);
        border-radius: 12px;
        transform: rotate(30deg);
      }
    }
  }

  .tile-context {
    // width: 70%;
    // margin: 0 auto 0 0;

    ._title {
      font-size: 32px;
      color: #222222;
      margin-bottom: 15px;
      letter-spacing: -0.3px;
    }
    ._subtitle {
      font-size: 24px;
      color: #222222;
      opacity: 0.7;
      letter-spacing: -0.3px;
      font-weight: 500;
    }
  }

  &-footer {
    position: relative;
    top: -38px;
    padding: 70px 0;

    ._title {
      font-size: 24px;
    }
    .my-footer {
      text-align: left;

      /deep/ a:first-child {
        margin-left: 0;
      }
    }
  }
}

.flex-wrap-reverse {
  flex-wrap: wrap-reverse;
}


@media screen and (max-width: 1100px){
  br{
    display: none;
  }
}

@media screen and (max-width: 1250px) and (min-width: 960px) {

  .intro-title{
    font-size: 36px !important;
  }

  .learn-more .tile-context{
    ._title{
      font-size: 28px;
    }

    ._subtitle{
      font-size: 20px;
    }
  }
}



</style>