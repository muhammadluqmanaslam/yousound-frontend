<template>
  <div class="page video-page show-page mx-5" v-if="isPageReady">
    <v-layout row>
      <v-flex sm9>
        <video-player :src="stream.mp_channel_1_ep_1_url"></video-player>
      </v-flex>
      <v-flex sm3 pl-3>
        <div class="box">
          <div class="box__header">
            <div class="box__title">Join the conversation</div>
          </div>
          <div class="box__content">
            <chat :items="comments"></chat>
          </div>
          <div class="box__footer">
            <div class="ci">
              <div class="ci__header">
                <router-link :to="`/${currentUser.slug}`">
                  <div
                    class="ci__image"
                    :style="`background-image: url(${currentUser.avatar.url})`"
                  ></div>
                </router-link>
              </div>
              <div class="ci__content">
                <input
                  type="text"
                  v-model.trim="commentText"
                  placeholder="Say something nice!"
                  @keyup.enter="addComment()"
                />
              </div>
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>

    <div class="meta">
      <div class="meta__header">
        <router-link :to="`/${stream.user.slug}`">
          <div
            class="meta__image"
            :style="`background-image: url(${stream.user.avatar.url})`"
          ></div>
        </router-link>
      </div>
      <div class="meta__content">
        <div class="meta__title">{{ stream.name }}</div>

        <div class="meta__subtitle">
          {{ stream.viewers_size || 0 }}
          views &bull;
          {{ moment(stream.created_at).format('MMM D, YYYY') }}
        </div>

        <div class="meta__actions">
          <user-tag :user="stream.user" />
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
          <div
            class="meta__cta donate"
            v-if="hasDigitalContent"
            @click="openPaymentDialog()"
          >
            <img src="/static/images/ic_dollar.svg" height="32" />
          </div>
          <div class="meta__cta repost" @click="repostItem()">
            <img src="/static/images/ic_repost.svg" height="28" />
          </div>
          <div class="meta__cta share" @click="openShareDialog()">
            <img src="/static/images/ic_share.svg" height="28" />
          </div>
          <div class="meta__cta" v-if="currentUser.id === user.id">
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
              </v-list>
            </v-menu>
          </div>
        </div>

        <div class="meta__description">
          {{ stream.description }}
        </div>
      </div>
    </div>

    <div class="section users-section">
      <div class="section__header">
        <h4 class="section__title">Featured content and people</h4>
        <span
          class="section__subtitle"
          v-if="currentUser.id === user.id"
          @click="openFeaturedDialog()"
          >Edit attachment</span
        >
      </div>
      <div class="section__content">
        <div
          class="attach-container"
          v-if="stream.assoc && stream.assoc.id > 0"
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
                {{ stream.assoc.name }}
              </div>
              <div class="assoc__title">
                {{ stream.assoc.price }}
              </div>
              <div class="assoc__cta" v-if="stream.assoc_type == 'ShopProduct'">
                <img src="/static/images/ic_cart_active.svg" width="20" />
              </div>
            </div>
          </div>
        </div>

        <template v-for="account in stream.accounts">
          <div class="user-container" :key="`user-${account.id}`">
            <artist-item :artist="account" />
          </div>
        </template>
      </div>
    </div>

    <div class="section videos-section">
      <h4 class="section__title">Similar videos</h4>
      <div class="section__content">
        <template v-for="(video, index) in videos">
          <div class="video-container" :key="`video-${index}`">
            <video-box :video="video" />
          </div>
        </template>
      </div>
    </div>

    <v-dialog
      v-model="show_featured_dialog"
      content-class="featured-content-dialog"
    >
      <v-card>
        <v-card-text>
          <div class="headline mb-2">Add albms & products to your video</div>
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

    <share-modal
      v-if="show_share_dialog"
      :item="stream"
      type="Stream"
      :dismiss="closeShareDialog"
    ></share-modal>
  </div>
</template>

<script type="text/javascript" src="./show.ctrl.js"></script>

<style lang="scss" scoped>
.section {
  margin: 20px 0 0;
  border-top: 1px solid #ccc;

  &__content {
    display: block;
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

.users-section {
  .section__content {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }
}

// comments list
.box {
  position: relative;
  width: 100%;
  height: 100%;

  &__header {
    display: flex;
    align-items: center;
    height: 60px;
  }

  &__footer {
    display: flex;
    align-items: flex-end;
    height: 55px;
    margin-top: 5px;
    border-top: 1px solid #ccc;
  }

  &__content {
    position: relative;
    height: calc(100% - 120px);
  }

  &__title {
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    font-size: 20px;
    font-weight: 700;
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
  }

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  input {
    width: 100%;
    padding: 5px 10px;
  }
}

.meta {
  display: flex;
  margin: 20px 0 0;
  padding: 10px 0 0;
  border-top: 1px solid #ccc;

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
    margin-top: 10px;

    .tag {
      font-size: 20px;
    }
  }

  &__cta {
    display: inline-flex;
    margin-left: 25px;

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

.assoc {
  display: flex;
  height: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;

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
    align-items: center;
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
    font-size: 18px;
    font-weight: 700;
  }

  &__subtitle {
    font-size: 16px;
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
  padding: 10px 20px 10px 5px;
}

.user-container {
  display: inline-block;
  width: 12.5%;
  padding: 10px;
}

.video-container {
  display: inline-block;
  width: 20%;
  padding: 10px;
}
</style>
