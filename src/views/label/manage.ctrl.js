import _ from 'lodash'

import AuthService from '@/services/auth'
import AlbumService from '@/services/album'
import LabelService from '@/services/label'
import UserService from '@/services/user'

import selectUserModal from '@/components/selectusermodal'
import labelUserItem from './components/user'
import labelAlbumItem from './components/album'

export default {
  components: {
    selectUserModal,
    labelUserItem,
    labelAlbumItem,
  },

  data() {
    return {
      navigatorState: {
        page: '',
        tab: '',
      },
      artist_tabs: [
        { id: 'approved_labels', title: 'Labels' },
        { id: 'approved_albums', title: 'Approved Albums' },
        { id: 'pending_labels', title: 'Pending Labels' },
        { id: 'pending_albums', title: 'Pending Albums' },
      ],
      label_tabs: [
        { id: 'approved_labels', title: 'Roster' },
        { id: 'approved_albums', title: 'Albums' },
        { id: 'pending_labels', title: 'Pending Artists' },
        { id: 'pending_albums', title: 'Pending Albums' },
      ],
      labels: [],
      albums: [],
      user: {},
      album: {},
      label_delete_confirm_dialog: false,
      album_delete_confirm_dialog: false,
      album_status_confirm_dialog: false,
      roster_delete_confirm_dialog: false,
      show_select_user_modal: false,
      show_help_dialog: false,
      isPageReady: false,
    }
  },

  computed: {
    // currentTab: {
    //   get: function() {
    //     // return this.$store.state.navigator.current.tab
    //     return this.navigatorState.tab
    //   },
    //   set: function (newValue) {
    //   }
    // },

    currentUser() {
      return this.$store.state.auth.user
    },

    approved_labels() {
      return _.filter(this.labels, (item) => {
        return item.status === 'accepted'
      })
    },

    not_approved_labels() {
      return _.filter(this.labels, (item) => {
        return item.status !== 'accepted'
      })
    },

    pending_labels() {
      return _.filter(this.labels, (item) => {
        return item.status === 'pending'
      })
    },

    approved_albums() {
      console.log(
        'approved_albums',
        _.filter(this.albums, (item) => {
          return item.status === 'accepted'
        })
      )
      return _.filter(this.albums, (item) => {
        return item.status === 'accepted'
      })
    },

    not_approved_albums() {
      return _.filter(this.albums, (item) => {
        return item.status !== 'accepted'
      })
    },

    pending_albums() {
      return _.filter(this.albums, (item) => {
        return item.status === 'pending'
      })
    },

    status_dialog_title() {
      if (this.album.status === 'published') {
        return 'Make Private an Album'
      } else if (this.album.status !== 'published') {
        return 'Make Public an Album'
      }
      return ''
    },

    status_dialog_text() {
      if (this.album.status === 'published') {
        return (
          'If you click OK, the album will be private. Click OK to make private <' +
          this.album.name +
          '>, or click Cancel.'
        )
      } else if (this.album.status !== 'published') {
        return (
          'If you click OK, the album will be published. Click OK to publish <' +
          this.album.name +
          '>, or click Cancel.'
        )
      }
      return ''
    },
  },

  created() {
    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    if (this.currentUser.data['label_page_visited'] !== 1) {
      this.openHelpDialog()
    }

    this.navigatorState.page = 'label'
    if (this.$store.state.auth.user.user_type === 'artist') {
      this.loadData()
      this.navigatorState.tab = 'approved_labels'
    } else if (this.$store.state.auth.user.user_type === 'label') {
      this.loadData()
      this.navigatorState.tab = 'approved_labels'
    } else {
      this.$router.push({ path: '/' })
    }
    // console.log('calling navigator/setCurrentState', this.navigatorState)
    this.$store.dispatch(
      'navigator/setCurrentState',
      _.cloneDeep(this.navigatorState)
    )
  },

  methods: {
    isActiveTab(tab) {
      return this.navigatorState.tab == tab
    },

    loadData() {
      this.isPageReady = false
      Promise.all([LabelService.getLabelUsers(), LabelService.getLabelAlbums()])
        .then((values) => {
          this.labels = values[0].body
          this.albums = values[1].body
          this.isPageReady = true
        })
        .catch((reason) => {
          console.log(reason)
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', reason)
        })
    },

    openHelpDialog() {
      this.show_help_dialog = true
    },

    closeHelpDialog() {
      this.show_help_dialog = false
      const params = {
        user: {
          label_page_visited: 1,
        },
      }
      UserService.updateUserInfo(this.currentUser.id, params).then(
        (response) => {
          AuthService.setUser(response.body)
          this.$store.dispatch('auth/setUser', response.body)
        }
      )
    },

    onTab(tab) {
      this.navigatorState.tab = tab
      this.$store.dispatch(
        'navigator/setCurrentState',
        _.cloneDeep(this.navigatorState)
      )
    },

    acceptLabelUserRequest(host) {
      UserService.acceptLabelRequest(host.id).then((response) => {
        this.loadData()
        this.navigatorState.tab = 'approved_labels'
        this.$store.dispatch(
          'navigator/goNextState',
          _.cloneDeep(this.navigatorState)
        )
      })
    },

    denyLabelUserRequest(host) {
      UserService.denyLabelRequest(host.id).then((response) => {
        this.loadData()
        this.navigatorState.tab = 'approved_labels'
        this.$store.dispatch(
          'navigator/goNextState',
          _.cloneDeep(this.navigatorState)
        )
      })
    },

    acceptLabelAlbumRequest(album, label) {
      const params = {
        label_id: label.id,
      }
      AlbumService.acceptLabelRequest(album.id, params).then((response) => {
        this.loadData()
        this.navigatorState.tab = 'approved_albums'
        this.$store.dispatch(
          'navigator/goNextState',
          _.cloneDeep(this.navigatorState)
        )
      })
    },

    denyLabelAlbumRequest(album, label) {
      const params = {
        label_id: label.id,
      }
      AlbumService.denyLabelRequest(album.id, params).then((response) => {
        this.loadData()
        this.navigatorState.tab = 'approved_albums'
        this.$store.dispatch(
          'navigator/goNextState',
          _.cloneDeep(this.navigatorState)
        )
      })
    },

    showSelectUserDialog() {
      this.show_select_user_modal = true
    },

    hideSelectUserDialog() {
      this.show_select_user_modal = false
    },

    sendRequestToAdd(artist) {
      UserService.sendLabelRequest(artist.id)
        .then((res) => {
          // this.$router.push(`/album/${album.slug}/edit`)
          // this.$store.dispatch('navigator/setCurrentState', _.cloneDeep(this.navigatorState))
          this.loadData()
          this.navigatorState.tab = 'pending_labels'
          this.$store.dispatch(
            'navigator/goNextState',
            _.cloneDeep(this.navigatorState)
          )
        })
        .catch((e) => {
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
    },

    showLabelDeleteConfirmDialog(user) {
      this.user = user
      this.label_delete_confirm_dialog = true
    },

    hideLabelDeleteConfirmDialog() {
      this.user = {}
      this.label_delete_confirm_dialog = false
    },

    removeLabel() {
      UserService.removeLabel(this.user.id)
        .then((response) => {
          this.loadData()
          this.hideLabelDeleteConfirmDialog()
        })
        .catch((e) => {
          this.hideLabelDeleteConfirmDialog()
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
    },

    showRosterDeleteConfirmDialog(user) {
      this.user = user
      this.roster_delete_confirm_dialog = true
    },

    hideRosterDeleteConfirmDialog() {
      this.user = {}
      this.roster_delete_confirm_dialog = false
    },

    removeRoster() {
      UserService.removeLabel(this.user.id)
        .then((response) => {
          this.loadData()
          this.hideRosterDeleteConfirmDialog()
        })
        .catch((e) => {
          this.hideRosterDeleteConfirmDialog()
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
    },

    showAlbumDeleteConfirmDialog(album, user) {
      this.album = album
      if (user) this.user = user
      this.album_delete_confirm_dialog = true
    },

    hideAlbumDeleteConfirmDialog() {
      this.album = {}
      this.album_delete_confirm_dialog = false
    },

    removeAlbum() {
      let label_id = ''
      if (this.$store.state.auth.user.user_type == 'label') {
        label_id = this.$store.state.auth.user.id
      } else {
        label_id = this.user.id
      }
      // console.log('removeAlbum', label_id, this.album)

      const params = {
        label_id: label_id,
      }
      AlbumService.removeLabel(this.album.id, params)
        .then((response) => {
          _.remove(this.albums, (item) => {
            return item.album_id == this.album.id && item.user_id == label_id
          })
          const arr = this.albums.slice()
          this.albums = arr
          this.hideAlbumDeleteConfirmDialog()
        })
        .catch((e) => {
          this.hideAlbumDeleteConfirmDialog()
          if (e.body.errors) {
            this.$store.dispatch('error/showErrorToast', e.body.errors)
          } else {
            this.$store.dispatch('error/showErrorToast', [e.body])
          }
        })
    },

    // editAlbum (album) {
    //   // console.log('editAlbum', album)
    //   this.$router.push(`/album/${album.slug}/edit`)
    // },

    showAlbumStatusConfirmDialog(album) {
      this.album = album
      this.album_status_confirm_dialog = true
    },

    hideAlbumStatusConfirmDialog() {
      this.album = {}
      this.album_status_confirm_dialog = false
    },

    updateAlbumStatus() {
      // console.log('makePrivateAlbum', this.album)
      if (this.album.status === 'published') {
        AlbumService.makePrivateAlbum(this.album.id)
          .then((response) => {
            this.album.status = 'privated'
            this.hideAlbumStatusConfirmDialog()
          })
          .catch((e) => {
            this.hideAlbumStatusConfirmDialog()
            if (e.body.errors) {
              this.$store.dispatch('error/showErrorToast', e.body.errors)
            } else {
              this.$store.dispatch('error/showErrorToast', [e.body])
            }
          })
      } else if (this.album.status !== 'published') {
        AlbumService.makePublicAlbum(this.album.id)
          .then((response) => {
            this.album.status = 'published'
            this.hideAlbumStatusConfirmDialog()
          })
          .catch((e) => {
            this.hideAlbumStatusConfirmDialog()
            if (e.body.errors) {
              this.$store.dispatch('error/showErrorToast', e.body.errors)
            } else {
              this.$store.dispatch('error/showErrorToast', [e.body])
            }
          })
      }
    },
  },

  mounted() {},
}
