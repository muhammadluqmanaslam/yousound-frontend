<template>
  <div class="page live-page mx-5">
    <content-top-header>
      <template slot="topHeader">
        <ul>
          <li class="active">
            <label>Broadcast Live</label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="page-content">
        <v-container fluid grid-list-lg px-0>
            <v-layout wrap row>
                <v-flex xs12 sm8>
                    <div class="wrapper-info top-layer">
                        <v-layout wrap row>
                            <v-flex xs12 sm3>
                                <img src="/static/images/live-illu.svg" alt="">
                            </v-flex>
                            <v-flex xs12 sm9>
                                <b>
                                    You can...
                                </b>
                                <ul>
                                    <li>
                                        Run limited capacity events for free or pay-per-view.
                                    </li>
                                    <li>
                                        Sell exclusive products and connect your content.
                                    </li>
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
                                <li>
                                    RTMP video software (OBS, Wirecast, etc.)
                                </li>
                                <li>
                                    Internet connection
                                </li>
                            </ul>

                            <v-spacer></v-spacer>

                            <div>View FAQ</div>
                        </div>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>

        <div class="my-3">
            <h3>Choose option</h3>
        </div>

        <div class="wrapper-info dflex justify-space-between align-center mb-3">
            <div>
                <b class="mr-2">Unused time:</b>
                <span class="">You have</span>
                <b class="">{{ currentUser.free_stream_seconds | timeInHours }}</b>
                <span>left</span>
            </div>

            <div>
                <span>Add more time below, or</span>

                <v-btn
                    :disabled="hasFree_stream_seconds"
                    depressed
                    round
                    dark
                    class="app-blue-2"
                    :style="[
                        hasFree_stream_seconds ?
                        {'background-color': '#c9c3c3 !important', color: 'grey !important'} :
                        {}
                    ]"
                    @click="$router.push({name: 'VideoCreate'})"
                >
                    <b>Use remaining time</b>
                </v-btn>
            </div>
        </div>

        <v-container fluid grid-list-lg px-0>
            <v-layout wrap row>
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
                    <li
                        v-for="(b, j) in plan.benefits"
                        :key="j"
                    >
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
                    <div class="dflex align-center justify-space-between block-n-reverse-column-m">
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
                                <v-btn round depressed class="mx-0 choose__btn width100" @click="getPayable(plan)">
                                    <span v-if="hasFree_stream_seconds">Choose</span>
                                    <span v-else>Add More time</span>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </div>
                </div>

                </v-flex>
            </v-layout>
        </v-container>
    </div>

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
    background-color: #f9f9f9;
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
    border: 1px solid #D3D3D3;
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
    background-color: #1F78FF !important;
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

</style>
