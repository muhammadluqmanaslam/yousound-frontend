<template>
  <v-flex xs12 sm12 class="share-section">
    <v-flex xs12 sm12 class="dismiss-section" @click="dismiss()"></v-flex>
    <v-layout row wrap class="popup-section">
      <v-flex xs12 class="profile-section">
        <router-link :to="'/' + user.slug"
          ><div
            class="avatar-image"
            :style="{
              'background-image': 'url(' + user.avatar.thumb.url + ')',
            }"
          ></div
        ></router-link>
        <router-link :to="'/' + user.slug"
          ><label class="user-name"
            >{{ user.display_name }}
            <v-icon
              class="user-status"
              v-bind:class="{ online: user.status == 'active' }"
              v-if="user.user_type == 'artist'"
              >fa-check-circle</v-icon
            ></label
          ></router-link
        >
        <v-btn
          :class="{
            'follow-btn': true,
            follow: !user.is_following,
            following: user.is_following,
          }"
          @mouseenter="buttonHover = true"
          @mouseleave="buttonHover = false"
          @click.native="followUser()"
          v-if="user.id != $store.state.auth.user.id"
          >{{ followButtonText }}
        </v-btn>
      </v-flex>
      <v-flex xs12 class="item-section">
        <div
          class="item-image"
          :style="{ 'background-image': 'url(' + itemCover + ')' }"
        ></div>
        <p class="item-name">{{ item.name }}</p>
      </v-flex>
      <v-flex xs12 class="share-social-section">
        <!-- <v-btn class="social-share-btn"><v-icon>fa-envelope</v-icon></v-btn> -->
        <social-sharing v-bind:url="albumURL" inline-template>
          <div class="social-section">
            <network network="facebook">
              <!-- <i class="fa fa-fw fa-facebook"></i> Facebook -->
              <v-btn class="social-share-btn"
                ><v-icon>fa-facebook</v-icon></v-btn
              >
            </network>
            <network network="twitter">
              <!-- <i class="fa fa-fw fa-twitter"></i> Twitter -->
              <v-btn class="social-share-btn"
                ><v-icon>fa-twitter</v-icon></v-btn
              >
            </network>
          </div>
        </social-sharing>
      </v-flex>
      <v-flex xs12 class="input-section">
        <input type="text" class="form-control" v-model="albumURL" readonly />
        <v-btn
          class="clipboard-btn"
          v-clipboard:copy="albumURL"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >
          <v-icon>fa-clipboard</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script type="text/javascript">
import AlbumService from '@/services/album'
import UserService from '@/services/user'
import { MyEvents } from '@/helper'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    dismiss: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      donate_amount: null,
      buttonHover: false,
      albumURL: '',
    }
  },

  computed: {
    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },

    user() {
      if (this.item.slug) {
        return this.item.user
      } else {
        return this.item.merchant
      }
    },

    itemCover() {
      if (this.item.slug) {
        return this.item.cover.url
      } else {
        var coverURL = ''
        for (let index in this.item.covers) {
          const cover = this.item.covers[index].cover
          if (cover.url) {
            coverURL = cover.url
            break
          }
        }
        return coverURL
      }
    },
  },

  created() {
    if (this.item.slug) {
      this.albumURL = window.location.origin + '/album/' + this.item.slug
    } else {
      this.albumURL = window.location.origin + '/product/' + this.item.id
    }
  },

  methods: {
    donateAmount(amount) {
      this.donate_amount = amount
    },

    dismissModal() {
      console.log('touched')
    },

    followUser() {
      if (this.item.user.is_following) {
        UserService.unfollowUser(this.item.user.id)
          .then((response) => {
            this.$store.dispatch('error/showSuccessToast', [
              'You just unfollowed ' + this.item.user.display_name,
            ])
            this.item.user.is_following = false
            // this.$store.dispatch('player/setUpdatedUser', this.item.user)
            this.$root.$emit(MyEvents.USER_FOLLOW, this.item.user.id, false)
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      } else {
        UserService.followUser(this.item.user.id)
          .then((response) => {
            this.$store.dispatch('error/showSuccessToast', [
              'You just followed ' + this.item.user.display_name,
            ])
            this.item.user.is_following = true
            // this.$store.dispatch('player/setUpdatedUser', this.item.user)
            this.$root.$emit(MyEvents.USER_FOLLOW, this.item.user.id, true)
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      }
    },

    downloadItem() {
      this.dismiss()
      AlbumService.downloadAlbum(this.item.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You just download ' + this.item.name,
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    onCopy: function (e) {
      this.$store.dispatch('error/showSuccessToast', [
        'You just copied: ' + e.text,
      ])
      // alert('You just copied: ' + e.text)
    },

    onError: function (e) {
      this.$store.dispatch('error/showErrorToast', ['Failed to copy link'])
      // alert('Failed to copy link')
    },
  },
}
</script>
