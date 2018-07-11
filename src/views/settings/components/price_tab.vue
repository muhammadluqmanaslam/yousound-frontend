<template>
  <div class="main-section">
    <div class="content-section">

      <v-dialog v-model="show_repost_price_confirm_modal">
        <v-card>
          <v-card-title class="headline">Upgrade Repost Price</v-card-title>
          <v-card-text>In order to upgrade your Repost Price you need to pay an annual fee equal to the price you want to upgrade to.  ie. To increase your Repost Price to $20, you must pay $20 annually.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="blue--text darken-1" flat="flat" @click.native="openPaymentModal()">Ok</v-btn>
            <v-btn class="blue--text darken-1" flat="flat" @click.native="closeRepostPriceConfirmModal()">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <payment-modal v-if="show_payment_modal"
        :type="''"
        :amount="repost_price"
        :dismiss="closePaymentModal"
        :finish="setRepostPrice"></payment-modal>

      <v-flex xs12 repost-price-section pa-0>
        <v-flex xs12 sm12 form-group>
          <label class="normal-text">repost price</label>
          <div class="repost-price-select">
            <v-select
              v-bind:items="repost_prices"
              v-model="repost_price"
              item-text="name"
              item-value="value"
              label="Price"
              content-class="GLOBAL-repost-price-select"
              single-line
              auto
              dirty
              text-field></v-select>
          </div>
          <v-btn @click.native="openRepostPriceConfirmModal()" class="update-btn top-btn">Set</v-btn>
        </v-flex>
      </v-flex>
    </div>
    <div class="description-section">
      <p>Set Repost Price here.</p>
    </div>
  </div>
</template>

<script type="text/javascript" src="./price_tab.ctrl.js"></script>
