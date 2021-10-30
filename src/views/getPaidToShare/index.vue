<template>
  <div class="page getpaid-to-share-page">
    <v-container fluid class="set-price-container border-me">
      <v-layout v-if="currentUser.stripe_connected"  align-center>
        <v-flex xs2 after-divider>
          <router-link to="/settings/#bank-details">
            View Stripe Account
          </router-link>
        </v-flex>

        <v-flex xs7>
          <div class="repost-price-info-box">
            <div class="mr-1">
              You've upgraded to
              <b>${{ currentUser.max_repost_price | formatNumber }} </b>
            </div>
            <div v-if="currentUser.repost_price_end_at">
              Upgraded until
              <b>{{ currentUser.repost_price_end_at | formatDate }}</b>
            </div>
          </div>
        </v-flex>

        <v-flex xs3>
          <div class="content-section">
          <div class="">
            <!-- <label class="normal-text">repost price</label> -->
            <div class="repost-price-select">
              <v-select
                v-model="repost_price"
                :items="repost_prices"
                item-text="name"
                item-value="value"
                label="Price"
                content-class="GLOBAL-repost-price-select"
                class="pa-0 white __v-select"
                single-line
                auto
                dirty
                text-field
                hide-details
              />
            </div>
            <v-btn 
              @click.native="openRepostPriceConfirmModal()"
              class="update-btn"
              :disabled="repost_price == currentUser.repost_price"
            >
              Set
            </v-btn>
          </div>
    </div>
        </v-flex>
      </v-layout>
      <v-layout v-else align-center>
        <v-flex xs2 after-divider>
          <div class="cursor-pointer">
            <a target="_blank" href="https://stripe.com">
              Connect Stripe Account
            </a>
            
          </div>
        </v-flex>

        <v-flex xs7>
          <div class="repost-price-info-box">
            <div class="mr-1">
              You have not upgraded yet
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <div class="body-section-wrapper">
      <div class="__intro-title">
        Get Paid to Share
        <br>
        albums, products & videos
      </div>

      <div class="sections">
        <v-container grid-list-md sections-container>
          <v-layout wrap row justify-center>
            <v-flex xs8>
              <v-layout row wrap>
                <v-flex xs6 comm-flex>
                  <div class="__title">First, grow your community</div>
                  <div class="__content">Invite your friends, build your following and start reposting & sharing great content</div>
                </v-flex>
                <v-flex xs6 comm-flex>
                  <img
                    src="/static/images/first-comm.png"
                    class="comm-img"
                  />
                </v-flex>

                <v-flex xs6 comm-flex>
                  <img
                    src="/static/images/best-comm.png"
                    class="comm-img"
                  />
                </v-flex>
                <v-flex xs6 comm-flex>
                  <div class="__title">Best practices for successful releases</div>
                  <div class="__content">Learn how to lauch a product, album, or video on YouSound effectively to build an audience & generate revenue</div>
                </v-flex>

                <v-flex xs6 comm-flex>
                  <div class="__title">Start accepting repost requests.</div>
                  <div class="__content">Artists & brands will request reposts from you through Direct Messages. You can view content & accept, deny, or repost for free. You get paid for accepted reposts every 2 days.</div>
                </v-flex>
                <v-flex xs6 comm-flex>
                  <img
                    src="/static/images/start-comm.png"
                    class="comm-img"
                  />
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </div>

    <div class="section-faq">
      <div class="__intro-title">FAQ</div>
      <accordion :accordions="accordions" leftIcon="add" />
    </div>

  <v-dialog v-model="show_repost_price_confirm_modal">
    <v-card>
      <v-card-title class="headline">Upgrade Repost Price</v-card-title>
      <v-card-text>
        In order to upgrade your Repost Price you need to pay an annual fee
        equal to the price you want to upgrade to.<br />
        <template v-if="proration.add_amount > 0"
          >You have to pay additional ${{
            proration.add_amount | formatNumber
          }}</template
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="blue--text darken-1"
          flat="flat"
          @click.native="openPaymentModal()"
          >Ok</v-btn
        >
        <v-btn
          class="blue--text darken-1"
          flat="flat"
          @click.native="closeRepostPriceConfirmModal()"
          >Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <payment-modal
    v-if="show_payment_modal"
    :amount="proration.add_amount"
    :dismiss="closePaymentModal"
    :finish="setRepostPrice"
  />
  </div>
</template>


<script type="text/javascript" src="./getPaidToShare.ctrl.js"></script>

<style lang="scss" scoped>
.set-price-container {
  background-color: #f0f0f0;

  .__v-select {
    /deep/.input-group__details {
      display: none;
    }
  }

  .after-divider::after {
    right: 43px;
  }

  .update-btn {
    height: 37.5px;
    // width: 112.5px;
    box-shadow: none;
    text-transform: none;
    margin: 0;
    background-color: #3a92ff !important;
    border-radius: 75px;
    font-weight: 600;
    font-size: 15px;
    color: #ffffff;
    letter-spacing: 0;
    margin-top: 0;

    .btn__content {
    padding: 0 22.5px;
    }
  }
  .repost-price-info-box {
    display: flex;
    text-align: center;
    border-radius: 5px;
  }
}
.content-section {
    .repost-price-select {
        display: inline-block;
        width: 200px;
        margin-right: 10px;
    }
}

.body-section-wrapper {
  .__intro-title {
    text-align: center;
    margin: 100px 0;
    font-size: 1.8em;
    font-weight: 800;
    line-height: 1;
  }
  .sections-container {
    .__title {
      font-weight: 800;
      font-size: 16px;
    }
    .comm-flex {
      margin-bottom: 20px;

      img.comm-img {
        width: 70%;
        border-radius: 7px;
      }
    }
  }
}
.section-faq {
  .__intro-title {
    text-align: center;
    margin: 60px 0;
    font-size: 1.8em;
    font-weight: 800;
    line-height: 1;
  }
}
</style>
