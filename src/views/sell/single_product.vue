<template>
  <div class="page single-product-page mx-5">
    <!-- {{ product }} -->
    <content-top-header v-if="isPageReady" class="black-theme">
      <template slot="topHeader">
        <ul>
          <a href="/product">
          <li class="active">
              < Back
            </li>
          </a>
        </ul>
      </template>
    </content-top-header>

    <div class="page-content" v-if="isPageReady">
      <v-container grid-list-lg class="ml-0 pl-0">
        <v-layout row wrap align-start margin-top-header>
          <v-flex xs12 sm8 class="wrapFlex product-covers">
            <div class="product-container">
              <div v-if="!onMobile" class="product-side-thumbnails">
                <div
                  class="product-thumbnail"
                  :class="img === selectedCover ? 'selected' : ''"
                  v-for="(img, i) in covers"
                  :key="i"
                  @click="changeFeaturedImage(img)"
                >
                  <div
                    class="product-covers"
                    :style="{
                      'background-image': `url(${img})`,
                    }"
                  ></div>
                </div>
              </div>

              <div class="product-cover-selected">
                <div
                  class="__selected"
                  :style="{
                    'background-image': `url(${selectedCover})`,
                  }"
                ></div>
              </div>
            </div>
          </v-flex>

          <v-flex v-if="product" xs12 sm4 class="product-details">
            <div class="product-section pl-3">
              <div class="product-category">{{ productCategoryName }}</div>
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">${{ product.price * 100 | formatNumber }}</div>


              <div class="product-options">
                <!-- <div class="product-options"> -->
                <v-select
                  v-model="option"
                  :items="options"
                  item-text="name"
                  placeholder="Select option"
                  item-value="id"
                  class="large"
                  single-line
                  bottom
                  hide-details
                ></v-select>
              </div>
              <v-btn
                v-if="isAuthenticated"
                round
                block
                dark
                class="product-addTobag"
                @click="product.stock > 0 ? addToCart() : ''"
              >
                <span v-if="product.stock > -1">Add to cart</span>
                <span v-else>Out of Stock</span>
              </v-btn>

              <div class="divider-x  mt-5 mb-3"></div>

              <div class="product-merchant">
                <user-tag showAvatar class="tag" :user="product.merchant" />
              </div>

              <div class="divider-x  mt-3 mb-4"></div>

              <div v-if="isAuthenticated" class="product-actions">
                <user-follow-btn class="follow-btx" :user="user" theme="blue" type="product" borderRadius btnBlock @afterFollow="afterFollow" />


                <v-tooltip top>
                  <span slot="activator" class="__actions pl-0" @click="addToCollections()">
                    <img
                      src="../../assets/plus.svg"
                      width="20"
                      class="cursor-pointer mt-3 filter-invert"
                      
                    />
                  </span>
                  <span>Add to wishlist</span>
                </v-tooltip>
  
  
              <v-tooltip top>
                <span slot="activator" class="__actions pl-0">
                  <img
                    src="/static/images/ic_share.svg"
                    width="20"
                    class="cursor-pointer mt-3"
                    @click="share_dialog = true"
                  />
                </span>
                <span>Share</span>
              </v-tooltip>


<!-- 
              <v-tooltip top v-if="product.merchant.id !== currentUser.id">
                <span slot="activator" class="__actions">
                  <img
                    src="/static/images/ic_repost.svg"
                    width="20"
                    class="cursor-pointer mt-3"
                    @click="repostProduct"
                  />
                </span>
                <span>Repost</span>
              </v-tooltip> -->
            </div>


            </div>
          </v-flex>
          <div class="divider-x my-5"></div>
          <div class="dflex w-100">

            <v-flex xs12 sm8>
              <div class="general-heading mb-4">Description</div>
              <div class="product-description">
                {{ product.description }}
              </div>
            </v-flex>

            <v-flex xs12 sm4>
              <div class="pl-3">
                <div class="general-heading mb-4">Info</div>
                <!-- <accordion :accordions="accordions" /> -->
                <div class="info-link-container">
                  <div class="info-modal-links dflex align-center gap-15" @click="(info_dialog=true ) && (info_active_tab = 1)">
                    <div class="dflex align-center">
                      <img src="../../assets/link-icon.svg" width="16">
                    </div>
                    <div class="info-link-text">
                      Size & Fit
                    </div>
                  </div>

                    <div class="info-modal-links dflex align-center gap-15" 
                    @click="(info_dialog=true ) && (info_active_tab = 2)"
                    >
                    <div class="dflex align-center">
                      <img src="../../assets/link-icon.svg" width="16">
                    </div>
                    <div class="info-link-text">
                      Shipping Policy
                    </div>
                  </div>

                  <div class="info-modal-links dflex align-center gap-15"
                  @click="(info_dialog=true ) && (info_active_tab = 3)"
                  >
                    <div class="dflex align-center">
                      <img src="../../assets/link-icon.svg" width="16">
                    </div>
                    <div class="info-link-text">
                      Return Policy
                    </div>
                  </div>

                  <div class="info-modal-links dflex align-center gap-15"
                  @click="(info_dialog=true ) && (info_active_tab = 4)"
                  >
                    <div class="dflex align-center">
                      <img src="../../assets/link-icon.svg" width="16">
                    </div>
                    <div class="info-link-text">
                      Privacy Policy
                    </div>
                  </div>
                </div>
              </div>
            </v-flex>''
          </div>

          <div class="divider-x my-5"></div>
          <div class="w-100">
            <v-flex xs12 sm12>
              <div class="general-heading mb-4">More from this seller</div>
              <div class="">
                <v-layout class="covers-content">
                  <v-flex
                    xs12
                    sm4
                    class="card-container"
                    v-for="(product, index) in products"
                    :key="index"
                  >
                  
                    <product-card :dataObject="product" showFullOverlay></product-card>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </div>

          <div v-if="isAuthenticated" class="flex-center py-5">
            <comments :item="product" :comments="comments" :commentTableType="commentTableType" class="w-80"/>
          </div>

          <v-flex xs4>
            <!-- <div class="album-merch-section">
              <div class="d-flex justify-space-between">
                <h4 class="__title flex-none">
                  Shop {{ product.merchant.username }}
                </h4>
                <label class="link-btn flex-none" @click="goToArtistProfile()">
                  View All
                </label>
              </div>
              <div class="merch-detail-section" @click.self="showMerchDialog()">
                <div
                  class="merch-avatar"
                  :style="`background-image: url(${album.products[0].covers[0].cover.thumb.url})`"
                  @click.self="showMerchDialog()"
                ></div>
                <div class="info-section" @click.self="showMerchDialog()">
                  <label class="product-name" @click.self="showMerchDialog()">{{
                    album.products[0].name
                  }}</label>

                  <br>

                  <label class="merch-name" @click.self="showMerchDialog()">
                    {{ album.products[0].merchant.username }}
                  </label>


                  <div class="flex-space-between">
                    <label class="merch-price" @click.self="showMerchDialog()">
                      ${{ album.products[0].price | formatNumber }}
                    </label>
                    <div>
                      <img class="merch-status-icon" src="/static/images/ic_share.svg" />
                      <img class="merch-status-icon" src="/static/images/ic_repost.svg" />
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </v-flex>
        </v-layout>
      </v-container>
    </div>


        <v-dialog
        v-model="info_dialog"
        content-class="info-dialog"
      >
        <v-card>
          <v-card-title >
            <div class="general-heading w-100 mb-2">
              Info
            </div>

            <div class="dflex align-center gap-20">
              <div class="modal-head" 
              :class='(info_active_tab == 1) ? "active": null'
              @click="(info_active_tab = 1)">Size & Fit</div>
              <div class="modal-head" @click="(info_active_tab = 2)"
              :class='(info_active_tab == 2) ? "active": null'
              >Shipping policy</div>
              <div class="modal-head" @click="(info_active_tab = 3)"
              :class='(info_active_tab == 3) ? "active": null'
              >Return policy</div>
              <div class="modal-head" @click="(info_active_tab = 4)"
              :class='(info_active_tab == 4) ? "active": null'
              >Privacy policy</div>
            </div>
          
          </v-card-title>
          <v-card-text>
            <div>
              <div class="modal-body-text" v-if="(info_active_tab == 1)">
                Size and fit
              </div>

              <div class="modal-body-text" v-if="(info_active_tab == 2)">
                Shipping policy
              </div>

              <div class="modal-body-text" v-if="(info_active_tab == 3)">
                Return policy
              </div>

              <div class="modal-body-text" v-if="(info_active_tab == 4)">
                Privacy policy
              </div>


            </div>
          </v-card-text>

        </v-card>
      </v-dialog>
    
    <share-modal
      v-if="share_dialog"
      :item="product"
      :dismiss="closeShareDialog"
    />
  </div>
</template>

<script type="text/javascript" src="./single_product.ctrl.js"></script>
<style src="../../../static/styles/singleProduct.scss" lang="scss" scoped>
