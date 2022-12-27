<template>
  <div class="page cart-page cart-checkout-page mx-5 margin-top-header">
    <content-top-header>
      <template slot="topHeader">
        <ul class="mx-0">
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
              class="nav-li"
            :class="[{ active: isActiveTab(tab.id)}, `nav-${tab.id}`]"
          >
            <label class="nav-label" @click="onTab(tab.id)">
              <img v-if="tab.icon" :src="tab.icon" width="18" class="li-icon">
              {{ tab.title }}
            </label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="page-content">
      <v-container fluid grid-list-md px-0>
        <v-layout row wrap>
          <v-flex xs12 sm9 order-section>
            <div class="order-item" v-for="(item, index) in cartItems" :key="index">

              <div sm12 class="order-content-section pa-0">
                <div class="product-cover-image">
                  <activity-product-card
                    :object="item.product"
                    :price-show="false"
                  />
                </div>

                <div class="product-content">
                  <div class="product-content-row">
                    <div class="product-name">
                      {{ item.product.name }} |
                      {{ item.product_variant.name }}
                    </div>
                    <div
                      class="product-content-row justify-space-between pt-2"
                    >
                      <div>
                        By
                        <router-link
                          :to="`/${item.product.merchant.slug}`"
                          class="user-name"
                          href="#"
                          >{{ item.product.merchant.username }}</router-link
                        >
                      </div>
                    </div>
                    <label class="product-price">
                      ${{ item.price | formatNumber }}
                    </label>
                  </div>

                  <v-spacer></v-spacer>

                  <div
                    class="product-action-row justify-space-between"
                  >
                  <div
                      class="product-status"
                      :class="productStatusStyle(item)"
                    >
                      {{ productStatusText(item) }}
                    </div>
                      <div v-if="!isDigitalProduct(item)">
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
                      </div>
                    <a
                      class="message-buyer-btn"
                      @click.self="removeCartItem(item)"
                      >Remove</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </v-flex>

          <v-flex xs12 sm3 class="orders-section-container">
            <div class="shipping-address-section">
              <div
                class="
                  d-flex
                  justify-space-between
                  shipping-action-header
                "
              >
                <div class="header-title app-bold flex-none">
                  Default Shipping Address
                </div>
              </div>
              <div class="stripped-shipping-address">
                <div v-for="(line, i) in strippedAddress" :key="i">
                  {{ line }}
                </div>
              </div>
              <v-dialog
                v-model="editDialog"
                content-class="edit-address-dialog"
              >
                <address-tab />
              </v-dialog>
            </div>

            <router-link
              to="/settings#shipping-address"
              class="update-shipping-address"
            >
              <v-icon class="settings-icon">settings</v-icon>
              Update Shipping Address
            </router-link>

            <div class="orders-status-section">
              <div class="status-row">
                <label class="status-title">Subtotal</label>
                <label class="status-title value">
                  ${{ cartCost.subtotal_cost | formatNumber }}
                </label>
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
                  >${{
                    (cartCost.total_cost + cartCost.fee_cost)
                      | formatNumber
                  }}</label
                >
              </div>

              <div class="action-row">
                <v-btn
                  class="place-order-btn"
                  @click.native="openPaymentDialog()"
                  :disabled="!canOrder"
                  >Place Order</v-btn
                >
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>


    <v-dialog
      v-model="editDialog"
      content-class="edit-address-dialog"
    >
      <address-tab />
    </v-dialog>

    <v-dialog v-model="show_order_complete_dialog" content-class="my-dialog-1">
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
          <strong> email@email.com </strong>
        </div>

        <div class="second-head mt-4">
          Buyer protection
        </div>

        <div class="divider mt-1"></div>
        <div class="post mt-2">
          Sellers have <b>21 days</b> to ship your items or your order is automatically refunded.
        </div>


        <v-btn depressed round block class="mt-5 pay_btn"
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
</template>

<script type="text/javascript" src="./checkout.ctrl.js"></script>
<style src="../../../static/styles/cart.scss" lang="scss" scoped></style>
<style src="../../../static/styles/checkout.scss" lang="scss" scoped></style>
