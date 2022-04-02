<template>
  <div class="timeline-user">
    <div class="event-info">
      <div class="event-top-bar" pa-0>
        <div class="user-info">
          <user-tag :user="user" showAvatar width="30" height="30" />
          <label class="description-text">
            {{ actionText }}
          </label>
        </div>
      </div>

      <div row wrap class="event-body covers-content d-block" mt-2 pb-5>
        <!-- <div
          v-if="['Album', 'ShopProduct', 'Stream'].indexOf(recentItem.assoc_type) > -1"
          class="card-container"
        >
          <track-card
            v-if="recentItem.assoc_type == 'Album'"
            :objects="user.recent_items"
            :objectIndex="index"
          />
          <product-card
            v-if="recentItem.assoc_type == 'ShopProduct'"
            :dataObject="recentItem"
          />
          <video-box v-if="recentItem.assoc_type == 'Stream'" :item="recentItem.assoc" />
        </div> -->
        <div
          v-for="(feed, index) in user.recent_items.slice(0, 1)"
          v-if="
            ['Album', 'ShopProduct', 'Stream'].indexOf(feed.assoc_type) > -1
          "
          :key="index"
          class="show-card-container feed_assoc_item"
        >
          <!-- Show only 1 item (first on list) -->
          <div v-if="feed.assoc_type == 'Album'">
            <div>
              <track-card
                ref="trackCard"
                :noMeta="true"
                :noAction="true"
                :objects="user.recent_items"
                :objectIndex="index"
                :is-playing-status="setIsPlaying"
              />

            <div>
              <div class="side-action-details">
                <div class="__title">
                  {{ trackItem(user.recent_items, index).album_type }}
                </div>
                <div class="__subtitle-1">
                  {{ trackItem(user.recent_items, index).name }}
                </div>
                <div class="__subtitle-2">
                  {{ trackItem(user.recent_items, index).user.username }}
                </div>
              </div>
            </div>
            </div>
          </div>

          <v-container
            v-if="feed.assoc_type == 'Thought'"
            grid-list-md
            thought-feed
          >
            <v-layout row wrap align-center>
              <v-flex xs12>
                <div class="avatar-wrapper">
                  <user-tag :user="user" showAvatar hideTick width="70" height="70" />
                </div>
                <div class="thought-context text-xs-center mt-3">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Com sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.
                </div>
                <div class="attach-container">
                  <div class="__cover" :style="{ 'background-image': 'url(' + attachCover + ')' }"></div>

                  <div class="__details">
                      <div class="_meta-title">
                        <v-icon class="attach-icon">attachment</v-icon>
                        <span>Attachment</span>
                      </div>
                      <div class="_title"></div>
                      <div class="_info"></div>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>

          <div v-if="feed.assoc_type == 'ShopProduct'">
            <div>
              <product-card
                :dataObject="feed"
                noMeta
                hideMoreOptions
                hideOverlay
              />

              <div class="side-action-details">
                <div class="__title">
                  {{ productItem(feed, index).merchant.username }}
                </div>
                <div class="__subtitle-2">
                  {{ productItem(feed, index).name }}
                </div>
                <div class="__subtitle-1 __price">
                  ${{ productItem(feed, index).price | formatNumber }}
                </div>
              </div>
            </div>
          </div>

          <video-box v-if="feed.assoc_type == 'Stream'" :item="feed.assoc" />

          <div v-if="feed.assoc.commented" class="comment">
            <div class="comment_count_action">
              <div class="comment_count width100 justify-space-between">
                <div>
                  {{ feed.assoc.commented }} comment{{ feed.assoc.commented && feed.assoc.commented > 1 ? 's' : ''}}
                </div>

                <div class="commenters-group">
                  <user-tag v-for="(u, i) in commenters" :key="i" :user="u" class="commenter" showAvatar hideName hideTick width="25" height="25" />
                </div>
              </div>
              <!-- <div class="comment_action">
                <img
                  width="20"
                  class="comment_action-icon share-icon cursor-pointer"
                  src="/static/images/ic_share.svg"
                  @click="showShareDialog()"
                />
                <img
                  width="20"
                  class="comment_action-icon repost-icon cursor-pointer"
                  src="/static/images/ic_repost.svg"
                  @click="repostItem(feed.assoc.id)"
                />
                <share-modal
                  v-if="show_share_dialog"
                  :item="feed.assoc"
                  :dismiss="closeShareDialog"
                />
              </div> -->
            </div>

            <!-- <div class="comment_box">
              <comments :item="feed.assoc" :comments="comments" roundAvatar hideCommentCount hideComments />
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <merch-modal
      v-if="showMerchModal && user.recent_items[0].assoc_type === 'ShopProduct'"
      :item="user.recent_items[0].assoc"
      :dismiss="dimissMerchModal"
    />
  </div>
</template>

<script type="text/javascript" src="./timeline.ctrl.js"></script>
<style src="../../../../../static/styles/mobile/timeline.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.side-action-details {
  text-align: left;
  padding-left: 30px;
  margin-top: -30px;

  .__title {
    text-transform: uppercase;
    font-size: 13px;
    color: #777;
    padding-bottom: 8px;
  }
  .__subtitle-1 {
    font-weight: 500;
    font-size: 18px;
    padding-bottom: 3px;

    &.__price {
      margin-top: -10px;
    }
  }
  .__subtitle-2 {
    text-transform: uppercase;
    font-size: 14px;
    margin-bottom: 20px;
    font-weight: 700;
  }
  .song-btn {
    margin: 0 !important;
    width: 60px !important;
    height: 60px !important;
    background: #ddd8d8 !important;

    i {
      font-size: 40px;
      color: #000000;
    }
  }

  .view-product-btn {
    margin-top: 20px !important;
    background-color: #000000 !important;
    padding: 0 10px;
  }
}
.comment {
  .comment_count_action {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    padding-right: 20px;
    padding-left: 20px;
    margin-bottom: 20px;
    border-top: 1px solid #e4e4e4;

    .comment_count {
      letter-spacing: -1px;
      display: flex;
      align-items: center;
    }

    .comment_action {
      margin-left: auto;

      .share-icon {
        margin-right: 40px;
      }
    }
  }
  &_box {
    padding-top: 10px;
    border-top: 1px solid #e4e4e4;
  }
}
// chat input box
.ci {
  display: flex;
  width: 100%;

  &__header {
    width: 55px;
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-start;
    padding-left: 20px;
  }

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__image {
    width: 48px;
    height: 48px;
    border-radius: 100px;
    background-size: contain;
    background-repeat: no-repeat;
  }

  input {
    width: 100%;
    padding: 5px 10px;
    margin-left: 30px;
    margin-right: 20px;
  }
}
.user-section {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e4e4e4;
  padding: 20px 0;
  padding: 20px 0;

  .user__wrapper {
    display: flex;
    .user__image {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-size: contain;
      background-repeat: no-repeat;
      margin-right: 10px;
    }

    .tag {
      font-size: 20px;

      /deep/.user-status {
        margin-left: 0px;
        color: #24ab18;
      }
    }

    .vid__description {
      height: 24px;
      overflow: hidden;
    }

    .show-more-less {
      color: #333;
      font-size: 13px;
    }
  }
}
</style>
