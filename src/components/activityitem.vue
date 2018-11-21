<template>
  <v-layout row wrap class="activity-item">
    <v-flex xs12 sm10 offset-sm1 class="activity-item-body">
      <v-layout row wrap>
        <v-flex xs12 sm6 class="activity-item-section"  v-bind:class="{'sm6': activityItem.sender.recent_reposts, 'no-reposts': !activityItem.sender.recent_reposts}">
          <v-flex xs12 class="activity-item-section-body">
            <profile-item :user="activityItem.sender" :className="'activity-item-profile-avatar-area'"></profile-item>
            <div class="activity-item-content-area">
              <div class="activity-item-content">
                <router-link class="user-name" :to="'/' + activityItem.sender.slug">{{ activityItem.sender.display_name }}</router-link>&nbsp;
                <v-icon class="user-status" v-bind:class="{'online': activityItem.sender.status == 'active'}" v-if="activityItem.sender.user_type == 'artist'">fa-check-circle</v-icon>&nbsp;
                <label class="description-text">{{ activityItem.message }}
                  <img class="follow-icon" v-if="activityItem.action_type=='follow'" src=""/>
                  <img class="download-icon" v-if="activityItem.action_type=='download'" src="/static/images/ic_download.png"/>
                  <img class="play-icon" v-if="activityItem.action_type=='play'" src=""/>
                  <img class="comment-icon" v-if="activityItem.action_type=='comment'" src="/static/images/ic_message.png"/>
                  <img class="release-icon" v-if="activityItem.action_type=='release'" src=""/>
                  <img class="repost-icon" v-if="activityItem.action_type=='repost'" src="/static/images/ic_repeat.png"/>
                  <img class="share-icon" v-if="activityItem.action_type=='share'" src="/static/images/ic_share.png"/>
                  <v-icon class="recommend-icon" v-if="activityItem.action_type=='recommend'">thumb_up</v-icon>
                  <label class="items-title" @click="doAction()" v-if="activityItem.assoc && activityItem.assoc_type!='Comment'">{{ activityItem.assoc.name }}</label>
                  <label class="items-title" @click="doAction()" v-if="activityItem.assoc && activityItem.assoc.commentable">{{ activityItem.assoc.commentable.name }}</label>
                </label>
              </div>
              <div class="details">
                <p class="detailed-description" v-if="activityItem.action_type=='comment'">"{{ activityItem.assoc.body }}"</p>
                <!-- <div class="actioned-item" :style="{'background-image': 'url(' + activityItem.assoc.covers[0].cover.thumb.url + ')'}" v-if="activityItem.assoc && activityItem.assoc_type=='ShopProduct'">
                  <router-link to="/" v-if="activityItem.assoc.assoc_type=='ShopProduct'"></router-link>
                </div> -->
                <div class="actioned-item" v-if="activityItem.assoc && activityItem.assoc_type=='ShopProduct'">
                  <activity-product-card :object="activityItem.assoc"></activity-product-card>
                </div>
                <div class="actioned-item" v-if="activityItem.assoc && activityItem.assoc_type=='Album'">
                  <activity-album-card :object="activityItem.assoc" ></activity-album-card>
                </div>
                <div class="actioned-item" v-if="activityItem.assoc && activityItem.assoc_type=='Comment'">
                  <activity-album-card :object="activityItem.assoc.commentable" ></activity-album-card>
                </div>
                <!-- <div class="actioned-item" :style="{'background-image': 'url(' + activityItem.assoc.cover.thumb.url + ')'}" v-if="activityItem.assoc && activityItem.assoc_type=='Album'">
                  <router-link :to="'/album/' + activityItem.assoc.slug"></router-link>
                </div> -->
              </div>
            </div>
          </v-flex>
        </v-flex>

        <v-flex xs12 sm6 class="activity-item-recent-posts" v-if="activityItem.sender.recent_items">
          <p class="recent-posts-section-title">Recent reposts</p>
          <!-- <div class="recent-post-item" :style="{'background-image': 'url(' + imageURL(repost.assoc) + ')'}" v-for="(repost, index) in activityItem.sender.recent_items" :key="index">
            <router-link :to="'/album/' + repost.assoc.slug" v-if="repost.assoc.album_type"></router-link>
            <router-link to="/" v-if="!repost.assoc.album_type"></router-link>
          </div> -->
          <div class="recent-post-item" v-for="(repost, index) in activityItem.sender.recent_items" :key="index">
            <activity-product-card :object="repost" v-if="repost.assoc_type=='ShopProduct'"></activity-product-card>
            <activity-album-card :object="repost" v-if="repost.assoc_type=='Album'"></activity-album-card>
          </div>
        </v-flex>
      </v-layout>
      <label class="activity-time">{{ toLocalTimeString(activityItem.updated_at) }}</label>
    </v-flex>

    <!-- <send-message
      v-if="showSendMessage"
      :receiver="activityItem.sender"
      :dismiss="dismissMessageModal"
    /> -->

    <merch-modal
      v-if="showMerchModal && activityItem.assoc_type === 'ShopProduct'"
      :item="activityItem.assoc"
      :dismiss="dimissMerchModal"
    />
  </v-layout>
</template>

<script type="text/javascript">
  import { Utils } from '@/helper'
  import profileItem from '@/components/profileitem'
  import merchModal from '@/components/merchmodal'
  import activityAlbumCard from '@/components/activityalbumcard'
  import activityProductCard from '@/components/activityproductcard'

  export default {
    components: {
      profileItem,
      merchModal,
      activityAlbumCard,
      activityProductCard
    },

    props: {
      activityItem: {
        type: Object
      }
    },

    data () {
      return {
        showSendMessage: false,
        showMerchModal: false
      }
    },

    computed: {
      toLocalTimeString () {
        return Utils.toLocalTimeString
      },

      actionText () {
        if (this.activityItem.action_type === 'release') {
          return 'released'
        } else if (this.activityItem.action_type === 'repost') {
          return 'reposted'
        } else if (this.activityItem.action_type === 'unrepost') {
          return 'unreposted'
        } else if (this.activityItem.action_type === 'follow') {
          return 'followed you'
        } else if (this.activityItem.action_type === 'unfollow') {
          return 'unfollowed you'
        } else if (this.activityItem.action_type === 'play') {
          return 'played'
        } else if (this.activityItem.action_type === 'download') {
          return 'downloaded'
        } else {
          return 'commented'
        }
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

      doAction () {
        if (this.activityItem.assoc_type === 'ShopProduct') {
          this.showMerchModal = true
        } else {
          if (this.activityItem.assoc.commentable) {
            this.$router.push({ path: this.activityItem.assoc.commentable.album_type + '/' + this.activityItem.assoc.commentable.slug })
          } else {
            this.$router.push({ path: this.activityItem.assoc.album_type + '/' + this.activityItem.assoc.slug })
          }
        }
      },

      dimissMerchModal () {
        this.showMerchModal = false
      }
    }
  }
</script>
