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
        <v-layout row wrap align-start>
          <v-flex xs8 class="wrapFlex product-covers">
            <div class="product-container">
              <div class="product-side-thumbnails">
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

          <v-flex xs4 v-if="product" class="product-details">
            <div class="product-section px-5">
              <div class="product-category">{{ productCategoryName }}</div>
              <div class="product-name">{{ product.name }}</div>
              <div class="product-merchant">
                <div
                  class="__avatar"
                  :style="{
                    'background-image': `url(${product.merchant.avatar.thumb.url})`,
                  }"
                ></div>
                <span class="__owner">{{ product.merchant.display_name }}</span>
              </div>
              <div class="product-price">${{ product.price }}</div>

              <div class="product-options">
                <!-- <div class="product-options"> -->
                <div class="__title">Select Option</div>
                <v-select
                  v-model="option"
                  :items="options"
                  item-text="name"
                  item-value="id"
                  class="large"
                  single-line
                  bottom
                  hide-details
                ></v-select>
              </div>

              <v-btn round block dark class="product-addTobag" @click="product.stock > 0 ? addToCart() : ''">
                <span v-if="product.stock > -1">Add to Bag</span>
                <span v-else>Out of Stock</span>
              </v-btn>

              <div class="product-description">
                {{ product.description }}
              </div>

              <div class="product-actions">
                <v-tooltip top>
                  <span slot="activator" class="__actions pl-0">
                    <img
                      src="/static/images/ic_share.svg"
                      width="20"
                      class="cursor-pointer"
                    />
                  </span>
                  <span>Share</span>
                </v-tooltip>

                <v-tooltip top>
                  <span slot="activator" class="__actions">
                    <img
                      src="/static/images/ic_repost.svg"
                      width="20"
                      class="cursor-pointer"
                    />
                  </span>
                  <span>Repost</span>
                </v-tooltip>
              </div>

              <accordion :accordions="accordions" />
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script type="text/javascript" src="./single_product.ctrl.js"></script>
<style src="../../../static/styles/singleProduct.scss" lang="scss" scoped>
