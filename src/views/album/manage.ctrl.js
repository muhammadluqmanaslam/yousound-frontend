import _ from 'lodash'
import AlbumService from '@/services/album'
import albumCard from './components/album'

export default {
  components: {
    albumCard
  },

  data () {
    return {
      activeTab: null,
      albums: [],
      album: {},
      album_delete_confirm_dialog: false,
      album_status_confirm_dialog: false,
      show_album_finish_modal: false,
      isPageReady: false,
    }
  },

  computed: {
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

    status_dialog_title () {
      if (this.album.status === 'published') {
        return 'Make Private an Album'
      } else if (this.album.status !== 'published') {
        return 'Make Public an Album'
      }
      return ''
    },

    status_dialog_text () {
      if (this.album.status === 'published') {
        return 'If you click OK, the album will be private. Click OK to make private <' + this.album.name  + '>, or click Cancel.'
      } else if (this.album.status !== 'published') {
        return 'If you click OK, the album will be published. Click OK to publish <' + this.album.name  + '>, or click Cancel.'
      }
      return ''
    },
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

    showAlbumDeleteConfirmDialog (album) {
      this.album = album
      this.album_delete_confirm_dialog = true
    },

    hideAlbumDeleteConfirmDialog () {
      this.album = {}
      this.album_delete_confirm_dialog = false
    },

    deleteAlbum () {
      // console.log('deleteAlbum', this.album)
      AlbumService.deleteAlbum(this.album.id).then(response => {
        _.remove(this.albums, (item) => { return item.id == this.album.id });
        const arr = this.albums.slice();
        this.albums = arr;
        this.hideAlbumDeleteConfirmDialog();
      }).catch(e => {
        this.hideAlbumDeleteConfirmDialog();
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    editAlbum (album) {
      // console.log('editAlbum', album)
      this.$router.push(`/album/${album.slug}/edit`)
    },

    showAlbumStatusConfirmDialog (album) {
      this.album = album
      this.album_status_confirm_dialog = true
    },

    hideAlbumStatusConfirmDialog () {
      this.album = {}
      this.album_status_confirm_dialog = false
    },

    updateAlbumStatus () {
      // console.log('makePrivateAlbum', this.album)
      if (this.album.status === 'published') {
        AlbumService.makePrivateAlbum(this.album.id).then(response => {
          this.album.status = 'private'
          this.hideAlbumStatusConfirmDialog();
        }).catch(e => {
          this.hideAlbumStatusConfirmDialog();
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      } else if (this.album.status !== 'published') {
        AlbumService.makePublicAlbum(this.album.id).then(response => {
          this.album.status = 'published'
          this.hideAlbumStatusConfirmDialog();
        }).catch(e => {
          this.hideAlbumStatusConfirmDialog();
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      }
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
        this.activeTab = 'collaborated'
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

      this.activeTab = tab
      // this.$store.dispatch('navigator/setCurrentState', { page: 'manage', tab: tab })
      this.$store.dispatch('navigator/goNextState', { page: 'manage', tab: tab })
    }
  },

  mounted () {
  }
}
