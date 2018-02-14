<template>
  <v-flex class="product-card">
    <v-flex xs12 class="product-info" pa-0>
      <v-flex xs12 class="product-user" v-if="false" pa-0>
        <!-- <router-link :to="'/' + publisher.slug"><div class="product-user-avatar" :style="{'background-image': 'url(' + publisher.avatar.thumb.url + ')'}"/></div></router-link> -->
        <profile-item :user="publisher" :className="'product-user-avatar'"></profile-item>
        <router-link :to="'/' + publisher.slug"><p class="product-user-name">{{ publisher.display_name }}</p></router-link>
        <div class="product-posted-at">
          <img class="product-status-icon" src="/static/images/ic_repeat.png" /><label>reposted 10min ago</label>
        </div>
      </v-flex>
      <v-flex xs12 class="product-cover">
        <p class="product-price">${{ item.price | formatNumber }}</p>
        <div class="product-image" :style="{'background-image': 'url(' + item.covers[0].cover.url + ')'}"/></div>
        <v-flex xs12 class="product-actions" relative v-if="$store.state.auth.user">
          <!-- <v-btn dark class="play-button">
            <img src="/static/images/btn_play.png"/>
          </v-btn> -->
          <v-flex xs12 class="touch-flex" @click="showMerchModal=true"></v-flex>
          <v-menu offset-y class="product-menu">
            <v-btn dark slot="activator">
              <!-- <img src="/static/images/ic_more.png"/></v-icon> -->
              <v-icon right>more_horiz</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile v-if="item.merchant.id != $store.state.auth.user.id"
                  key="repost"
                  @click.native="repostProduct()">
                <v-list-tile-title class="product-menu-item">
                  <img class="product-status-icon" src="/static/images/ic_repeat.png" />
                  <label>Repost</label>
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                  key="share"
                  class="product-menu-item"
                  @click.native="showShareDialog()">
                <v-list-tile-title>
                  <img class="product-status-icon" src="/static/images/ic_share.png" />
                  <label>Share</label>
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
      </v-flex>
      <v-flex xs12 class="product-detail" pa-0>
        <p class="product-name">{{ item.name }}</p>
        <router-link :to="'/' + owner.slug" v-if="item.collaborators_count == 0"><p class="product-user-name">{{ owner.display_name }}</p></router-link>
        <router-link :to="'/' + owner.slug" v-else><p class="track-user-name">Merch Collaborations</p></router-link>
      </v-flex>
    </v-flex>

    <merch-modal v-if="showMerchModal"
      :item="item"
      :dismiss="dimissMerchDialog"
      :shareProduct="showShareDialog"></merch-modal>
    <share-modal v-if="showShareModal"
      :item="item"
      :dismiss="dismissShareDialog"></share-modal>
  </v-flex>  
</template>

<script type="text/javascript">
  import merchModal from '@/components/merchmodal'
  import profileItem from '@/components/profileitem'
  import ProductService from '@/services/product'
  import shareModal from '@/components/sharemodal'

  export default {
    components: {
      merchModal,
      shareModal,
      profileItem
    },

    props: {
      dataObject: {
        type: Object
      }
    },

    data () {
      return {
        showMerchModal: false,
        showShareModal: false
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
      showMerchDialog () {
        this.showMerchModal = true
      },

      dimissMerchDialog () {
        this.showMerchModal = false
      },

      showShareDialog () {
        this.showMerchModal = false
        this.showShareModal = true
      },

      dismissShareDialog () {
        this.showShareModal = false
      },

      repostProduct () {
        ProductService.repostProduct(this.item.id).then(response => {
          if (response.body.errors) {
            this.$store.dispatch('error/showErrorToast', response.body.errors)
          } else {
            this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.item.name])
          }
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    },

    mounted () {
    }
  }
</script>
