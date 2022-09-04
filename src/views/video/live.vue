<template>
  <div class="page live-page mx-5">
    <content-top-header>
      <template slot="topHeader">
        <ul class="pr-3">
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            class="nav-li"
            :class="[
              { 'active tab-active': isActiveTab(tab.id) },
              `nav-${tab.id}`,
              { isParent: tab.isParent },
            ]"
          >
            <label class="nav-label" @click="onTab(tab)">
              {{ tab.title }}
              <v-icon v-if="tab.isParent">chevron_right</v-icon>
            </label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="page-content">
      <!-- <v-container fluid grid-list-lg px-0>
        <v-layout wrap row>
          <v-flex xs12 sm8>
            <div class="wrapper-info top-layer">
              <v-layout wrap row>
                <v-flex xs12 sm3>
                  <img src="/static/images/live-illu.svg" alt="" />
                </v-flex>
                <v-flex xs12 sm9>
                  <b> You can... </b>
                  <ul>
                    <li>
                      Run limited capacity events for free or pay-per-view.
                    </li>
                    <li>Sell exclusive products and connect your content.</li>
                    <li>
                      Engage with viewers on live chat & accept donations.
                    </li>
                  </ul>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>

          <v-flex xs12 sm4>
            <div class="wrapper-info top-layer">
              <div class="req-wrapper">
                <b>Requirements</b>

                <ul>
                  <li>RTMP video software (OBS, Wirecast, etc.)</li>
                  <li>Internet connection</li>
                </ul>

                <v-spacer></v-spacer>

                <div>View FAQ</div>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-container> -->

      <div class="my-3">
        <h3>
          Maximize revenue with live broadcasts.
          <span
            class="ml-2 cursor-pointer text-underline"
            @click="learnMoreActive = true"
          >
            Learn more
          </span>
        </h3>
      </div>

      <hr class="light mb-4" />

      <div class="wrapper-info dflex justify-space-between align-center mb-3">
        <div>
          <h3 class="mr-2">Rollover time remaining</h3>
          <span class="">You have</span>
          <b class="">{{ currentUser.free_stream_seconds | timeInWords }}</b>
          <span>remaining</span>
        </div>

        <div>
          <v-btn
            :disabled="!hasFree_stream_seconds"
            depressed
            dark
            class="app-blue-2 px-2"
            :style="[
              !hasFree_stream_seconds
                ? {
                    'background-color': '#c9c3c3 !important',
                    color: 'grey !important',
                  }
                : {},
            ]"
            @click="$router.push({ name: 'VideoCreate' })"
          >
            <b>Use time</b>
          </v-btn>
        </div>
      </div>

      <v-container fluid grid-list-lg px-0 pb-0>
        <!-- <v-layout wrap row>
          <v-flex
            v-for="(plan, i) in plans"
            :key="i"
            xs12
            md4
            plan-layer
            flex-text
          >
            <div class="plan-card" :class="plan.id">
              <h2>{{ plan.viewersLimit }} viewers</h2>
              <ul>
                <li v-for="(b, j) in plan.benefits" :key="j">
                  <div>
                    <v-icon>check</v-icon>
                  </div>

                  <div>
                    <span>
                      {{ b }}
                    </span>
                  </div>
                </li>
              </ul>

              <v-spacer></v-spacer>

              <div class="price-wrapper">
                <span class="__currency">$</span>
                <span class="__price">{{ plan.price }}</span>
                <span class="__duration">/hour</span>
              </div>
              <div
                class="
                  dflex
                  align-center
                  justify-space-between
                  block-n-reverse-column-m
                "
              >
                <v-layout wrap row justify-space-between align-center>
                  <v-flex xs12 md5>
                    <v-select
                      v-model="plan.selectedHour"
                      :items="hours"
                      dense
                      item-text="title"
                      item-value="value"
                      hide-details
                      class="pa-0 hour-selector"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 md5>
                    <v-btn
                      round
                      depressed
                      class="mx-0 choose__btn width100"
                      @click="getPayable(plan)"
                    >
                      <span v-if="!hasFree_stream_seconds">Choose</span>
                      <span v-else>Add More time</span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </div>
            </div>
          </v-flex>
        </v-layout> -->

        <div class="plans">
          <div
            v-for="(plan, i) in plans"
            :key="i"
            class="plan dflex justify-space-between align-center mb-5 px-3"
          >
            <div class="price-highlight">
              <h3 class="_price">${{ plan.price }}/hour</h3>
              <div class="_viewers_limit ml-2">
                <span class="_bullet">&bull;</span>
                {{ plan.viewersLimit }} concurrent viewers
              </div>
            </div>

            <div class="price-highlight dflex align-center">
              <v-select
                v-model="plan.selectedHour"
                :items="hours"
                dense
                item-text="title"
                item-value="value"
                hide-details
                outline
                class="pa-0 mr-3 hour-selector"
              ></v-select>

              <v-btn outline class="px-2">
                <span v-if="!hasFree_stream_seconds">Choose</span>
                <span v-else>Add time</span>
              </v-btn>
            </div>
          </div>
        </div>
      </v-container>

      <hr class="light" />

      <div class="footnote py-3">
        <div>
          * Add more time at any point of your broadcast, unused time is rolled
          over to your next broadcast.
        </div>
        <div>
          <span>* </span>
          <span class="app-bold">Requirement</span>
          <span>RMTP video software (OBS, Wireast, etc..)</span>
        </div>
      </div>

      <hr class="light" />
    </div>

    <v-dialog v-model="learnMoreActive" content-class="learn-more-dialog">
      <div class="dflex align-center">
        <img
          :src="require('@/assets/up_live.svg')"
          width="40"
          class="mr-3"
          alt="live signal icon"
        />
        <h2>
          Maximize revenue with
          <br />
          live broadcasts
        </h2>
      </div>

      <hr class="light my-3" />

      <div class="mb-3">
        Use these tools to maximize sale conversions with limited audiences.
        <br />
        There’s an average 16% sales conversation on products sold on YouSound
        live broadcasts.
      </div>

      <ul class="_highlight ml-3">
        <li class="app-bold">Sell products (you keep 100%)</li>
        <li class="app-bold">
          Sell exclusive “live video only” products (you keep 100%)
        </li>
        <li class="app-bold">
          Sell pay-per-view access up to $10,000/viewer (you keep 90%)
        </li>
        <li class="app-bold">Limit event capacity</li>
      </ul>

      <hr class="light my-3" />
      <div>
        As a creator, you own and operate your brand & cover your costs.
        <br />
        We do not sell your information & you keep the lion share of profits.
      </div>
    </v-dialog>

    <payment-modal
      v-if="showPaymentModal"
      :amount="payable"
      :dismiss="closePaymentDialog"
      :finish="proceedToUpload"
    />
  </div>
</template>

<script type="text/javascript" src="./live.ctrl.js"></script>

<style lang="scss" scoped>
.wrapper-info {
  border: 1px solid #dbdbdb;
  //   background-color: #f9f9f9;
  border-radius: 5px;
  padding: 20px;

  &.top-layer {
    height: 165px;
  }

  .req-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-left: 20px;
  }
}
.plan-card {
  display: flex;
  flex-direction: column;
  min-height: 280px;
  padding: 30px;
  border-radius: 6px;
  border: 1px solid #d3d3d3;
  .price-wrapper {
    margin-top: 35px;
    margin-bottom: 8px;

    .__currency {
      font-size: 20px;
    }
    .__price {
      font-size: 30px;
      font-weight: 900;
      line-height: 1;
    }
    .__duration {
      color: #525252;
    }
  }
  .hour-selector {
    /deep/.input-group__input {
      .input-group__selections__comma {
        font-size: 13px !important;
      }
    }
  }
  .choose__btn {
    background-color: #1f78ff !important;
    color: #ffffff;
  }
  li {
    list-style: none;
    display: flex;
    .icon {
      margin-right: 10px;
      font-size: 14px;
    }
  }
}

.plans {
  .plan {
    /deep/ .input-group--select .input-group__input {
      margin-top: 2px;
      min-height: 36px;
      border: 1px solid #000000;
      border-radius: 0;
      font-size: 13px;

      &.input-group__input {
        border-color: #000000;
        font-size: 13px;
      }
    }
    .hour-selector {
      /deep/.input-group__input {
        .input-group__selections__comma {
          font-size: 13px !important;
        }
      }
    }

    &:hover {
      /deep/ .input-group--select .input-group__input {
        background-color: #000000 !important;
        min-height: 34px;
      }
      .input-group {
        // background-color: #000000;

        /deep/ &__selections {
          &__comma {
            color: #ffffff !important;
          }
        }
        /deep/ .icon {
          color: #ffffff !important;
        }
      }

      .btn {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
    }
  }
}
</style>

<style lang="scss">
.overlay.overlay--active {
  background-color: rgba(0, 0, 0, 0.9);
}

.learn-more-dialog {
  background-color: #ffffff;
  padding: 30px;
  width: 700px !important;
}
</style>