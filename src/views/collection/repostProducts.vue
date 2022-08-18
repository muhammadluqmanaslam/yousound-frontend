<template>
  <div class="repost-comp repost-products">
    <div class="_top mb-3">
      {{ products.length }} {{ "product" | pluralize(products.length) }}
    </div>

    <div
      class="
        list-track-view list-track-view-trackCard list-track-view-video
        listings
      "
    >
      <div
        v-for="(product, index) in products"
        :key="index"
        class="list-track-view-item listing cursor-none"
      >
        <product-card
          :dataObject="tempProduct"
          sideTabView
          hideOverlay
          hideOptionCount
          altMeta
          noMeta
          altMetaPrice
        />

        <div class="d-none list-track-view-action listing-action">
          <span class="share" @click="shareProduct(product)">
            <img :src="require('@/assets/ic_share.svg')" alt="share icon" />
          </span>
          <span class="add">
            <v-icon>add</v-icon>
          </span>
          <span class="more">
            <v-icon>more_horiz</v-icon>
          </span>
        </div>
      </div>
    </div>

    <share-modal
      v-if="share_dialog"
      :item="sharedProduct"
      type="Stream"
      :dismiss="closeShareProduct"
    />
  </div>
</template>

<script>
import shareModal from "@/components/sharemodal";
import productCard from "@/components/productcard";

export default {
  components: {
    shareModal,
    productCard,
  },
  data() {
    return {
      products: [1, 2, 3, 4],
      share_dialog: false,
      sharedProduct: {},
    };
  },
  methods: {
    shareProduct(product) {
      this.sharedProduct = this.tempProduct;
      this.share_dialog = true;
    },
    closeShareProduct(tab) {
      this.share_dialog = false;
      this.sharedProduct = {};
    },
  },
  computed: {
    tempProduct() {
      return {
        id: 2,
        name: "Hip Hop Playing Cards Vol.1",
        description: "East vs. West",
        price: 1000,
        reposted: 0,
        stock: 500,
        sold: 0,
        stock_status: "active",
        collaborators_count: 0,
        show_status: "show_all",
        tax_percent: "0.0",
        is_vat: false,
        seller_location: null,
        status: "published",
        created_at: "2018-02-11T01:39:42.213Z",
        collaborators: [],
        creator_share: 100,
        creator_recoup_cost: 0,
        digital_content_name: null,
        merchant: {
          id: 26,
          slug: "testartist1",
          username: "testartist1",
          display_name: "Hudson Mohawke",
          first_name: null,
          last_name: null,
          contact_url: null,
          user_type: "listener",
          avatar: {
            url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/26/e296aa7c-5107-47a1-8eea-e9813097ed37.jpg",
            thumb: {
              url: "https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/26/thumb_e296aa7c-5107-47a1-8eea-e9813097ed37.jpg",
            },
          },
          repost_price: 100,
          repost_price_end_at: null,
          max_repost_price: 100,
          status: "active",
          size_chart: "",
          shipping_policy: "",
          return_policy: "",
          privacy_policy: "",
          followers: 2,
          followings: 2,
          stripe_connected: false,
          stripe_customer_id: null,
          stripe_subscription_id: null,
          phone_number: null,
          masked_phone_number: null,
          age_group: "",
          social_provider: null,
          is_following: true,
          invited_at: null,
          social_user_name: null,
          request_role: null,
          request_status: null,
          country: "",
          city: "",
        },
        category: {
          id: 13,
          name: "Other",
          description: null,
          is_digital: false,
        },
        variants: [
          {
            id: 4,
            name: "Cards",
            price: 1000,
            quantity: 500,
          },
        ],
        shipments: [
          {
            id: 11,
            country: "United States",
            shipment_alone_price: 500,
            shipment_with_price: 200,
          },
        ],
        covers: [
          {
            id: 14,
            cover: {
              url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/14/6490ecfc-b39f-4524-b1d5-60d31063871e.jpg",
              large: {
                url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/14/large_6490ecfc-b39f-4524-b1d5-60d31063871e.jpg",
              },
              thumb: {
                url: "https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/14/thumb_6490ecfc-b39f-4524-b1d5-60d31063871e.jpg",
              },
            },
            position: 0,
          },
          {
            id: 15,
            cover: {
              url: null,
              large: {
                url: null,
              },
              thumb: {
                url: null,
              },
            },
            position: 1,
          },
          {
            id: 16,
            cover: {
              url: null,
              large: {
                url: null,
              },
              thumb: {
                url: null,
              },
            },
            position: 2,
          },
        ],
      };
    },
  },
};
</script>

<style>
</style>