<template>
  <div row wrap class="page sell-page mx-5">
    <dashboard-nav name="sales" />

    <content-top-header class="__inner mt-3">
      <template slot="topHeader">
        <ul class="pr-3 width100">
          <li
            v-for="filter in filters"
            :key="filter.id"
            :href="`#${filter.id}`"
            :class="{ active: activeFilter.id == filter.id }"
          >
            <label @click="filterItems(filter)">{{ filter.name }}</label>
          </li>

          <v-spacer></v-spacer>

          <li v-if="active_tab == 'orders'" class="my-0 py-3">
            <div class="export-wrapper">
              <VueCtkDateTimePicker
                v-model="exportPeriod"
                id="export-period"
                :range="true"
                format="YYYY-MM-DD"
                label="Orders CSV - Select date & time"
                formatted="ll"
              >
              </VueCtkDateTimePicker>
              <v-icon class="pl-2" @click="csvExport()">save_alt</v-icon>
            </div>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="page-content" v-if="currentUser && isPageReady">
      <template v-if="active_tab == 'orders'">
        <div
          v-if="!orderHistories || orderHistories.length == 0"
          class="empty-section"
        >
          <p class="empty-title">You have no new orders</p>
        </div>
        <v-card v-else flat class="relative">
          <div
            v-for="(order, index) in orderHistories"
            :key="index"
            class="order-item"
          >
            <template v-if="currentUser.id == order.merchant.id">
              <div class="profile-section">
                <v-layout row>
                  <div class="profile-content-section relative">
                    <div class="profile-avatar">
                      <profile-item
                        :user="order.customer"
                        :className="'order-item-profile-avatar'"
                      ></profile-item>
                    </div>
                    <div>
                      <div class="profile-content">
                        <a href="#" class="user-name">{{
                          order.customer.username
                        }}</a>
                        <label class="order-detail-text">
                          purchased
                          <b>${{ order.amount | formatNumber }}</b></label
                        >
                      </div>
                      <div class="profile-actions">
                        <router-link
                          :to="`/sell/order/${order.id}`"
                          class="order-detail-btn"
                          >View Order Details</router-link
                        >
                        <a
                          class="message-buyer-btn"
                          @click="showMessageDialog(order)"
                          >Message Buyer</a
                        >
                      </div>
                    </div>
                  </div>
                  <div class="status-section text-xs-center"></div>
                </v-layout>
              </div>

              <div
                v-for="item in order.items"
                :key="item.id"
                class="order-section"
              >
                <v-container :fluid="isSidebarMini" grid-list-xl fill-height class="pa-0 pl-4">
                  <v-layout
                    v-if="
                      activeFilterItemStatus == '' ||
                      item.status == activeFilterItemStatus
                    "
                    row
                  >
                    <v-flex xs9>
                      <div class="order-content-section">
                        <div class="order-content-container">
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
                            <div class="product-content-row pt-1">
                              <div class="product-price">
                                ${{ item.price | formatNumber }}
                              </div>

                              <div
                                class="product-count"
                                v-if="!isDigitalProduct(item)"
                              >
                                Quantity: <b>{{ item.quantity }}</b>
                              </div>
                            </div>
                          </div>
                        </div>

                        <v-spacer></v-spacer>

                        <div class="order-date">
                          {{ order.created_at | formatDate }}
                        </div>
                      </div>
                    </v-flex>

                    <v-flex xs3>
                      <div
                        class="order-status-section text-xs-center digital"
                        v-if="isDigitalProduct(item)"
                      >
                        <p class="order-status-text">
                          {{ item.product.digital_content_name }}
                        </p>
                      </div>
                      <div
                        class="order-status-section text-xs-center"
                        v-else-if="item.status == 'item_ordered'"
                      >
                        <p class="order-status-text">Pending</p>
                        <v-btn
                          class="order-status-btn ship"
                          @click.native.stop="openShipConfirmModal(item)"
                          >Ship</v-btn
                        >
                      </div>
                      <div
                        class="order-status-section text-xs-center"
                        v-else-if="item.status == 'item_shipped'"
                      >
                        <p class="order-status-text">Shipped</p>
                        <v-btn
                          class="order-status-btn shipped"
                          @click.native.stop="openUnshipConfirmModal(item)"
                          >Unship</v-btn
                        >
                      </div>
                      <div class="order-status-section text-xs-center" v-else>
                        <p class="order-status-text">Refunded</p>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </div>
            </template>

            <template v-else>
              <div class="profile-section">
                <v-layout row>
                  <div class="profile-content-section relative">
                    <div class="profile-avatar">
                      <profile-item
                        :user="order.customer"
                        :className="'order-item-profile-avatar'"
                      ></profile-item>
                    </div>
                    <div class="profile-content">
                      <a href="#" class="user-name">{{
                        order.customer.username
                      }}</a>
                      <label class="order-detail-text">
                        purchased
                        <b>${{ order.amount | formatNumber }}</b></label
                      >
                    </div>
                    <div class="profile-actions">
                      <router-link
                        :to="`/sell/order/${order.id}`"
                        class="order-detail-btn"
                        >View Order Details</router-link
                      >
                      <a
                        class="message-buyer-btn"
                        @click="showMessageDialog(order)"
                        >Message Buyer</a
                      >
                      <label class="order-date">{{
                        order.created_at | formatDate
                      }}</label>
                    </div>
                  </div>
                  <div class="status-section text-xs-center"></div>
                </v-layout>
              </div>
              <div
                v-for="item in order.items"
                :key="item.id"
                class="order-section"
              >
                <v-container grid-list-xl fill-height class="pa-0">
                  <v-layout
                    v-if="
                      activeFilterItemStatus == '' ||
                      item.status == activeFilterItemStatus
                    "
                    row
                  >
                    <v-flex xs10>
                      <div class="order-content-section relative">
                        <div
                          class="product-cover-image"
                          :style="`background-image: url(${item.product.covers[0].cover.thumb.url})`"
                        ></div>
                        <div class="product-content">
                          <v-flex sm12 class="product-content-row">
                            <label class="product-name">{{
                              item.product.name
                            }}</label>
                            <label class="product-count"
                              >Quantity: <b>{{ item.quantity }}</b></label
                            >
                          </v-flex>
                          <v-flex sm12 class="product-content-row" pt-1>
                            <label class="product-price"
                              >${{ item.price | formatNumber }}</label
                            >
                          </v-flex>
                        </div>
                      </div>
                    </v-flex>
                    <v-flex xs2>
                      <div
                        class="order-status-section text-xs-center"
                        v-if="isCollaborated(item)"
                      >
                        <p class="order-status-text">Collaborated</p>
                        <v-chip
                          label
                          outline
                          color="red"
                          v-if="item.status == 'item_ordered'"
                          >Unshipped</v-chip
                        >
                        <v-chip label outline color="blue" v-else
                          >Shipped</v-chip
                        >
                      </div>
                      <div
                        class="order-status-section text-xs-center"
                        style="background: transparent"
                        v-else
                      ></div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </div>
            </template>
          </div>
          <div class="text-xs-center">
            <v-btn
              v-show="
                order_pagination.current_page < order_pagination.total_pages
              "
              @click.native="loadOrders()"
              class="loadmore-btn"
              >Load More</v-btn
            >
          </div>
        </v-card>
      </template>

      <template v-if="active_tab == 'products'">
        <v-card flat>
          <v-layout row wrap>
            <v-flex
              v-if="
                ['artist', 'brand', 'label'].indexOf(currentUser.user_type) !=
                -1
              "
              xs12
              text-xs-right
            >
              <v-btn
                v-if="currentUser.stripe_connected"
                class="add-product-btn"
                @click.native="addProduct()"
              >
                <v-icon>add</v-icon>Add Product
              </v-btn>
              <v-btn
                v-else
                class="add-product-btn"
                to="/settings#bank-details"
              >
                Connect Stripe to Add Products
              </v-btn>
            </v-flex>
            <product-item
              v-for="(product, index) in published_products"
              :index="index"
              :key="index"
              :product="product"
              :deleteItem="openProductDeleteConfirmDialog"
            ></product-item>
          </v-layout>
        </v-card>
      </template>

      <template v-if="active_tab == 'collaborations'">
        <div
          v-if="!collaborated_products || collaborated_products.length == 0"
          class="empty-section"
        >
          <p class="empty-title">You have no product collaborations</p>
        </div>
        <v-card flat v-else>
          <v-layout row wrap class="covers-content">
            <div
              class="card-container"
              v-for="product in collaborated_products"
              :key="product.id"
            >
              <collaborate-product
                :product="product"
                :editButtonAction="editProduct"
                :deleteButtonAction="openProductDeleteConfirmDialog"
              ></collaborate-product>
            </div>
          </v-layout>
        </v-card>
      </template>

      <template v-if="active_tab == 'pendings'">
        <div
          v-if="!pending_products || pending_products.length == 0"
          class="empty-section"
        >
          <p class="empty-title">
            You have no pending product collaborations
          </p>
        </div>
        <v-card flat v-else>
          <v-layout row wrap class="covers-content">
            <div
              class="card-container"
              v-for="product in pending_products"
              :key="product.id"
            >
              <collaborate-product
                v-if="product.merchant.id == currentUser.id"
                :product="product"
                :showPromoteButton="false"
                :editButtonAction="editProduct"
                :deleteButtonAction="openProductDeleteConfirmDialog"
                :releaseButtonAction="releaseProduct"
              />
              <collaborate-product
                v-else-if="notResponded(product)"
                :product="product"
                :showPromoteButton="false"
                :acceptButtonAction="acceptCollaboration"
                :denyButtonAction="denyCollaboration"
              />
              <collaborate-product
                v-else
                :product="product"
                :showPromoteButton="false"
              />
            </div>
          </v-layout>
        </v-card>
      </template>
    </div>

    <send-message
      v-if="showSendMessage"
      :receiver="user"
      :dismiss="dismissMessageModal"
    />

    <div class="product-finish-section" v-if="show_product_finish_modal">
      <v-flex
        xs12
        sm12
        class="dismiss-section"
        @click="closeProductFinishModal()"
      ></v-flex>
      <v-layout row wrap class="popup-section">
        <v-flex xs12 class="title-section">
          <label class="title-text"
            >This product is pending release,
            <router-link to="/product/add" class="link-text"
              >upload another</router-link
            ></label
          >
        </v-flex>
        <v-flex xs12 class="promote-product-section">
          <v-flex xs12 class="header-section">
            <label class="header-text">What Next?</label>
          </v-flex>
          <div class="content-section">
            <div class="promote-product-image">
              <div
                class="promote-image"
                :style="{
                  'background-image':
                    'url(' + product.covers[0].cover.url + ')',
                }"
              ></div>
            </div>
            <div class="promote-product-description">
              <p>
                When you added collaborators accept your collaboration via
                Direct Message or Sell > Pending Collaborations, you will then
                be able to release the product.
              </p>
              <p>
                Visit Sell > Pending Collaborations to see who accepted and/or
                denied your collaboration.
              </p>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>

    <v-dialog v-model="product_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete a Product</v-card-title>
        <v-card-text
          >If you click OK, the product will no longer be available to users.
          Click OK to delete &lt;{{ product.name }}&gt;, or click
          Cancel.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="deleteProduct()"
            >Ok</v-btn
          >
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="closeProductDeleteConfirmDialog()"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_ship_confirm_modal" persistent>
      <v-form
        v-model="valid_tracking_form"
        ref="valid_tracking_form"
        lazy-valiation
      >
        <v-card>
          <v-card-title class="headline">Ship Product</v-card-title>
          <v-card-text>
            Enter shipping carrier website & tracking number<br />
            Buyer will see the tracking number in their <b>Order History</b>
            <v-text-field
              label="www.fedex.com"
              v-model="tracking_site"
              :rules="[(v) => !!v || 'Carrier website is required']"
              required
              single-line
            ></v-text-field>
            <v-text-field
              label="Enter tracking number"
              v-model="tracking_number"
              :rules="[(v) => !!v || 'Tracking number is required']"
              required
              single-line
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click.native="shipItem()" flat class="blue--text darken-1"
              >Ok</v-btn
            >
            <v-btn
              @click.native="closeShipConfirmModal()"
              flat
              class="blue--text darken-1"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="show_unship_confirm_modal" persistent>
      <v-card>
        <v-card-title class="headline">Unship Product</v-card-title>
        <v-card-text
          >If you click OK, the buyer will see the item has not been shipped.
          Click OK to mark the itme as unshipped, or click Cancel.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="unshipItem()"
            >Ok</v-btn
          >
          <v-btn
            class="blue--text darken-1"
            flat="flat"
            @click.native="closeUnshipConfirmModal()"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_help_dialog" content-class="my-dialog-2">
      <v-card>
        <v-card-title>
          <label>Sellers</label>
        </v-card-title>
        <v-card-text>
          <ul>
            <li>Sell <b>physical</b> & <b>digital</b> products.</li>
            <li>
              <b>Collaborate</b> on products with artists, brands & labels.
            </li>
            <li>
              <b>Set splits & recoup costs</b>, confirm through direct message.
            </li>
            <li>
              Automatically <b>split payments</b> for collaborative products.
            </li>
            <li>Keep<b> 90%</b> of sales.</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn
            dark
            round
            color="blue"
            @click.native="closeHelpDialog()"
            class="px-4"
            >Ok, Got it!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./sell.ctrl.js"></script>
<style src="../../../static/styles/sell.scss" lang="scss" scoped>
