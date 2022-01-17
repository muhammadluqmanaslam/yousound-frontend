<template>
  <v-flex xs12 sm12 class="merch-section single-product-page" id="carousel-view">
    <v-layout row wrap class="dismiss-section" @click="dismiss()"></v-layout>
    <div row wrap class="popup-section">
      <v-container grid-list-lg class="ml-0 pl-0">
        <v-layout row wrap align-start>
          <v-flex xs12 sm7 class="wrapFlex product-covers">
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

          <v-flex xs12 sm5 v-if="item" class="product-details">
            <div class="product-section px-5">
              <div class="product-category">{{ productCategoryName }}</div>
              <div class="product-name">{{ item.name }}</div>
              <div class="product-merchant">
                <user-tag showAvatar class="tag" :user="item.merchant" />
              </div>
              <div class="product-price">${{ item.price * 100 | formatNumber }}</div>

              <div class="product-actions">
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

                <v-tooltip top>
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

                <div
                  class="mt-3"
                >
                  <router-link
                    class="black--text"
                    :to="{
                          name: 'SingleProduct',
                          params: { id: item.id }
                          }
                    "
                  >
                    <b>View product page</b>
                  </router-link>
                </div>
              </div>

              <div class="product-description">
                {{ item.description }}
              </div>

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

              <v-btn
                round
                block
                dark
                class="product-addTobag"
                @click="item.stock > 0 ? addToCart() : ''"
              >
                <span v-if="item.stock > -1">Add to Bag</span>
                <span v-else>Out of Stock</span>
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-flex>
</template>

<style src="../../static/styles/singleProduct.scss" lang="scss" scoped></style>
<style lang="stylus">
#carousel-view {
  .fade {
    &-enter-active, &-leave-active, &-leave-to {
      transition: 0.5s ease-out;
      position: absolute;
      top: 0;
      left: 0;
    }

    &-enter, &-leave, &-leave-to {
      opacity: 0;
    }
  }
}
</style>

<script type="text/javascript">
import _ from "lodash";
import profileItem from "@/components/profileitem";
import ItemService from "@/services/item";
import ProductService from "@/services/product";
import UserTag from '@/components/user_tag'

export default {
  components: {
    profileItem,
    UserTag,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
    shareProduct: {
      type: Function,
    },
    dismiss: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedCover: null,
      product_categories: [],
      buttonHover: false,
      option: null,
      showPolicySection: false,
    };
  },

  computed: {
    initImgSelection() {
      console.log(this.covers)
      return this.covers[0]
    },
    covers() {
      let imgs = this.item.covers || []
      let covers = []
      imgs.forEach((img) => {
        if (img.cover.url) {
          covers.push(img.cover.url)
        }
      })

      // imgs = [
      //   'https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/125/523b9cda-b1a7-4cf0-9fe2-619c63a15f34.jpg',
      //   'https://d19mruzykfu6hg.cloudfront.net/uploads/album/cover/42/b5fe3a4c-4221-402d-ab22-4b1a52e474ac.jpg',
      //   'https://d19mruzykfu6hg.cloudfront.net/uploads/album/cover/33/73c40199-a5ac-463e-9154-09581f92c987.jpg',
      // ]

      // return imgs
      return covers
    },
    user() {
      if (this.item.slug) {
        return this.item.user
      } else {
        return this.item.merchant
      }
    },
    currentUser() {
      return this.$store.state.auth.user
    },
    productCategoryName() {
      return _.get(
          _.find(
              this.product_categories,
              (pc) => pc.id === this.item.category
          ),
          'name',
          ''
      )
    },
    policyButtonText() {
      return this.showPolicySection ? "Close" : "Size Chart & Seller Policies";
    },

    isDigitalProduct() {
      return _.get(this.item, "category.is_digital", false);
    },

    options() {
      var options = [];
      // const defaultOption = {
      //   id: '',
      //   name: '-----'
      // }
      // options.push(defaultOption)
      for (let index in this.item.variants) {
        const variant = this.item.variants[index];
        if (this.isDigitalProduct || variant.quantity > 0) {
          const option = {
            id: variant.id,
            name: variant.name,
          };
          options.push(option);
        }
      }
      return options;
    },

    price() {
      if (this.option !== "") {
        for (let index in this.item.variants) {
          const variant = this.item.variants[index];
          if (variant.id === this.option) {
            return variant.price;
          }
        }
      }
      return this.item.price;
    },

    canAdd() {
      const stripe_connected = _.get(
        this.item,
        "merchant.stripe_connected",
        false
      );
      const product_stock_status = _.get(this.item, "stock_status", "inactive");
      return (
        this.option === "" ||
        this.option === null ||
        !stripe_connected ||
        product_stock_status !== "active"
      );
    },
  },

  created() {
    // this.option = _.get(_.find(this.item.variants, (v) => (v.quantity > 0)), 'id', null)
    this.option = _.get(this.options, "[0].id", null);
  },

  watch: {
    initImgSelection: {
      handler(newVal, oldVal) {
        this.selectedCover = newVal
      },
      immediate: true,
    },
  },

  methods: {
    changeFeaturedImage(img) {
      if (this.selectedCover == null) {
        this.selectedCover = this.initImgSelection
      } else {
        this.selectedCover = img
      }
    },

    addToCart() {
      if (this.option === "" || this.option === null) {
        this.$store.dispatch("error/showErrorToast", [
          "Please select valid variant.",
        ]);
      } else {
        let pageTrack = "";
        if (this.$store.state.streamPlayer.frame_mode === "full") {
          const streamId = _.get(
            this.$store.state.streamPlayer.stream,
            "id",
            ""
          );
          if (streamId !== "") {
            pageTrack = "Stream: " + streamId;
          }
        }
        const params = {
          product_variant_id: this.option,
          quantity: 1,
          page_track: pageTrack,
        };
        ItemService.addToCart(params)
          .then((response) => {
            if (response.body.errors) {
              this.$store.dispatch(
                "error/showErrorToast",
                response.body.errors
              );
            } else {
              this.dismiss();
              this.$store.dispatch("error/showSuccessToast", [
                "Added successfully to Cart.",
              ]);
            }
          })
          .catch((e) => {
            this.$store.dispatch(
              "error/showErrorToast",
              e.body.errors || [e.body]
            );
          });
      }
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

    togglePolicy() {
      this.showPolicySection = !this.showPolicySection;
    },

    zoomOut() {
      console.log("test");
    },
  },
};
</script>
