<template>
  <div class="page single-product-page onMobile mx-5">

    <div class="page-content" v-if="isPageReady">
      <div class="product-covers">
        <v-carousel hide-controls hide-delimiters :cycle="false">
          <v-carousel-item
            v-for="(item,i) in covers"
            :key="i"
            :src="item"
            transition="fade"
            reverse-transition="fade"
          ></v-carousel-item>
        </v-carousel>
      </div>

      <div class="pane-tabs-onMobile">
        <div
          v-for="(tab, index) in paneTabs"
          :key="index"
          class="pane-tab"
          :class="{active: activePaneTab == tab.id}"
          @click="activePaneTab = tab.id"
        >
          {{ tab.name }} <span v-if="tab.id == 'comments'">({{ comments.length | formatLargeNumber }})</span>
        </div>
      </div>

      <div class="pb-5">
        <div v-if="activePaneTab == 'details'" class="details-wrapper">
          <div class="user-details dflex align-start _section pa-3">
            <user-tag showAvatar hideName hideTick :user="product.merchant" width="50" height="50" class="tag" />
            <div>
              <div class="mt-0 _details">
                {{ product.description }}
              </div>
              <div>
                <b class="text-capitalize mt-2">{{ product.merchant.username }}</b>
              </div>
            </div>
          </div>

          <div class="dflex align-center justify-space-between _section pa-3">
            <div class="product-price ma-0">${{ product.price * 100 | formatNumber }}</div>
            <div class="product-cat">{{ productCategoryName }}</div>
          </div>

          <div class="product-actions _section mt-0 pa-3">
            <v-btn
              v-if="product.merchant.id != currentUser.id"
              class="follow-btn"
              :class="{
                follow: !product.merchant.is_following,
                following: product.merchant.is_following,
              }"
              @mouseenter="buttonHover = true"
              @mouseleave="buttonHover = false"
              @click.native="followUser()"
            >
              {{ followButtonText }}
            </v-btn>

            <v-tooltip top v-if="product.merchant.id !== currentUser.id">
              <span slot="activator" class="__actions">
                <img
                  src="/static/images/ic_repost.svg"
                  width="20"
                  class="cursor-pointer"
                  @click="repostProduct()"
                />
              </span>
              <span>Repost</span>
            </v-tooltip>

            <v-tooltip top>
              <span slot="activator" class="__actions pl-0">
                <img
                  src="/static/images/ic_share.svg"
                  width="20"
                  class="cursor-pointer"
                  @click="share_dialog = true"
                />
              </span>
              <span>Share</span>
            </v-tooltip>
          </div>

          <div class="variants _section pa-3">
            <v-radio-group v-model="option" :mandatory="false" hide-details class="py-0">
              <v-radio
                v-for="(option, index) in options"
                :key="index"
                :label="option.name"
                :value="option.id"
              ></v-radio>
            </v-radio-group>
          </div>

          <div class="quantity dflex align-center justify-center">
            <v-btn
             fab 
             flat
             :ripple="false"
             @click="toggleQuantity('remove')"
            >
              <v-icon>remove</v-icon>
            </v-btn>

            <div class="quantity-count">{{ quantity }}</div>

            <v-btn
             fab 
             flat
             :ripple="false"
             @click="toggleQuantity('add')"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </div>
        </div>

        <div v-if="activePaneTab == 'comments'" class="comments pa-3">
            <comments :item="product" :comments="comments" roundAvatar roundInput aviHeight="40" aviWidth="40" />
        </div>
        
        <div v-if="activePaneTab == 'details'" class="product-section px-5">
          <v-btn
            round
            block
            class="product-addTobag black white--text"
            :disabled="product.stock < 1 || quantity < 1"
            @click="product.stock > 0 ? addToCart() : ''"
          >
            <span v-if="product.stock > -1">Add to Cart</span>
            <span v-else>Out of Stock</span>
          </v-btn>
        </div>
      </div>
    </div>

    
    <share-modal
      v-if="share_dialog"
      :item="product"
      :dismiss="closeShareDialog"
    />
  </div>
</template>

<script type="text/javascript" src="./single_product.ctrl.js"></script>
<style src="../../../../static/styles/singleProduct.scss" lang="scss" scoped>
