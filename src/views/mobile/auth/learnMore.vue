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
        <div v-if="activeTab === 'listener'" class="learn-more-body" :class="{onMobile}">
          <div v-if="onMobile" class="intro-section">
            <h1 class="intro-title">For Everyone</h1>
            <hr class="light intro-divider">
          </div>

          <v-container grid-list-lg>
            <v-layout row wrap align-center justify-space-between mt-5 :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 sm5>
                <div class="tiles">
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
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 v-if="!onMobile" class="_title">Listen, watch & shop</h2>
                  <h2 v-if="onMobile" class="_title">Build your collection</h2>

                  <div class="_subtitle">
                    Collect music, videos, products & create playlists. Easily
                    organize everything you discover.
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between mt-5 :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 sm5>
                <div class="tile-context">
                  <h2 class="_title">Empower creators</h2>
                  <div class="_subtitle">
                    50% of your subscription goes to creators you stream most.
                    View your dashboard to see who you support.
                  </div>
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="tiles">
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
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between mt-5 :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 sm5>
                <div class="tiles single-tile">
                  <div class="tile square">
                    <div
                      class="_img"
                      :style="`background-image: url('${tile9}')`"
                    ></div>
                  </div>
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Get paid to share</h2>
                  <div class="_subtitle">
                    Artists & brands can send DMs with content. Earn money
                    helping creators reach the right audience.
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="activeTab === 'creator'" class="learn-more-body">
          <v-container grid-list-lg>
            <v-layout row wrap align-center justify-space-between mt-5 :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 sm6>
                <div class="_img-wrapper text-center">
                  <img
                    :src="require('@/assets/learn-creator-1.jpeg')"
                    width="80%"
                    alt="creator image"
                  />
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Upload everything</h2>
                  <div class="_subtitle">
                    Easily upload albums, videos, products. Instantly available
                    worldwide.
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between mt-5 :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Keep 100% of sales</h2>
                  <div class="_subtitle">
                    Keep all of your digital & physical sales. Split payments &
                    recoups with collaborators.
                  </div>
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="_img-wrapper text-center">
                  <img
                    :src="require('@/assets/learn-creator-2.jpeg')"
                    width="80%"
                    alt="creator image"
                  />
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between mt-5 :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 sm6>
                <div class="_img-wrapper text-center">
                  <img
                    :src="require('@/assets/learn-creator-3.jpeg')"
                    width="80%"
                    alt="creator image"
                  />
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">User-centric payouts</h2>
                  <div class="_subtitle">
                    Earn up to 50% of subscriber payments. As little as 20,000
                    plays can earn $5,000.
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between mt-5 :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Connect with text</h2>
                  <div class="_subtitle">
                    Your followers can opt-in with their cell number. Grow a SMS
                    list & use text to bypass the algorithm.
                  </div>
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="_img-wrapper text-center">
                  <img
                    :src="require('@/assets/learn-creator-4.jpeg')"
                    width="80%"
                    alt="creator image"
                  />
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between mt-5 :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 sm6>
                <div class="_img-wrapper text-center">
                  <img
                    :src="require('@/assets/learn-creator-5.jpeg')"
                    width="80%"
                    alt="creator image"
                  />
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Go live!</h2>
                  <div class="_subtitle">
                    Broadcast live video, sell exclusive content, limit viewer
                    capacity, run pay per view & chat live.
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <v-layout row wrap align-center justify-space-between mt-5 :class="{'flex-wrap-reverse': onMobile}">
              <v-flex xs12 sm6>
                <div class="tile-context">
                  <h2 class="_title">Advanced analytics</h2>
                  <div class="_subtitle">
                    Access key metrics from an extensive set of data points
                    needed to maximize your sale conversions.
                  </div>
                </div>
              </v-flex>

              <v-flex xs12 sm6>
                <div class="_img-wrapper text-center">
                  <img
                    :src="require('@/assets/learn-creator-6.jpeg')"
                    width="80%"
                    alt="creator image"
                  />
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import contentTopHeader from "@/components/contentTopHeader";

export default {
  components: {
    contentTopHeader,
  },
  data() {
    return {
      activeTab: "listener",
      tabs: [
        { id: "listener", title: "For Everyone" },
        { id: "creator", title: "For Creators" },
      ],
      tile1: require("@/assets/tile-1.jpeg"),
      tile2: require("@/assets/tile-2.jpeg"),
      tile3: require("@/assets/tile-3.jpeg"),
      tile4: require("@/assets/tile-4.jpeg"),
      tile5: require("@/assets/tile-5.jpeg"),
      tile6: require("@/assets/tile-6.jpeg"),
      tile7: require("@/assets/tile-7.jpeg"),
      tile8: require("@/assets/tile-8.jpeg"),
      tile9: require("@/assets/tile-9.jpg"),
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
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>

<style lang="scss" scoped>
.learn-more {
  padding: 0 25px 40px 25px;

  &.onMobile {
    padding: 0 8px 40px 8px;
  }

  &-body {
    &.onMobile {
      .intro-section {
        margin-top: 40px;
        .intro-section {
          .intro-title {
            font-size: 36px;
          }
          .intro-divider {
            margin: 60px 0;
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
        filter: blur(29px);
        border-radius: 10px;
        z-index: -1;
      }

      &.top-right {
        margin-top: 20px;

        .tile-6 {
          margin-top: -50px;
        }
        .tile-7 {
          margin-top: 18px;
        }
      }
      &.bottom-left {
        margin-top: 5px;
      }
      &.bottom-right {
        margin-top: 25px;
      }

      ._img {
        display: block;
        position: relative;
        border-radius: 6px;
        background-position: center;
        background-size: cover;
      }

      &.portrait {
        width: 37%;

        ._img {
          width: 100%;
          height: 130px;
        }
      }
      &.landscape {
        width: 58%;

        ._img {
          width: 100%;
          height: 100px;
        }
      }
      &.square {
        width: 47%;

        ._img {
          width: 100%;
          height: 127px;
        }
      }
    }
  }

  .single-tile {
    .tile {
      width: 100% !important;
      max-width: unset;
      position: relative;

      ._img {
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
      font-size: 24px;
      color: #222222;
      margin-bottom: 15px;
    }
    ._subtitle {
      font-size: 18px;
      color: #222222;
      opacity: 0.7;
    }
  }
}

.flex-wrap-reverse {
  flex-wrap: wrap-reverse;
}
</style>