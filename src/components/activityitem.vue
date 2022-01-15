<template>
  <div class="activity-item">
    <div class="activity-item-body">
      <v-layout row wrap>
        <v-flex
          xs12
          md12
          :class="{
            md5: activityItem.sender.recent_reposts,
            'no-reposts': !activityItem.sender.recent_reposts,
          }"
          class="activity-item-section"
        >
          <div class="activity-item-section-body">
            <v-flex xs10 class="activity-item-content-area">
              <profile-item
                :user="activityItem.sender"
                :className="'activity-item-profile-avatar-area'"
              ></profile-item>
              <div class="activity-item-content">
                <div :class="{'d-block': onMobile, 'dflex align-center': !onMobile}">
                  <user-tag class="user-name white--text" :user="activityItem.sender" />
                  <span v-if="!onMobile" class="mx-2 white--text">●</span>
                  <span class="activity-time">{{ toLocalTimeString(activityItem.updated_at) | formatDateFromNow }}</span>
                </div>
                <!-- <v-btn
                :class="{
                  'follow-btn': true,
                  follow: !activityItem.sender.is_following,
                  following: activityItem.sender.is_following,
                }"
                @click.native="followUser()"
                @mouseenter="buttonHover = true"
                @mouseleave="buttonHover = false"
                >{{ followButtonText }}</v-btn
              > -->

                <label class="description-text align-center">
                  <img v-if="activityIcon" :src="activityIcon" width="10" class="mr-2">
                  <span>{{ activityItem.message | capitalize }}</span>

                  <!-- <img
                    v-if="activityItem.action_type == 'follow'"
                    src=""
                    class="follow-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'download'"
                    src="/static/images/ic_download.png"
                    class="download-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'play'"
                    src=""
                    class="play-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'comment'"
                    src="/static/images/ic_message.png"
                    class="comment-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'release'"
                    src=""
                    class="release-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'repost'"
                    src="/static/images/ic_repeat.png"
                    class="repost-icon"
                  />
                  <img
                    v-else-if="activityItem.action_type == 'share'"
                    src="/static/images/ic_share.png"
                    class="share-icon"
                  />
                  <v-icon
                    v-else-if="activityItem.action_type == 'recommend'"
                    class="recommend-icon"
                    >thumb_up</v-icon
                  >
                  <span
                    v-if="
                      activityItem.assoc && activityItem.assoc_type != 'Comment'
                    "
                    @click="doAction()"
                    class="items-title"
                    >{{ activityItem.assoc.name }}</span
                  >
                  <span
                    v-if="activityItem.assoc && activityItem.assoc.commentable"
                    @click="doAction()"
                    class="items-title"
                  >
                    <template
                      v-if="activityItem.assoc.commentable_type == 'Post'"
                      >Story</template
                    >
                    <template v-else>{{
                      activityItem.assoc.commentable.name
                    }}</template>
                  </span> -->
                </label>                
              </div>
            </v-flex>

            <v-flex v-if="activityItem.action_type == 'comment' || activityItem.assoc" xs2 class="details">
              <p v-if="activityItem.action_type == 'comment'">
                <template v-if="activityItem.assoc_type == 'Comment'">
                  {{ activityItem.assoc.body }}
                </template>
                <template v-else-if="activityItem.assoc_type == 'Post'">
                  {{ activityItem.assoc.description }}
                </template>
              </p>

              <!-- <template v-if="activityItem.assoc">
                <template v-if="activityItem.assoc_type == 'Comment'">
                  <div
                    v-if="
                      activityItem.assoc.commentable_type == 'ShopProduct'
                    "
                    :style="{
                      'background-image':
                        'url(' +
                        activityItem.assoc.commentable.covers[0].cover.thumb
                          .url +
                        ')',
                    }"
                    class="actioned-item"
                  ></div>
                  <div
                    v-else-if="activityItem.assoc.commentable_type == 'Album'"
                    :style="{
                      'background-image':
                        'url(' +
                        activityItem.assoc.commentable.cover.thumb.url +
                        ')',
                    }"
                    class="actioned-item"
                  ></div>
                  <div
                    v-else-if="activityItem.assoc.commentable_type == 'Post'"
                    :style="{
                      'background-image':
                        'url(' +
                        activityItem.assoc.commentable.cover.thumb.url +
                        ')',
                    }"
                    class="actioned-item"
                  ></div>
                </template>

                <div
                  v-if="activityItem.assoc_type == 'Post'"
                  :style="{
                    'background-image':
                      'url(' + activityItem.assoc.cover.thumb.url + ')',
                  }"
                  class="actioned-item"
                ></div>

                <div
                  class="actioned-item"
                  v-if="activityItem.assoc_type == 'ShopProduct'"
                >
                  <activity-product-card :object="activityItem.assoc" />
                </div>
                <div
                  class="actioned-item"
                  v-if="activityItem.assoc_type == 'Album'"
                >
                  <activity-album-card :object="activityItem.assoc" />
                </div>
              </template> -->
            </v-flex>
          </div>
        </v-flex>

        <!-- <v-flex
          v-if="activityItem.sender.recent_items"
          xs12
          md7
          class="activity-item-recent-posts"
        >
          <div class="recent-posts-section-title">Recent activity</div>
          <div
            v-for="(repost, index) in activityItem.sender.recent_items"
            v-if="['ShopProduct', 'Album'].indexOf(repost.assoc_type) > -1"
            :key="index"
            class="recent-post-item"
          >
            <activity-product-card
              :object="repost"
              v-if="repost.assoc_type == 'ShopProduct'"
            ></activity-product-card>
            <activity-album-card
              :object="repost"
              v-if="repost.assoc_type == 'Album'"
            ></activity-album-card>
          </div>
        </v-flex> -->
      </v-layout>
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
import userTag from './user_tag'

export default {
  components: {
    profileItem,
    merchModal,
    activityAlbumCard,
    activityProductCard,
    userTag,
  },

  props: {
    activityItem: {
      type: Object,
    },
  },

  data() {
    return {
      showSendMessage: false,
      showMerchModal: false,
    }
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    toLocalTimeString() {
      return Utils.toLocalTimeString
    },

    actionText() {
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
    },
    activityIcon() {
      switch (this.activityItem.action_type) {
        case 'repost':
          return require('../../static/images/repost_blue.svg');
        case 'comment':
          return require('../../static/images/comment.svg');
        case 'order_product':
          return require('../../static/images/dollar.svg');
        case 'donation':
          return require('../../static/images/dollar.svg');
        default:
          return null
      }
    },

    followButtonText() {
      if (this.activityItem.sender.is_following) {
        return this.buttonHover ? "Unfollow" : "Following";
      }
      return "Follow";
    },
  },

  created() {},

  methods: {
    showMessageDialog() {
      this.showSendMessage = true
    },

    dismissMessageModal() {
      this.showSendMessage = false
    },

    imageURL(item) {
      if (item.cover) {
        return item.cover.thumb.url
      } else {
        return item.covers[0].cover.thumb.url
      }
    },

    blockUser() {},

    doAction() {
      switch (this.activityItem.assoc_type) {
        case 'ShopProduct':
          this.showMerchModal = !true
          break
        case 'Album':
          this.$router.push({
            path:
              this.activityItem.assoc.album_type +
              '/' +
              this.activityItem.assoc.slug,
          })
          break
        default:
          if (this.activityItem.assoc.commentable_type === 'Album') {
            this.$router.push({
              path:
                this.activityItem.assoc.commentable.album_type +
                '/' +
                this.activityItem.assoc.commentable.slug,
            })
          }
      }
    },

    dimissMerchModal() {
      this.showMerchModal = false
    },
  },
}
</script>
<style src="../../static/styles/activityitem.scss" lang="scss" scoped></style>
