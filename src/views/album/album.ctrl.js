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
import profileItem from '@/components/profileitem'
import promoteModal from '@/components/promotemodal'
import sampleLicenseDialog from './components/sample_license_dialog'
import shareModal from '@/components/sharemodal'
import trackCard from '@/components/trackcard'
import videoCard from '@/components/videocard'

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
    profileItem,
    promoteModal,
    sampleLicenseDialog,
    shareModal,
    trackCard,
    videoCard
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
        name: "",
        user: {
          display_name: ""
        },
        cover: {
          large: ""
        }
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
      isPageReady: false
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    toLocalTimeString() {
      return Utils.toLocalTimeString
    },

    showStats() {
      return !_.isEmpty(_.find(this.roles, (user_album) => { return ['creator', 'label', 'collaborator'].indexOf(user_album.user_type) > -1 }))
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
      return this.comment_pagination.current_page < this.comment_pagination.total_pages
    },

    isPlaying() {
      return this.$store.state.player.isPlaying &&
        _.get(this.$store.state.player.list[this.$store.state.player.listIndex], 'id') === this.album.id
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
    }
  },

  watch: {
    '$route' (to, from) {
      const toPath = to.path.split('/')
      this.slug = toPath[2]
      this.trackIndex = 0
      this.loadData()
    }
  },

  created() {
    // this.$store.dispatch('navigator/setCurrentState', { page: 'upload', tab: '' })
    this.$store.dispatch('navigator/goNextState', { page: 'album', tab: '' })
    // console.log('current', this.$store.state.navigator.current)
    // console.log('last', this.$store.getters['navigator/last'])

    this.loadData()
  },

  beforeDestroy() {
    if (this.comments_subscription) {
      this.comments_subscription.unsubscribe()
    }
  },

  methods: {
    ...mapActions({
      setPlaylist: 'player/setPlaylist',
      setPlaylistIndex: 'player/setListIndex',
      setTrackIndex: 'player/setTrackIndex',
      setPlaying: 'player/setPlayingStatus'
    }),

    loadData() {
      const vm = this
      this.slug = this.$route.params.slug
      this.isPageReady = false
      Promise.all([
        AlbumService.getAlbum(this.slug),
        AlbumService.myRole(this.slug)
      ]).then(values => {
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

        setTimeout(function () {
          vm.changeBackground()
          var height = $('#album_info_page').height() + 230
          var screen_height = $( window ).height()
          if (height > screen_height ) {
            height += 50
          } else {
            height = screen_height
          }
          var canvas = document.getElementById("canvas")
          canvas.height = height
          // $('#back_image').css("cssText", "height: " + height + "px !important;")
        }, 200)

        if (this.comments_subscription) {
          this.comments_subscription.unsubscribe()
        }
        this.cable = ActionCable.createConsumer(`${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`)
        this.comments_subscription = this.cable.subscriptions.create(
          {
            channel: 'CommentsChannel',
            album_id: vm.album.id
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
                  if (data.comment.status == 'published' || data.comment.readable_user_ids.indexOf(vm.currentUser.id) > -1) {
                    const commentIndex = _.findIndex(vm.comments, (comment) => (comment.id == data.comment.id))
                    if (commentIndex === -1) {
                      vm.comments.push(data.comment)
                    } else {
                      vm.comments[commentIndex] = data.comment
                    }
                  } else {
                    _.remove(vm.comments, (item) => { return item.id == data.comment.id })
                  }
                  break
                case 'delete':
                  _.remove(vm.comments, (item) => { return item.id == data.comment_id })
                  break
              }
              vm.comments = _.orderBy(vm.comments, ['created_at'], ['desc'])
              // const arr = vm.comments.slice()
              // vm.comments = arr
            },
            disconnected: () => {
              console.log('disconnected to CommentsChannel :(')
            }
          }
        )

        this.isPageReady = true
      }).catch(reason => { 
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

    changeBackground() {
      var canvas = document.getElementById("canvas")
      var cctx = canvas.getContext("2d")
      var buff = document.createElement("canvas")
      buff.width = canvas.width
      buff.height = canvas.height

      var imageObj = new Image()
      // this will make CORS happy because the server is well configured
      imageObj.crossOrigin = 'anonymous'
      // Easiest is to always host your images on your own server
      // imageObj.src = 'https://dl.dropboxusercontent.com/s/8q8sjnqmmto13h5/lionCMYK.jpg'
      imageObj.src = this.coverThumbImageURL
      imageObj.onload = function() {
        // canvas.width = imageObj.height
        // canvas.height = imageObj.height
        cctx.drawImage(imageObj, 0, 0)
        StackBlur.image(imageObj, canvas, 70, false)
        var height = $('#album_info_page').height() + 230
        var screen_height = $( window ).height()
        if (height > screen_height ) {
          height += 50
        } else {
          height = screen_height
        }
        if(canvas) {
          $('#canvas').css("cssText", "height: " + height + "px !important;")
        }
        $('#back_image').css("cssText", "height: " + height + "px !important;")
      }
    },

    followUser(user) {
      if (user.is_following) {
        UserService.unfollowUser(user.id).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['You just unfollowed ' + user.display_name])
          user.is_following = false
          // this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(user))
          this.$root.$emit(MyEvents.USER_FOLLOW, user.id, false)
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors|| [e.body])
        })
      } else {
        UserService.followUser(user.id).then(response => {
          this.$store.dispatch('error/showSuccessToast', ['You just followed ' + user.display_name])
          user.is_following = true
          // this.$store.dispatch('player/setUpdatedUser', _.cloneDeep(user))
          this.$root.$emit(MyEvents.USER_FOLLOW, user.id, true)
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors|| [e.body])
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

    openSampleClearanceLicenseModal () {
      this.$router.push({ path: '/terms' })
      // this.show_sample_clearance_license_modal = true
    },

    closeSampleClearanceLicenseModal () {
      this.show_sample_clearance_license_modal = false
    },

    blurMessage() {
      const vm = this
      if (vm.showEmojiPicker) {
        setTimeout(function() {
          // console.log('hide')
          vm.showEmojiPicker = false
        }, 200);
      }
    },

    loadMoreComments() {
      const params = {
        commentable_type: 'Album',
        commentable_id: this.album.id,
        page: this.comment_pagination.current_page + 1,
        per_page: this.comment_pagination.per_page
      }
      CommentService.getComments(params).then(response => {
        this.comments = this.comments.concat(response.body.comments)
        this.comment_pagination = response.body.pagination
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    addComment() {
      const params = new FormData()
      params.append('comment[commentable_type]', 'Album')
      params.append('comment[commentable_id]', this.album.id)
      params.append('comment[body]', this.commentString)
      this.commentString = ''
      CommentService.sendComment(params).then(response => {
        // this.comments.unshift(response.body)
        // this.comment_pagination.total_count += 1
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    makePublicComment(comment) {
      CommentService.makePublicComment(comment.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You made a comment public!'])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    makePrivateComment(comment) {
      CommentService.makePrivateComment(comment.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You made a comment private!'])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    deleteComment(comment) {
      CommentService.deleteComment(comment.id).then(response => {
        // _.remove(this.comments, (item) => { return item.id == comment.id });
        // const arr = this.comments.slice();
        // this.comments = arr;
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    blockUser(comment) {
      UserService.blockUser(comment.user.id).then(response =>  {
        _.remove(this.comments, (item) => { return item.user.id == comment.user.id })
        const arr = this.comments.slice();
        this.comments = arr;
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
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
      if (this.$store.state.player.isPaused &&
        this.$store.getters['player/currentAlbum'] &&
        this.$store.getters['player/currentAlbum'].id == this.album.id) {
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
      AlbumService.repostAlbum(this.album.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just reposted ' + this.album.name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    // hoverTrackItem (index, status) {
    //   this.buttonHover[index] = status
    //   this.buttonHover = this.buttonHover.slice()
    // },

    goToArtistProfile() {
      this.$router.push({
        path: '/' + this.album.user.slug,
        hash: 'merch'
      })
    },

    showMerchDialog() {
      this.showMerchModal = true
    },

    dimissMerchDialog() {
      this.showMerchModal = false
    }
  },

  mounted() {
    const vm = this
    $(window).resize(function () {
      var height = $('#album_info_page').height() + 230
      var screen_height = $( window ).height()
      if (height > screen_height ) {
        height += 50
      } else {
        height = screen_height
      }
      var canvas = document.getElementById("canvas")
      if (canvas) {
        $('#canvas').css("cssText", "height: " + height + "px !important;")
      }
      $('#back_image').css("cssText", "height: " + height + "px !important;")
    }).trigger('resize')
  },

  updated() {
  },

  head: {
    title() {
      return {
        inner: this.album.user.display_name + " - " + this.album.name
      }
    },
    meta() {
      return [
        { p: 'twitter:title', content: this.album.user.display_name + " - " + this.album.name},
        { p: 'twitter:image', c: this.album.cover.large.url },
      ]
    }
  },
}
