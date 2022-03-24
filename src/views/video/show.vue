<template>
  <div v-if="isPageReady" class="page video-page show-page" :class="{'no-top-nav': !onMobile, onMobile }">
    <div class="page-content">
      <v-container fluid px-0 :class="{'grid-list-md px-4':!onMobile}">
        <v-layout row wrap>
          <v-flex xs12 sm9 class="vid_col">
            <video-player :src="stream.mp_channel_1_ep_1_url"></video-player>

            <div v-if="onMobile" class="pane-tabs-onMobile">
              <div
                v-for="(tab, index) in paneTabs"
                :key="index"
                class="pane-tab"
                :class="{active: activePaneTab == tab.id}"
                @click="activePaneTab = tab.id"
              >
                {{ tab.name }} <span v-if="tab.id == 'comments'">({{ comments.length | formatLargeNumber }})</span>
              </div>
            </div>

            <div v-if="activePaneTab == 'info'">
              <div class="content-section">
                <div class="meta__content" :class="{'px-4':onMobile}">
                  <user-tag v-if="onMobile" class="tag" showAvatar hideName hideTick clickUser width="40" height="40" :user="stream.user" />
                  <div v-if="onMobile" class="">{{ stream.name.split('- ')[1] }}</div>
                  <div v-if="!onMobile" class="meta__title">{{ stream.name }}</div>

                  <div v-if="onMobile" class="meta__title text-capitalize">{{ stream.user.username }}</div>

                  <div class="meta__subtitle">
                    {{ stream.viewers_size || 0 }}
                    views <span v-if="!onMobile">&bull;</span>
                    {{ moment(stream.created_at).format("MMM D, YYYY") }}
                  </div>

                  <div v-if="onMobile" class="meta__cta follow">
                    <v-btn
                      v-if="currentUser && stream.user.id != currentUser.id"
                      :class="{
                        'follow-btn': true,
                        follow: !stream.user.is_following,
                        following: stream.user.is_following,
                      }"
                      @mouseenter="buttonHover = true"
                      @mouseleave="buttonHover = false"
                      @click.native="followUser()"
                      >{{ followButtonText }}</v-btn
                    >
                  </div>
                </div>

                <div class="meta__actions" :class="{'py-3': !ownItem}">
                  <div v-if="ownItem" class="meta__cta donate">
                    <img src="/static/images/stat.svg" width="20" />
                  </div>

                  <div v-else class="meta__cta donate" @click="showLoveDialog()">
                    <img src="/static/images/ic_dollar.svg" height="21" />
                  </div>

                  <div class="meta__cta repost" @click="repostItem()">
                    <img src="/static/images/ic_repost.svg" height="17" />
                  </div>
                  <div class="meta__cta share" @click="openShareDialog()">
                    <img src="/static/images/ic_share.svg" height="17" />
                  </div>
                  <div class="meta__cta" v-if="ownItem">
                    <v-menu offset-y class="more-menu">
                      <v-btn icon slot="activator">
                        <v-icon>more_horiz</v-icon>
                      </v-btn>
                      <v-list>
                        <v-list-tile
                          class="default-menu-item"
                          @click.native="deleteStream()"
                        >
                          <v-list-tile-title>
                            <label>Delete</label>
                          </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile class="default-menu-item">
                          <v-list-tile-title>
                            <label>Report</label>
                          </v-list-tile-title>
                        </v-list-tile>

                        <v-list-tile
                          v-if="stream.user.username === currentUser.username"
                          class="default-menu-item"
                          :to="{ name: 'VideoEdit', params: { slug: stream.slug }}"
                        >
                          <v-list-tile-title>
                            <label>Edit Video</label>
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </div>

              <div v-if="!onMobile" class="user-section" :class="{'px-4':onMobile}">
                <div class="user__wrapper">
                  <router-link :to="`/${stream.user.slug}`">
                    <div
                      class="user__image"
                      :style="`background-image: url(${stream.user.avatar.url})`"
                    ></div>
                  </router-link>

                  <div>
                    <user-tag class="tag" :user="stream.user" />
                    <div class="vid__description">
                      {{ stream.description }}
                    </div>

                    <span
                      class="app-grey--text cursor-pointer showMoreActive"
                      @click="showMoreActive = !showMoreActive"
                    >
                      <b v-if="!showMoreActive" class="show-more-less show-more"
                        >SHOW MORE</b
                      >
                      <b v-if="showMoreActive" class="show-more-less show-less"
                        >SHOW LESS</b
                      >
                    </span>
                  </div>
                </div>

                <div class="meta__cta follow">
                  <v-btn
                    v-if="currentUser && stream.user.id != currentUser.id"
                    :class="{
                      'follow-btn': true,
                      follow: !stream.user.is_following,
                      following: stream.user.is_following,
                    }"
                    @mouseenter="buttonHover = true"
                    @mouseleave="buttonHover = false"
                    @click.native="followUser()"
                    >{{ followButtonText }}</v-btn
                  >
                </div>
              </div>

              <div v-if="showFeaturedSection" class="section users-section" :class="{'px-4':onMobile}">
                <div class="section__header">
                  <h4 class="section__title">Featured content and people</h4>
                  <span
                    class="section__subtitle"
                    v-if="ownItem"
                    @click="openFeaturedDialog()"
                    >Edit attachment</span
                  >
                </div>
                <div class="section__content">
                  <div
                    class="attach-container cursor-pointer"
                    v-if="stream.assoc && stream.assoc.id > 0"
                    @click="gotoAssoc()"
                  >
                    <div class="assoc">
                      <div class="assoc__header">
                        <div class="assoc__image-wrapper">
                          <div
                            class="assoc__image"
                            :style="`background-image: url(${assocImage})`"
                          ></div>
                        </div>
                      </div>
                      <div class="assoc__content">
                        <div class="assoc__subtitle">
                          <span class="__name">{{ stream.assoc.name }}</span>
                          <div v-if="onMobile">
                            <b class="__name text-capitalize">{{ stream.assoc.merchant.username }}</b>
                          </div>
                          <br />
                          <span
                            v-if="stream.assoc.user"
                            class="app-bold __user_name"
                          >
                            {{ stream.assoc.user.username }}
                          </span>
                        </div>
                        <div class="assoc__title">
                          <span v-if="stream.assoc.price && !onMobile">
                            ${{ stream.assoc.price | formatNumber }}
                          </span>
                        </div>
                        <div
                          class="assoc__cta-"
                          v-if="stream.assoc_type == 'ShopProduct'"
                        >
                          <!-- <img src="/static/images/ic_cart_active.svg" width="20" /> -->
                          <v-btn v-if="!onMobile" round outline small class="text-capitalize ma-0">
                            view
                          </v-btn>
                        </div>
                        <div
                          class="assoc__cta-"
                          v-if="stream.assoc_type == 'Album'"
                        >
                          <!-- <img src="/static/images/ic_cart_active.svg" width="20" /> -->
                          <v-btn round outline small class="text-capitalize ma-0">
                            Play
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="profile-section attach-container"
                    v-if="stream.assoc && stream.assoc.id > 0"
                  >
                    <div v-if="stream.accounts.length" class="assoc">
                      <template v-for="account in stream.accounts">
                        <div class="user-container" :key="`user-${account.id}`">
                          <artist-item :artist="account" />
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-flex>

          <v-flex v-if="activePaneTab == 'info'" xs12 sm3 class="related_col" :class="{'pl-3': !onMobile}">
            <div class="videos-section">
              <h4 class="__title">Related Videos</h4>
              <div class="section__content">
                <!-- <template v-for="(video, index) in videos">
                  <div class="video-container" :key="`video-${index}`">
                    <video-box :item="video" hideUser />
                  </div>
                </template> -->
                <div
                  v-for="(video) in videos"
                  :key="video.name"
                  :class="{side_fullwidth: onMobile}"
                >
                  <video-box :hoverOverlay="false" :item="video" showUsername :hideUser="!onMobile ? true : false" :sideTabView="!onMobile ? true : false" />
                </div>
              </div>
            </div>
          </v-flex>

          <v-flex v-if="!onMobile || activePaneTab == 'comments'" xs12 sm9 comment-wrapper :class="{'px-4':onMobile}">
            <comments :item="stream" :comments="comments" roundAvatar />
          </v-flex>
          <!-- <v-flex xs3>
            <div class="album-reposted-section">
              <h4 class="__title">
                Reposted by {{ stream.user.username }}
              </h4>
              <v-layout row wrap class="recent-content">
                <template v-for="(feed, index) in album.user.recent_items">
                  <div
                    v-if="
                      ['Album', 'ShopProduct', 'Stream'].indexOf(feed.assoc_type) > -1
                    "
                    :key="feed.id"
                    class="card-container"
                  >
                    <track-card
                      :objects="album.user.recent_items"
                      :objectIndex="index"
                      v-if="feed.assoc_type == 'Album'"
                    />
                    <product-card
                      :dataObject="feed"
                      v-if="feed.assoc_type == 'ShopProduct'"
                    />
                    <video-card
                      :dataObject="feed"
                      v-if="feed.assoc_type == 'Stream'"
                    />
                  </div>
                </template>
              </v-layout>
            </div>
          </v-flex> -->
        </v-layout>
      </v-container>
    </div>

    <!-- <div class="meta">
      <div class="meta__header">
        <router-link :to="`/${stream.user.slug}`">
          <div
            class="meta__image"
            :style="`background-image: url(${stream.user.avatar.url})`"
          ></div>
        </router-link>
      </div>
    </div> -->

    <v-dialog
      v-model="show_featured_dialog"
      content-class="featured-content-dialog"
    >
      <v-card>
        <v-card-text>
          <div class="headline mb-2">Add albmus & products to your video</div>
          <v-divider />
          <div
            class="mt-3 pa-3"
            style="
              text-align: left;
              background-color: #f8f8f8;
              border: 1px solid #eee;
              border-radius: 5px;
            "
          >
            <attach v-model="stream_assoc" style="width: 100%" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            round
            color="blue"
            @click.native="updateStream()"
            class="px-4"
            >Update</v-btn
          >
          <v-btn
            dark
            round
            color="grey"
            @click.native="closeFeaturedDialog()"
            class="px-4"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="show_payment_dialog">
      <payment-modal
        v-if="show_payment_dialog"
        :receivers="[stream.user]"
        :amount="amount"
        :dismiss="closePaymentDialog"
        :finish="payAttachment"
      />
    </v-dialog>

    <send-love-modal
      v-if="showSendLoveModal"
      :item="user"
      :dismiss="dismissLoveDialog"
    />

    <share-modal
      v-if="show_share_dialog"
      :item="stream"
      type="Stream"
      :dismiss="closeShareDialog"
    ></share-modal>

    <merch-modal
      v-if="showMerchModal"
      :item="stream.assoc"
      :dismiss="dimissMerchDialog"
    />
  </div>
</template>

<script type="text/javascript" src="./show.ctrl.js"></script>
<style src="../../../static/styles/video.scss" lang="scss" scoped></style>

<style lang="scss" scoped>
.vid_col {
  // -ms-flex-preferred-size: 66.66666666666666%;
  // flex-basis: 100%;
  // max-width: 80%;
}
.video-page {
  .page-content {
    margin-top: 0;
  }

  .section {
    border-top: 1px solid #e4e4e4;

    &__content {
      display: block;

      .profile-section {
        .user-container {
          padding: 13px;
        }

        /deep/.artist-cover {
          border-radius: 0;
          width: 100px;
          height: 84px;
          background-size: contain;
          margin-right: 15px;
          padding: 0;
        }
        /deep/.artist-info-section {
          display: flex;
          align-items: center;
          margin: 0;
        }
        /deep/.avatar-cover {
          padding: 0 !important;
        }

        /deep/.artist-actions {
          pointer-events: none;
        }
      }
    }

    &__title {
      margin-top: 20px;
      font-size: 18px;
    }

    &__subtitle {
      color: #1976d2;
      cursor: pointer;
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
        font-size: 16px;

        /deep/.user-status {
          margin-left: 0px;
          color: #24ab18;
        }
      }

      .vid__description {
        height: 20px;
        overflow: hidden;
      }

      .show-more-less {
        color: #333;
        font-size: 13px;
      }
    }
  }

  .users-section {
    .section__title {
      margin-top: 12px;
      font-size: 14px;
    }

    .section__content {
      width: 100%;
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: 12px;
      margin-top: 10px;
    }
  }

  .content-section {
    display: flex;
    padding: 10px 0;
    .meta {
      display: flex;
      margin: 20px 0 0;
      padding: 10px 0 0;
      border-top: 1px solid #f3dfdf;

      &__header {
        width: 60px;
        flex: 0 0 auto;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
      }

      &__content {
        flex: 1;
      }

      &__image {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-size: contain;
        background-repeat: no-repeat;
      }

      &__title {
        font-size: 16px;
        font-weight: 700;
      }

      &__actions {
        display: flex;
        align-items: center;
        // margin-top: 10px;

        .tag {
          font-size: 20px;
        }
      }

      &__cta {
        display: inline-flex;
        margin-left: 32px;

        img {
          cursor: pointer;
        }

        .options {
          filter: invert(1);
          width: 20px;
          height: auto;
          padding: 15px 0;
        }
      }
    }
  }
  .assoc {
    display: flex;
    height: 100%;
    border-radius: 5px;
    border: 1px solid #e4e4e4;

    &__header {
      position: relative;
      width: 40%;
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px;
    }

    &__content {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
    }

    &__image-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 100%;
    }

    &__image {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }

    &__title {
      font-size: 16px;
      font-weight: 700;
      padding-bottom: 14px;
    }

    &__subtitle {
      font-size: 14px;
      padding-bottom: 0px;

      .__name {
        white-space: break-spaces;
      }
    }

    &__cta {
      position: absolute;
      right: 20px;
      bottom: 20px;
      width: 40px;
      height: 40px;
      background-color: #000;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        filter: invert(1);
      }
    }
  }

  .follow-btn {
    text-transform: none;
    box-shadow: none;
    height: 36px;
    border-radius: 24px;
    font-size: 14px;
    letter-spacing: 0;
    min-width: 100px;
    &.follow {
      border: 1px solid #1872ff;
      background-color: #1872ff !important;
      color: #fff !important;
    }
    &.following {
      border: 1px solid #5bad00;
      background-color: #0000 !important;
      color: #000 !important;
      &:hover {
        border: 0.75px solid #dc3545;
        background-color: #dc3545 !important;
        color: #fff !important;
      }
    }
  }

  .attach-container {
    display: inline-block;
    width: 37.5%;
    padding: 16px 20px 10px 5px;
  }

  .user-container {
    display: inline-block;
    padding: 10px;
  }

  .video-container {
    display: inline-block;
    width: 100%;
    padding: 10px;
    margin-top: -20px;
  }
  .related_col {
    position: sticky;
    top: 0;

    .videos-section {
      .__title {
        // margin-left: 10px;
        margin-bottom: 10px;
      }

      .video-container {
        .box {
          display: flex;
          align-items: center;

          /deep/ &__content {
            width: 40%;
            margin-right: 20px;
          }
        }
      }
    }
  }

  &.onMobile {
    .users-section {
      .section__content {
        overflow-x: unset;
      }
    }
    .content-section {
      display: block;

      .meta__title {
        max-width: 75%;
      }
      .meta__content {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      .meta__subtitle {
        flex-basis: 100%;
        padding-left: 52px;
        color: #606060;
      }
      .meta__actions {
        border-top: 1px solid #e4e4e4;
        justify-content: space-around;
        margin-top: 12px;
        margin-bottom: -10px;

        .meta__cta {
          margin: 0;
        }
      }
    }
    .attach-container {
      display: inline-block;
      width: 100%;
      padding: 0;
    }
    .assoc {
      display: flex;
      height: 100%;
      border-radius: 5px;
      border: none;

      &__header {
        width: 23%;
      }

      &__content {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px;
      }

      &__image-wrapper {
        position: relative;
        width: 100%;
        padding-bottom: 100%;
      }

      &__image {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      &__title {
        font-size: 16px;
        font-weight: 700;
        padding-bottom: 0;
      }

      &__subtitle {
        font-size: 14px;
        padding-bottom: 0px;

        .__name {
          white-space: break-spaces;
        }
      }

      &__cta {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: 40px;
        height: 40px;
        background-color: #000;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          filter: invert(1);
        }
      }
    }
    .follow-btn {
      &.follow {
        border: 1px solid #000000;
        background-color: #000000 !important;
        color: #fff !important;
      }
      &.following {
        border: 1px solid #5bad00;
        background-color: #0000 !important;
        color: #000 !important;
        &:hover {
          border: 0.75px solid #dc3545;
          background-color: #dc3545 !important;
          color: #fff !important;
        }
      }
    }
  }
}
</style>
