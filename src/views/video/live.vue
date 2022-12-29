<template>
  <div>
    <BannerUpload 
    MainHeading="Broadcast live" 
    MainText="Broadcast from your browser, run pay-per-view, sell exclusives, limit room capacity & allow up to 40 video participants"
    :Icon="iconImage"
    :MainImage="bannerImage"
    />
    <div class="page live-page mx-5">
      <!-- <content-top-header>
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
      </content-top-header> -->
  
      <div class="page-content mt-4">
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

          <h2 class="heading-2">Choose</h2>
  
          <div class="plans">
            <div
              v-for="(plan, i) in plans"
              :key="i"
              class="plan"
              sm3
            > 
            <div class="price-title-flex">
              <div class="upload-tab-img uploadLive"></div>
              <h3>
                {{ plan.viewersLimit }} viewers
              </h3>
             
            </div>
              <div class="price-highlight mt-4">
                <h4 class="_price">${{ plan.price }} <span>/hour</span></h4>
              </div>
  
              <div class="price-highlight-button dflex align-center mt-2">
                <v-select
                  v-model="plan.selectedHour"
                  :items="hours"
                  dense
                  item-text="title"
                  item-value="value"
                  hide-details
                  outlined
                  class="pa-0 hour-selector"
                ></v-select>
  
                <v-btn outline class="_button">
                  <span v-if="!hasFree_stream_seconds">Add time</span>
                  <span v-else>Add time</span>
                </v-btn>
              </div>
            </div>
          </div>
        </v-container>

        <div class="mt-5">
          <h2 class="heading-3">Remaining time</h2>
        
  
        <div class="wrapper-container" :class="!(hasFree_stream_seconds)?`empty`:null">
          <div v-if="!(hasFree_stream_seconds)">
            <p class="text-muted">Unused time on your events is saved here for later use
            </p>
          </div>
        <div v-else class="wrapper-info dflex justify-space-between align-center mb-3">
          <div>
            <h3 class="mr-2">Rollover time remainings</h3>
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
      </div>
      </div>
  

  
  
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
  </div>
</template>

<script type="text/javascript" src="./live.ctrl.js"></script>

<style lang="scss" scoped>

.input-group__input {
  border: 1px solid #000 !important;

}
.input-group__selections__comma {
  font-size: 14px !important;
}
.wrapper-container{
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 20px;
  padding-bottom: 0px;

  &.empty{
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
}
.heading-3{
  font-weight: medium;
  color: black;
  font-size: 16px;
  margin-bottom: 20px;
}
.text-muted{
  font-size: 16px;
  font-weight: medium;
  color: rgba(0,0,0,0.5);
}
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

.upload-tab-img {
  height: 30px;
  width: 30px;
  border-radius: 4px;
  background-size: contain;
  background-position: center;
  &.uploadLive {
      background-image: url('../../assets/up_live.svg');
  }


}
.heading-2{
  font-weight: bold;
  color: black;
  font-size: 20px;
  margin-bottom: 20px;
}
.plans {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  .plan {
    display: flex;
    width: 25%;
    flex-direction: column;
    padding: 20px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 10px;
    min-width: 250px;


    ._price {
      font-size: 24px;
      font-weight: bold;
      font-family: 'Inter';
      letter-spacing: -1%;
      color: rgba(0,0,0,0.7);

      span{
        font-size: 14px;
        margin-right: 5px;
        font-weight: 500;
      }
    }

    .price-title-flex{
      display: flex;
      align-items: center;
      gap: 10px;
      h3{
        color: black;
        font-weight: bold;
        font-size: 20px;
      }
    }
    .price-highlight-button{
      display: flex;
      gap: 10px;

      .hour-selector{
        .input-group__input{
          border: 1px solid black !important;
          border-radius: 3px !important;
          font-size: 14px;
          font-weight: 500;
        }
      }
      ._button{
        background: rgba(0,0,0,0.06)  !important;
        border-radius: 5px;
        color: black;
        font-size: 14px;
        font-weight: bold;
        margin: 0 !important;
        height: 42px;
        border: none;

      }
    }



  &:hover{
    .price-highlight-button{
      ._button{
        background: rgba(0,0,0,1) !important;
        color: white;
      }
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