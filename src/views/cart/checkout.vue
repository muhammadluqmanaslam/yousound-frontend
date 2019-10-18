<template>
  <div class="page cart-page cart-checkout-page mx-5">
    <div class="d-flex">
      <div class="page-left">
        <div class="tab-container">
          <h2 class="page-title">Checkout</h2>
          <div class="shipping-address-section">
            <a class="shipping-address-header" :class="{'open': showAddress}" @click.self="showAddress = !showAddress">
              <div class="arrow"></div> Default Shipping Address
              <div class="shipping-address-content" v-if="shippingAddress.length">
                <label>{{ shippingAddress[0].street_1 }} {{ shippingAddress[0].street_2 }}</label>
                <label>{{ shippingAddress[0].city }}, {{ shippingAddress[0].state }} {{ shippingAddress[0].postcode }}</label>
                <label>{{ shippingAddress[0].country }}</label>
              </div>
            </a>
          </div>
          <div class="shipping-address-section">
            <router-link to="/settings#shipping-address" class ="update-shipping-address">
              Update Shipping Address
              <v-icon class="settings-icon">settings</v-icon>
            </router-link>
            <!-- <a class="shipping-address-header">
              <div class="arrow"></div> New Shipping Address
              <div class="shipping-address-content">
                <label>123 Main Street</label>
                <label>San Francisco, CA</label>
                <label>United States</label>
              </div>
            </a> -->
          </div>
        </div>
      </div>

      <div class="page-content relative" v-if="currentUser && isPageReady">
        <div class="order-status-section" v-if="cartItems.length">
          <div class="status-row">
            <label class="status-title">Subtotal</label>
            <label class="status-title value">${{ cartCost.subtotal_cost|formatNumber }}</label>
          </div>
          <div class="status-row">
            <label class="status-title">Shipping</label>
            <label class="status-title value">${{ cartCost.shipping_cost|formatNumber }}</label>
          </div>
          <div class="status-row">
            <label class="status-title">Sales Tax</label>
            <label class="status-title value">${{ cartCost.tax_cost|formatNumber }}</label>
          </div>
          <div class="total-row">
            <label class="status-title">Total</label>
            <label class="status-title value">${{ cartCost.total_cost|formatNumber }}</label>
          </div>
          <div class="action-row">
            <v-btn class="place-order-btn" @click.native="openPaymentDialog()">Place Order</v-btn>
          </div>
        </div>

        <div class="order-item" v-for="(item, index) in cartItems" :key="index">
          <div class="order-section">
            <v-layout row>
              <v-flex sm12 class="order-content-section pa-0 relative" :class="{'border-top-none': index!=0}">
                <!-- <img class="product-cover-image" src="/static/images/product1.png"/> -->
                <!-- <div class="product-cover-image" :style="`background-image: url(${item.product.covers[0].cover.thumb.url})`"></div> -->
                <div class="product-cover-image">
                  <activity-product-card :object="item.product" :priceShow="false"></activity-product-card>
                </div>
                <div class="product-content">
                  <v-flex sm12 class="product-content-row">
                    <label class="product-name">{{ item.product.name }} | {{ item.product_variant.name }}</label>
                    <label class="product-status" :class="productStatusStyle(item)">{{ productStatusText(item) }}</label>
                    <template v-if="!isDigitalProduct(item)">
                      <v-btn
                        class="product-count-adjust-btn active"
                        @click.native="addQuantity(item)"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                      <label class="product-count">{{ item.quantity }}</label>
                      <v-btn
                        class="product-count-adjust-btn"
                        :class="{'active': item.quantity > 1}"
                        :disabled="item.quantity <= 1"
                        @click.native="removeQuantity(item)"
                      >
                        <v-icon>remove</v-icon>
                      </v-btn>
                    </template>
                  </v-flex>
                  <v-flex sm12 class="product-content-row">
                    By <router-link :to="`/${item.product.merchant.slug}`" class="user-name" href="#">{{ item.product.merchant.display_name }}</router-link>
                  </v-flex>
                  <v-flex sm12 class="product-content-row" pt-1>
                    <label class="product-price">${{ item.price|formatNumber }}</label>
                    <a class="message-buyer-btn" @click.self="removeCartItem(item)">Remove</a>
                    <!-- <a class="order-detail-btn" href="#">Save for later</a> -->
                  </v-flex>
                </div>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="show_order_complete_dialog" content-class="my-dialog-1">
      <v-card>
        <v-card-media src="/static/images/ic_check_o_green.png" height="100px" contain></v-card-media>
        <v-card-text>
          <div class="headline">Your order has been processed!</div>
          <div>View your order history to view shipping status of your items,<br/>
          view payment invoices & download any digital products.</div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" dark round @click.native="viewOrderHistory()">View Order History</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <payment-modal v-if="showPaymentModal"
      :type="''"
      :amount="cartCost.total_cost"
      :dismiss="closePaymentDialog"
      :finish="orderItems"
    ></payment-modal>
  </div>
</template>

<script type="text/javascript" src="./checkout.ctrl.js"></script>
