import _ from 'lodash'
import { mapActions } from 'vuex'
import ProfileService from '@/services/profile'
import UserService from '@/services/user'

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
    slide
  },

  data () {
    return {
      currentTab: 'songs',
      slide_tab: 'songs',
      tabs: [
        {
          id: 'artists',
          title: 'Artists',
          roles: ['label']
        },
        {
          id: 'catalog',
          title: 'Catalog',
          roles: ['label']
        },
        {
          id: 'songs',
          title: 'Albums',
          roles: ['artist']
        },
        {
          id: 'downloaded',
          title: 'Downloaded'
        },
        {
          id: 'reposted',
          title: 'Reposted'
        },
        {
          id: 'playlists',
          title: 'Playlists'
        },
        {
          id: 'followings',
          title: 'Following'
        },
        // {
        //   id: 'followers',
        //   title: 'Followers'
        // },
        {
          id: 'merch',
          title: 'Merch',
          roles: ['artist', 'brand', 'label']
        }
      ],
      slug: null,
      user: null,
      show_block_user_confirm_dialog: false,
      showPageMerchModal: false,
      selectedProduct: {},
      showPageShareModal: false,
      showSendMessage: false,
      showShareModal: false,
      showSendLoveModal: false,
      grid_show: false,
      startIndex: 0,
      page_index: 1,
      total_pages: 1,
      items_per_page: 6 * 1,
      genres: [{
        id: 'any',
        name: 'Any genre',
        slug: 'any'
      }],
      genre_index: 0,
      followings_selector: 'followings',
      products:[],
      albums: [],
      users: [],
      isShowModal: [],
      buttonHover: false
    }
  },

  computed: {
    coverImageURL () {
      const imageUrl = _.get(this.albums, `[${this.startIndex}].cover.thumb.url`, '')
      if (imageUrl) {
        return imageUrl + '?' + new Date()
      }
      return imageUrl
    },

    albumDisplayCount () {
      if(this.albums.length > 7) {
        return 7
      } else {
        return this.albums.length
      }
    },

    merchDisplayCount () {
      if(this.products.length > 7) {
        return 7
      } else {
        return this.products.length
      }
    },

    followButtonText () {
      if (this.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    }
  },

  watch: {
    '$route' (toPath, fromPath) {
      const paths = toPath.path.split('/')
      this.slug = paths[1]
      const tab = toPath.hash.substr(1)
      const grid_view = toPath.query.grid_view
      this.init(tab, grid_view)
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'profile', tab: '' })
    this.slug = this.$route.params.slug
    this.init(null, true)
  },

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setPlaying: 'player/setPlayingStatus',
      setPage: 'player/setPage',
      setTab: 'player/setTab'
    }),

    onTab (tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab,
        query: {
          grid_view: this.grid_show
        }
      })
    },

    setGridView (flag) {
      this.$router.push({
        path: this.$route.path,
        hash: this.currentTab,
        query: {
          grid_view: flag
        }
      })
    },

    init (tab, grid_view) {
      this.showSendMessage = false
      this.startIndex = 0

      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.getUserInfo(this.slug).then(response => {
        this.user = response.body
        if (tab) {
          this.currentTab = tab
          this.slide_tab = tab
        } else {
          if (this.user.user_type === 'artist') {
          //   if (this.$store.state.user.tab) {
          //     this.currentTab = this.$store.state.user.tab
          //     this.slide_tab = this.$store.state.user.tab
          //     this.$store.dispatch('user/setTab', null)
          //     this.$store.dispatch('navigator/goNextState', {page: 'profile', tab: this.currentTab})
          //   }
            this.currentTab = 'songs'
            this.slide_tab = 'songs'
          } else if (this.user.user_type === 'label') {
            this.currentTab = 'artists'
            this.slide_tab = 'artists'
          } else {
            this.currentTab = 'downloaded'
            this.slide_tab = 'downloaded'
          }
        }

        this.grid_show = grid_view
        this.$store.dispatch('player/setGridShow', grid_view)
        if (grid_view) {
          this.currentTab = this.slide_tab
        } else {
          switch (this.currentTab) {
            case 'artists':
              this.slide_tab = 'catalog'
              this.onTab(this.slide_tab) 
              break
            case 'followings':
              this.slide_tab = 'downloaded'
              this.onTab(this.slide_tab) 
              break
            default:
              this.slide_tab = this.currentTab
              break
          }
        }

        this.$store.dispatch('navigator/goNextState', { page: 'profile', tab: this.currentTab })
        this.getItems(this.currentTab, false)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    getItems (tab, loadMore) {
      if (!loadMore) {
        this.albums = []
        this.products = []
        this.isShowModal = []
        this.users = []
        this.startIndex = 0
      }

      if (tab == 'followings') {
        tab = this.followings_selector
      }
      var params = {}
      this.$store.dispatch('error/showLoadingActivity', true)
      ProfileService.getItems(this.user.id, tab, params).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        switch (tab) {
          case 'merch':
            this.products = this.products.concat(response.body.products)
            for (let index in response.body.products) {
              this.isShowModal.push(false)
            }
            break
          case 'followers':
          case 'followings':
          case 'artists':
            this.users = this.users.concat(response.body.users)
            break
          default:
            var albums = []
            if (tab === 'reposted') {
              for(let index in response.body.feeds) {
                if (response.body.feeds[index].assoc_type === 'Album') {
                  albums.push(response.body.feeds[index].assoc)
                }
              }
            } else {
              albums = response.body.albums
            }
            for (let album_index in albums) {
              const album = albums[album_index]
              var genre_ids = []
              for (let new_index in album.genres) {
                let add_flag = true
                const genre_id = album.genres[new_index].id
                genre_ids.push(genre_id)
                for (let genre_index in this.genres) {
                  if (genre_id === this.genres[genre_index].id) {
                    add_flag = false
                    break
                  }
                }
                if (add_flag) {
                  this.genres.push(album.genres[new_index])
                }
              }
              album.genre_ids = genre_ids.join(',')
              this.albums.push(album)
              if (this.$store.state.player.isPlaying && !this.grid_show) {
                const currentItem = this.$store.state.player.list[this.$store.state.player.listIndex]
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
            if(!this.grid_show) {
              this.changeBackground()
            }
            break
        }

        this.page_index = response.body.pagination.current_page
        this.total_pages = response.body.pagination.total_pages
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    setFollowingsSelector (value, name) {
      if (this.followings_selector !== value) {
        this.followings_selector = value
        $('#followings_selector .btn__content').html(name + '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>')
        this.getItems(this.currentTab, false)
      }
    },

    followersClickHandler () {
      this.grid_show = true
      this.currentTab = 'followings'
      const value = 'followers', name = 'Follower'
      this.followings_selector = value
      this.getItems('followings', false)
      this.$nextTick(() => {
        $('#followings_selector .btn__content').html(name + '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>')
      })
    },

    onAfterAlbumSlideChange (index) {
      // if(this.$store.state.player.isPlaying && this.$store.state.player.page === 'profile' && !this.grid_show) {
      //   this.$refs.albumCarousel.goSlide(this.$store.state.player.listIndex)
      // } else {
      //   this.startIndex = index
      // }
      this.startIndex = index
      this.changeBackground()
    },

    onAfterMerchSlideChange (index) {
    },

    changeBackground () {
      var canvas = document.getElementById("canvas")
      var cctx = canvas.getContext("2d")
      if (this.coverImageURL) {
        var buff = document.createElement("canvas")
        buff.width = canvas.width
        buff.height = canvas.height
        var imageObj = new Image()
        // this will make CORS happy because the server is well configured
        imageObj.crossOrigin = 'anonymous'
        // Easiest is to always host your images on your own server
        // imageObj.src = 'https://dl.dropboxusercontent.com/s/8q8sjnqmmto13h5/lionCMYK.jpg'
        imageObj.src = this.coverImageURL
        imageObj.onload = function() {
          // canvas.width = imageObj.height
          // canvas.height = imageObj.height
          cctx.drawImage(imageObj, 0, 0)
          StackBlur.image(imageObj, canvas, 70, false)
        }
      } else {
        cctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },

    isAvailableForSlideView (tab) {
      return ['artists', 'followings'].indexOf(tab.id) === -1
          && (!!!tab.roles || tab.roles.indexOf(this.user.user_type) > -1)
    },

    isAvailableForGridView (tab) {
      return !!!tab.roles || tab.roles.indexOf(this.user.user_type) > -1
    },

    closePageMerchModal () {
      this.showPageMerchModal = false
    },

    openPageMerchModal (product) {
      // console.log('openPageMerchModal', product)
      this.selectedProduct = product
      this.$nextTick(() => {
        this.showPageMerchModal = true
      })
    },

    closePageShareModal () {
      this.showPageShareModal = false
    },

    openPageShareModal () {
      // console.log('openPageShareModal')
      this.showPageMerchModal = false
      this.showPageShareModal = true
    },

    dimissMerchModal (index) {
      this.isShowModal[index] = false
    },

    showMerchModal (index) {
      this.isShowModal[index] = true
    },

    showMessageDialog () {
      this.showSendMessage = true
    },

    dismissMessageModal () {
      this.showSendMessage = false
    },

    showLoveDialog () {
      this.showSendLoveModal = true
    },

    dismissLoveDialog () {
      this.showSendLoveModal = false
    },

    goToChat () {
      this.$router.push({ path: '/' + this.user.id + '/chat' })
    },

    openBlockUserConfirmDialog () {
      this.show_block_user_confirm_dialog = true
    },

    closeBlockUserConfirmDialog () {
      this.show_block_user_confirm_dialog = false
    },

    blockUser () {
      UserService.blockUser(this.user.id).then(response => {
      }).catch(e => this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body]))
      this.closeBlockUserConfirmDialog()
    },

    followUser () {
      if (this.user.is_following) {
        UserService.unfollowUser(this.user.id).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['You just unfollowed ' + this.user.display_name])
          this.user.is_following = false
          this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(this.user))
          this.$root.$emit('unfollow')
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors|| [e.body])
        })
      } else {
        UserService.followUser(this.user.id).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['You just followed ' + this.user.display_name])
          this.user.is_following = true
          this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(this.user))
          this.$root.$emit('follow')
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors|| [e.body])
        })
      }
    },

    playSong () {
      if(this.albums.length) {
        this.setPlaylist(this.albums)
        this.setPlaylistIndex(0)
        this.setPlaying(true)
        this.setPage(this.$store.state.auth.page)
        this.setTab(this.$store.state.auth.tab)
        this.$root.$emit('play')        
      }
    },

    moveSlide () {
      if (this.$refs.albumCarousel !== undefined) {
        if(this.$store.state.player.page === 'profile') {
          this.$refs.albumCarousel.goSlide(this.$store.state.player.listIndex)
        } else {
          var playingIndex = -1
          for (let index in this.albums) {
            var currentItem = this.albums[index]
            var playingItem = this.$store.state.player.list[this.$store.state.player.listIndex]
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

    test () {
      console.log('Test')
    }
  },

  mounted () {
    const vm = this;
    this.$root.$on('index_change', this.moveSlide)
    $( window ).resize(function() {
      var height = $('#user_info_page').height() + 230
      var screen_height = $( window ).height()
      if (height > screen_height ) {
        height += 50
      } else {
        height = screen_height
      }
      var canvas = document.getElementById("canvas")
      if(canvas) {
        $('#canvas').css("cssText", "height: " + height + "px !important;")
      }
      $('#back_image').css("cssText", "height: " + height + "px !important;")
    }).trigger('resize')
  }
}
