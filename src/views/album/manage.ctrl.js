import _ from 'lodash'
import AlbumService from '@/services/album'
import albumCard from './components/album'

export default {
  components: {
    albumCard
  },

  data () {
    return {
      active_tab: null,
      tabs: [
        { id: 'published', title: 'Published' },
        { id: 'private', title: 'Private' },
        { id: 'video_only', title: 'Video Attachments' },
        { id: 'collaborated', title: 'Collaborations' },
        { id: 'pending', title: 'Pending Collaborations' }
      ],
      albums: [],
      album: {},
      show_album_delete_confirm_dialog: false,
      show_publish_confirm_dialog: false,
      show_private_confirm_dialog: false,
      show_video_only_confirm_dialog: false,
      show_album_finish_modal: false,
      isPageReady: false,
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    published_albums () {
      return _.filter(this.albums, (item) => { return item.status === 'published' && !item.is_only_for_live_stream })
    },

    private_albums () {
      return _.filter(this.albums, (item) => { return item.status === 'privated' })
    },

    video_only_albums () {
      return _.filter(this.albums, (item) => { return item.status === 'published' && item.is_only_for_live_stream })
    },

    pending_albums () {
      return _.filter(this.albums, (item) => { return item.status === 'pending' })
    },

    collaborated_albums () {
      return _.filter(this.albums, (item) => { return item.status === 'collaborated' })
    },

    albumStatus () {
      if (this.album.status === 'published' && !this.album.is_only_for_live_stream) {
        return 'published'
      }

      if (this.album.status === 'published' && this.album.is_only_for_live_stream) {
        return 'video_only'
      }

      return 'privated'
    }
  },

  watch: {
    '$route' (toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    }
  },

  created () {
    if (!this.$store.state.auth.user) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    if (this.$store.state.auth.user.user_type !== 'artist') {
      this.$router.push({ path: '/'})
      return
    }

    const tab = this.$route.hash.substr(1)
    this.setTab(tab)

    const lastState = this.$store.getters['navigator/last']
    if (_.get(lastState, 'params.album_id')) {
      AlbumService.getAlbum(lastState.params.album_id).then(response => {
        this.album = response.body
        this.openAlbumFinishModal()
      })
    }
    this.loadAlbums()
  },

  methods: {
    isActiveTab(tab) {
      return this.active_tab == tab
    },

    loadAlbums () {
      this.$store.dispatch('error/showLoadingActivity', true)
      this.isPageReady = false
      AlbumService.getAlbums().then(response => {
        this.albums = response.body
        this.$store.dispatch('error/showLoadingActivity', false)
        this.isPageReady = true
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.isPageReady = true
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    openAlbumFinishModal() {
      this.show_album_finish_modal = true
    },

    closeAlbumFinishModal() {
      this.show_album_finish_modal = false
    },

    openAlbumDeleteConfirmDialog (album) {
      this.album = album
      this.show_album_delete_confirm_dialog = true
    },

    closeAlbumDeleteConfirmDialog () {
      this.album = {}
      this.show_album_delete_confirm_dialog = false
    },

    deleteAlbum () {
      // console.log('deleteAlbum', this.album)
      AlbumService.deleteAlbum(this.album.id).then(response => {
        _.remove(this.albums, (item) => { return item.id == this.album.id });
        const arr = this.albums.slice();
        this.albums = arr;
        this.closeAlbumDeleteConfirmDialog();
      }).catch(e => {
        this.closeAlbumDeleteConfirmDialog();
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    editAlbum (album) {
      // console.log('editAlbum', album)
      this.$router.push(`/album/${album.slug}/edit`)
    },

    openPublishConfirmDialog (album) {
      this.album = album
      this.show_publish_confirm_dialog = true
    },

    closePublishConfirmDialog () {
      this.album = {}
      this.show_publish_confirm_dialog = false
    },

    openPrivateConfirmDialog (album) {
      this.album = album
      this.show_private_confirm_dialog = true
    },

    closePrivateConfirmDialog () {
      this.album = {}
      this.show_private_confirm_dialog = false
    },

    openVideoOnlyConfirmDialog (album) {
      this.album = album
      this.show_video_only_confirm_dialog = true
    },

    closeVideoOnlyConfirmDialog () {
      this.album = {}
      this.show_video_only_confirm_dialog = false
    },

    publishAlbum () {
      AlbumService.makePublicAlbum(this.album.id).then(response => {
        this.closePublishConfirmDialog()
        this.album.status = 'published'
        this.album.is_only_for_live_stream = false
      }).catch(e => {
        this.closePublishConfirmDialog()
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    privateAlbum () {
      AlbumService.makePrivateAlbum(this.album.id).then(response => {
        this.closePrivateConfirmDialog()
        this.album.status = 'private'
      }).catch(e => {
        this.closePrivateConfirmDialog()
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    videoOnlyAlbum () {
      AlbumService.makeLiveVideoOnlyAlbum(this.album.id).then(response => {
        this.closeVideoOnlyConfirmDialog()
        this.album.status = 'published'
        this.album.is_only_for_live_stream = true
      }).catch(e => {
        this.closeVideoOnlyConfirmDialog();
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    notResponded (album) {
      const collaborator = _.find(album.collaborators, (c) => {
        return c.user_id == this.$store.state.auth.user.id
      })
      // console.log('notResponded', this.$store.state.auth.user.id, collaborator)
      return collaborator && (collaborator.status == 'pending')
    },

    acceptAlbum (album) {
      AlbumService.acceptCollaboration(album.id).then(response => {
        this.loadAlbums()
      })
    },

    denyAlbum (album) {
      AlbumService.denyCollaboration(album.id).then(response => {
        this.loadAlbums()
      })
    },

    releaseAlbum (album) {
      AlbumService.releaseAlbum(album.id).then(response => {
        this.active_tab = 'collaborated'
        this.loadAlbums()
      })
    },

    onTab (tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab
      })
    },

    setTab (tab) {
      if (!tab)
        tab = 'published'

      this.active_tab = tab
      // this.$store.dispatch('navigator/setCurrentState', { page: 'manage', tab: tab })
      this.$store.dispatch('navigator/goNextState', { page: 'manage', tab: tab })
    }
  },

  mounted () {
  }
}
