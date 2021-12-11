<template>
  <!-- <div class="stream-player-wrapper" :class="{'is-hide': !$store.getters['streamPlayer/hasFrame']}"> -->
  <div class="stream-player-wrapper" ref="myVideoPlayer">
    <video
      ref="myVideo"
      id="my_video"
      class="video-js vjs-default-skin vjs-fluid"
      controls
    ></video>

    <div ref="myOverlay" class="my_overlay" v-if="user">
      <v-layout row wrap class="my-header">
        <v-flex xs12 sm10 offset-sm1>
          <v-toolbar class="header">
            <v-toolbar-title @click="choosePage('album')"></v-toolbar-title>
            <v-spacer></v-spacer>

            <v-tooltip bottom>
              <v-btn icon slot="activator" @click.native="choosePage('album')">
                <img
                  src="/static/images/ic_music_active.svg"
                  width="20"
                  style="margin-top: 3px"
                />
              </v-btn>
              <span>Album</span>
            </v-tooltip>

            <v-tooltip bottom>
              <v-btn
                icon
                slot="activator"
                @click.native="choosePage('product')"
              >
                <img
                  src="/static/images/ic_tag_active.svg"
                  width="18"
                  style="margin-top: -2px"
                />
              </v-btn>
              <span>Product</span>
            </v-tooltip>

            <v-tooltip bottom>
              <v-btn icon slot="activator" @click.native="choosePage('video')">
                <img src="/static/images/ic_video_active.svg" width="20" />
              </v-btn>
              <span>Video</span>
            </v-tooltip>

            <v-badge color="red">
              <span
                slot="badge"
                v-if="$store.state.activity.badge.stream > 0"
                >{{ $store.state.activity.badge.stream }}</span
              >
              <v-tooltip bottom>
                <v-btn icon slot="activator" @click.native="choosePage('feed')">
                  <img src="/static/images/ic_home_active.svg" width="20" />
                </v-btn>
                <span>Feed</span>
              </v-tooltip>
            </v-badge>

            <v-badge color="red">
              <span
                slot="badge"
                v-if="$store.state.activity.badge.activity > 0"
                >{{ $store.state.activity.badge.activity }}</span
              >
              <v-tooltip bottom>
                <v-btn
                  icon
                  slot="activator"
                  @click.native="choosePage('activity')"
                >
                  <img src="/static/images/ic_alarm_active.svg" width="18" />
                </v-btn>
                <span>Activity</span>
              </v-tooltip>
            </v-badge>

            <v-badge color="red">
              <span
                slot="badge"
                v-if="$store.state.activity.badge.message > 0"
                >{{ $store.state.activity.badge.message }}</span
              >
              <v-tooltip bottom>
                <v-btn
                  icon
                  slot="activator"
                  @click.native="choosePage('messages')"
                >
                  <img src="/static/images/ic_message_active.svg" width="20" />
                </v-btn>
                <span>Messages</span>
              </v-tooltip>
            </v-badge>

            <v-badge color="red">
              <span slot="badge" v-if="$store.state.activity.badge.cart > 0">{{
                $store.state.activity.badge.cart
              }}</span>
              <v-tooltip bottom>
                <v-btn icon slot="activator" @click.native="choosePage('cart')">
                  <img src="/static/images/ic_cart_active.svg" width="20" />
                </v-btn>
                <span>Cart</span>
              </v-tooltip>
            </v-badge>

            <v-badge color="red">
              <span slot="badge" v-if="$store.state.activity.badge.sell > 0">{{
                $store.state.activity.badge.sell
              }}</span>
              <v-tooltip bottom>
                <v-btn
                  icon
                  slot="activator"
                  @click.native="choosePage('sell')"
                  v-if="
                    $store.state.auth.user &&
                    ['artist', 'brand', 'label'].indexOf(
                      $store.state.auth.user.user_type
                    ) > -1
                  "
                >
                  <img
                    src="/static/images/ic_delivery_active.svg"
                    width="20"
                    style="margin-top: 2px"
                  />
                </v-btn>
                <span>Sell</span>
              </v-tooltip>
            </v-badge>

            <v-menu offset-y class="profile-menu" v-if="$store.state.auth.user">
              <v-btn icon slot="activator" @click.native="player.fullscreen()">
                <div
                  class="profile-image"
                  :style="{
                    'background-image':
                      'url(' + currentUser.avatar.thumb.url + ')',
                  }"
                ></div>
              </v-btn>
            </v-menu>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <div class="stream-sector" v-if="user.id == currentUser.id">
        <div class="stream-sector__header">
          <div class="stream-sector__header__left">
            <div
              class="avatar"
              :style="{
                'background-image': 'url(' + user.avatar.thumb.url + ')',
              }"
            ></div>
            <div class="name">{{ user.username }}</div>
          </div>
          <div class="stream-sector__header__right">
            <div class="time">{{ time | timeInHours }}</div>
          </div>
        </div>
        <div class="separator"></div>
        <div class="stream-sector__content">
          <div class="stream-sector__content__left">
            <div class="user-info">
              <label>
                <strong>{{ stream.stats.views_size }}</strong
                ><span>views</span>
              </label>
              <label v-if="stream.assoc_type === 'Album'">
                <strong>{{ stream.stats.downloads_size }}</strong
                ><span>downloaded</span>
              </label>
              <!-- <label v-if="stream.assoc_type === 'ShopProduct'">
                  <strong>{{ stream.stats.carts_size }}</strong><span>added to cart</span>
                </label> -->
              <label>
                <strong>{{ stream.stats.followed_size }}</strong
                ><span>followed</span>
              </label>
            </div>
          </div>
          <div class="stream-sector__content__right">
            <template v-if="showAttachButton">
              <v-btn
                dark
                color="blue"
                class="display-btn"
                @click.native="openAlbumMerchPopup()"
                >Display Merch / Album</v-btn
              >
            </template>
            <template v-else>
              <div class="media d-flex">
                <template v-if="stream && stream.assoc_type == 'Album'">
                  <div
                    class="media__image"
                    :style="`background-image: url(${stream.assoc.cover.thumb.url})`"
                  ></div>
                  <div class="media__content">
                    <div class="media__title">{{ stream.assoc.name }}</div>
                    <div class="media__description">
                      {{ stream.assoc.tracks.length }} tracks
                    </div>
                  </div>
                </template>
                <template
                  v-else-if="stream && stream.assoc_type == 'ShopProduct'"
                >
                  <div
                    class="media__image"
                    :style="`background-image: url(${stream.assoc.covers[0].cover.thumb.url})`"
                  ></div>
                  <div class="media__content">
                    <div class="media__title">{{ stream.assoc.name }}</div>
                    <div class="media__description">
                      ${{ stream.assoc.price | formatNumber }}
                    </div>
                  </div>
                </template>
                <template v-else-if="stream && stream.assoc_type == 'User'">
                  <div
                    class="media__image round"
                    :style="`background-image: url(${stream.assoc.avatar.thumb.url})`"
                  ></div>
                  <div class="media__content">
                    <div class="media__title">
                      {{ stream.assoc.username }}
                    </div>
                    <div class="media__description">
                      {{ stream.assoc.followers }} followers
                    </div>
                  </div>
                </template>

                <div class="media__action--hover">
                  <v-btn
                    @click.native="openAlbumMerchPopup()"
                    dark
                    color="blue"
                    class="display-btn"
                    ><v-icon>link</v-icon></v-btn
                  >
                  <v-btn
                    @click.native="removeItem()"
                    dark
                    color="red"
                    class="remove-btn"
                    ><v-icon>delete</v-icon></v-btn
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="stream-sector" v-else>
        <div class="stream-sector__header">
          <div class="stream-sector__header__left">
            <div
              class="avatar"
              :style="{
                'background-image': 'url(' + user.avatar.thumb.url + ')',
              }"
            ></div>
            <div class="user-info">
              <div class="name">{{ user.username }}</div>
              <div>
                <v-btn
                  round
                  dark
                  color="white"
                  class="follow-btn mr-0 px-2"
                  small
                  :class="{
                    follow: !user.is_following,
                    following: user.is_following,
                  }"
                  @mouseenter="buttonHover = true"
                  @mouseleave="buttonHover = false"
                  @click.native="followUser()"
                  >{{ followButtonText }}</v-btn
                >
                <v-btn
                  v-if="stream.is_reposted"
                  round
                  dark
                  small
                  color="green"
                  class="ml-1 px-2"
                  >Reposted</v-btn
                >
                <v-btn
                  v-else
                  round
                  dark
                  small
                  color="blue"
                  class="ml-1 px-2"
                  @click.native="repostStream()"
                  >Repost Stream</v-btn
                >
              </div>
            </div>
          </div>
          <div class="stream-sector__header__right"></div>
        </div>
        <div class="separator"></div>
        <div
          class="stream-sector__content"
          v-if="stream && stream.assoc_type == 'Album'"
        >
          <div class="stream-sector__content__left">
            <div
              class="media__image"
              :style="`background-image: url(${stream.assoc.cover.thumb.url})`"
            >
              <!-- <div class="media__image--hover" @click="removeItem()"><v-icon>delete</v-icon></div> -->
            </div>
            <div class="media__content">
              <div class="media__title">{{ stream.assoc.name }}</div>
              <div class="media__description">
                {{ stream.assoc.tracks.length }} tracks
              </div>
            </div>
          </div>
          <div class="stream-sector__content__right">
            <v-btn dark color="blue" @click.native="downloadAlbum()"
              >Download</v-btn
            >
          </div>
        </div>
        <div
          class="stream-sector__content"
          v-else-if="stream && stream.assoc_type == 'ShopProduct'"
        >
          <div class="stream-sector__content__left">
            <div
              class="media__image"
              :style="`background-image: url(${stream.assoc.covers[0].cover.thumb.url})`"
            >
              <div class="media__image--hover" @click="removeProductFromCart()">
                <v-icon>delete</v-icon>
              </div>
            </div>
            <div class="media__content">
              <div class="media__title">{{ stream.assoc.name }}</div>
              <div class="media__description">
                ${{ stream.assoc.price | formatNumber }}
              </div>
            </div>
          </div>
          <div class="stream-sector__content__right">
            <v-btn v-if="isInCart" dark color="green">Added to Cart</v-btn>
            <v-btn v-else dark color="blue" @click.native="openMerchModal()"
              >Add to Cart</v-btn
            >
          </div>
        </div>
        <div
          class="stream-sector__content"
          v-else-if="stream && stream.assoc_type == 'User'"
        >
          <div class="stream-sector__content__left">
            <div
              class="media__image round"
              :style="`background-image: url(${stream.assoc.avatar.thumb.url})`"
            >
              <!-- <div class="media__image--hover" @click="removeItem()"><v-icon>delete</v-icon></div> -->
            </div>
            <div class="media__content">
              <div class="media__title">{{ stream.assoc.username }}</div>
              <div class="media__description">
                {{ stream.assoc.followers }} followers
              </div>
            </div>
          </div>
          <div class="stream-sector__content__right">
            <v-btn dark color="blue" @click.native="visitProfile()"
              >Visit</v-btn
            >
          </div>
        </div>
      </div>

      <div class="album-merch-popup requests" v-if="show_album_merch_popup">
        <div class="dismiss-section" @click="closeAlbumMerchPopup()"></div>
        <div class="popup-section">
          <div class="requests-section">
            <div class="header-section">
              <p class="section-title">Attach content to live video</p>
              <div class="option-area">
                <v-btn
                  class="request-option-btn"
                  :class="{ selected: request_tab == 'Album' }"
                  @click.native="onRequestTab('Album')"
                  >Album</v-btn
                >
                <v-btn
                  class="request-option-btn"
                  :class="{ selected: request_tab == 'ShopProduct' }"
                  @click.native="onRequestTab('ShopProduct')"
                  >Product</v-btn
                >
                <!-- <v-btn class="request-option-btn" :class="{'selected':request_tab=='User'}" @click.native="onRequestTab('User')">User</v-btn> -->
              </div>
            </div>
            <div class="content-section" v-if="request_tab == 'Album'">
              <div
                v-for="album in albums"
                :key="album.id"
                class="request-item"
                :class="{ selected: assoc.id == album.id }"
                @click="selectItem('Album', album)"
              >
                <div class="avatar-area">
                  <div
                    class="avatar-image"
                    :style="`background-image: url(${album.cover.thumb.url})`"
                  ></div>
                </div>
                <div class="detail-area">
                  <label class="item-name">{{ album.name }}</label>
                  <label class="user-name">{{ album.user.username }}</label>
                </div>
              </div>
            </div>
            <div class="content-section" v-if="request_tab == 'ShopProduct'">
              <div
                v-for="product in products"
                :key="product.id"
                class="request-item"
                :class="{ selected: assoc.id == product.id }"
                @click="selectItem('ShopProduct', product)"
              >
                <div class="avatar-area">
                  <div
                    class="avatar-image"
                    :style="`background-image: url(${product.covers[0].cover.thumb.url})`"
                  ></div>
                </div>
                <div class="detail-area">
                  <label class="item-name">{{ product.name }}</label>
                  <label class="user-name">{{
                    product.merchant.username
                  }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <i
      ref="closeButton"
      class="fa fa-close close-btn"
      @click="closePlayer()"
    ></i>

    <template v-if="user">
      <v-dialog
        v-model="show_streaming_confirm_dialog"
        content-class="stream-view-confirm-dialog"
      >
        <div class="box">
          <div class="box__caption">Live</div>
          <div class="box__content">
            <div class="box__title">{{ stream.name }}</div>
            <div class="box__subtitle">
              {{ _.get(stream, "user.username") }}
              <v-icon>fa-check-circle</v-icon>
            </div>
            <label class="stream-genre">{{ _.get(stream, "genre.name") }}</label>
          </div>
          <div class="box__header">
            <label>{{ stream.started_at | formatDateFromNow }}</label>
          </div>
          <div
            class="box__image"
            :style="`background-image: url(${_.get(stream, 'cover.url')})`"
          ></div>
          <div class="box__footer">
            <v-btn
              v-if="can_view"
              block
              :class="{ 'theme--dark': enabledPlaying }"
              @click="onClick"
              :disabled="!enabledPlaying"
              >Watch{{ latencyTime }}</v-btn
            >
            <div v-else-if="exceed_capacity">
              Sorry,<br />
              Broadcast is at capacity
            </div>
            <v-btn v-else dark block @click="openPaymentDialog"
              >Pay ${{ stream.view_price | formatNumber }}</v-btn
            >
          </div>
        </div>
      </v-dialog>

      <merch-modal
        v-if="show_merch_modal"
        :item="product"
        :dismiss="closeMerchModal"
      />

      <share-modal
        v-if="show_share_dialog"
        :item="album"
        :dismiss="closeShareDialog"
      />
    </template>

    <v-dialog v-model="show_payment_dialog">
      <payment-modal
        v-if="show_payment_dialog"
        :receivers="[stream.user]"
        :amount="stream.view_price"
        :dismiss="closePaymentDialog"
        :finish="payViewStream"
      />
    </v-dialog>

    <v-dialog v-model="show_stream_delete_confirm_dialog">
      <v-card>
        <v-card-title class="headline">Delete a Stream</v-card-title>
        <v-card-text
          >If you click OK, the stream will no longer be available. Click OK to
          delete, or click Cancel.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="red--text darken-1" flat @click.native="archiveStream()"
            >Ok</v-btn
          >
          <v-btn
            class="green--text darken-1"
            flat
            @click.native="closeStreamDeleteConfirmDialog()"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script type="text/javascript" src="./stream_player.ctrl.js"></script>
