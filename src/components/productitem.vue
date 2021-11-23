<template>
  <v-flex xs12 class="product-item">
    <promote-modal v-if="showPromoteMessage"
      :item="product"
      :dismiss="dismissPromoteModal"
      :success="saveAndFinish"></promote-modal>

    <v-flex sm12 product-content-section pa-0 relative>
      <div class="product-image" :style="{'background-image': 'url(' + product.covers[0].cover.thumb.url + ')'}"/></div>
      <div class="product-content">
        <v-flex sm12 class="product-content-row" pr-0>
          <label class="product-name">{{ product.name }}</label>

          <label class="product-count product-status" v-if="product.stock_status=='active'">{{ product.stock_status }} <v-icon :class="product.stock_status">done</v-icon></label>
          <label class="product-count product-status" v-else>{{ product.stock_status }} <v-icon :class="product.stock_status">done</v-icon></label>

          <label class="product-count product-sold-count">Sold: <b>{{ product.sold }}</b></label>
          <label class="product-count product-stock-count">In Stock: <b>{{ product.stock }}</b></label>
        </v-flex>
        <v-flex sm12 class="product-content-row" pt-1>
          <label class="product-price">${{ product.price | formatNumber }}</label>

          <template v-if="$store.state.auth.user.id==product.merchant.id">
            <v-btn class="text-btn pr-1" @click.native.stop="deleteItem(product)">Delete</v-btn>
            <!-- <label class="btn-divider"></label>
            <v-btn class="text-btn" @click.native="showPromoteModal()" v-if="showPromoteButton">Promote</v-btn> -->
            <label class="btn-divider" v-if="showPromoteButton"></label>
            <v-btn class="text-btn" @click.native="editProduct()">Edit</v-btn>
            <label class="btn-divider"></label>
          </template>
          <template v-else>
            <v-btn class="text-btn" v-if="denyItem" @click.native="denyItem(product)">Deny</v-btn>
            <label class="btn-divider" v-if="denyItem"></label>
            <v-btn class="text-btn" v-if="acceptItem" @click.native="acceptItem(product)">Accept</v-btn>
            <label class="btn-divider" v-if="acceptItem"></label>
          </template>

          <label class="product-category-text" v-if="status && status != ''">{{ status }}</label>
          <label class="btn-divider" v-if="status && status != ''"></label>
          <label class="product-category-text">Category: {{ product.category ? product.category.name : '' }}</label>
        </v-flex>
      </div>
    </v-flex>
    <v-flex v-if="product.collaborators.length > 0" sm12 collaborator-content-section>
      <div>
        <div class="app-bold">Collaborators</div>
        <div class="collaborator-content">
          <div v-for="(collaborator, i) in product.collaborators" :key="i">
            {{ collaborator.user.username }}
            <span v-if="$store.state.auth.user.username === collaborator.user.username">
              (owner)
            </span>
          </div>

          <v-btn v-if="product.status == 'pending'" depressed dark class="action-btn release" @click.native="releaseButtonAction(product)">Release Now</v-btn>
        </div>
      </div>
    </v-flex>
  </v-flex>
</template>

<script type="text/javascript">
/* global $:true */
// import ProductService from '@/services/product'
import promoteModal from "@/components/promotemodal";

export default {
  components: {
    promoteModal,
  },

  props: {
    product: {
      type: Object,
    },

    index: {
      type: Number,
    },

    acceptItem: {
      type: Function,
    },

    denyItem: {
      type: Function,
    },

    deleteItem: {
      type: Function,
    },

    status: {
      type: String,
    },

    showPromoteButton: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      showPromoteMessage: false,
      dialog: false,
    };
  },

  computed: {
    count() {
      var count = 0;
      for (let index in this.product.variants) {
        const variant = this.product.variants[index];
        count += variant.quantity;
      }
      return count;
    },
  },

  created() {},

  methods: {
    editProduct() {
      this.$router.push({ path: "/product/edit/" + this.product.id });
    },

    showPromoteModal() {
      this.showPromoteMessage = true;
      $("body").css("overflow", "scroll");
    },

    dismissPromoteModal() {
      this.showPromoteMessage = false;
      $("body").css("overflow", "scroll");
    },

    saveAndFinish(users) {
      $("body").css("overflow", "scroll");
      this.showPromoteMessage = false;
    },
  },

  mounted() {},
};
</script>
