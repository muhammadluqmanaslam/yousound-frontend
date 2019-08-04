<template>
  <div class="main-section repost-price">
    <div class="description-section">
      <h3>Earn money by sharing content</h3>
      <span @click="learnMore()">Learn more</span>
      <p class="mt-2">Every user can accept $1 and earns 50% of the revenue split.<br>
      Upgrade your price to keep 90% of each repost request.</p>
      <ul class="mt-3">
        <li>To increase your repost price, you must pay an annual amount equal to the price you want to set<br>
        Example: To charge $20 per repost, you must pay $20 per year</li>
        <li>If you want to increase your price multiple times within an year, your cost is prorated</li>
        <li>If you upgrade your price, you can downgrade your price at any time</li>
      </ul>
    </div>

    <div class="content-section">
      <div class="form-group">
        <!-- <label class="normal-text">repost price</label> -->
        <div class="repost-price-select">
          <v-select
            :items="repost_prices"
            v-model="repost_price"
            item-text="name"
            item-value="value"
            label="Price"
            content-class="GLOBAL-repost-price-select"
            single-line
            auto
            dirty
            text-field
            hide-details/>
        </div>
        <v-btn
          @click.native="openRepostPriceConfirmModal()"
          class="update-btn top-btn">Set</v-btn>
      </div>
      <div class="repost-price-info-box pa-3 mt-2">
        <div>You've upgraded to <b>${{ currentUser.repost_price | formatNumber }}</b></div>
        <div>Upgraded until <b>{{ currentUser.repost_price_end_at | formatDate }}</b></div>
      </div>
    </div>

    <v-dialog v-model="show_repost_price_confirm_modal">
      <v-card>
        <v-card-title class="headline">Upgrade Repost Price</v-card-title>
        <v-card-text>
          In order to upgrade your Repost Price you need to pay an annual fee equal to the price you want to upgrade to.<br/>
          <template v-if="proration.add_amount > 0">You have to pay additional ${{ proration.add_amount | formatNumber }}</template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="openPaymentModal()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="closeRepostPriceConfirmModal()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <payment-modal v-if="show_payment_modal"
      :type="''"
      :amount="proration.add_amount"
      :dismiss="closePaymentModal"
      :finish="setRepostPrice"
    />
  </div>
</template>

<script type="text/javascript" src="./price_tab.ctrl.js"></script>
