<template>
  <div row wrap class="page cart-page mx-5">
    <div class="d-flex">
      <div class="tab-container">
        <h2 class="page-title">Cart</h2>
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{active: isActiveTab(tab.id)}"
          ><label @click="onTab(tab.id)">{{ tab.title }}</label></li>
        </ul>
      </div>

      <div class="tab-content" v-if="currentUser && isPageReady">
        <template v-if="active_tab == 'cart'">
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
              <div class="status-row">
                <label class="status-title">Sales Tax</label>
                <label class="status-title value">${{ cartCost.tax_cost|formatNumber }}</label>
              </div>
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
            </v-flex>
          </v-card>
        </template>

        <template v-if="active_tab == 'history'">
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
                      <profile-item
                        :user="currentUser"
                        :className="'order-item-profile-avatar'"
                      />
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
                        <label class="product-count" v-if="!isDigitalProduct(item)">Quantity: <b>{{ item.quantity }}</b></label>
                      </v-flex>
                      <v-flex sm12 class="product-content-row">
                        <router-link class="user-name" :to = "'/' + item.product.merchant.slug">{{ item.product.merchant.display_name }}</router-link>
                      </v-flex>
                      <v-flex sm12 class="product-content-row">
                        <label class="product-price">${{ item.product_variant.price | formatNumber }}</label>
                        <!-- <span v-if="isDigitalProduct(item) && item.status == 'item_shipped'"
                          class="product-link"
                          @click = "download(item)"
                        >Download</span> -->
                      </v-flex>
                    </div>
                    <v-menu v-if="isMenuAvailable(order)"
                      down
                      offset-y
                      :nudge-top="-5"
                    >
                      <v-btn round slot="activator">
                        <v-icon dark right>more_horiz</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile @click.native="openTicketDialog(order, item)">
                          <v-list-tile-content>
                            Open Case / Complaint
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile v-if="isAddressEnabled(order)" @click.native="openAddressConfimDialog(order)">
                          <v-list-tile-content>
                            Remove my personal info
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                  <div v-if="isDigitalProduct(item)" class="order-status-section digital">
                    <div class="text-xs-center">
                      <label>{{ item.product.digital_content_name | truncateInMiddle(20) }}</label>
                      <span class="product-link" @click="download(item)">Download</span>
                    </div>
                  </div>
                  <div
                    v-else
                    @click="item.status!=='item_ordered' && openTrackingInfoDialog(item)"
                    :class="{'pending': item.status == 'item_ordered', 'shipped': item.status == 'item_shipped'}"
                    class="order-status-section">
                    <div
                      v-if="item.status=='item_ordered'"
                      class="text-xs-center"
                    >Pending Order</div>
                    <div
                      v-else
                      class="text-xs-center"
                    >Your Item Has Shipped!<br>View tracking info</div>
                  </div>
                </v-layout>
              </div>
            </v-flex>
          </v-card>
        </template>
      </div>
    </div>

    <send-message
      v-if="showSendMessage"
      :receiver="user"
      :dismiss="dismissMessageModal"
    />

    <ticket-new-dialog
      v-if="show_ticket_dialog"
      :item="active_item"
      :dismiss="closeTicketDialog"
    />

    <v-dialog v-model="show_tracking_info_dialog" content-class="tracking-info-dialog">
      <v-card>
        <v-card-title class="headline">Your item has shipped</v-card-title>
        <v-card-text>
          <div class="product" v-if="active_item && active_item.product">
            <div class="product-cover" :style="`background-image: url(${active_item.product.covers[0].cover.thumb.url})`"></div>
            <div class="product-info">
              <div class="product-name">{{ active_item.product.name }}</div>
              <div class="product-owner">{{ active_item.product.merchant.display_name }}</div>
            </div>
          </div>
          <div>
            <label>Carrier: </label><span class="red--text"><b>{{ active_item.tracking_site }}</b></span>
          </div>
          <div>
            <label>Tracking number: </label><span>{{ active_item.tracking_number }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

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
