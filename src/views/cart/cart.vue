<template>
  <div row wrap class="page cart-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Cart</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="isPageReady">
      <div class="normal-tab">
        <v-tabs black v-model="current_tab">
          <v-tabs-bar class="transparent">
            <v-tabs-item
              key="cart"
              href="#cart"
              @click.native="onTab('cart')"
              ripple>Added to cart</v-tabs-item>
            <v-tabs-item
              key="history"
              href="#history"
              @click.native="onTab('history')"
              ripple>Order History</v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content key="cart" id="cart">
              <div v-if="!cartItems || cartItems.length == 0" class="empty-section">
                <p class="empty-title">Your Cart is Empty</p>
                <p class="empty-description">Looking for something new?</p>
                <router-link to="/discover#merch" class="empty-discover-btn">Discover</router-link>
              </div>
              <v-card flat v-else>
                <div class="orders-status-section">
                  <div class="status-row">
                    <label class="status-title">Subtotal</label>
                    <label class="status-title value">${{ cartCost.subtotal_cost|formatNumber }}</label>
                  </div>
                  <div class="status-row">
                    <label class="status-title">Shipping</label>
                    <label class="status-title value">${{ cartCost.shipping_cost|formatNumber }}</label>
                  </div>
                  <!-- <div class="status-row">
                    <label class="status-title">Fees</label>
                    <label class="status-title value">${{ cartCost.fee_cost|formatNumber }}</label>
                  </div> -->
                  <div class="total-row">
                    <label class="status-title">Total</label>
                    <label class="status-title value">${{ cartCost.total_cost|formatNumber }}</label>
                  </div>
                  <div class="action-row">
                    <v-btn class="checkout-btn" @click.native="submit()">Proceed to Checkout</v-btn>
                  </div>
                </div>
                <v-flex class="order-item" v-for="(item, index) in cartItems" :key="index">
                  <div class="order-section">
                    <v-layout row>
                      <v-flex sm12 class="order-content-section pa-0 relative" :class="{'border-top-none': index!=0}">
                        <div class="product-cover-image">
                          <activity-product-card :object="item.product" :priceShow="false"></activity-product-card>
                        </div>
                        <div class="product-content">
                          <v-flex sm12 class="product-content-row">
                            <label class="product-name">{{ item.product.name }} | {{ item.product_variant.name }}</label>
                            <label class="product-status" :class="productStatusStyle(item)">{{ productStatusText(item) }}</label>
                            <v-btn
                              class="product-count-adjust-btn active"
                              @click.native="addQuantity(item)">
                              <v-icon>add</v-icon>
                            </v-btn>
                            <label class="product-count">{{ item.quantity }}</label>
                            <v-btn 
                              class="product-count-adjust-btn"
                              :class="{'active': item.quantity > 1}"
                              :disabled="item.quantity <= 1"
                              @click.native="removeQuantity(item)">
                              <v-icon>remove</v-icon>
                            </v-btn>
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
                </v-flex>
              </v-card>
            </v-tabs-content>
            <v-tabs-content key="history" id="history">
              <div v-if="!orderHistories || orderHistories.length == 0" class="empty-section">
                <p class="empty-title">New Orders</p>
                <p class="empty-description">You have no orders yet.</p>
              </div>
              <v-card flat v-else>
                <v-flex xs12 class="order-history-item" v-for="(order, index) in orderHistories" :key="index">
                  <div class="profile-section">
                    <v-layout row>
                      <div class="profile-content-section relative">
                        <div class="profile-avatar">
                          <profile-item :user="$store.state.auth.user" :className="'order-item-profile-avatar'"></profile-item>
                        </div>
                        <div class="profile-content">
                          <a href="#" class="user-name"><b>You</b></a>
                          <label class="order-detail-text">purchased these items for<b>&nbsp;${{ order.amount|formatNumber }}</b></label>
                        </div>
                        <div class="profile-actions">
                          <router-link :to="`/sell/order/${order.id}`" class="order-detail-btn">View Order Details</router-link>
                          <a class="message-buyer-btn" @click="showMessageDialog(order)">Message Buyer</a>
                          <label class="order-date">{{ order.created_at|formatDate }}</label>
                        </div>
                      </div>
                      <div class="status-section text-xs-center"></div>
                    </v-layout>
                  </div>
                  <div class="order-section" v-for="item in order.items">
                    <v-layout row>
                      <div class="order-content-section relative">
                        <div class="product-cover-image" :style="`background-image: url(${item.product.covers[0].cover.thumb.url})`"></div>
                        <div class="product-content">
                          <v-flex sm12 class="product-content-row">
                            <label class="product-name">{{ item.product.name }}</label>
                            <label class="product-count">Quantity: <b>{{ item.quantity }}</b></label>
                          </v-flex>
                          <v-flex sm12 class="product-content-row">
                            <router-link class="user-name" :to = "'/' + item.product.merchant.slug">{{ item.product.merchant.display_name }}</router-link>
                          </v-flex>
                          <v-flex sm12 class="product-content-row">
                            <label class="product-price">${{ order.items[0].price|formatNumber }}</label>
                          </v-flex>
                        </div>
                        <v-menu v-if="order.status == 'order_shipped' && order.enabled_address"
                          down
                          offset-y
                          :nudge-top="-5"
                        >
                          <v-btn round slot="activator">
                            <v-icon dark right>more_horiz</v-icon>
                          </v-btn>
                          <v-list>
                            <v-list-tile @click.native="openAddressConfimDialog(order)">
                              <v-list-tile-content>
                                Remove my personal info
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </div>
                      <div class="order-status-section text-xs-center" :class="{'pending': item.status == 'item_ordered', 'shipped': item.status == 'item_shipped'}">
                        <p class="order-status-text" v-if="item.status=='item_ordered'">Pending Order</p>
                        <p class="order-status-text" v-else>Your Item Has Shipped!</p>
                      </div>
                    </v-layout>
                  </div>
                </v-flex>
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>

    <send-message :receiver="user" :dismiss="dismissMessageModal" v-if="showSendMessage"></send-message>

    <v-dialog v-model="show_address_confirm_dialog" content-class="my-dialog-1">
      <v-card>
        <v-card-text>
          <div class="headline">Remove your shipping address?</div>
          <div>This will remove your shipping address from this user, and user might not be able to ship your items</div>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="green" @click.native="removeMyAddress()">Yes</v-btn>
          <v-btn dark color="grey" @click.native="closeAddressConfimDialog()">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./cart.ctrl.js"></script>
