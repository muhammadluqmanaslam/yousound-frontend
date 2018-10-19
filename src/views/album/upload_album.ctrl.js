import moment from 'moment'

import trackUploader from '@/components/trackuploader'

import UserService from '@/services/user'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import ProfileService from '@/services/profile'
import { Countries, CollaboratorRoleTypes } from '@/helper'

export default {
  components: {
    trackUploader
  },

  data () {
    return {
      isNeededToRelease: false,
      genres: [],
      products: [],
      selected_products: null,
      album: {
        name: '',
        released_at: null,
        location: '',
        genre: '',
        description: '',
        image: null,
        tracks: []
      },
      album_image_url: null,
      locations: [],
      followings: [],
      users: [],
      collaborators: [],
      contributors: [],
      page_index: 1,
      total_pages: 1,
      items_per_page: 30,
      collaborators_confirm_dialog: false,
      isPageReady: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    isAvailableToUploadAlbum () {
      return this.album.tracks.length && this.album.name.length && this.album.image && this.album.genre.length
    },

    role_types() {
      return CollaboratorRoleTypes
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'upload', tab: '' })
    if (this.currentUser && this.currentUser.user_type === 'artist') {
      this.album.released_at = moment().format('YYYY-MM-DD')
      const params = {
        filter: 'artist',
        page: this.page_index,
        per_page: this.items_per_page
      }
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        // UserService.searchUsers(params),
        ProfileService.getItems(this.currentUser.id, 'followings', params),
        ProductService.getProducts({
          statuses: 'published, collaborated',
          stock_statuses: 'active',
          user_statuses: 'accepted'
        })
      ]).then(values => {
        this.genres = _.flatMap(this.$store.state.app.genres, 'children')
        this.followings = _.cloneDeep(values[0].body.users)
        this.users = _.cloneDeep(values[0].body.users)
        this.users.unshift(this.currentUser)
        this.products = values[1].body

        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(reason => {
        // console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', reason)
      })
    } else {
      this.$router.push({ path: '/'})
    }
  },

  methods: {
    imageChanged (e) {
      this.album.image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        this.album_image_url = event.target.result
      }, false)
      reader.readAsDataURL(this.album.image)
    },

    deleteMerch(item) {
      console.log('deleted')
    },

    learnMore () {
    },

    addCollaborator () {
      this.collaborators.push({
        user_id: '',
        user_role: ''
      })
    },

    deleteCollaborator (index) {
      this.collaborators.splice(index, 1)
    },

    addContributor () {
      this.contributors.push({
        user_id: '',
        user_role: ''
      })
    },

    deleteContributor (index) {
      this.contributors.splice(index, 1)
    },

    deleteAlbum () {
      const id = ''
      this.isLoading = true
      AlbumService.deleteAlbum(id).then(response => {
        this.isLoading = false
        this.$router.push({ path: '/discover' })
      }).catch(e => {
        this.isLoading = false
        this.errorMessage = e.body.errors[0].detail
        this.showError = true
      })
    },

    saveForLater () {
      this.uploadAlbum()
    },

    showCollaboratorsConfirmDialog () {
      this.collaborators_confirm_dialog = true
    },

    hideCollaboratorsConfirmDialog () {
      this.collaborators_confirm_dialog = false
    },

    beforeReleaseNow () {
      this.showCollaboratorsConfirmDialog()
    },

    releaseNow () {
      if (this.collaborators.length == 0) {
        this.isNeededToRelease = true
      }
      this.uploadAlbum()
    },

    uploadAlbum () {
      this.$store.dispatch('error/showLoadingActivity', true)
      var tracks = []
      for(let index in this.album.tracks) {
        const track = this.album.tracks[index].track
        if(track) {
          tracks.push(track.id)
        }
      }

      const track_ids = tracks.join(',')
      const genre_ids = this.album.genre
      const formData = new FormData()
      formData.append('album[name]', this.album.name)
      formData.append('album[description]', this.album.description)
      formData.append('album[released_at]', this.album.released_at)
      formData.append('album[location]', this.album.location || '')
      formData.append('album[cover]', this.album.image)
      formData.append('album[track_ids]', track_ids)
      formData.append('album[genre_ids]', genre_ids)
      if (this.selected_products !== null && this.selected_products.length > 0) {
        formData.append('album[product_ids]', this.selected_products)
      }
      formData.append('album[collaborators]', JSON.stringify(this.collaborators))
      formData.append('album[contributors]', JSON.stringify(this.contributors))

      AlbumService.createAlbum(formData).then(response => {
        if(this.isNeededToRelease) {
          this.releaseAlbum(response.body.id)
        } else {
          this.$store.dispatch('error/showLoadingActivity', false)
          if (this.collaborators.length > 0) {
            this.$store.dispatch('navigator/setParams', { album_id: response.body.id })
            this.$router.push({ path: '/albums#pending' })
          } else {
            this.$router.push({ path: '/albums' })
          }
        }
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    releaseAlbum (album_id) {
      AlbumService.releaseAlbum(album_id).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('navigator/setParams', { album_id: album_id })
        this.$router.push({ path: '/album/' + album_id })
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    repostAlbum (album_id) {
      AlbumService.repostAlbum(album_id).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        // this.$router.push({ path: '/discover' })
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
    const vm = this
    $.getJSON('../../static/cities.json', function (data) {
      vm.locations = data
    })
  }
}
