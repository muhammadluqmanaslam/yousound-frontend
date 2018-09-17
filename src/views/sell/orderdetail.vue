<template>
  <v-layout row wrap class="page order-history-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Sell</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="order_detail">
      <div class="order-details" v-if="active=='none'">
        <p class="order-id"> Transaction Number: {{ order_detail.id }}</p>
        <div class="address-section">
          <p class="user-name">{{ order_detail.customer.display_name }}</p>
          <v-flex xs12 class="shipping-address-section">
            <a class="shipping-address-header open">
              <div class="arrow"></div> Shipping Address
              <div v-if="this.order_detail.shipping_address"
                class="shipping-address-content"
                :class="{'error--text': !this.order_detail.enabled_address}"
              >
                <label>{{ order_detail.shipping_address.street_1 }} {{ order_detail.shipping_address.street_2 }}</label>
                <label>{{ order_detail.shipping_address.city }}, {{ order_detail.shipping_address.state }} {{ order_detail.shipping_address.postcode }}</label>
                <label>{{ order_detail.shipping_address.country }}</label>
                <label class="email">{{ order_detail.shipping_address.email }}</label>
              </div>
            </a>
          </v-flex>
        </div>
        <div class="products-section">
          <table class="product-table">
            <thead>
              <tr>
                <th width="15%"></th>
                <th width="25%" class="text-xs-left pl-1 pr-1">Product</th>
                <th width="15%">Price</th>
                <th width="15%">Quantity</th>
                <th width="15%">Shipping</th>
                <th width="15%">Tax</th>
                <th width="15%">Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order_detail.items" :key="index">
                <td class="text-xs-center">
                  <div class="product-image" :style="`background-image: url(${item.product.covers[0].cover.thumb.url})`"></div>
                </td>
                <td class="text-xs-left">{{ item.product.name }}</td>
                <td class="text-xs-center">${{ item.price | formatNumber }}</td>
                <td class="text-xs-center">{{ item.quantity }}</td>
                <td class="text-xs-center">${{ item.shipping_cost | formatNumber }}</td>
                <td class="text-xs-center">{{ item.tax_percent }}%</td>
                <td class="text-xs-center red--text">${{ item.fee | formatNumber }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="report-section">
          <div class="sub-total-section">
            <v-layout row wrap>
              <v-flex xs6 text-xs-left pb-2>SubTotal</v-flex>
              <v-flex xs6 text-xs-right pb-2>${{ subTotal | formatNumber }}</v-flex>
              <v-flex xs6 text-xs-left pb-2>Shipping</v-flex>
              <v-flex xs6 text-xs-right pb-2>${{ shippingTotal | formatNumber }}</v-flex>
              <v-flex xs6 text-xs-left pb-2>Tax</v-flex>
              <v-flex xs6 text-xs-right pb-2>${{ taxTotal | formatNumber }}</v-flex>
              <template v-if="refundAmount > 0">
                <v-flex xs6 text-xs-left pb-2 class="error--text">Refund</v-flex>
                <v-flex xs6 text-xs-right pb-2 class="error--text">${{ refundAmount | formatNumber }}</v-flex>
              </template>
            </v-layout>
          </div>
          <div class="total-section">
            <v-layout row wrap>
              <v-flex xs6 text-xs-left>Total</v-flex>
              <v-flex xs6 text-xs-right>${{ total | formatNumber }}</v-flex>
            </v-layout>
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./orderdetail.ctrl.js"></script>
