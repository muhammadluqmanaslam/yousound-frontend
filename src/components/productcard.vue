<template>
  <v-flex
    class="product-card"
    :class="{ 'side-tab-view': sideTabView, 'px-0': onMobile }"
  >
    <v-flex
      @mouseenter="is_component_hover = true"
      @mouseleave="is_component_hover = false"
      xs12
      pa-0
      class="product-info"
    >
      <v-flex xs12 class="product-cover" :class="{ 'px-0': onMobile }">
        <p class="product-price">${{ item.price | formatNumber }}</p>
        <div
          class="product-image"
          :style="{
            'background-image': 'url(' + item.covers[0].cover.url + ')',
          }"
        >
          <div
           
            class="full-overlay"
            @click="
              currentUser !== null ? $router.push({ name: 'SingleProduct', params: { id: item.id } }) : spotlightVideo()
            "
          >
            <div class="hover-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="artist-name">{{ item.merchant.username }}</div>
            </div>
            <div class="mt-3 dflex justify-space-between align-center w-100">
              <div class="items-price">${{ item.price | formatNumber }}</div>
              <div class="item-plus"><img src="../assets/plus.svg" width="15px"></div>
            </div>
          </div>
        </div>
        <v-flex
          v-if="currentUser && !hideOverlay"
          xs12
          class="product-actions"
          relative
          @click="
            currentUser !== null ? $router.push({ name: 'SingleProduct', params: { id: item.id } }) : spotlightVideo()
          "
        >
          <div class="product-label">${{ item.price | formatNumber }}</div>
          <!-- <v-flex xs12 class="touch-flex"></v-flex> -->
          <span v-if="!hideMoreOptions">
            <v-menu v-if="willMenuRender" offset-y class="product-menu">
              <v-btn dark slot="activator" @click="is_menu_hover = true">
                <v-icon right>more_horiz</v-icon>
              </v-btn>
              <v-list>
                <!-- <v-list-tile
                    v-if="item.merchant.id != currentUser.id"
                    @click.native="repostProduct()"
                  >
                    <v-list-tile-title class="product-menu-item">
                      <img class="product-status-icon" src="/static/images/ic_repeat.png" />
                      <label>Repost</label>
                    </v-list-tile-title>
                  </v-list-tile> -->
                <v-list-tile
                  v-if="item.merchant.id != currentUser.id"
                  @click.native="openHideDialog()"
                  class="default-menu-item track-menu-item"
                >
                  <v-list-tile-title>
                    <!-- <v-icon>visibility_off</v-icon> -->
                    <label>Hide</label>
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </span>
        </v-flex>
      </v-flex>

      <div @click="currentUser !== null ? $router.push({ name: 'SingleProduct', params: { id: item.id } }) : spotlightVideo()">
        <v-flex v-if="!noMeta" xs12 class="product-detail" pa-0>
          
          <p
            class="product-name cursor-pointer"
            @click="
              currentUser !== null ? $router.push({ name: 'SingleProduct', params: { id: item.id } }) : spotlightVideo()
            "
          >
            {{ item.name }}
          </p>
          <user-tag class="tag" :user="item.merchant" />
          <!-- <div v-if="!hideOptionCount" class="product-options-count">
            <span>{{ item.variants.length }} Option</span>
            <span v-if="item.variants.length > 1">s</span>
          </div> -->
          <!-- <p class="product-price">${{ item.price | formatNumber }}</p> -->
          <!-- <p class="product-user-name">
            <router-link :to="'/' + owner.slug" v-if="item.collaborators_count == 0">{{ owner.username }}</router-link>
            <template v-else-if="item.collaborators_count == 1">
              <router-link :to="'/' + owner.slug">{{ owner.username }}</router-link>,&nbsp;
              <router-link :to="'/' + item.collaborators[0].user.slug" v-if="item.collaborators[0]">{{ item.collaborators[0].user.username }}</router-link>
            </template>
            <router-link :to="'/' + owner.slug" v-else>Multiple Collaborators</router-link>
          </p> -->
        </v-flex>
      </div>

      <div v-if="altMeta" class="mt-2 box__footer alt-meta">
        <div class="alt-meta-name">{{ item.name }}</div>
        <div class="alt-meta-user">
          <b class="text-capitalize">{{ item.merchant.username }}</b>
        </div>
        <div v-if="altMetaPrice" class="alt-meta-price">
          <b class="text-capitalize">${{ item.price | formatNumber }}</b>
        </div>
      </div>
    </v-flex>

    <merch-modal
      v-if="showMerchModal"
      :item="item"
      :dismiss="closeMerchDialog"
      :shareProduct="openShareDialog"
    />

    <share-modal
      v-if="showShareModal"
      :item="item"
      :dismiss="closeShareDialog"
    />

    <v-dialog
      v-if="show_hide_dialog"
      v-model="show_hide_dialog"
      content-class="my-dialog-1"
    >
      <v-card>
        <v-card-media
          :src="item.covers[0].cover.url"
          height="125px"
          contain
        ></v-card-media>
        <v-card-text>
          <div class="headline">
            Are you sure you want to hide this product?
          </div>
          <div>
            You won't be able to see it anymore, unless you visit the artists
            profile or download the song.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn dark color="grey" @click.native="show_hide_dialog = false"
            >No, cancel please!</v-btn
          >
          <v-btn dark color="red" @click.native="hideProduct()"
            >Yes, hide it!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="show_logout_modal" content-class="logout-modal">
      <logoutModal />
    </v-dialog>
  </v-flex>
</template>

<script type="text/javascript">
import merchModal from "@/components/merchmodal";
import profileItem from "@/components/profileitem";
import ProductService from "@/services/product";
import shareModal from "@/components/sharemodal";
import UserTag from "@/components/user_tag";
import logoutModal from '../views/LogoutModal'

export default {
  components: {
    merchModal,
    shareModal,
    profileItem,
    UserTag,
    logoutModal,
  },

  props: {
    altMetaPrice: Boolean,
    altMeta: {
      type: Boolean,
      default: false,
    },
    noMeta: {
      type: Boolean,
      default: false,
    },
    hideOptionCount: {
      type: Boolean,
      default: false,
    },
    hideMoreOptions: {
      type: Boolean,
      default: false,
    },
    hideOverlay: {
      type: Boolean,
      default: false,
    },
    dataObject: {
      type: Object,
    },
    hideButtonAction: {
      type: Function,
    },
    sideTabView: {
      type: Boolean,
    },
    showFullOverlay: Boolean,
  },

  data() {
    return {
      showMerchModal: false,
      showShareModal: false,
      show_hide_dialog: false,
      is_component_hover: false,
      is_menu_hover: false,
      show_logout_modal: false,
    };
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user;
    },

    willMenuRender() {
      // console.log('willMenuRender', this.item.id, this.is_component_hover, this.is_menu_hover)
      return this.is_menu_hover || this.is_component_hover;
    },

    // publisher() {
    //   if (this.dataObject.assoc_type) {
    //     return this.dataObject.publisher
    //   } else {
    //     return this.dataObject.merchant
    //   }
    // },

    item() {
      if (this.dataObject.assoc_type) {
        return this.dataObject.assoc;
      } else {
        return this.dataObject;
      }
    },

    owner() {
      if (this.dataObject.assoc_type) {
        return this.dataObject.assoc.merchant;
      } else {
        return this.dataObject.merchant;
      }
    },
  },

  methods: {
    spotlightVideo() {
      this.show_logout_modal = true
    },

    openMerchDialog() {
      this.showMerchModal = true;
    },

    closeMerchDialog() {
      this.showMerchModal = false;
    },

    openShareDialog() {
      this.showMerchModal = false;
      this.showShareModal = true;
    },

    closeShareDialog() {
      this.showShareModal = false;
    },

    openHideDialog() {
      this.menu = false;
      this.submenu = false;
      this.show_hide_dialog = true;
    },

    hideProduct() {
      this.menu = false;
      this.submenu = false;
      this.show_hide_dialog = false;

      ProductService.hideProduct(this.item.id)
        .then((response) => {
          this.$store.dispatch("error/showSuccessToast", [
            "You just hid " + this.item.name,
          ]);
          if (this.hideButtonAction) {
            this.hideButtonAction(this.objects[this.objectIndex]);
          }
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
    },

    repostProduct() {
      ProductService.repostProduct(this.item.id)
        .then((response) => {
          if (response.body.errors) {
            this.$store.dispatch("error/showErrorToast", response.body.errors);
          } else {
            this.$store.dispatch("error/showSuccessToast", [
              "You just reposted " + this.item.name,
            ]);
          }
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
    },
  },

  created() {},

  mounted() {},
};
</script>
