<template>
  <v-flex xs12 sm12 class="direct-message-section">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row class="popup-section">
      <v-flex xs12 class="content-section" :class="{'sm7':$store.state.auth.user.user_type=='artist', 'sm12':$store.state.auth.user.user_type!='artist'}">
        <div class="avatar-image" :style="{'background-image': 'url(' + receiver.avatar.thumb.url + ')'}"></div>
        <p class="user-name">{{ receiver.display_name }} <v-icon class="user-status" v-bind:class="{'online': receiver.status == 'active'}" v-if="receiver.user_type == 'artist'">fa-check-circle</v-icon></p>
        <label class="repost-price" v-if="$store.state.auth.user.user_type=='artist'">Repost Price: ${{ receiver.repost_price | formatNumber }}</label>
        <div class="send-message-section relative">
          <textarea v-model="message"
            maxlength="500"
            class="message-input-area"
            placeholder="Write a message..."
            ref="message">
          </textarea>
          <picker v-if="showEmojiPicker"
            title="Pick your emoji…"
            emoji="point_up"
            class="emoji-picker"
            @click="addEmoji"></picker>
          <v-btn
            class="show-emoji-box-btn"
            :class="{'selected': showEmojiPicker}"
            @click.native="showEmojiPicker=!showEmojiPicker">
            <v-icon>tag_faces</v-icon>
          </v-btn>
          <v-btn class ="send-message-btn" @click.native="checkMessage()" :disabled="!message">Send</v-btn>
        </div>
      </v-flex>
      <v-flex xs12 pa-0 class="requests-section" v-if="$store.state.auth.user.user_type=='artist'" :class="{'sm5': $store.state.auth.user.user_type=='artist', 'sm12': $store.state.auth.user.user_type!='artist'}">
        <div class="header-section">
          <p class="section-title">Request repost</p>
          <div class="option-area">
            <v-btn
              class="request-option-btn"
              :class="{'selected':tab=='album'}"
              @click.native="onTab('album')"
            >Album</v-btn>
            <v-btn
              class="request-option-btn"
              :class="{'selected':tab=='merch'}"
              @click.native="onTab('merch')"
            >Merch</v-btn>
          </div>
        </div>
        <div class="content-section" v-if="tab=='album'">
          <div
            v-for="album in albums"
            :key="album.id"
            @click="InBanned(album) ? null : selectItem(album)"
            class="request-item"
            :class="{'selected': item == album, 'banned': InBanned(album)}"
          >
            <div class="avatar-area">
              <div class="avatar-image" :style="`background-image: url(${album.cover.thumb.url})`"></div> 
            </div>
            <div class="detail-area">
              <label class="item-name">{{ album.name }}</label>
              <label class="user-name">{{ album.user.display_name }}</label>
            </div>
          </div>
        </div>
        <div class="content-section" v-if="tab=='merch'">
          <div
            v-for="product in products"
            :key="product.id"
            @click="InReposted(product) ? null : selectItem(product)"
            class="request-item"
            :class="{'selected': item == product, 'banned': InReposted(product)}"
          >
            <div class="avatar-area">
              <div class="avatar-image" :style="`background-image: url(${product.covers[0].cover.thumb.url})`"></div> 
            </div>
            <div class="detail-area">
              <label class="item-name">{{ product.name }}</label>
              <label class="user-name">{{ product.merchant.display_name }}</label>
            </div>
          </div>
        </div>
      </v-flex>

      <repost-payment-modal
        v-if="show_repost_payment_modal"
        :item="item"
        :itemType="tab"
        :user="receiver"
        :dismiss="closeRepostPaymentModal"
        :finish="sendMessage"
      />
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
  import _ from 'lodash'
  import { Picker } from 'emoji-mart-vue'

  import AlbumService from '@/services/album'
  import MessageService from '@/services/message'
  import ProductService from '@/services/product'
  import UserService from '@/services/user'

  import repostPaymentModal from '@/components/repost_payment_modal'

  export default {
    props: {
      receiver: {
        type: Object,
        required: true
      },

      dismiss: {
        type: Function,
        required: true
      }
    },

    components: {
      Picker,
      repostPaymentModal
    },

    data () {
      return {
        showEmojiPicker: false,
        show_repost_payment_modal: false,
        tab: 'album',
        item: null,
        albums: [],
        products: [],
        itemType: {
          'album': 'Album',
          'merch': 'ShopProduct'
        },
        repostedFeeeds: [],
        message: ''
      }
    },

    computed: {
      current_repost_price () {
        return this.receiver.repost_price
      }
    },

    created () {
      // console.log(this.receiver)
      Promise.all([
        AlbumService.getAlbums({
          statuses: 'published, collaborated',
          user_statuses: 'accepted'
        }),
        ProductService.getProducts({
          statuses: 'published, collaborated',
          stock_statuses: 'active',
          user_statuses: 'accepted'
        }),
        UserService.repostedFeeds(this.receiver.id)
      ]).then(values => {
        this.albums = values[0].body
        this.products = values[1].body
        this.repostedFeeds = values[2].body
        // this.$forceUpdate()
      }).catch(reason => {
        console.log(reason)
        // this.$store.dispatch('error/showErrorToast', [reason])
      })
    },

    methods: {
      InBanned (album) {
        return this.InHiddenGenres(album) || this.InReposted(album)
      },

      // true : in hidden genres
      InHiddenGenres (album) {
        const genreId = _.get(album.genres, '[0].id', '')
        const genre = _.find(this.receiver.hidden_genres, (genre) => { return genre.id === genreId })
        // return !(genre === undefined || genre === null)
        return !!genre
      },

      InReposted (item) {
        const feed = _.find(this.repostedFeeds, (f) => {
          return f.assoc_type === this.itemType[this.tab] && f.assoc_id === item.id
        })
        return !!feed
      },

      openRepostPaymentModal () {
        // console.log(this.item)
        this.show_repost_payment_modal = true
      },

      closeRepostPaymentModal () {
        this.show_repost_payment_modal = false
      },

      checkMessage () {
        if (this.item) {
          this.openRepostPaymentModal()
        } else {
          this.sendMessage()
        }
      },

      sendMessage (token) {
        this.dismiss()
        let params = {
          body: this.message
        }
        this.message = ''
        params['receiver_id'] = this.receiver.id
        if (this.item) {
          if (this.tab === 'album') {
            params['attachable_type'] = 'Album'
            params['attachable_id'] = this.item.id
          } else {
            params['attachable_type'] = 'ShopProduct'
            params['attachable_id'] = this.item.id
          }
        }
        if (token) {
          params['payment_token'] = token.id
        }
        MessageService.addMessage(params).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['Sent message successfully.'])
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      },

      onTab (tab) {
        this.tab = tab
        this.item = null
      },

      selectItem (item) {
        // console.log(this.item === item, this.item, item)
        if (this.item === item) {
          this.item = null
        } else {
          this.item = item
        }
      },

      addEmoji (emoji, event) {
        this.showEmojiPicker = false
        this.message += emoji.native
        this.$refs.message.focus()
      }
    }
  }
</script>
