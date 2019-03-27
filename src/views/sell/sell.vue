<template>
  <div row wrap class="page sell-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">Sell</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 v-if="currentUser && isPageReady">
      <div class="normal-tab">
        <v-tabs black v-model="active_tab">
          <v-tabs-bar class="transparent">
            <v-tabs-item
              v-for="tab in tabs"
              @click.native="onTab(tab.id)"
              :key="tab.id"
              :href="`#${tab.id}`"
              ripple
            >{{ tab.title }}</v-tabs-item>
            <v-tabs-slider color="black"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content key="orders" id="orders">
              <div class="orders-actions">
                <v-menu offset-y id="filter_selector" class="filter_menu" v-show="active_tab == 'orders'">
                  <v-btn slot="activator">All
                    <v-icon right>keyboard_arrow_down</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile
                      v-for="filter in filters"
                      @click.native="filterItems(filter)"
                      :key="filter.id"
                    >
                      <v-list-tile-title>{{ filter.name }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-btn dark color="green" @click.native="csvExport()">Export</v-btn>
              </div>
              <div v-if="!orderHistories || orderHistories.length == 0" class="empty-section">
                <p class="empty-title">Your have no new orders</p>
              </div>
              <v-card v-else flat class="relative">
                <v-flex
                  v-for="(order, index) in orderHistories"
                  :key="index"
                  xs12
                  class="order-item"
                >
                  <template v-if="currentUser.id == order.merchant.id">
                    <div class="profile-section">
                      <v-layout row>
                        <div class="profile-content-section relative">
                          <div class="profile-avatar">
                            <profile-item :user="order.customer" :className="'order-item-profile-avatar'"></profile-item>
                          </div>
                          <div class="profile-content">
                            <a href="#" class="user-name">{{ order.customer.display_name }}</a>
                            <label class="order-detail-text"> purchased <b>${{ order.amount|formatNumber }}</b></label>
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
                    <div
                      v-for="item in order.items"
                      v-if="filter_status == '' || item.status == filter_status"
                      class="order-section"
                    >
                      <v-layout row>
                        <div class="order-content-section relative">
                          <div class="product-cover-image" :style="`background-image: url(${item.product.covers[0].cover.thumb.url})`"></div>
                          <div class="product-content">
                            <v-flex sm12 class="product-content-row">
                              <label class="product-name">{{ item.product.name }}</label>
                              <label class="product-count" v-if="!isDigitalProduct(item)">Quantity: <b>{{ item.quantity }}</b></label>
                            </v-flex>
                            <v-flex sm12 class="product-content-row" pt-1>
                              <label class="product-price">${{ item.price|formatNumber }}</label>
                            </v-flex>
                          </div>
                        </div>
                        <div class="order-status-section text-xs-center digital" v-if="isDigitalProduct(item)">
                          <p class="order-status-text">{{ item.product.digital_content_name }}</p>
                        </div>
                        <div class="order-status-section text-xs-center" v-else-if="item.status=='item_ordered'">
                          <p class="order-status-text">Pending</p>
                          <v-btn class="order-status-btn ship" @click.native.stop="openShipConfirmModal(item)">Ship</v-btn>
                        </div>
                        <div class="order-status-section text-xs-center" v-else>
                          <p class="order-status-text">Shipped</p>
                          <v-btn class="order-status-btn shipped" @click.native.stop="openUnshipConfirmModal(item)">Unship</v-btn>
                        </div>
                      </v-layout>
                    </div>
                  </template>
                  <template v-else>
                    <div class="profile-section">
                      <v-layout row>
                        <div class="profile-content-section relative">
                          <div class="profile-avatar">
                            <profile-item :user="order.customer" :className="'order-item-profile-avatar'"></profile-item>
                          </div>
                          <div class="profile-content">
                            <a href="#" class="user-name">{{ order.customer.display_name }}</a>
                            <label class="order-detail-text"> purchased <b>${{ order.amount|formatNumber }}</b></label>
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
                    <div class="order-section" v-for="item in order.items" v-if="filter_status == '' || item.status == filter_status">
                      <v-layout row>
                        <div class="order-content-section relative">
                          <div class="product-cover-image" :style="`background-image: url(${item.product.covers[0].cover.thumb.url})`"></div>
                          <div class="product-content">
                            <v-flex sm12 class="product-content-row">
                              <label class="product-name">{{ item.product.name }}</label>
                              <label class="product-count">Quantity: <b>{{ item.quantity }}</b></label>
                            </v-flex>
                            <v-flex sm12 class="product-content-row" pt-1>
                              <label class="product-price">${{ item.price|formatNumber }}</label>
                            </v-flex>
                          </div>
                        </div>
                        <div class="order-status-section text-xs-center" v-if="isCollaborated(item)">
                          <p class="order-status-text">Collaborated</p>
                          <v-chip label outline color="red" v-if="item.status == 'item_ordered'">Unshipped</v-chip>
                          <v-chip label outline color="blue" v-else>Shipped</v-chip>
                        </div>
                        <div class="order-status-section text-xs-center" style="background: transparent;" v-else></div>
                      </v-layout>
                    </div>
                  </template>
                </v-flex>
              </v-card>
            </v-tabs-content>

            <v-tabs-content key="products" id="products">
              <v-card flat>
                <v-layout row wrap>
                  <v-flex xs12 v-if="['artist', 'brand', 'label'].indexOf(currentUser.user_type)!=-1">
                    <v-btn class="add-product-btn" @click.native="addProduct()">
                      <v-icon>add</v-icon>Add Product
                    </v-btn>
                  </v-flex>
                  <product-item v-for="(product, index) in published_products"
                    :index="index"
                    :key="index"
                    :product="product"
                    :deleteItem="openProductDeleteConfirmDialog"></product-item>
                </v-layout>
              </v-card>
            </v-tabs-content>

            <v-tabs-content key="collaborations" id="collaborations">
              <div v-if="!collaborated_products || collaborated_products.length == 0" class="empty-section">
                <p class="empty-title">Your have no product collaborations</p>
              </div>
              <v-card flat v-else>
                <v-layout row wrap class="covers-content">
                  <div class="card-container" v-for="product in collaborated_products" :key="product.id">
                    <collaborate-product
                      :product="product"
                      :editButtonAction="editProduct"
                      :deleteButtonAction="openProductDeleteConfirmDialog"></collaborate-product>
                  </div>
                </v-layout>
              </v-card>
            </v-tabs-content>

            <v-tabs-content key="pendings" id="pendings">
              <div v-if="!pending_products || pending_products.length == 0" class="empty-section">
                <p class="empty-title">Your have no pending product collaborations</p>
              </div>
              <v-card flat v-else>
                <v-layout row wrap class="covers-content">
                  <div class="card-container" v-for="product in pending_products" :key="product.id">
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
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </div>
    </v-flex>

    <send-message
      v-if="showSendMessage"
      :receiver="user"
      :dismiss="dismissMessageModal"
    />

    <div class="product-finish-section" v-if="show_product_finish_modal">
      <v-flex xs12 sm12 class="dismiss-section" @click="closeProductFinishModal()"></v-flex>
      <v-layout row wrap class="popup-section">
        <v-flex xs12 class="title-section">
          <label class="title-text">This product is pending release, <router-link to="/product/add" class="link-text">upload another</router-link></label>
        </v-flex>
        <v-flex xs12 class="promote-product-section">
          <v-flex xs12 class="header-section">
            <label class="header-text">What Next?</label>
          </v-flex>
          <div class="content-section">
            <div class="promote-product-image">
              <div class="promote-image" :style="{'background-image': 'url(' + product.covers[0].cover.url + ')'}"></div>
            </div>
            <div class="promote-product-description">
              <p>When you added collaborators accept your collaboration via Direct Message or Sell > Pending Collaborations, you will then be able to release the product.</p>
              <p>Visit Sell > Pending Collaborations to see who accepted and/or denied your collaboration.</p>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>

    <v-dialog v-model="product_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete a Product</v-card-title>
        <v-card-text>If you click OK, the product will no longer be available to users. Click OK to delete &lt;{{ product.name }}&gt;, or click Cancel.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="deleteProduct()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="closeProductDeleteConfirmDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_ship_confirm_modal" persistent>
      <v-form v-model="valid_tracking_form" ref="valid_tracking_form" lazy-valiation>
        <v-card>
          <v-card-title class="headline">Ship Product</v-card-title>
          <v-card-text>
            Enter shipping carrier website & tracking number<br>
            Buyer will see the tracking number in their <b>Order History</b>
            <v-text-field
              label='www.fedex.com'
              v-model="tracking_site"
              :rules="[v => !!v || 'Carrier website is required']"
              required
              single-line
            ></v-text-field>
            <v-text-field
              label='Enter tracking number'
              v-model="tracking_number"
              :rules="[v => !!v || 'Tracking number is required']"
              required
              single-line
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click.native="shipItem()"
              flat
              class="blue--text darken-1"
            >Ok</v-btn>
            <v-btn
              @click.native="closeShipConfirmModal()"
              flat
              class="blue--text darken-1"
            >Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="show_unship_confirm_modal" persistent>
      <v-card>
        <v-card-title class="headline">Unship Product</v-card-title>
        <v-card-text>If you click OK, the buyer will see the item has not been shipped. Click OK to mark the itme as unshipped, or click Cancel.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="unshipItem()">Ok</v-btn>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="closeUnshipConfirmModal()">Cancel</v-btn>
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
            <li><b>Collaborate</b> on products with artists, brands & labels.</li>
            <li><b>Set percentages & recoup costs</b>, confirm through direct message</li>
            <li>Split payments from sales automatically.</li>
            <li>Keep<b> 90%</b> of sales.</li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn dark round color="blue" @click.native="closeHelpDialog()" class="px-4">Ok, Got it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./sell.ctrl.js"></script>
