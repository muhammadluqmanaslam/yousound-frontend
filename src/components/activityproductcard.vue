<template>
  <v-flex class="activity-product-card">
    <v-flex xs12 class="product-info" pa-0>
      <!-- <v-flex xs12 class="product-user" pa-0>
        <profile-item :user="publisher" :className="'product-user-avatar'"></profile-item>
        <router-link :to="'/' + publisher.slug"><p class="product-user-name">{{ publisher.display_name }}</p></router-link>
        <div class="product-posted-at">
          <img class="product-status-icon" src="/static/images/ic_repeat.png" /><label>reposted 10min ago</label>
        </div>
      </v-flex> -->
      <v-flex xs12 class="product-cover">
        <!-- <p class="product-price" v-if="priceShow">${{ item.price | formatNumber }}</p> -->
        <div class="product-image" :style="{'background-image': 'url(' + item.covers[0].cover.thumb.url + ')'}"/></div>
        <v-flex
          v-if="priceShow"
          xs12
          relative
          class="product-actions"
        >
          <v-flex xs12 class="touch-flex" @click="showMerchModal=true"></v-flex>
        </v-flex>
      </v-flex>
    </v-flex>

    <!-- <v-btn depressed v-if="priceShow">
      <img width="12px" src="/static/images/ic_cart-2.svg">
    </v-btn> -->

    <merch-modal
      v-if="showMerchModal"
      :item="item"
      :dismiss="dimissMerchModal"
    />
  </v-flex>
</template>

<script type="text/javascript">
import merchModal from '@/components/merchmodal'
import profileItem from '@/components/profileitem'
import ProductService from '@/services/product'

export default {
  components: {
    merchModal,
    profileItem,
  },

  props: {
    object: {
      type: Object,
    },

    priceShow: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      dialog: false,
      showMerchModal: false,
    }
  },

  computed: {
    item() {
      if (this.object.assoc_type) {
        return this.object.assoc
      } else {
        return this.object
      }
    },

    // isShowUserInfo() {
    //   if (this.$store.state.navigator.current.page === 'feed') {
    //     return true
    //   } else {
    //     return false
    //   }
    // },

    // publisher() {
    //   if (this.object.assoc_type) {
    //     return this.object.publisher
    //   } else {
    //     return this.object.user
    //   }
    // },

    // owner() {
    //   if (this.object.assoc_type) {
    //     return this.object.assoc.merchant
    //   } else {
    //     return this.object.merchant
    //   }
    // }
  },

  created() {
  },

  methods: {
    dimissMerchModal() {
      this.showMerchModal = false
    },

    showModal() {
      this.showMerchModal = true
    },

    repostProduct() {
      this.dialog = false
      ProductService.repostProduct(this.item.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.item.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },
  },

  mounted() {
  },
}
</script>
