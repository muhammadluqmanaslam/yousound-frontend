import moment from 'moment'

import genreSingleSelector from '@/components/genre_single_selector'
import sampleLicenseDialog from './components/sample_license_dialog'
import trackUploader from '@/components/trackuploader'

import UserService from '@/services/user'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import ProfileService from '@/services/profile'
import { Countries, CollaboratorRoleTypes } from '@/helper'

export default {
  components: {
    genreSingleSelector,
    sampleLicenseDialog,
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
        is_only_for_live_stream: false,
        is_content_acapella: false,
        is_content_instrumental: false,
        is_content_stems: false,
        is_content_remix: false,
        is_content_dj_mix: false,
        enabled_sample: 'false',
        image: null,
        tracks: []
      },
      album_image_url: null,
      locations: [],
      followings: [],
      users: [],
      collaborators: [],
      contributors: [],
      samplings: [],
      artists: [],
      artist_albums: [],
      artist_album_tracks: [],
      page_index: 1,
      total_pages: 1,
      items_per_page: 30,
      show_collaborators_confirm_dialog: false,
      show_genre_selector_dialog: false,
      show_sample_clearance_license_modal: false,
      isPageReady: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    isAvailableToUploadAlbum () {
      return this.album.tracks.length &&
        this.album.name.length &&
        this.album.image &&
        (this.$store.state.genreSelector.genres.length > 0)
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
        this.$store.dispatch('genreSelector/setGenres', [])

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

    addSampling () {
      this.samplings.push({
        sampling_track_id: '',
        sample_track_id: '',
        sample_album_id: '',
        sample_user_id: ''
      })
    },

    deleteSampling (index) {
      this.samplings.splice(index, 1)
    },

    onChangeSampleArtist (user_id) {
      // console.log('onChangeSampleArtist', user_id)
      AlbumService.getAlbums({
        statuses: 'published, collaborated',
        user_statuses: 'accepted',
        user_id: user_id,
        enabled_sample: true
      }).then(response => {
        this.artist_albums = response.body
      })
    },

    onChangeSampleArtistAlbum (album_id) {
      this.artist_album_tracks = _.find(this.artist_albums, (album) => (album.id == album_id)).tracks
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
      this.show_collaborators_confirm_dialog = true
    },

    hideCollaboratorsConfirmDialog () {
      this.show_collaborators_confirm_dialog = false
    },

    openGenreSelectorDialog () {
      this.show_genre_selector_dialog = true
    },

    closeGenreSelectorDialog () {
      this.show_genre_selector_dialog = false
    },

    openSampleClearanceLicenseModal () {
      this.show_sample_clearance_license_modal = true
    },

    closeSampleClearanceLicenseModal () {
      this.show_sample_clearance_license_modal = false
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
      const genre_ids = this.$store.getters['genreSelector/genre'].id
      const formData = new FormData()
      formData.append('album[name]', this.album.name)
      formData.append('album[description]', this.album.description)
      formData.append('album[released_at]', this.album.released_at)
      formData.append('album[location]', this.album.location || '')
      formData.append('album[is_only_for_live_stream]', this.album.is_only_for_live_stream)
      formData.append('album[is_content_acapella]', this.album.is_content_acapella)
      formData.append('album[is_content_instrumental]', this.album.is_content_instrumental)
      formData.append('album[is_content_stems]', this.album.is_content_stems)
      formData.append('album[is_content_remix]', this.album.is_content_remix)
      formData.append('album[is_content_dj_mix]', this.album.is_content_dj_mix)
      formData.append('album[enabled_sample]', this.album.enabled_sample === 'true')
      formData.append('album[cover]', this.album.image)
      formData.append('album[track_ids]', track_ids)
      formData.append('album[genre_ids]', genre_ids)
      if (this.selected_products !== null && this.selected_products.length > 0) {
        formData.append('album[product_ids]', this.selected_products)
      }
      formData.append('album[collaborators]', JSON.stringify(this.collaborators))
      formData.append('album[contributors]', JSON.stringify(this.contributors))
      formData.append('album[samplings]', JSON.stringify(this.samplings))

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
