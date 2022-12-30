/* global $:true */

import _ from 'lodash'
import Vue from 'vue'
import { mapActions } from 'vuex'
import ProfileService from '@/services/profile'
import UserService from '@/services/user'
import smsService from "@/services/sms";
import { MyEvents, ViolationsEmail, PublicRelationsUsername } from '@/helper'
import albumSlideCard from '@/components/albumslidecard'
import carousel3d from '@/components/slider/Carousel3d'
import merchModal from '@/components/merchmodal'
import shareModal from '@/components/sharemodal'
import productCard from '@/components/productcard'
import productSlideCard from '@/components/productslidecard'
import sendLoveModal from '@/components/sendlovemodal'
import sendMessage from '@/components/sendmessage'
import slide from '@/components/slider/Slide'
import trackCard from '@/components/trackcard'
import userItem from '@/components/useritem'
import artistItem from '@/components/artistitem'
import contentTopHeader from '@/components/contentTopHeader'
import AuthService from '@/services/auth'
import StreamService from '@/services/stream'
import VideoBox from '@/components/video_box'
import UserFollowBtn from "@/components/userFollowBtn";

// import streamPlayer from '@/components/stream_player'

export default {
  components: {
    trackCard,
    albumSlideCard,
    productCard,
    productSlideCard,
    merchModal,
    shareModal,
    userItem,
    artistItem,
    sendMessage,
    sendLoveModal,
    carousel3d,
    slide,
    contentTopHeader,
    VideoBox,
    UserFollowBtn,
    // streamPlayer
  },

  data() {
    return {
      // active_tab: 'songs',
      // slide_tab: 'songs',
      PublicRelationsUsername: PublicRelationsUsername,
      active_tab: '',
      slide_tab: '',
      show_following: false,     
      show_following_scroll: false,       
      tabs: [
        { id: 'catalog', title: 'Catalog', roles: ['label'], icon: require('../../../static/images/grid-interface.svg') },
        { id: 'artists', title: 'Artists', roles: ['label'] },
        { id: 'songs', title: 'Music', icon: require('../../../static/images/music.svg') },
        { id: 'video', title: 'Video', icon: require('../../../static/images/video.svg') },
        { id: 'merch', title: 'Shop', icon: require('../../../static/images/shop.svg') },
        { id: 'sms_group', title: 'SMS groups' },
        { id: 'reposted', title: 'Reposted', roles: ['label'], icon: require('../../../static/images/ic_repost.svg') },
        { id: 'downloaded', title: 'Downloaded', roles: ['label'], icon: require('../../../static/images/download.svg') },
        { id: 'followings', title: 'Following' },
        { id: 'followers', title: 'Followers' },
      ],
      slug: null,
      user: {
        display_name: '',
        avatar: {},
      },
      show_block_user_confirm_dialog: false,
      show_invite_confirm_dialog: false,
      showPageMerchModal: false,
      selectedProduct: {},
      showPageShareModal: false,
      showSendMessage: false,
      showShareModal: false,
      showSendLoveModal: false,
      show_stream_live_button: false,
      view_stream_clicked: false,
      grid_show: true,
      auto_play: false,
      startIndex: 0,
      page_index: 1,
      total_pages: 0,
      items_per_page: 5 * 10,
      genres: null,
      genre_index: 0,
      followings_selector: 'followings',
      products: [],
      albums: [],
      users: [],
      buttonHover: false,
      isPageReady: false,
      ownVideos: [],
      smsList: [],
    }
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    currentUser() {
      return this.$store.state.auth.user
    },

    userLocation() {
      return _.get(this.user, 'default_address.city', '--')
    },

    enabledViewDirectMessage() {
      return (
        this.currentUser.user_type === 'admin' ||
        (this.currentUser.user_type === 'moderator' &&
          _.get(this.currentUser, 'enabled_view_direct_message') === true)
      )
    },

    coverImageURL() {
      const imageUrl = _.get(
        this.albums,
        `[${this.startIndex}].cover.thumb.url`,
        ''
      )
      if (imageUrl) {
        return imageUrl + '?' + new Date()
      }
      return imageUrl
    },

    albumDisplayCount() {
      if (this.albums.length > 7) {
        return 7
      } else {
        return this.albums.length
      }
    },

    merchDisplayCount() {
      if (this.products.length > 7) {
        return 7
      } else {
        return this.products.length
      }
    },

    streamViewPrice() {
      return _.get(this.user, 'stream.view_price', 0)
    },

    followMetaVisible() {
      return (
        _.get(this.user, 'username') !== PublicRelationsUsername ||
        _.get(this.currentUser, 'user_type') === 'admin'
      )
    },

    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },
    smsCount() {
      return this.smsList.length
    }
  },

  watch: {
    $route(toPath, fromPath) {
      const paths = toPath.path.split('/')
      this.slug = paths[1]
      const tab = toPath.hash.substr(1)
      const grid_view =
        toPath.query.grid_view === undefined
          ? true
          : toPath.query.grid_view === 'true' || toPath.query.grid_view === true
      const auto_play =
        toPath.query.auto_play === undefined
          ? false
          : toPath.query.auto_play === 'true' || toPath.query.auto_play === true
      this.init(tab, grid_view, auto_play, false)
    },
  },

  created() {
    window.addEventListener('scroll', this.handleScroll)
    this.ownStream()

    this.slug = this.$route.params.slug
    const tab = this.$route.hash.substr(1)
    const grid_view =
      this.$route.query.grid_view === undefined
        ? true
        : this.$route.query.grid_view === 'true' ||
          this.$route.query.grid_view === true
    const auto_play =
      this.$route.query.auto_play === undefined
        ? false
        : this.$route.query.auto_play === 'true' ||
          this.$route.query.auto_play === true
    this.init(tab, grid_view, auto_play, true)

    this.$root.$on(MyEvents.USER_FOLLOW, this.setFollowingStatus)

    this.listAllSMS()
  },

  beforeDestroy() {
    this.$root.$off(MyEvents.USER_FOLLOW, this.setFollowingStatus)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setPlaying: 'player/setPlayingStatus',
    }),

    ownStream(tab, page) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        genre_id: 0, // default for all videos
        only_follows: this.only_follows,
        page: 1, // get page 1
      }
      StreamService.getStreams(params)
        .then((response) => {
          console.log(response.body.streams)
          this.ownVideos = response.body.streams.filter((str) => this.user.display_name == str.user.display_name)
          // this.ownVideos = this.ownVideos.concat(response.body.streams)
          // this.ownVideos = [ ...this.ownVideos, ...this.ownVideos]
          this.pagination = response.body.pagination
          this.videoGenres = response.body.genres
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch(() => {
          this.$store.dispatch('error/showLoadingActivity', false)
        })
    },

    loadMore() {
      this.loadData(this.pagination.current_page + 1)
    },
    handleScroll(event) {
      if(this.show_following){
        const navProfileCard = document.querySelector('.special-scroll-header')

        var y = window.scrollY
        if (y >= 75) {
          this.show_following_scroll = true
        } else {
          this.show_following_scroll = false
        }
      }
      else{
        this.show_following_scroll = false
      }
    },
    isActiveTab(tab) {
      return this.active_tab === tab
    },

    onTab(tab) {
      if(tab == "followings" && currentUser){
          this.show_following = true;
      }
      else{
        this.show_following = false;
        this.show_following_scroll = false
      }
      this.$router.push({
        path: this.$route.path,
        hash: tab,
        // query: {
        //   grid_view: this.grid_show
        // }

      })
    },

    setGridView(flag) {
      this.$router.push({
        path: this.$route.path,
        hash: this.active_tab,
        // query: {
        //   grid_view: flag
        // }
      })
    },

    isStreaming() {
      // console.log(_.get(this.$store.state.streamPlayer.user, 'slug', ''), this.user.slug, this.$store.state.streamPlayer.frame_mode)
      return (
        _.get(this.user.stream, 'status', '') === 'running' &&
        _.get(this.user.stream, 'notified', false) &&
        (_.get(this.$store.state.streamPlayer.stream, 'user.slug', '') !==
          this.user.slug ||
          !this.$store.getters['streamPlayer/hasFrame'])
      )
    },

    viewStream() {
      console.log('viewStream clicked')
      this.view_stream_clicked = true
      UserService.getUserInfo(this.slug)
        .then((response) => {
          this.user = response.body
          this.view_stream_clicked = false

          if (this.isStreaming()) {
            this.$store.dispatch('streamPlayer/setStream', this.user.stream)
            this.$root.$emit(MyEvents.STREM_PLAYER_INIT)
          }
        })
        .catch((err) => {
          console.log('profle/viewStream', err)
          this.view_stream_clicked = false
        })
    },

    init(tab, grid_view, auto_play, first_visit) {
      this.show_stream_live_button = false
      this.showSendMessage = false
      this.startIndex = 0
      this.genres = [
        {
          id: 'any',
          name: 'Any genre',
          slug: 'any',
        },
      ]
      this.total_pages = 0

      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getUserInfo(this.slug)
        .then((response) => {
          if (response.body.status !== 'active') {
            this.$store.dispatch('error/showErrorToast', [
              'User does not exist',
            ])
            this.$router.push({ name: 'AlbumIndex' })
            return
          }

          // console.log('profile init')
          this.user = response.body
          this.$emit('updateHead')

          if (this.isStreaming()) {
            Vue.http.get(this.user.stream.mp_channel_1_ep_1_url).then(() => {
              this.show_stream_live_button = true
              if (first_visit) {
                // console.log('calling ...', MyEvents.STREM_PLAYER_INIT)
                this.$store.dispatch('streamPlayer/setStream', this.user.stream)
                this.$root.$emit(MyEvents.STREM_PLAYER_INIT)
              }
            })
            // this.$store.dispatch('streamPlayer/setStream', this.user.stream)
            // this.$root.$emit(MyEvents.STREM_PLAYER_INIT)
          }

          // // put 'merch' tab first for brand
          // if (this.user.user_type === 'brand') {
          //   if (this.tabs[7].id === 'merch') {
          //     this.tabs.unshift(this.tabs.pop())
          //   }
          // } else {
          //   if (this.tabs[7].id !== 'merch') {
          //     this.tabs.push(this.tabs.shift())
          //   }
          // }
          if (this.currentUser.id === this.user.id) {
            this.tabs.filter(tab => tab.id == 'songs')[0].title = 'Releases'
          } else {
            this.tabs = this.tabs.filter(tab => tab.id !== 'sms_group')
          }
          if (tab) {
            this.active_tab = tab
            this.slide_tab = tab
          } else {
            switch (this.user.user_type) {
              case 'artist':
                this.active_tab = 'songs'
                this.slide_tab = 'songs'

                // this.active_tab = 'followings'
                // this.slide_tab = 'followings'
                break
              case 'label':
                this.active_tab = 'artists'
                this.slide_tab = 'artists'
                break
              case 'brand':
                this.active_tab = 'merch'
                this.slide_tab = 'merch'
                break
              default:
                // this.active_tab = 'playlists'
                // this.slide_tab = 'playlists'
                this.active_tab = 'reposted'
                this.slide_tab = 'reposted'
                break
            }
          }

          this.grid_show = grid_view
          this.auto_play = auto_play
          this.$store.dispatch('player/setGridShow', grid_view)
          if (grid_view) {
            this.active_tab = this.slide_tab
            this.$store.dispatch('navigator/goNextState', {
              page: 'profile',
              tab: this.active_tab,
            })
          } else {
            this.slide_tab = this.active_tab
            this.$store.dispatch('navigator/goNextState', {
              page: 'profile-slider',
              tab: this.active_tab,
            })
          }

          if (this.active_tab !== 'video' && this.active_tab !== 'sms_group') {
            // temp implementation because there is no video 'getItems' yet
            this.getItems(this.active_tab, false)
          }
          this.isPageReady = false
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', ['User does not exist'])
          this.$router.push({ path: '/' })
          // this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          // setTimeout(() => {
          //   this.$router.push({ path: '/album' })
          // }, 5000)
        })
    },

    getItems(tab, loadMore) {
      if (!loadMore) {
        this.albums = []
        this.products = []
        this.users = []
        this.startIndex = 0
        this.page_index = 1
      } else {
        this.page_index += 1
      }

      var params = {
        page: this.page_index,
        per_page: this.items_per_page,
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      ProfileService.getItems(this.user.id, tab, params)
        .then((response) => {
          console.log(response.body);
          this.$store.dispatch('error/showLoadingActivity', false)
          switch (tab) {
            case 'merch':
              this.products = this.products.concat(response.body.products)
              break
            case 'followers':
            case 'followings':
            case 'artists':
              this.users = this.users.concat(response.body.users)
              break
            case 'video':
              this.users = this.users.concat(response.body.users)
              break
            case 'sms_group':
              break
            default:
              let albums = []
              if (tab === 'reposted' || tab === 'downloaded') {
                for (let index in response.body.feeds) {
                  if (response.body.feeds[index].assoc_type === 'Album') {
                    albums.push(response.body.feeds[index].assoc)
                  }
                }
              } else {
                albums = response.body.albums
              }
              this.fillAlbums(albums)

              if (tab === 'songs' && this.auto_play) {
                this.auto_play = false
                this.playSong()
              }

              if (!this.grid_show) {
                this.changeBackground()
              }
              break
          }

          this.page_index = response.body.pagination.current_page
          this.total_pages = response.body.pagination.total_pages
        })
        .catch((e) => {
          console.log(e)
          console.log(e.message)
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    fillAlbums(albums) {
      let genres = this.genres.slice()
      for (let album_index in albums) {
        const album = albums[album_index]
        genres = genres.concat(album.genres)
        album.genre_ids = _.map(album.genres, 'id').join(',')
        this.albums.push(album)

        /* focus the album on playing in slider view */
        if (this.$store.state.player.isPlaying && !this.grid_show) {
          const currentItem = this.$store.state.player.list[
            this.$store.state.player.listIndex
          ]
          if (currentItem.assoc_type) {
            if (currentItem.assoc.id === album.id) {
              this.startIndex = album_index
            }
          } else {
            if (currentItem.id === album.id) {
              this.startIndex = album_index
            }
          }
        }
      }
      this.genres = _.uniqBy(genres, 'id')
      // console.log(this.active_tab, albums)
      // console.log(this.albums)
    },

    setFollowingsSelector(value, name) {
      if (this.followings_selector !== value) {
        this.followings_selector = value
        $('#followings_selector .btn__content').html(
          name +
            '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>'
        )
        this.getItems(this.active_tab, false)
      }
    },

    onAfterAlbumSlideChange(index) {
      // if(this.$store.state.player.isPlaying && this.$store.state.player.page === 'profile' && !this.grid_show) {
      //   this.$refs.albumCarousel.goSlide(this.$store.state.player.listIndex)
      // } else {
      //   this.startIndex = index
      // }
      this.startIndex = index
      this.changeBackground()
    },

    onAfterMerchSlideChange(index) {},

    changeBackground() {
      var canvas = document.getElementById('canvas')
      var cctx = canvas.getContext('2d')
      if (this.coverImageURL) {
        var buff = document.createElement('canvas')
        buff.width = canvas.width
        buff.height = canvas.height
        var imageObj = new Image()
        // this will make CORS happy because the server is well configured
        imageObj.crossOrigin = 'anonymous'
        // Easiest is to always host your images on your own server
        // imageObj.src = 'https://dl.dropboxusercontent.com/s/8q8sjnqmmto13h5/lionCMYK.jpg'
        imageObj.src = this.coverImageURL
        imageObj.onload = function () {
          // canvas.width = imageObj.height
          // canvas.height = imageObj.height
          cctx.drawImage(imageObj, 0, 0)
          window.StackBlur.image(imageObj, canvas, 70, false)
        }
      } else {
        cctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    },

    isAvailableForSlideView(tab) {
      return (
        ['artists', 'followings'].indexOf(tab.id) === -1 &&
        (!tab.roles || tab.roles.indexOf(this.user.user_type) > -1)
      )
    },

    isAvailableForGridView(tab) {
      return !tab.roles || tab.roles.indexOf(this.user.user_type) > -1
    },

    closePageMerchModal() {
      this.showPageMerchModal = false
    },

    openPageMerchModal(product) {
      // console.log('openPageMerchModal', product)
      this.selectedProduct = product
      this.$nextTick(() => {
        this.showPageMerchModal = true
      })
    },

    closePageShareModal() {
      this.showPageShareModal = false
    },

    openPageShareModal() {
      // console.log('openPageShareModal')
      this.showPageMerchModal = false
      this.showPageShareModal = true
    },

    showMessageDialog() {
      this.showSendMessage = true
    },

    dismissMessageModal() {
      this.showSendMessage = false
    },

    showLoveDialog() {
      this.showSendLoveModal = true
    },

    dismissLoveDialog() {
      this.showSendLoveModal = false
    },

    viewDirectMessages() {
      this.$router.push({ path: '/user/' + this.user.slug + '/messages' })
    },

    goToChat() {
      this.$router.push({ path: '/user/' + this.user.slug + '/chat' })
    },

    flagUser() {
      const emailTo = ViolationsEmail
      const emailCC = ''
      const emailSub = ''
      const emailBody = ''
      window.open(
        `mailto:${emailTo}?cc=${emailCC}&subject=${emailSub}&body=${emailBody}`,
        '_blank'
      )
    },

    openBlockUserConfirmDialog() {
      this.show_block_user_confirm_dialog = true
    },

    closeBlockUserConfirmDialog() {
      this.show_block_user_confirm_dialog = false
    },

    blockUser() {
      UserService.blockUser(this.user.id)
        .then((response) => {
          this.$store.dispatch('error/showSuccessToast', [
            'You blocked ' +
              this.user.display_name +
              ', go to settings page to unblock',
          ])
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
      this.closeBlockUserConfirmDialog()
    },

    setFollowingStatus(userId, isFollowing) {
      if (this.user && this.user.id === userId) {
        this.user.is_following = isFollowing
      }
    },

    openInviteConfirmDialog() {
      this.show_invite_confirm_dialog = true
    },

    closeInviteConfirmDialog() {
      this.show_invite_confirm_dialog = false
    },

    inviteUser() {
      this.closeInviteConfirmDialog()
      UserService.inviteUser(this.user.id).then((response) => {
        this.user = response.body
        this.$store.dispatch('error/showSuccessToast', ['Invited'])
      })
    },

    playSong() {
      if (this.active_tab === 'songs' || this.albums.length) {
        this.setPlaylist(this.albums)
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.$root.$emit('play')
      } else {
        this.$router.push({
          path: this.$route.path,
          hash: 'songs',
          query: {
            // grid_view: this.grid_show,
            auto_play: true,
          },
        })
      }
    },

    moveSlide() {
      if (this.$refs.albumCarousel !== undefined) {
        const lastState = this.$store.getters['navigator/last']
        if (lastState.page === 'profile') {
          this.$refs.albumCarousel.goSlide(this.$store.state.player.listIndex)
        } else {
          var playingIndex = -1
          for (let index in this.albums) {
            var currentItem = this.albums[index]
            var playingItem = this.$store.state.player.list[
              this.$store.state.player.listIndex
            ]
            if (playingItem !== undefined) {
              if (playingItem.assoc_type === 'Album') {
                playingItem = playingItem.assoc
              }
              if (playingItem.id === currentItem.id) {
                playingIndex = index
                break
              }
            }
          }
          this.$refs.albumCarousel.goSlide(parseInt(playingIndex))
        }
      }
    },
    signOut() {
      AuthService.signout()
      this.$router.push({ path: '/login' })
      this.$root.$emit(MyEvents.AUTH_SIGNOUT)
    },
    listAllSMS() {
      smsService
        .listSMS()
        .then((response) => {
          this.smsList = response.body;
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
    },
    setMenuAction(menu) {
      switch (menu.id) {
        case "profile":
          this.$router.push(`/${this.currentUser.slug}`);
          break;
        case "signOut":
          this.signOut();
          break;
        default:
          this.$router.push({ name: menu.pathName });
          break;
      }
    },
  },

  mounted() {
    this.$root.$on('index_change', this.moveSlide)
    $(window)
      .resize(function () {
        var height = $('#user_info_page').height() + 230
        var screen_height = $(window).height()
        if (height > screen_height) {
          height += 50
        } else {
          height = screen_height
        }
        var canvas = document.getElementById('canvas')
        if (canvas) {
          $('#canvas').css('cssText', 'height: ' + height + 'px !important;')
        }
        $('#back_image').css('cssText', 'height: ' + height + 'px !important;')
      })
      .trigger('resize')
  },

  head: {
    title() {
      return {
        inner: _.get(this.user, 'display_name', ''),
      }
    },
  },
}
