<template>
  <v-flex xs12 sm12 class="download-section">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row wrap class="top-section">
      <p class="title-label">Support artists with your contribution</p>
      <p class="content">When you download this album, it's reposted to your followers.</p>
    </v-layout>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 class="profile-section">
        <!-- <div class="avatar-image" style="background-image: url('/static/images/user1.jpg');"></div> -->
        <router-link :to="'/' + item.user.slug"><div class="avatar-image" :style="{'background-image': 'url(' + item.user.avatar.thumb.url + ')'}"></div></router-link>
        <router-link :to="'/' + item.user.slug"><label class="user-name">{{ item.user.display_name }} <v-icon class="user-status" v-bind:class="{'online': item.user.status == 'active'}" v-if="item.user.user_type == 'artist'">fa-check-circle</v-icon></label></router-link>
        <v-btn v-if="item.user.id!=$store.state.auth.user.id"
          :class="{ 'follow-btn': true, 'follow': !item.user.is_following, 'following': item.user.is_following }"
          @mouseenter="buttonHover = true"
          @mouseleave="buttonHover = false"
          @click.native="followUser()">{{ followButtonText }}</v-btn>
      </v-flex>
      <v-flex xs12 class="item-section">
        <!-- <div class="item-image" style="background-image: url('/static/images/post1.jpg');"></div> -->
        <div class="item-image" :style="{'background-image': 'url(' + item.cover.url + ')'}"></div>
        <p class="item-name" v-if="track">{{ track.name }}</p>
        <p class="item-name" v-else>{{ item.name }}</p>
      </v-flex>
      <v-flex xs12 class="donate-section">
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(0)">$0</v-btn>
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(5)">$5</v-btn>
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(10)">$10</v-btn>
        <v-btn class ="donate-amount-btn" @click.native="donateAmount(50)">$50</v-btn>
      </v-flex>
      <v-flex xs12 class="input-section">
        <input type="text" class="donate-amount form-control" v-model="donate_amount" placeholder="$0.00">
        <v-btn class ="download-btn" @click.native="showPaymentDialog()">
          <img class="pa-2" src="/static/images/ic_download_white.png"/>Download
        </v-btn>
      </v-flex>
    </v-layout>

    <payment-modal v-if="showPaymentModal"
      :type="''"
      :amount="donate_amount_by_cent"
      :dismiss="hidePaymentDialog"
      :finish="sendLove"></payment-modal>
  </v-flex>
</template>

<script type="text/javascript">
  import AuthService from '@/services/auth'
  import AlbumService from '@/services/album'
  import UserService from '@/services/user'
  import paymentModal from '@/components/paymentmodal'
  // import { Utils } from '@/helper'
  import { Filter, MyEvents } from '@/helper'

  export default {
    components: {
      paymentModal
    },

    props: {
      item: {
        type: Object,
        required: true
      },

      track: {
        type: Object
      },

      dismiss: {
        type: Function,
        required: true
      }
    },

    data () {
      return {
        donate_amount: null,
        showPaymentModal: false,
        buttonHover: false
      }
    },

    computed: {
      followButtonText () {
        if (this.item.user.is_following) {
          return this.buttonHover ? 'Unfollow' : 'Following'
        }
        return 'Follow'
      },

      donate_amount_by_cent () {
        return this.donate_amount * 100
      }
    },

    created () {
    },

    methods: {
      donateAmount (amount) {
        this.donate_amount = amount
      },

      dismissModal () {
        console.log('touched')
      },

      followUser () {
        if (this.item.user.is_following) {
          UserService.unfollowUser(this.item.user.id).then(response => {
            this.$store.dispatch('error/showSuccessToast', ['You just unfollowed ' + this.item.user.display_name])
            this.item.user.is_following = false
            // this.$store.dispatch('player/setUpdatedUser', this.item.user)
            this.$root.$emit(MyEvents.USER_FOLLOW, this.item.user.id, false)
          }).catch(e => {
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        } else {
          UserService.followUser(this.item.user.id).then(response => {
            this.$store.dispatch('error/showSuccessToast', ['You just followed ' + this.item.user.display_name])
            this.item.user.is_following = true
            // this.$store.dispatch('player/setUpdatedUser', this.item.user)
            this.$root.$emit(MyEvents.USER_FOLLOW, this.item.user.id, true)
          }).catch(e => {
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        }
      },

      showPaymentDialog () {
        if (this.donate_amount > 0) {
          this.showPaymentModal = true
        } else {
          this.downloadItem()
        }
      },

      hidePaymentDialog () {
        this.showPaymentModal = false
      },

      downloadItem () {
        this.dismiss()
        if (this.track) {
          // console.log(this.track)
          // AlbumService.downloadAlbum(this.item.id)
          // window.open(this.track.audio_download_url, '_blank')

          var a = document.createElement('A')
          a.href = this.track.audio_download_url
          a.download = ''
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)

          // window.download(this.track.audio.url, Utils.getFilenameWithExtension(this.track.name)
          // const filename = Utils.getFilenameWithExtension(this.track.name)
          // window.jQuery.ajax({
          //   url: this.track.audio.url,
          //   dataType: 'binary',
          //   success: window.download.bind(true, 'application/octet-stream', filename)
          // })
        } else {
          AlbumService.downloadAlbum(this.item.id).then(response => {
            // this.$store.dispatch('error/showSuccessToast', ['You just download ' + this.item.name])
            var a = document.createElement('A')
            a.href = response.body.url
            a.download = ''
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }).catch(e => {
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        }
      },

      sendLove (token) {
        this.dismiss()
        const params = {
          amount: this.donate_amount_by_cent
        }
        if (token) {
          params['payment_token'] = token.id
        }
        UserService.donateMoney(this.item.user.slug, params).then(response => {
          this.$store.dispatch('error/showSuccessToast', [`You sent user $${Filter.formatNumber(this.donate_amount_by_cent)}`])
          AuthService.setUser(response.body)
          this.downloadItem()
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
    }
  }
</script>
