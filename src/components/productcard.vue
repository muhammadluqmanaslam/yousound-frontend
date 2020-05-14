<template>
  <v-flex class="product-card">
    <v-flex
      @mouseenter="is_component_hover=true"
      @mouseleave="is_component_hover=false"
      xs12 pa-0
      class="product-info"
    >
      <!-- <v-flex xs12 class="product-user" v-if="false" pa-0>
        <router-link :to="'/' + publisher.slug"><div class="product-user-avatar" :style="{'background-image': 'url(' + publisher.avatar.thumb.url + ')'}"/></div></router-link>
        <profile-item :user="publisher" :className="'product-user-avatar'"></profile-item>
        <router-link :to="'/' + publisher.slug"><p class="product-user-name">{{ publisher.display_name }}</p></router-link>
        <div class="product-posted-at">
          <img class="product-status-icon" src="/static/images/ic_repeat.png" /><label>reposted 10min ago</label>
        </div>
      </v-flex> -->
      <v-flex xs12 class="product-cover">
        <p class="product-price">${{ item.price | formatNumber }}</p>
        <div class="product-image" :style="{'background-image': 'url(' + item.covers[0].cover.url + ')'}"/></div>
        <v-flex xs12 class="product-actions" relative v-if="currentUser">
          <div class="product-label">${{ item.price | formatNumber }}</div>
          <v-flex xs12 class="touch-flex" @click="openMerchDialog()"></v-flex>
          <v-menu
            v-if="willMenuRender"
            offset-y
            class="product-menu"
          >
            <v-btn dark slot="activator" @click="is_menu_hover = true">
              <v-icon right>more_horiz</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile
                v-if="item.merchant.id != currentUser.id"
                key="repost"
                @click.native="repostProduct()"
              >
                <v-list-tile-title class="product-menu-item">
                  <img class="product-status-icon" src="/static/images/ic_repeat.png" />
                  <label>Repost</label>
                </v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                key="share"
                class="product-menu-item"
                @click.native="openShareDialog()"
              >
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
        <p class="product-user-name">
          <router-link :to="'/' + owner.slug" v-if="item.collaborators_count == 0">{{ owner.display_name }}</router-link>
          <template v-else-if="item.collaborators_count == 1">
            <router-link :to="'/' + owner.slug">{{ owner.display_name }}</router-link>,&nbsp;
            <router-link :to="'/' + item.collaborators[0].user.slug" v-if="item.collaborators[0]">{{ item.collaborators[0].user.display_name }}</router-link>
          </template>
          <router-link :to="'/' + owner.slug" v-else>Multiple Collaborators</router-link>
        </p>
      </v-flex>
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
        showShareModal: false,
        is_component_hover: false,
        is_menu_hover: false
      }
    },

    computed: {
      currentUser () {
        return this.$store.state.auth.user
      },

      willMenuRender () {
        // console.log('willMenuRender', this.item.id, this.is_component_hover, this.is_menu_hover)
        return this.is_menu_hover || this.is_component_hover
      },

      // publisher () {
      //   if (this.dataObject.assoc_type) {
      //     return this.dataObject.publisher
      //   } else {
      //     return this.dataObject.merchant
      //   }
      // },

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

    methods: {
      openMerchDialog () {
        this.showMerchModal = true
      },

      closeMerchDialog () {
        this.showMerchModal = false
      },

      openShareDialog () {
        this.showMerchModal = false
        this.showShareModal = true
      },

      closeShareDialog () {
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

    created () {
    },

    mounted () {
    }
  }
</script>
