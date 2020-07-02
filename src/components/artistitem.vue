<template>
  <v-flex class="artist-card">
    <v-flex xs12 class="item-info" pa-0>
      <v-flex xs12 class="artist-info-section">
        <div class="artist-cover" :style="{'background-image': 'url(' + artist.avatar.url + ')'}"></div>
        <v-flex
          v-if="canViewProfile"
          xs12 class="artist-actions"
        >
          <router-link :to="`/${artist.slug}`">
            <div class="avatar-cover">
              <div class="hover-title">View Profile</div>
            </div>
          </router-link>

          <div v-if="followButtonVisible" class="follow-section">
            <v-btn
              :class="{ 'follow-btn': true, 'follow': !artist.is_following, 'following': artist.is_following }"
              @click.native="followUser()"
              @mouseenter="buttonHover = true"
              @mouseleave="buttonHover = false">{{ followButtonText }}</v-btn>
          </div>
        </v-flex>
        <div class="artist-name">
          {{ artist.display_name }}
          <v-icon
            v-if="artist.user_type == 'artist'"
            class="user-status"
            :class="{'online': artist.status == 'active'}"
          >fa-check-circle</v-icon>
        </div>
      </v-flex>
    </v-flex>
  </v-flex>
</template>

<script type="text/javascript">
  import UserService from '@/services/user'
  import { MyEvents, PublicRelationsUsername } from '@/helper'

  export default {
    components: {
    },

    props: {
      artist: {
        type: Object
      }
    },

    data () {
      return {
        PublicRelationsUsername: PublicRelationsUsername,
        buttonHover: false
      }
    },

    computed: {
      currentUser () {
        return this.$store.state.auth.user
      },

      followButtonText () {
        if (this.artist.is_following) {
          return this.buttonHover ? 'Unfollow' : 'Following'
        }
        return 'Follow'
      },

      followButtonVisible () {
        return this.currentUser && this.currentUser.id !== this.artist.id &&
          ['admin', 'superadmin'].indexOf(this.artist.user_type) === -1 &&
          this.artist.username !== PublicRelationsUsername
      },

      canViewProfile () {
        return ['admin', 'superadmin'].indexOf(this.artist.user_type) === -1
      }
    },

    created () {
    },

    methods: {
      showMessageDialog () {
        this.showSendMessage = true
      },

      dismissMessageModal () {
        this.showSendMessage = false
      },

      imageURL (item) {
        if (item.cover) {
          return item.cover.thumb.url
        } else {
          return item.covers[0].cover.thumb.url
        }
      },

      blockUser () {
      },

      followUser () {
        if (this.artist.is_following) {
          UserService.unfollowUser(this.artist.id).then(response => {
            this.$store.dispatch('error/showSuccessToast', ['You just unfollowed ' + this.artist.display_name])
            this.artist.is_following = false
            // this.$store.dispatch('player/setUpdatedUser', this.artist)
            // this.$root.$emit(MyEvents.USER_FOLLOW, { id: this.artist.id, is_following: false })
            this.$root.$emit(MyEvents.USER_FOLLOW, this.artist.id, false)
          }).catch(e => {
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        } else {
          UserService.followUser(this.artist.id).then(response => {
            this.$store.dispatch('error/showSuccessToast', ['You just followed ' + this.artist.display_name])
            this.artist.is_following = true
            // this.$store.dispatch('player/setUpdatedUser', this.artist)
            this.$root.$emit(MyEvents.USER_FOLLOW, this.artist.id, true)
          }).catch(e => {
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        }
      }
    }
  }
</script>
