<template>
  <div row wrap class="page cart-page margin-top-header">
    <content-top-header class="black-theme">
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
              class="nav-li"
            :class="[{ active: isActiveTab(tab.id)}, `nav-${tab.id}`]"
          >
            <label class="nav-label" @click="onTab(tab.id)">
              {{ tab.title }}
            </label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="d-flex">
      <div class="page-content" v-if="currentUser && isPageReady">
        <template v-if="active_tab == 'cart'">
          <div v-if="!cartItems || cartItems.length == 0" class="empty-section">
            <p class="empty-title">Your Cart is Empty</p>
            <p class="empty-description">Looking for something new?</p>
            <router-link to="/product" class="empty-discover-btn"
              >Discover</router-link
            >
          </div>
          <v-card flat v-else>
            <v-container fluid grid-list-md>
              <v-layout row wrap class="min-100">
                <v-flex xs12 sm7 order-section class="px-4 pt-4">
                  <div class="mb-4 main-heading">{{ cartItems.length }} items in cart</div>
                  <div class="order-container">
                  <div
                    v-for="(item, index) in cartItems"
                    class="order-item"
                    :key="index"
                  >
                    <div sm12 class="order-content-section pa-0">
                      <div class="product-cover-image">
                        <router-link :to="{name: 'SingleProduct', params: {id: item.product.id}}">
                          <activity-product-card
                            :object="item.product"
                            :price-show="false"
                          />
                        </router-link>
                      </div>

                      <div class="product-content">
                        <div class="product-content-row">
                          <div class="product-name">
                            <router-link :to="{name: 'SingleProduct', params: {id: item.product.id}}">
                              <span class="black--text">
                                {{ item.product.name }} |
                                {{ item.product_variant.name }}
                              </span>
                            </router-link>
                          </div>
                          <div
                            class="product-content-row justify-space-between pt-0"
                          >
                            <div>
                              <router-link
                                :to="`/${item.product.merchant.slug}`"
                                class="user-name"
                              >
                                {{ item.product.merchant.username }}
                              </router-link>
                            </div>
                          </div>
                          <!-- <label class="product-price">
                            ${{ item.price | formatNumber }}
                          </label> -->
                          <div v-if="!isDigitalProduct(item)">
                            <v-btn
                              class="product-count-adjust-btn"
                              :class="{ active: item.quantity > 1 }"
                              :disabled="item.quantity <= 1"
                              @click.native="removeQuantity(item)"
                            >
                              <v-icon>remove</v-icon>
                            </v-btn>
                            <label class="product-count">{{
                              item.quantity
                            }}</label>

                            <v-btn
                            class="product-count-adjust-btn active"
                            @click.native="addQuantity(item)"
                          >
                            <v-icon>add</v-icon>
                          </v-btn>
                          </div>
                        </div>

                        <v-spacer></v-spacer>

                        <div
                          class="product-action-row justify-space-between"
                        >
                        <label class="product-price">
                          ${{ item.price | formatNumber }}
                        </label>
                        <!-- <div
                            class="product-status"
                            :class="productStatusStyle(item)"
                          >
                            {{ productStatusText(item) }}
                          </div> -->
                            <!-- <div v-if="!isDigitalProduct(item)">
                              <v-btn
                                class="product-count-adjust-btn active"
                                @click.native="addQuantity(item)"
                              >
                                <v-icon>add</v-icon>
                              </v-btn>
                              <label class="product-count">{{
                                item.quantity
                              }}</label>
                              <v-btn
                                class="product-count-adjust-btn"
                                :class="{ active: item.quantity > 1 }"
                                :disabled="item.quantity <= 1"
                                @click.native="removeQuantity(item)"
                              >
                                <v-icon>remove</v-icon>
                              </v-btn>
                            </div> -->
                          <a
                            class="message-buyer-btn"
                            @click.self="removeCartItem(item)"
                            >Remove</a
                          >
                          <!-- <a class="order-detail-btn" href="#">Save for later</a> -->
                        </div>


                      </div>
                    </div>
                  </div>
                  </div>
                  <div class="orders-status-section">
                    <div class="status-row">
                      <label class="status-title">Subtotal</label>
                      <label class="status-title value"
                        >${{ cartCost.subtotal_cost | formatNumber }}</label
                      >
                    </div>
                    <div class="status-row">
                      <label class="status-title">Shipping</label>
                      <label class="status-title value">
                        ${{ cartCost.shipping_cost | formatNumber }}
                      </label>
                    </div>
                    <div class="status-row">
                      <label class="status-title">Sales Tax</label>
                      <label class="status-title value"
                        >${{ cartCost.tax_cost | formatNumber }}</label
                      >
                    </div>
                    <div class="status-row">
                      <label class="status-title">Stripe Fee</label>
                      <label class="status-title value"
                        >${{ cartCost.fee_cost | formatNumber }}</label
                      >
                    </div>
                    <div class="total-row">
                      <label class="status-title">Total</label>
                      <label class="status-title value"
                        > <span>USD</span> ${{
                          (cartCost.total_cost + cartCost.fee_cost)
                            | formatNumber
                        }}</label
                      >
                    </div>
                    <div class="action-row">
                      <v-btn class="checkout-btn" @click.native="submit()"
                        >Proceed to Checkout</v-btn
                      >
                    </div>
                  </div>
                </v-flex>

                <v-flex xs12 sm5 class="orders-section-container px-5 pt-4">
                  <div class="mb-3">
                    <div class="title mb-2">Shipping</div>
                    <div class="subtitle">All transactions are secure and encrypted.</div>
                  </div>
                  <div class="shipping-address-section">
                    <div
                      class="
                        d-flex
                        justify-space-between
                        shipping-action-header
                        align-center
                      "
                    >
                    <div class="stripped-shipping-address">
                      <div v-for="(line, i) in strippedAddress" :key="i">
                        {{ line }}
                      </div>
                    </div>
                      <div
                        class="header-title app-bold flex-none cursor-pointer shipped-btn"
                        @click="editDialog = true"
                      >
                        Edit
                      </div>
                    </div>

                    <v-dialog
                      v-model="editDialog"
                      content-class="edit-address-dialog"
                    >
                      <address-tab />
                    </v-dialog>
                  </div>

                  <div class="mb-3">
                    <div class="title mb-2">Payment</div>
                    <div class="subtitle">All transactions are secure and encrypted.</div>
                  </div>

                  <div class="payment-stripe-section">
                    <div class="header-title">
                      <h3>Credit card</h3>
                      <div class="icon-image">
                        <img src="../../assets/cards.png" alt="" width="130">
                        and more...
                      </div>
                    </div>
                    <div class="stripe-section-body">
                      <div class="lock">
                        <input type="text" placeholder="Card number">
                        <img src="../../assets/lock.png" alt="" width="30">
                      </div>
                      <div>
                        <input type="text" placeholder="Name on card">
                      </div>
                      <div class="dflex bottom-details">
                        <div><input type="text" placeholder="Expiration date (MM / YY)"></div>
                        <div class="question-mark">
                          <input type="text" placeholder="Security code">
                          <img src="../../assets/question.png" alt="" width="30">
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="title mb-2">Remember me</div>
                  </div>

                  <div class="payment-stripe-section">
                    <div class="regular-checkbox">
                      <input type="checkbox" id="c-checkbox">
                      <label for="c-checkbox">Save my information for faster checkout</label>
                    </div>
                  </div>
                  <div class="payment-stripe-section-button">
                    <div class="btn-holder">
                      <v-btn class="checkout-btn"
                        >Pay now</v-btn
                      >
                    </div>
                  </div>

                  <div class="powered-by text-center">
                    <img src="../../assets/powered-by.png" width="100" alt="">
                  </div>
                  


                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </template>

        <template v-if="active_tab == 'history'">
          <div
            v-if="!orderHistories || orderHistories.length == 0"
            class="empty-section"
          >
            <p class="empty-title">New Orders</p>
            <p class="empty-description">You have no orders yet.</p>
          </div>
          <v-card flat v-else>
            <v-flex
              xs12
              class="order-history-item px-5"
              v-for="(order, index) in orderHistories"
              :key="index"
            >
              <div class="profile-section">
                <v-layout row>
                  <div class="profile-content-section relative">
                    <div class="dflex align-center">

                    
                    <div class="profile-avatar">
                      <profile-item
                        :user="currentUser"
                        :className="'order-item-profile-avatar'"
                      />
                    </div>
                    <div class="profile-content">
                      <a href="#" class="user-name"><b>You</b></a>
                      <br>
                      <label class="order-detail-text"
                        >purchased <b>&nbsp;${{ order.amount | formatNumber }}</b> on <b>&nbsp;{{ order.created_at | formatDate }}</b></label
                      >
                    </div>

                    </div>
                    <div class="profile-actions">

                      <div>                    
                        <v-menu
                        v-if="isMenuAvailable(order)"
                        down
                        offset-y
                        :nudge-top="-5"
                        class="menu-content-x"
                      >
                        <v-btn round slot="activator">
                          <v-icon dark right>more_horiz</v-icon>
                        </v-btn>
                        <v-list class="list-class">
                          <v-list-tile
                            @click.native="openTicketDialog(order, item)"
                          >
                            <v-list-tile-content>
                              <router-link
                              :to="`/sell/order/${order.id}`"
                              class="order-detail-btn"
                              >Order Details</router-link
                            >
                            <a
                              class="message-buyer-btn"
                              @click="showMessageDialog(order)"
                              >Message Buyer</a
                            >
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile
                            v-if="isAddressEnabled(order)"
                            @click.native="openAddressConfimDialog(order)"
                          >
                            <v-list-tile-content>
                              Remove my personal info
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </div>
                    </div>
                  </div>
                </v-layout>
              </div>
              <div class="order-section" v-for="(item, index) in order.items" :key="index">
                <v-layout row class="border-x">
                  <div class="order-content-section relative dflex align-center">
                    <div
                      class="product-cover-image"
                      :style="`background-image: url(${item.product.covers[0].cover.thumb.url})`"
                    ></div>
                    <div class="product-content">
                      <div class="product-content-row">
                        <div class="product-name">
                          {{ item.product.name }} |
                          {{ item.product_variant.name }}
                        </div>
                      </div>
                      <!-- <div class="product-content-row">
                        <router-link
                          class="user-name"
                          :to="'/' + item.product.merchant.slug"
                          >{{ item.product.merchant.username }}</router-link
                        >
                      </div> -->
                      <div class="product-content-row max-width justify-space-between">
                        <div class="product-price">
                          ${{ item.product_variant.price | formatNumber }}
                        </div>
                        <div
                          class="product-count"
                          v-if="!isDigitalProduct(item)"
                        >
                          Quantity: <b>{{ item.quantity }}</b>
                        </div>
                        <!-- <span v-if="isDigitalProduct(item) && item.status == 'item_shipped'"
                          class="product-link"
                          @click = "download(item)"
                        >Download</span> -->
                      </div>
                    </div>

                  </div>
                  <div
                    v-if="isDigitalProduct(item)"
                    class="order-status-section digital"
                  >
                    <div class="text-xs-center">
                      <label>{{
                        item.product.digital_content_name | truncateInMiddle(20)
                      }}</label>
                      <span class="product-link" @click="download(item)"
                        >Download</span
                      >
                    </div>
                  </div>
                  <div
                    v-else
                    @click="
                      item.status !== 'item_ordered' &&
                        openTrackingInfoDialog(item)
                    "
                    :class="{
                      pending: item.status == 'item_ordered',
                      shipped: item.status == 'item_shipped',
                    }"
                    class="order-status-section"
                  >
                    <div
                      v-if="item.status == 'item_ordered'"
                      class=""
                    >
                     <li>Pending</li> 
                    </div>
                    <div
                      v-if="item.status == 'item_refunded'"
                      class=""
                    >
                      Refunded
                    </div>
                    <div v-else class="">
                      Must ship by <b>Monday. Aug 21, 2022</b> or this order is automatically refunded
                    </div>
                    <div class="dflex align-center justify-space-between">
                      <div class="bold">Download</div>
                      <v-btn class="hollow-btn">sample.zip</v-btn>
                    </div>
                  </div>
                </v-layout>
              </div>
            </v-flex>
          </v-card>
        </template>

        <v-dialog v-if="active_tab == 'cart'" v-model="show_order_complete_dialog" content-class="my-dialog-1">
          <div class="payment-success payment-ready">
            <div class="dflex align-center my-4">
              <!-- <v-icon class="success-icon result-icon">check_circle</v-icon> -->
              <div class="success-img">
                <img src="../../assets/true.svg" width="100%">
              </div>
              <div class="result-text">
                <div class="big">Thank you!</div>
                <div>Your order was successful</div>
              </div>
            </div>

            <div class="post">
              We sent an email confirmation to: <br />
              <strong> {{ currentUser.email }} </strong>
            </div>

            <div class="second-head mt-4">
              Buyer protection
            </div>

            <div class="divider mt-1"></div>
            <div class="post mt-2">
              Sellers have <b>21 days</b> to ship your items or your order is automatically refunded.
            </div>


            <v-btn depressed round block class="mt-5 pay_btn" @click="orderDetails()"
              >View order details</v-btn
            >
          </div>
        </v-dialog>

        <payment-modal
          v-if="showPaymentModal"
          :receivers="merchants"
          :amount="cartCost.total_cost"
          :dismiss="closePaymentDialog"
          :finish="orderItems"
        />
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

    <v-dialog
      v-model="show_tracking_info_dialog"
      content-class="tracking-info-dialog"
    >
      <v-card>
        <v-card-title class="headline">Your item has shipped</v-card-title>
        <v-card-text>
          <div class="product" v-if="active_item && active_item.product">
            <div
              class="product-cover"
              :style="`background-image: url(${active_item.product.covers[0].cover.thumb.url})`"
            ></div>
            <div class="product-info">
              <div class="product-name">{{ active_item.product.name }}</div>
              <div class="product-owner">
                {{ active_item.product.merchant.username }}
              </div>
            </div>
          </div>
          <div>
            <label>Carrier: </label
            ><span class="red--text"
              ><b>{{ active_item.tracking_site }}</b></span
            >
          </div>
          <div>
            <label>Tracking number: </label
            ><span>{{ active_item.tracking_number }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_address_confirm_dialog" content-class="my-dialog-1">
      <v-card>
        <v-card-text>
          <div class="headline">Remove your shipping address?</div>
          <div>
            This will remove your shipping address from this user, and user
            might not be able to ship your items
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="green" @click.native="removeMyAddress()"
            >Yes</v-btn
          >
          <v-btn dark color="grey" @click.native="closeAddressConfimDialog()"
            >No</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./cart.ctrl.js"></script>
<style src="../../../static/styles/cart.scss" lang="scss" scoped></style>
<style src="../../../static/styles/checkout.scss" lang="scss" scoped></style>
