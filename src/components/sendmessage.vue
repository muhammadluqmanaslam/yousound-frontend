<template>
  <v-flex xs12 sm12 class="direct-message-section">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row class="popup-section">
      <v-flex xs12 class="content-section" :class="{'sm7':$store.state.auth.user.user_type=='artist', 'sm12':$store.state.auth.user.user_type!='artist'}">
        <!-- <div class="avatar-image" style="background-image: url('/static/images/user1.jpg');"></div> -->
        <div class="avatar-image" :style="{'background-image': 'url(' + receiver.avatar.thumb.url + ')'}"></div>
        <p class="user-name">{{ receiver.display_name }} <v-icon class="user-status" v-bind:class="{'online': receiver.status == 'active'}" v-if="receiver.user_type == 'artist'">fa-check-circle</v-icon></p>
        <label class="repost-price" v-if="$store.state.auth.user.user_type=='artist'">Repost Price: ${{ receiver.repost_price }}</label>
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
          <v-btn class ="send-message-btn" @click.native="sendMessage()">Send</v-btn>
        </div>
        <!--<p class="followed-count-text">
          This user is followed by 
          <a class="followed-user">Ruckazoid</a>, 
          <a class="followed-user">Teeko</a>, 
          <a class="followed-user">DJ Soda</a> 
          and 28 others artists.</p>-->
      </v-flex>
      <v-flex xs12 pa-0 class="requests-section" v-if="$store.state.auth.user.user_type=='artist'" :class="{'sm5': $store.state.auth.user.user_type=='artist', 'sm12': $store.state.auth.user.user_type!='artist'}">
        <div class="header-section">
          <p class="section-title">Request repost</p>
          <div class="option-area">
            <v-btn class="request-option-btn" :class="{'selected':tab=='album'}" @click.native="onTab('album')">Album</v-btn>
            <v-btn class="request-option-btn" :class="{'selected':tab=='merch'}" @click.native="onTab('merch')">Merch</v-btn>
          </div>
        </div>
        <div class="content-section" v-if="tab=='album'">
          <div class="request-item" :class="{'selected':item_index==index}" v-for="(album, index) in albums" :key="index" @click="selectItemIndex(index)">
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
          <div class="request-item" :class="{'selected':item_index==index}" v-for="(product, index) in products" :key="index" @click="selectItemIndex(index)">
            <div class="avatar-area">
              <div class="avatar-image" :style="`background-image: url(${product.covers[0].cover.thumb.url})`"></div> 
            </div>
            <div class="detail-area">
              <label class="item-name">{{ product.name }}</label>
              <label class="user-name">{{ product.merchant.display_name }}</label>
            </div>
          </div>
        </div>
        <!-- <div class="content-section">
          <div class="request-item">
            <div class="avatar-area">
              <div class="avatar-image" style="background-image: url('/static/images/post1.jpg');"></div>
            </div>
            <div class="detail-area">
              <label class="item-name">I'll Take You There</label>
              <a class="user-name">Ruckazoid</a>
            </div>
          </div>
        </div> -->
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
  import MessageService from '@/services/message'
  import { Picker } from 'emoji-mart-vue'
  import AlbumService from '@/services/album'
  import ProductService from '@/services/product'

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
      Picker
    },

    data () {
      return {
        showEmojiPicker: false,
        tab: 'album',
        item_index: -1,
        albums: [],
        products: [],
        message: ''
      }
    },

    computed: {
    },

    created () {
      Promise.all([
        AlbumService.getAlbums({
          statuses: 'published, collaborated',
          user_statuses: 'accepted'
        }),
        ProductService.getProducts({
          statuses: 'published, collaborated',
          stock_statuses: 'active',
          user_statuses: 'accepted'
        })
      ]).then(values => {
        this.albums = values[0].body
        this.products = values[1].body
      }).catch(reason => {
        console.log(reason)
        // this.$store.dispatch('error/showErrorToast', [reason])
      })
    },

    methods: {
      sendMessage () {
        this.dismiss()
        const params = new FormData()
        params.append('body', this.message)
        this.message = ''
        params.append('receiver_id', this.receiver.id)
        MessageService.addMessage(params).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['Sent message successfully.'])
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      },

      onTab (tab) {
        this.tab = tab
        this.item_index = -1
      },

      selectItemIndex (index) {
        if (this.item_index !== index) {
          this.item_index = index
        } else {
          this.item_index = -1
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
