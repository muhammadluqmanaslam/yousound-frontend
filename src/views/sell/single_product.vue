<template>
  <div class="page single-product-page mx-5">
    <!-- {{ product }} -->
    <content-top-header v-if="isPageReady">
      <template slot="topHeader">
        <ul>
          <li class="active">
            <label>{{ product.name }}</label>
          </li>
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
            <div class="product-section px-5">
              <div class="product-category">{{ productCategoryName }}</div>
              <div class="product-name">{{ product.name }}</div>
              <div class="product-merchant">
                <user-tag showAvatar class="tag" :user="product.merchant" />
              </div>
              <div class="product-price">${{ product.price * 100 | formatNumber }}</div>

              <div class="product-options">
                <!-- <div class="product-options"> -->
                <div class="__title">Select Option</div>
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
                <span v-if="product.stock > -1">Add to Bag</span>
                <span v-else>Out of Stock</span>
              </v-btn>

              <div class="product-description">
                {{ product.description }}
              </div>

              <div v-if="isAuthenticated" class="product-actions">
                  <user-follow-btn class="mt-3" :user="user" theme="blue" type="product" btnBlock @afterFollow="afterFollow" />

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
                </v-tooltip>
              </div>

              <accordion :accordions="accordions" />
            </div>
          </v-flex>

          <v-flex v-if="isAuthenticated" xs12 sm8>
            <comments :item="product" :comments="comments" :commentTableType="commentTableType" />
          </v-flex>

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

    
    <share-modal
      v-if="share_dialog"
      :item="product"
      :dismiss="closeShareDialog"
    />
  </div>
</template>

<script type="text/javascript" src="./single_product.ctrl.js"></script>
<style src="../../../static/styles/singleProduct.scss" lang="scss" scoped>
