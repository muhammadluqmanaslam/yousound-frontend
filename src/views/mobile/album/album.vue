<template>
  <transition name="slide-up">
    <div v-if="isPageReady" class="page album-detail-page">
      <div class="album-pages" v-if="isPageReady">
        <div class="album-info-page" id="album_info_page">
          <div class="album-image-section mb-3">
            <div
              class="album-image"
              :style="`background-image: url(${coverImageURL})`"
            ></div>

            <!-- <div class="meta-details">
              <span class="album-plays"
                >{{
                  album.played.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }}
                plays</span
              >
              <span class="mx-2">&bull;</span>
              <span class="cursor-pointer" @click="dialog = true"
                >Album Credits</span
              >
            </div> -->
          </div>
          <div class="album-details px-3 dflex align-center justify-space-between">
            <div class="album-info">
              <div class="album-type">
                {{ album.album_type }}
              </div>
              <div class="album-title">
                {{ album.name }}
              </div>
              <div class="album-artist">
                <router-link :to="'/' + album.user.slug" class="album-detail">{{
                  album.user.username
                }}</router-link>

                <template v-for="collaborator in album.collaborators">
                  <div :key="`${collaborator.id}`" class="d-inline-block">
                    <span>,</span>
                    <router-link
                      :to="'/' + collaborator.user.slug"
                      class="album-detail"
                      >{{ collaborator.user.username }}</router-link
                    >
                  </div>
                </template>
              </div>
            </div>

            <div class="play-button-section">
              <v-btn
                class="play-button play-pause-btn"
                @click.native="playSong()"
                v-if="!isPlaying || $store.state.player.isPaused"
              >
                <v-icon class="play">play_arrow</v-icon>
              </v-btn>
              <v-btn
                class="pause-button play-pause-btn"
                @click.native="pauseSong()"
                v-else-if="isPlaying && !$store.state.player.isPaused"
              >
                <v-icon class="pause">pause</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="album-action px-3 dflex align-center justify-space-between">
            <v-btn
              v-if="album.collaborators_count == 0"
              round
              depressed
              dark
              class="ml-0"
              :class="{
                'follow-btn': true,
                follow: !album.user.is_following,
                following: album.user.is_following,
              }"
              @mouseenter="buttonHover = true"
              @mouseleave="buttonHover = false"
              @click.native="followUser(album.user)"
              >
                {{ followButtonText }}
              </v-btn>

              <img
                class="track-status-icon"
                width="25"
                src="/static/images/ic_share.svg"
                @click.native="openShareModal()"
              />

              <img
                class="track-status-icon"
                width="25"
                src="/static/images/ic_repost.svg"
                @click.native="openShareModal()"
              />

              <img
                class="track-status-icon"
                width="25"
                src="/static/images/stat.svg"
                @click.native="openShareModal()"
              />
          </div>

          <div class="album-tracks px-3">
            <div class="_intro py-3">
              <b>Tracklist</b>
              <span class="mx-2">•</span>
              <b>{{ album.tracks.length }} {{ 'track' | pluralize(album.tracks.length) }}</b>
            </div>

            <div class="album-tracks-section">
              <album-track-item
                v-for="(track, index) in album.tracks"
                :key="index"
                :album="album"
                :trackIndex="index"
                showIndexPlayIcon
                hideMoreBtn
                class="each-track"
              ></album-track-item>
            </div>
          </div>
          <!-- <div class="album-detail-section">
            <div class="album-info-section">
              <label class="album-title">{{ album.album_type }}</label>
              <h4 class="album-name">{{ album.name }}</h4>
              <div class="album-detail">
                by
                <router-link :to="'/' + album.user.slug" class="album-detail">{{
                  album.user.username
                }}</router-link>
                <template v-for="collaborator in album.collaborators">
                  <div :key="`${collaborator.id}`" class="d-inline-block">
                    <span>,</span>
                    <router-link
                      :to="'/' + collaborator.user.slug"
                      class="album-detail"
                      >{{ collaborator.user.username }}</router-link
                    >
                  </div>
                </template>
                <div
                  v-if="
                    currentUser &&
                    currentUser.user_type != 'listener' &&
                    album.enabled_sample
                  "
                  class="album-sample-clearance mr-2"
                >
                  • Cleared to be sampled on YouSound.
                  <span
                    class="border-bottom"
                    @click="openSampleClearanceLicenseModal()"
                    >More Info</span
                  >
                </div>
                <label
                  class="album-stats-btn"
                  @click="goToAlbumStats('played_by')"
                  v-if="showStats"
                  >View Stats</label
                >
              </div>
              <span class="play-button-section">
                <v-btn
                  dark
                  class="play-button"
                  @click.native="playSong()"
                  v-if="!isPlaying || $store.state.player.isPaused"
                >
                  <v-icon class="play">play_arrow</v-icon>
                </v-btn>
                <v-btn
                  dark
                  class="play-button"
                  @click.native="pauseSong()"
                  v-if="isPlaying && !$store.state.player.isPaused"
                >
                  <v-icon class="pause">pause</v-icon>
                </v-btn>
              </span>
              <span class="album-action-section">
                <v-menu offset-y class="more-menu">
                  <v-btn dark class="more-btn" slot="activator">
                    <v-icon right>more_horiz</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile
                      key="share"
                      class="default-menu-item"
                      @click.native="openShareModal()"
                    >
                      <v-list-tile-title>
                        <label>Share</label>
                      </v-list-tile-title>
                    </v-list-tile>

                    <v-list-tile
                      v-if="album.user.username === currentUser.username"
                      key="edit"
                      class="default-menu-item"
                      :to="{ name: 'UploadAlbum', params: { slug: album.slug } }"
                    >
                      <v-list-tile-title>
                        <label>Edit Album</label>
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </span>
            </div>
          </div> -->
        </div>

        <div class="comments-section pa-3 dflex align-center justify-space-between">
          <div
            class="dflex align-center"
            @click="showComments()"
          >
            <img class="mr-2" src="/static/images/ic_comment.svg" />
            <b>{{ comments.length }} {{ "comment" | pluralize(comments.length) }}</b>
          </div>

          <div v-if="comments.length" class="commenters-group">
            <user-tag v-for="(u, i) in commenters" :key="i" :user="u" class="commenter" showAvatar hideName hideTick />
          </div>
        </div>

        <!-- Featured Product -->
        <div v-if="album.products.length" class="product-section pa-3">
          <h4>Shop {{ feat_product.merchant.username | capitalize }}</h4>

          <div class="featured __product width100">
            <div
              class="_image"
              :style="{ 'background-image': 'url(' + feat_product.covers[0].cover.thumb.url + ')' }"
            ></div>
            <div class="_details">
              <div class="_prod_name">{{ feat_product.name }}</div>
              <div class="_merchant-name">{{ feat_product.merchant.username }}</div>
              <div class="_price">${{ feat_product.price | formatNumber }}</div>
            </div>
          </div>
        </div>

        <!-- Suggestions -->
        <div v-if="album.user.recent_items.length > 0" class="suggestion-section pa-3">
          <h3 class="_title mb-2">
            Suggested by 
            <span class="text-capitalize">
              {{ album.user.username }}
            </span>
          </h3>

          <div class="_subtitle" v-if="album.user.recent_items.length < 1">
            <b>No suggestions yet</b>
          </div>

          <item-tab
            v-else
            :minHeight="suggestionHasProduct ? 323 : ''"
          >
            <template slot="itemTabs">
              <span
                v-for="(feed, index) in album.user.recent_items"
                :key="index"
                class="tab-holder"
              >
                <div
                  v-if="
                    ['Album', 'ShopProduct', 'Stream'].indexOf(
                      feed.assoc_type
                    ) > -1
                  "
                  :key="feed.id"
                  class=""
                >
                  <track-card
                    :objects="album.user.recent_items"
                    :objectIndex="index"
                    v-if="feed.assoc_type == 'Album'"
                  />
                  <product-card
                    v-if="feed.assoc_type == 'ShopProduct'"
                    :dataObject="feed"
                    hideOptionCount
                  />
                  <video-card
                    v-if="feed.assoc_type == 'Stream'"
                    :dataObject="feed"
                  />
                </div>
              </span>
            </template>
          </item-tab>
        </div>
      </div>

      <div class="credits-dialog-wrapper">
        <v-dialog
          v-model="dialog"
          class="album-credits-dialog"
          scrollable
          max-width="600px"
        >
          <v-card class="album-dialog-body">
            <v-card-title>Album Credits</v-card-title>
            <v-btn class="dialog-close-btn" @click.native="dialog = false"
              ><v-icon>highlight_off</v-icon></v-btn
            >
            <v-card-text style="height: 300px">
              <v-flex xs12 sm12>
                <label class="album-info-label">Album Name: </label>
                <label class="album-info-text">{{ album.name }}</label>
              </v-flex>
              <v-flex xs12 sm12>
                <label class="album-info-label">Release Date: </label>
                <label class="album-info-text">{{
                  album.released_at | formatDate
                }}</label>
              </v-flex>
              <v-flex xs12 sm12 v-if="album.location && album.location != ''">
                <label class="album-info-label">Location: </label>
                <label class="album-info-text">{{ album.location }}</label>
              </v-flex>
              <v-flex xs12 sm12>
                <label class="album-info-label">Genre: </label>
                <label class="album-info-text">{{ genres }}</label>
              </v-flex>
              <v-flex
                xs12
                sm12
                v-if="album.collaborators && album.collaborators.length > 0"
              >
                <label class="album-info-label">Collaborators: </label>
                <label class="album-info-text">
                  <template v-for="c in album.collaborators">
                    <div class="collaborator-info" :key="`collaborator-${c.id}`">
                      <router-link class="user-name" :to="`/${c.user.slug}`">{{
                        c.user.username
                      }}</router-link>
                      <span> - {{ c.user_role }}</span>
                    </div>
                  </template>
                </label>
              </v-flex>
              <v-flex xs12 sm12>
                <label class="album-info-label">Contributors: </label>
                <label class="album-info-text">
                  <div class="contributor-info">
                    <router-link class="user-name" :to="`/${album.user.slug}`">{{
                      album.user.username
                    }}</router-link>
                    <span> - Uploader</span>
                  </div>
                </label>
                <label
                  class="album-info-text"
                  v-if="album.contributors && album.contributors.length > 0"
                >
                  <template v-for="c in album.contributors">
                    <div class="contributor-info" :key="`contributor-${c.id}`">
                      <router-link class="user-name" :to="`/${c.user.slug}`">{{
                        c.user.username
                      }}</router-link>
                      <span> - {{ c.user_role }}</span>
                    </div>
                  </template>
                </label>
              </v-flex>
              <v-flex
                xs12
                sm12
                v-if="album.samplings && album.samplings.length > 0"
              >
                <label class="album-info-label">Samples: </label>
                <label
                  class="album-info-text"
                  v-if="album.samplings && album.samplings.length > 0"
                >
                  <template v-for="s in album.samplings">
                    <div class="sampling-info" :key="`sampling-${s.id}`">
                      <label>{{ s.sampling_track.name }}</label
                      >:&nbsp;<router-link
                        class="user-name"
                        :to="`/${s.sample_user.slug}`"
                        >{{ s.sample_user.username }}</router-link
                      >
                      <span> - {{ s.sample_track.name }}</span>
                    </div>
                  </template>
                </label>
              </v-flex>
              <v-flex xs12 sm12 v-if="album.labels && album.labels.length > 0">
                <label class="album-info-label">Label: </label>
                <label class="album-info-text">
                  <router-link
                    class="user-name"
                    :to="`/${album.labels[0].user.slug}`"
                    >{{ album.labels[0].user.username }}</router-link
                  >
                </label>
              </v-flex>
              <v-flex xs12 sm12>
                <div class="album-info-label">About the album:</div>
                <label class="album-info-text">{{ album.description }}</label>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>

      <!-- Show Comments Dialog -->
      <mobile-comments
        :item="album"
        :comments="comments"
        ref="mobileComments"
      >
        <template slot="_assoc">
          <trackcard-simple :item="album" />
        </template>
      </mobile-comments>

      <v-dialog
        v-model="show_sample_clearance_license_modal"
        content-class="my-dialog-1 large"
      >
        <sample-license-dialog :dismiss="closeSampleClearanceLicenseModal" />
      </v-dialog>

      <merch-modal
        v-if="showMerchModal"
        :item="album.products[0]"
        :dismiss="dimissMerchDialog"
      />

      <download-modal
        v-if="showDownloadModal"
        :item="album"
        :dismiss="dismissDownloadModal"
      />

      <promote-modal
        v-if="showPromoteMessage"
        :item="album"
        :dismiss="dismissPromoteModal"
        :success="saveAndFinish"
      />

      <album-finish-modal
        v-if="isShowFinishModal"
        :item="album"
        :promote="showPromoteModal"
        :dismiss="dismissFinishDialog"
      />

      <share-modal
        v-if="showShareModal"
        :item="album"
        :dismiss="closeShareModal"
      />
    </div>
  </transition>
</template>

<script>
  import _ from 'lodash'
  import Vue from 'vue'
  import { mapActions } from 'vuex'
  import { Picker } from 'emoji-mart-vue'
  import { MyEvents, Utils } from '@/helper'

  import AlbumService from '@/services/album'
  import CommentService from '@/services/comment'
  import UserService from '@/services/user'

  import activityItem from '@/components/activityitem'
  import albumTrackItem from '@/components/albumtrackitem'
  import albumFinishModal from '@/components/albumfinishmodal'
  import downloadModal from '@/components/downloadmodal'
  import merchModal from '@/components/merchmodal'
  import productCard from '@/components/productcard'
  import promoteModal from '@/components/promotemodal'
  import sampleLicenseDialog from '@/views/album/components/sample_license_dialog'
  import shareModal from '@/components/sharemodal'
  import trackCard from '@/components/trackcard'
  import trackcardSimple from '@/components/trackCard-simple'
  import videoCard from '@/components/videocard'
  import featuredProduct from '@/components/featuredProduct'
  import UserTag from '@/components/user_tag'
  import ItemTab from '@/components/itemTab'
  import MobileComments from '../components/mobileComments'

  const ActionCable = require('actioncable')
export default {
  components: {
      Picker,
      activityItem,
      albumFinishModal,
      albumTrackItem,
      downloadModal,
      merchModal,
      productCard,
      promoteModal,
      sampleLicenseDialog,
      shareModal,
      trackCard,
      trackcardSimple,
      videoCard,
      featuredProduct,
      UserTag,
      ItemTab,
      MobileComments,
  },

  data() {
    return {
      showDownloadModal: false,
      showMerchModal: false,
      showPromoteMessage: false,
      showShareModal: false,
      isShowFinishModal: false,
      showEmojiPicker: false,
      show_sample_clearance_license_modal: false,
      slug: null,
      cable: null,
      comments_subscription: null,
      album: {
          name: '',
          user: {
          display_name: '',
          },
          cover: {
          large: '',
        },
      },
      trackIndex: 0,
      comments: [],
      commentString: '',
      comment_pagination: {
        count: 0,
        current_page: 0,
        per_page: 5,
        total_count: 0,
        total_pages: 0,
      },
      buttonHover: false,
      // buttonHover: [],
      dialog: false,
      roles: [],
      isPageReady: false,
    }
  },
  computed: {
    feat_product() {
      const product = this.album.products[0] || {}
      return product
    },
    suggestionHasProduct() {
      const suggestions = this.album.user.recent_items
      const hasProduct = suggestions.some((f)=> f.assoc_type == 'ShopProduct')
      console.log(hasProduct);
      if (hasProduct) return true
      return false
    },
    commenters() {
      return [
        {
          username: 'user-1',
          avatar: {
            url: 'https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/5/thumb_2c068f2d-5dbf-445e-8715-2f17cf4fd6ce.jpg',
          },
        },
        {
          username: 'user-2',
          avatar: {
            url: 'https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/5/thumb_2c068f2d-5dbf-445e-8715-2f17cf4fd6ce.jpg',
          },
        },
        {
          username: 'user-3',
          avatar: {
            url: 'https://d19mruzykfu6hg.cloudfront.net/uploads/user/avatar/5/thumb_2c068f2d-5dbf-445e-8715-2f17cf4fd6ce.jpg',
          },
        },
      ].slice(0, 8) // max of 8
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
    return this.$store.state.auth.user
    },

    toLocalTimeString() {
    return Utils.toLocalTimeString
    },

    showStats() {
    return !_.isEmpty(
        _.find(this.roles, (user_album) => {
        return (
            ['creator', 'label', 'collaborator'].indexOf(user_album.user_type) >
            -1
        )
        })
    )
    },

    coverImageURL() {
      if (this.album.cover) {
          return this.album.cover.large.url
      } else {
          return ''
      }
    },

    coverThumbImageURL() {
    if (this.album.cover) {
        return this.album.cover.thumb.url + '?' + new Date()
    } else {
        return ''
    }
    },

    commentsCount() {
    if (this.comment_pagination.total_count > 0) {
        return this.comment_pagination.total_count
    } else {
        return 'No'
    }
    },

    hasMoreComments() {
    return (
        this.comment_pagination.current_page <
        this.comment_pagination.total_pages
    )
    },

    isPlaying() {
    return (
        this.$store.state.player.isPlaying &&
        _.get(
        this.$store.state.player.list[this.$store.state.player.listIndex],
        'id'
        ) === this.album.id
    )
    },

    ellipsisString() {
    if (this.album) {
        if (this.album.description.length >= 200) {
        return this.album.description.substr(200) + '...'
        } else {
        return this.album.description + '...'
        }
    } else {
        return ''
    }
    },

    followButtonText() {
    if (this.album.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
    }
    return 'Follow'
    },

    genres() {
    return _.map(this.album.genres, 'name').join(', ')
    },
  },

  watch: {
    $route(to, from) {
      const toPath = to.path.split('/')
      this.slug = toPath[2]
      this.trackIndex = 0
      this.loadData()
    },
  },

  created() {
     console.log(this.$route)
      // this.$store.dispatch('navigator/setCurrentState', { page: 'upload', tab: '' })
      this.$store.dispatch('navigator/goNextState', { page: 'album', tab: '' })
      // console.log('current', this.$store.state.navigator.current)
      // console.log('last', this.$store.getters['navigator/last'])

      this.loadData()

  },

  methods: {
      ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: 'player/setPlayingStatus',
      }),
      showComments() {
        this.$refs.mobileComments.showComments(true)
      },

      loadData() {
      const vm = this
      this.slug = this.$route.params.slug
      console.log('slug: ', this.slug);
      this.comments = []
      this.comment_pagination = {
          count: 0,
          current_page: 0,
          per_page: 5,
          total_count: 0,
          total_pages: 0,
      }
      this.isPageReady = false
      Promise.all([
          AlbumService.getAlbum(this.slug),
          AlbumService.myRole(this.slug),
      ])
          .then((values) => {
          this.album = values[0].body

          // Vue.set(this, "album", values[0].body)
          // for (let index in this.album.tracks) {
          //   this.buttonHover.push(false)
          // }

          const lastState = this.$store.getters['navigator/last']
          if (_.get(lastState, 'params.album_id') == this.album.id) {
              this.showFinishDialog()
          }

          this.roles = values[1].body

          if (this.currentUser) {
              this.loadMoreComments()
          }
          this.$emit('updateHead')

          if (this.comments_subscription) {
              this.comments_subscription.unsubscribe()
          }
          this.cable = ActionCable.createConsumer(
              `${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`
          )
          this.comments_subscription = this.cable.subscriptions.create(
              {
              channel: 'CommentsChannel',
              album_id: vm.album.id,
              },
              {
              connected: () => {
                  console.log('connected to CommentsChannel')
              },
              received: (data) => {
                  console.log('comments_subscription')
                  console.log(data)
                  switch (data.action) {
                  case 'create':
                  case 'update':
                      if (
                      data.comment.status == 'published' ||
                      data.comment.readable_user_ids.indexOf(
                          vm.currentUser.id
                      ) > -1
                      ) {
                      const commentIndex = _.findIndex(
                          vm.comments,
                          (comment) => comment.id == data.comment.id
                      )
                      if (commentIndex === -1) {
                          vm.comments.push(data.comment)
                      } else {
                          vm.comments[commentIndex] = data.comment
                      }
                      } else {
                      _.remove(vm.comments, (item) => {
                          return item.id == data.comment.id
                      })
                      }
                      break
                  case 'delete':
                      _.remove(vm.comments, (item) => {
                      return item.id == data.comment_id
                      })
                      break
                  }
                  vm.comments = _.orderBy(vm.comments, ['created_at'], ['desc'])
                  // const arr = vm.comments.slice()
                  // vm.comments = arr
              },
              disconnected: () => {
                  console.log('disconnected to CommentsChannel :(')
              },
              }
          )

          this.isPageReady = true
          })
          .catch((reason) => {
          console.log(reason)
          // this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', reason)
          })
      },

      convertedHTML(text) {
      var matches = text.match(/@[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*/g)
      for (let index in matches) {
          const match = matches[index]
          const user_name = match.substr(1)
          var reg = new RegExp(match, 'g')
          // text = text.replace(reg, `<a href="/${user_name}">${match}</a>`)
          text = text.replace(reg, `<a href="/${user_name}">${match}</a>`)
      }
      return text
      },

      followUser(user) {
      if (user.is_following) {
          UserService.unfollowUser(user.id)
          .then((response) => {
              this.$store.dispatch('error/showSuccessToast', [
              'You just unfollowed ' + user.display_name,
              ])
              user.is_following = false
              // this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(user))
              this.$root.$emit(MyEvents.USER_FOLLOW, user.id, false)
          })
          .catch((e) => {
              this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
              )
          })
      } else {
          UserService.followUser(user.id)
          .then((response) => {
              this.$store.dispatch('error/showSuccessToast', [
              'You just followed ' + user.display_name,
              ])
              user.is_following = true
              // this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(user))
              this.$root.$emit(MyEvents.USER_FOLLOW, user.id, true)
          })
          .catch((e) => {
              this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
              )
          })
      }
      },

      goToAlbumStats(stats) {
      this.$router.push({ path: `/album/${this.album.slug}/stats#${stats}` })
      },

      showPromoteModal() {
      this.isShowFinishModal = false
      this.showPromoteMessage = true
      },

      dismissPromoteModal() {
      this.showPromoteMessage = false
      this.isShowFinishModal = true
      },

      openDownloadModal() {
      this.showDownloadModal = true
      },

      closeDownloadModal() {
      this.showDownloadModal = false
      },

      openShareModal() {
      this.showShareModal = true
      },

      closeShareModal() {
      this.showShareModal = false
      },

      dismissFinishDialog() {
      this.isShowFinishModal = false
      $('html').css('overflow', 'scroll')
      },

      showFinishDialog() {
      this.isShowFinishModal = true
      $('html').css('overflow', 'hidden')
      },

      saveAndFinish(users) {
      $('html').css('overflow', 'scroll')
      this.showPromoteMessage = false
      this.isShowFinishModal = false
      },

      addEmoji(emoji, event) {
      // console.log('addEmoji')
      this.showEmojiPicker = false
      this.commentString += emoji.native
      this.$refs.comment.focus()
      },

      showEmojiDialog() {
      this.showEmojiPicker = !this.showEmojiPicker
      this.$refs.comment.focus()
      },

      openSampleClearanceLicenseModal() {
      this.$router.push({ path: '/terms' })
      // this.show_sample_clearance_license_modal = true
      },

      closeSampleClearanceLicenseModal() {
      this.show_sample_clearance_license_modal = false
      },

      blurMessage() {
      const vm = this
      if (vm.showEmojiPicker) {
          setTimeout(function () {
          // console.log('hide')
          vm.showEmojiPicker = false
          }, 200)
      }
      },

      loadMoreComments() {
      const params = {
          commentable_type: 'Album',
          commentable_id: this.album.id,
          page: this.comment_pagination.current_page + 1,
          per_page: this.comment_pagination.per_page,
      }
      CommentService.getComments(params)
          .then((response) => {
          this.comments = this.comments.concat(response.body.comments)
          this.comment_pagination = response.body.pagination
          })
          .catch((e) => {
          this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
          )
          })
      },

      addComment() {
      const params = new FormData()
      params.append('comment[commentable_type]', 'Album')
      params.append('comment[commentable_id]', this.album.id)
      params.append('comment[body]', this.commentString)
      this.commentString = ''
      CommentService.sendComment(params)
          .then((response) => {
          // this.comments.unshift(response.body)
          // this.comment_pagination.total_count += 1
          })
          .catch((e) => {
          this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
          )
          })
      },

      makePublicComment(comment) {
      CommentService.makePublicComment(comment.id)
          .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
              'You made a comment public!',
          ])
          })
          .catch((e) => {
          this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
          )
          })
      },

      makePrivateComment(comment) {
      CommentService.makePrivateComment(comment.id)
          .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
              'You made a comment private!',
          ])
          })
          .catch((e) => {
          this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
          )
          })
      },

      deleteComment(comment) {
      CommentService.deleteComment(comment.id)
          .then((response) => {
          // _.remove(this.comments, (item) => { return item.id == comment.id });
          // const arr = this.comments.slice();
          // this.comments = arr;
          })
          .catch((e) => {
          this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
          )
          })
      },

      blockUser(comment) {
      UserService.blockUser(comment.user.id)
          .then((response) => {
          _.remove(this.comments, (item) => {
              return item.user.id == comment.user.id
          })
          const arr = this.comments.slice()
          this.comments = arr
          })
          .catch((e) => {
          this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
          )
          })
      },

      selectTrack(index) {
      this.trackIndex = index
      if (this.isPlaying) {
          this.$root.$emit(MyEvents.AUDIO_PLAYER_SKIPTO, index)
      } else {
          this.setPlaylist([this.album])
          this.setPlaylistIndex(0)
          this.setPlaying(true)
          this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY, index)
      }
      },

      playSong() {
      if (
          this.$store.state.player.isPaused &&
          this.$store.getters['player/currentAlbum'] &&
          this.$store.getters['player/currentAlbum'].id == this.album.id
      ) {
          this.$root.$emit(MyEvents.AUDIO_PLAYER_REPLAY)
      } else {
          this.setPlaylist([_.cloneDeep(this.album)])
          this.setPlaylistIndex(0)
          this.setPlaying(true)
          this.$root.$emit(MyEvents.AUDIO_PLAYER_PLAY)
      }
      },

      pauseSong() {
      this.$root.$emit(MyEvents.AUDIO_PLAYER_PAUSE)
      },

      dismissDownloadModal() {
      this.showDownloadModal = false
      },

      repostItem() {
      AlbumService.repostAlbum(this.album.id)
          .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
              'You just reposted ' + this.album.name,
          ])
          })
          .catch((e) => {
          this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
          )
          })
      },

      // hoverTrackItem (index, status) {
      //   this.buttonHover[index] = status
      //   this.buttonHover = this.buttonHover.slice()
      // },

      goToArtistProfile() {
      this.$router.push({
          path: '/' + this.album.user.slug,
          hash: 'merch',
      })
      },

      showMerchDialog() {
      this.showMerchModal = true
      },

      dimissMerchDialog() {
      this.showMerchModal = false
      },
  },

  mounted() {},

  updated() {},

  head: {
      title() {
      return {
          inner: this.album.user.display_name + ' - ' + this.album.name,
      }
      },
      meta() {
      return [
          {
          p: 'twitter:title',
          content: this.album.user.display_name + ' - ' + this.album.name,
          },
          { p: 'twitter:image', c: this.album.cover.large.url },
      ]
      },
  },
}
</script>
<style scoped src="../../../../static/styles/album.scss" lang="scss"></style>
<style scoped lang="scss">
.page.album-detail-page {
  top: unset;
  left: unset;
  width: auto;

  .album-pages {
    min-height: unset;
    padding: 0;
    .album-info-page {
      display: block;

      .album-image-section {
        display: block;

        .album-image {
          width: 100%;
          height: 250px;
          background-size: contain;
          background-color: #ffffff;
        }
      }
    }

    .album-details {
      margin: 10px 0;

      .album-info {
        .album-type {
          text-transform: capitalize;
        }
        .album-title {
          font-weight: 800;
        }
        .album-artist a {
          text-transform: capitalize;
          color: #000000;
        }
      }

      .play-pause-btn {
        border-radius: 100%;
        height: 50px;
        width: 50px;
        padding: 0;
        margin: 0;
        min-width: auto;
        box-shadow: none;
        border: 1px solid #000000;
        background: transparent;
      }
    }

    .album-action {
      padding-bottom: 10px;
      border-bottom: 1px solid #d8d3d3;
    }

    .album-tracks {
      border-bottom: 1px solid #d8d3d3;
      padding-bottom: 20px;

      .album-tracks-section {
        .each-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 0;

          /deep/.track-name {
            color: unset;
            .track-index {
              color: unset;
            }
          }
        }
      }
    }

    .comments-section {
      border-bottom: 1px solid #d8d3d3;
    }
    .product-section {
      border-bottom: 1px solid #d8d3d3;

      .featured {
        &.__product {
          display: flex;
          align-items: center;
        }

        & ._image {
          width: 120px;
          height: 120px;
          background-size: contain;
          margin-right: 10px;
        }
        & ._details {
          ._merchant-name {
            font-weight: 800;
            text-transform: capitalize;
          }
          ._price {
            font-weight: 800;
            margin-top: 12px;
          }
        }
      }
    }
    .recent-video-section {
      border-bottom: 1px solid #d8d3d3;
    }
    .suggestion-section {
      // border-bottom: 1px solid #d8d3d3;
    }
  }
}
</style>