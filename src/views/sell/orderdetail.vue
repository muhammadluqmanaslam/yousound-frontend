<template>
  <div>
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

    <div class="page-content margin-top-header">
      <v-card flat>
        <v-container fluid grid-list-md>
          <v-layout row wrap class="min-100">
            <v-flex xs12 sm7 order-section class="px-4 pt-4">
              <div class="mb-4 main-heading">Order #: <b>{{ order_detail.id }}</b></div>
              <div class="order-container">
              <div
                class="order-item"
                v-for="(item, index) in order_detail.items" 
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
                        <router-link to="#">
                          <span class="black--text">
                            {{ item.product.name }} | {{ item.product_variant.name }}
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
                            {{item.product.merchant.username }}
                          </router-link>
                        </div>
                      </div>
                      <label class="product-price">
                        Quantity: <b>{{ item.quantity}}</b> 
                      </label>

                    </div>

                    <v-spacer></v-spacer>

                    <div
                      class="product-action-row justify-space-between"
                    >
                    <label class="product-price">
                      ${{ item.price | formatNumber }}
                    </label>
                    </div>


                  </div>
                </div>
              </div>
              </div>
              <div class="orders-status-section">
                <div class="status-row">
                  <label class="status-title">Subtotal</label>
                  <label class="status-title value"
                    >${{ subTotal | formatNumber }}</label
                  >
                </div>
                <div class="status-row">
                  <label class="status-title">Shipping</label>
                  <label class="status-title value">
                    ${{ shippingTotal | formatNumber }}
                  </label>
                </div>
                <div class="status-row">
                  <label class="status-title">Sales Tax</label>
                  <label class="status-title value"
                    >${{ taxTotal | formatNumber }}</label
                  >
                </div>
                <div class="status-row">
                  <label class="status-title">Stripe Fee</label>
                  <label class="status-title value"
                    >${{ stripeFee | formatNumber }}</label
                  >
                </div>
                <div class="total-row">
                  <label class="status-title">Total</label>
                  <label class="status-title value"
                    > <span>USD</span>${{ total | formatNumber }}</label
                  >
                </div>
              </div>
            </v-flex>

            <v-flex xs12 sm5 class="orders-section-container px-5 pt-4">
              <div class="mb-3">
                <div class="title mb-2">Shipment status</div>
                <div class="subtitle">Sellers have 21 days to ship your items</div>
              </div>
              <!-- PendingDiv -->
              <div class="pendingDiv">
                <div class="bold">
                  Pending
                </div>
                <div>12 days left to ship or you will receive an automatic refund</div>
              </div>
                <!-- track -->
                <div class="trackDiv mt-3">
                  <div class="mb-2">
                    <span class="bold">
                      Shipped
                    </span>
                    with <span class="bold">
                      USPS
                    </span> 
                  </div>
                  <div> <span class="bold">
                    Tracking:
                  </span> 21829Z28XSHDKSHDFKEEIS
                </div>
                <div>
                  <v-btn class="green-btn mt-2">Track order</v-btn>
                </div>
                </div>
              
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>

    </div>
  
  <!-- <v-layout row wrap class="page order-history-page">
    <v-flex xs12 sm10 offset-sm1>
      <h2 class="page-title">Sell</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 v-if="order_detail">
      <div class="order-details" v-if="active == 'none'">
        <p class="order-id">Transaction Number: {{ order_detail.id }}</p>
        <div class="address-section">
          <p class="user-name">{{ shippingFullName }}</p>
          <v-flex xs12 class="shipping-address-section">
            <a class="shipping-address-header open">
              <div class="arrow"></div>
              Shipping Address
              <div
                v-if="this.order_detail.shipping_address"
                class="shipping-address-content"
                :class="{ 'error--text': !this.order_detail.enabled_address }"
              >
                <label
                  >{{ order_detail.shipping_address.street_1 }}
                  {{ order_detail.shipping_address.street_2 }}</label
                >
                <label
                  >{{ order_detail.shipping_address.city }},
                  {{ order_detail.shipping_address.state }}
                  {{ order_detail.shipping_address.postcode }}</label
                >
                <label>{{ order_detail.shipping_address.country }}</label>
                <label class="email">{{
                  order_detail.shipping_address.email
                }}</label>
              </div>
            </a>
          </v-flex>
        </div>
        <div class="products-section">
          <table class="product-table">
            <thead>
              <tr>
                <th width="10%"></th>
                <th class="text-xs-left pl-1 pr-1">Product</th>
                <th width="10%">Price</th>
                <th width="10%">Quantity</th>
                <th width="10%">Shipping</th>
                <th width="10%">Tax</th>
                <th width="10%" v-if="currentUser.id !== user.id">Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order_detail.items" :key="index">
                <td class="text-xs-left">
                  <div
                    class="product-image"
                    :style="`background-image: url(${item.product.covers[0].cover.thumb.url})`"
                  ></div>
                </td>
                <td class="text-xs-left">
                  {{ item.product.name }}
                  <span>{{ item.product_variant.name }}</span>
                </td>
                <td class="text-xs-left">${{ item.price | formatNumber }}</td>
                <td class="text-xs-left">{{ item.quantity }}</td>
                <td class="text-xs-left">
                  ${{ item.shipping_cost | formatNumber }}
                </td>
                <td class="text-xs-left">{{ item.tax_percent }}%</td>
                <td
                  v-if="currentUser.id !== user.id"
                  class="text-xs-left red--text"
                >
                  ${{ item.fee | formatNumber }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="report-section">
          <div class="sub-total-section">
            <v-layout row wrap>
              <v-flex xs6 text-xs-left pb-2>SubTotal</v-flex>
              <v-flex xs6 text-xs-right pb-2
                >${{ subTotal | formatNumber }}</v-flex
              >
              <v-flex xs6 text-xs-left pb-2>Shipping</v-flex>
              <v-flex xs6 text-xs-right pb-2
                >${{ shippingTotal | formatNumber }}</v-flex
              >
              <v-flex xs6 text-xs-left pb-2>Tax</v-flex>
              <v-flex xs6 text-xs-right pb-2
                >${{ taxTotal | formatNumber }}</v-flex
              >
              <v-flex xs6 text-xs-left pb-2>Stripe Fee</v-flex>
              <v-flex xs6 text-xs-right pb-2
                >${{ stripeFee | formatNumber }}</v-flex
              >
              <template v-if="refundAmount > 0">
                <v-flex xs6 text-xs-left pb-2 class="error--text"
                  >Refund</v-flex
                >
                <v-flex xs6 text-xs-right pb-2 class="error--text"
                  >${{ refundAmount | formatNumber }}</v-flex
                >
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
  </v-layout>  -->
  </div>
</template>

<script type="text/javascript" src="./orderdetail.ctrl.js"></script>
<style src="./orderdetails.scss" lang="scss" scoped></style>
