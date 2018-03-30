<template>
  <v-flex class="product-slide-card">
    <v-flex xs12 class="product-info" pa-0>
      <v-flex xs12 class="product-user" v-if="false" pa-0>
        <profile-item :user="publisher" :className="'product-user-avatar'"></profile-item>
        <router-link :to="'/' + publisher.slug"><p class="product-user-name">{{ publisher.display_name }}</p></router-link>
        <div class="product-posted-at">
          <img class="product-status-icon" src="/static/images/ic_repeat.png" /><label>reposted 10min ago</label>
        </div>
      </v-flex>
      <v-flex xs12 class="product-cover">
        <p class="product-price">${{ item.price | formatNumber }}</p>
        <div class="product-image" :style="{'background-image': 'url(' + item.covers[0].cover.url + ')'}"/></div>
        <v-flex xs12 class="product-actions" relative>
          <!-- <v-flex xs12 class="touch-flex" @click="showMerchDialog"></v-flex> -->
          <v-flex xs12 class="touch-flex"></v-flex>
          <v-btn dark class="action-btn" @click.native="showButtonAction(item)" v-if="showButtonAction">View Detail</v-btn>
          <!-- <v-menu offset-y class="product-menu">
            <v-btn dark slot="activator">
              <v-icon right>more_horiz</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile key="repost" @click.native="repostProduct()">
                <v-list-tile-title class="product-menu-item">
                  <img class="product-status-icon" src="/static/images/ic_repeat.png" />
                  <label>Repost</label>
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile key="share" class="product-menu-item">
                <v-list-tile-title>
                  <img class="product-status-icon" src="/static/images/ic_share.png" />
                  <label>Share</label>
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu> -->
        </v-flex>
      </v-flex>
    </v-flex>
  </v-flex>  
</template>

<script type="text/javascript">
  import merchModal from '@/components/merchmodal'
  import profileItem from '@/components/profileitem'
  import ProductService from '@/services/product'

  export default {
    components: {
      merchModal,
      profileItem
    },

    props: {
      dataObject: {
        type: Object
      },

      showButtonAction: {
        type: Function
      }
    },

    data () {
      return {
        dialog: false,
        showMerchModal: false
      }
    },

    computed: {
      isShowUserInfo () {
        if (this.$store.state.auth.page === 'stream') {
          return true
        } else {
          return false
        }
      },

      publisher () {
        if (this.dataObject.assoc_type) {
          return this.dataObject.publisher
        } else {
          return this.dataObject.merchant
        }
      },

      item () {
        if (this.dataObject.assoc_type) {
          return this.dataObject.assoc
        } else {
          return this.dataObject
        }
      },

      owner () {
        if (this.dataObject.assoc_type) {
          return this.dataObject.assoc.merchant
        } else {
          return this.dataObject.merchant
        }
      }
    },

    created () {
    },

    methods: {
      dimissMerchDialog () {
        this.showMerchModal = false
      },

      showMerchDialog () {
        this.showMerchModal = true
      },

      repostProduct () {
        this.dialog = false
        ProductService.repostProduct(this.item.id).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.item.name])
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    },

    mounted () {
    }
  }
</script>
