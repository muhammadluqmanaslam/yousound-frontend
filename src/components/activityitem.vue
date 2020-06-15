<template>
  <div class="activity-item">
    <div class="activity-item-body">
      <v-layout row wrap>
        <v-flex
          xs12 md5
          :class="{'md5': activityItem.sender.recent_reposts, 'no-reposts': !activityItem.sender.recent_reposts}"
          class="activity-item-section"
        >
          <v-flex xs12 class="activity-item-section-body">
            <profile-item :user="activityItem.sender" :className="'activity-item-profile-avatar-area'"></profile-item>
            <div class="activity-item-content-area">
              <div class="activity-item-content">
                <router-link class="user-name" :to="'/' + activityItem.sender.slug">
                  {{ activityItem.sender.display_name }}
                </router-link>
                <v-icon
                  v-if="activityItem.sender.user_type == 'artist'"
                  class="user-status online"
                >fa-check-circle</v-icon>&nbsp;
                <label class="description-text">{{ activityItem.message }}
                  <img v-if="activityItem.action_type=='follow'" src="" class="follow-icon"/>
                  <img v-else-if="activityItem.action_type=='download'" src="/static/images/ic_download.png" class="download-icon"/>
                  <img v-else-if="activityItem.action_type=='play'" src="" class="play-icon"/>
                  <img v-else-if="activityItem.action_type=='comment'" src="/static/images/ic_message.png" class="comment-icon"/>
                  <img v-else-if="activityItem.action_type=='release'" src="" class="release-icon"/>
                  <img v-else-if="activityItem.action_type=='repost'" src="/static/images/ic_repeat.png" class="repost-icon"/>
                  <img v-else-if="activityItem.action_type=='share'" src="/static/images/ic_share.png" class="share-icon"/>
                  <v-icon v-else-if="activityItem.action_type=='recommend'" class="recommend-icon">thumb_up</v-icon>
                  <span
                    v-if="activityItem.assoc && activityItem.assoc_type!='Comment'"
                    @click="doAction()"
                    class="items-title"
                  >{{ activityItem.assoc.name }}</span>
                  <span
                    v-if="activityItem.assoc && activityItem.assoc.commentable"
                    @click="doAction()"
                    class="items-title"
                  >
                    <template v-if="activityItem.assoc.commentable_type=='Post'">Your Story</template>
                    <template v-else>{{ activityItem.assoc.commentable.name }}</template>
                  </span>
                </label>
              </div>
              <div class="details">
                <p v-if="activityItem.action_type=='comment'">"{{ activityItem.assoc.body }}"</p>
                <!-- <div
                  v-if="activityItem.assoc && activityItem.assoc_type=='ShopProduct'"
                  :style="{'background-image': 'url(' + activityItem.assoc.covers[0].cover.thumb.url + ')'}"
                  class="actioned-item"
                ></div>
                <div
                  v-if="activityItem.assoc && activityItem.assoc_type=='Album'"
                  :style="{'background-image': 'url(' + activityItem.assoc.cover.thumb.url + ')'}"
                  class="actioned-item"
                ><router-link :to="'/album/' + activityItem.assoc.slug"></router-link></div> -->
                <template v-if="activityItem.assoc && activityItem.assoc_type=='Comment'">
                  <div
                    v-if="activityItem.assoc.commentable_type=='ShopProduct'"
                    :style="{'background-image': 'url(' + activityItem.assoc.commentable.covers[0].cover.thumb.url + ')'}"
                    class="actioned-item"
                  ></div>
                  <div
                    v-else-if="activityItem.assoc.commentable_type=='Album'"
                    :style="{'background-image': 'url(' + activityItem.assoc.commentable.cover.thumb.url + ')'}"
                    class="actioned-item"
                  ></div>
                  <div
                    v-else-if="activityItem.assoc.commentable_type=='Post'"
                    :style="{'background-image': 'url(' + activityItem.assoc.commentable.cover.thumb.url + ')'}"
                    class="actioned-item"
                  ></div>
                </template>
                <div class="actioned-item" v-if="activityItem.assoc && activityItem.assoc_type=='ShopProduct'">
                  <activity-product-card :object="activityItem.assoc"></activity-product-card>
                </div>
                <div class="actioned-item" v-if="activityItem.assoc && activityItem.assoc_type=='Album'">
                  <activity-album-card :object="activityItem.assoc" ></activity-album-card>
                </div>
              </div>
            </div>
          </v-flex>
        </v-flex>

        <v-flex
          v-if="activityItem.sender.recent_items"
          xs12 md7
          class="activity-item-recent-posts"
        >
          <div class="recent-posts-section-title">Recent activity</div>
          <div
            v-for="(repost, index) in activityItem.sender.recent_items"
            v-if="['ShopProduct', 'Album'].indexOf(repost.assoc_type) > -1"
            :key="index"
            class="recent-post-item"
          >
            <activity-product-card :object="repost" v-if="repost.assoc_type=='ShopProduct'"></activity-product-card>
            <activity-album-card :object="repost" v-if="repost.assoc_type=='Album'"></activity-album-card>
          </div>
        </v-flex>
      </v-layout>
      <label class="activity-time">{{ toLocalTimeString(activityItem.updated_at) }}</label>
    </div>

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
  </div>
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
