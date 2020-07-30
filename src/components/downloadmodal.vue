<template>
  <v-flex xs12 sm12 class="my-download-dialog">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row wrap class="top-section">
      <p class="title-label">Support artists with your contribution</p>
      <p class="content">
        When you download this album, it's reposted to your followers.
      </p>
    </v-layout>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 class="profile-section">
        <!-- <div class="avatar-image" style="background-image: url('/static/images/user1.jpg');"></div> -->
        <router-link :to="'/' + trackUser.slug">
          <div
            class="avatar-image"
            :style="{
              'background-image': 'url(' + trackUser.avatar.thumb.url + ')',
            }"
          ></div>
        </router-link>
        <router-link :to="'/' + trackUser.slug">
          <label class="user-name">
            {{ trackUser.display_name }}
            <v-icon
              v-if="trackUser.user_type == 'artist'"
              class="user-status"
              :class="{ online: trackUser.status == 'active' }"
              >fa-check-circle</v-icon
            >
          </label>
        </router-link>
        <v-btn
          v-if="trackUser.id != currentUser.id"
          class="follow-btn"
          :class="{
            follow: !trackUser.is_following,
            following: trackUser.is_following,
          }"
          @mouseenter="buttonHover = true"
          @mouseleave="buttonHover = false"
          @click.native="followUser()"
          >{{ followButtonText }}</v-btn
        >
      </v-flex>
      <v-flex xs12 class="item-section">
        <div
          class="item-image"
          :style="{ 'background-image': 'url(' + coverUrl + ')' }"
        ></div>
        <p class="item-name" v-if="track">{{ track.name }}</p>
        <p class="item-name" v-else>{{ item.name }}</p>
      </v-flex>
      <v-flex xs12 class="donate-section">
        <v-btn class="donate-amount-btn" @click.native="donateAmount(5)"
          >$5</v-btn
        >
        <v-btn class="donate-amount-btn" @click.native="donateAmount(10)"
          >$10</v-btn
        >
        <v-btn class="donate-amount-btn" @click.native="donateAmount(20)"
          >$20</v-btn
        >
        <v-btn class="donate-amount-btn" @click.native="donateAmount(50)"
          >$50</v-btn
        >
      </v-flex>
      <v-flex xs12 class="input-section">
        <vue-numeric
          currency="$"
          currency-symbol-position="prefix"
          separator=","
          :precision="2"
          :min="0"
          v-model="donate_amount"
          class="donate-amount form-control"
        />
        <v-btn class="download-btn" @click.native="showPaymentDialog()">
          <img
            class="pa-2"
            src="/static/images/ic_download_white.png"
          />Download
        </v-btn>
      </v-flex>
    </v-layout>

    <payment-modal
      v-if="showPaymentModal"
      :receivers="[trackUser]"
      :amount="donate_amount_by_cent"
      :dismiss="hidePaymentDialog"
      :finish="sendLove"
    />
  </v-flex>
</template>

<script type="text/javascript">
import _ from 'lodash'
import AlbumService from '@/services/album'
import TrackService from '@/services/track'
import UserService from '@/services/user'
import PaymentModal from '@/components/paymentmodal'
// import { Utils } from '@/helper'
import { Filter, MyEvents } from '@/helper'

export default {
  components: {
    PaymentModal,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },

    track: {
      type: Object,
    },

    dismiss: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      donate_amount: 0,
      showPaymentModal: false,
      buttonHover: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    trackUser() {
      if (this.item.album_type === 'album') {
        return this.item.user
      } else {
        return this.track ? this.track.user : this.item.user
      }
    },

    coverUrl() {
      if (this.track) {
        return _.get(this.track, 'album.cover.url')
      } else {
        return _.get(this.item, 'cover.url')
      }
    },

    followButtonText() {
      if (this.trackUser.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },

    donate_amount_by_cent() {
      return this.donate_amount * 100
    },
  },

  created() {},

  methods: {
    donateAmount(amount) {
      this.donate_amount = amount
    },

    followUser() {
      if (this.trackUser.is_following) {
        UserService.unfollowUser(this.trackUser.id)
          .then((response) => {
            this.$store.dispatch('error/showSuccessToast', [
              'You just unfollowed ' + this.trackUser.display_name,
            ])
            this.track.user.is_following = false
            // this.$store.dispatch('player/setUpdatedUser', this.trackUser)
            this.$root.$emit(MyEvents.USER_FOLLOW, this.trackUser.id, false)
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      } else {
        UserService.followUser(this.trackUser.id)
          .then((response) => {
            this.$store.dispatch('error/showSuccessToast', [
              'You just followed ' + this.trackUser.display_name,
            ])
            this.track.user.is_following = true
            // this.$store.dispatch('player/setUpdatedUser', this.trackUser)
            this.$root.$emit(MyEvents.USER_FOLLOW, this.trackUser.id, true)
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      }
    },

    showPaymentDialog() {
      if (this.donate_amount > 0) {
        this.showPaymentModal = true
      } else {
        this.downloadItem()
      }
    },

    hidePaymentDialog() {
      this.showPaymentModal = false
    },

    downloadItem() {
      this.dismiss()
      if (this.track) {
        TrackService.downloadTrack(this.track.id)

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
        AlbumService.downloadAlbum(this.item.id)
          .then((response) => {
            // this.$store.dispatch('error/showSuccessToast', ['You just download ' + this.item.name])
            var a = document.createElement('A')
            a.href = response.body.url
            a.download = ''
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      }
    },

    sendLove(token) {
      this.dismiss()
      const params = {
        amount: this.donate_amount_by_cent,
        description: 'Donation',
      }
      if (token) {
        params['payment_token'] = token.id
      }
      UserService.donateMoney(this.trackUser.slug, params)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            `You've sent user $${Filter.formatNumber(
              this.donate_amount_by_cent
            )}`,
          ])
          this.downloadItem()
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
}
</script>
