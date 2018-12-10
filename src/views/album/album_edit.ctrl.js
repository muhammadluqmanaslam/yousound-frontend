import _ from 'lodash'
import moment from 'moment'

import genreSingleSelector from '@/components/genre_single_selector'
import promoteModal from '@/components/promotemodal'
import trackUploader from '@/components/trackuploader'

import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import ProfileService from '@/services/profile'
import UserService from '@/services/user'
import { Countries, CollaboratorRoleTypes } from '@/helper'

export default {
  components: {
    genreSingleSelector,
    promoteModal,
    trackUploader
  },

  data() {
    return {
      isNeededToRelease: false,
      showPromoteMessage: false,
      locations: [],
      followings: [],
      users: [],
      genres: [],
      products: [],
      collaborators: [],
      contributors: [],
      selected_product: null,
      album: null,
      album_image: null,
      album_image_url: null,
      genre: '',
      slug: null,
      show_collaborators_confirm_dialog: false,
      show_genre_selector_dialog: false,
      isPageReady: false,
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    isAvailableToEditAlbum () {
      return this.album.tracks.length &&
        this.album.name.length &&
        this.album_image_url &&
        (this.$store.state.genreSelector.genres.length > 0)
    },

    role_types() {
      return CollaboratorRoleTypes
    }
  },

  created() {
    this.$store.dispatch('navigator/goNextState', { page: 'album_edit', tab: '' })
    if (this.currentUser) {
      if (this.currentUser.user_type !== 'artist') {
        this.$router.push({ path: '/'})
      } else {
        const params = {
          filter: 'artist',
          'page': 1,
          'per_page': 30
        }
        this.isPageReady = false
        this.$store.dispatch('error/showLoadingActivity', true)
        this.slug = this.$route.params.slug
        Promise.all([
          // UserService.searchUsers(params)
          ProductService.getProducts({
            statuses: 'published, collaborated',
            stock_statuses: 'active',
            user_statuses: 'accepted'
          }),
          AlbumService.getAlbum(this.slug),
          ProfileService.getItems(this.currentUser.id, 'followings', params)
        ]).then(values => {
          this.genres = _.flatMap(this.$store.state.app.genres, 'children')
          this.products = values[0].body
          this.followings = _.cloneDeep(values[2].body.users)
          this.users = _.cloneDeep(values[2].body.users)
          this.users.unshift(this.currentUser)

          this.album = values[1].body
          this.album_image_url = this.album.cover.url
          if (this.album.released_at) {
            this.album.released_at = moment(this.album.released_at).format('YYYY-MM-DD')
          } else {
            this.album.released_at = moment().format('YYYY-MM-DD')
          }
          // if (this.album.genres.length > 0) {
          //   // this.genre = this.album.genres[0].id
          //   // this.genre = this.album.genres[0]
          //   // this.$store.dispatch('genreSelector/setGenres', this.album.genres)
          // }
          this.$store.dispatch('genreSelector/setGenres', this.album.genres)
          if (this.album.products.length > 0) {
            this.selected_product = this.album.products[0].id
          }
          if (this.album.collaborators.length > 0) {
            this.collaborators = this.album.collaborators
          }
          if (this.album.contributors.length > 0) {
            this.contributors = this.album.contributors
          }
          // console.log(this.isPageReady, this.genres, this.genre, this.products, this.selected_product)
          this.isPageReady = true
          this.$store.dispatch('error/showLoadingActivity', false)
          const vm = this
          setTimeout(function () {
            $('#album_image').css('background-image', 'url(' + vm.album.cover.url + ')')
          }, 200)
        }).catch(reason => { 
          console.log(reason)
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', reason)
          // this.isPageReady = true
        });
      }
    } else {
      this.$router.push({ path: '/'})
    }
  },

  methods: {
    imageChanged(e) {
      this.album_image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        this.album_image_url = event.target.result
      }, false)
      reader.readAsDataURL(this.album_image)
      this.$forceUpdate()
    },

    learnMore() {
    },

    addCollaborator() {
      this.collaborators.push({
        user_id: '',
        user_role: '',
        status: 'pending'
      })
    },

    deleteCollaborator(index) {
      this.collaborators.splice(index, 1)
    },

    addContributor() {
      this.contributors.push({
        user_id: '',
        user_role: ''
      })
    },

    deleteContributor(index) {
      this.contributors.splice(index, 1)
    },

    deleteAlbum() {
      const id = ''
      this.isLoading = true
      AlbumService.deleteAlbum(id).then(res => {
        this.isLoading = false
        this.$router.push({ path: '/discover' })
      })
      .catch(e => {
        this.isLoading = false
        this.errorMessage = e.body.errors[0].detail
        this.showError = true
      })
    },

    showCollaboratorsConfirmDialog() {
      this.show_collaborators_confirm_dialog = true
    },

    hideCollaboratorsConfirmDialog() {
      this.show_collaborators_confirm_dialog = false
    },

    openGenreSelectorDialog () {
      this.show_genre_selector_dialog = true
    },

    closeGenreSelectorDialog () {
      this.show_genre_selector_dialog = false
    },

    beforeReleaseNow() {
      if (this.album.status == 'pending') {
        this.showCollaboratorsConfirmDialog()
      } else {
        this.releaseNow()
      }
    },

    releaseNow() {
      this.hideCollaboratorsConfirmDialog()
      this.isNeededToRelease = true
      this.uploadAlbum()
    },

    uploadAlbum() {
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
      const product_ids = this.selected_product
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
      if (this.album_image) {
        formData.append('album[cover]', this.album_image)
      }
      formData.append('album[track_ids]', track_ids)
      formData.append('album[genre_ids]', genre_ids)
      formData.append('album[product_ids]', product_ids)
      formData.append('album[collaborators]', JSON.stringify(this.collaborators))
      formData.append('album[contributors]', JSON.stringify(this.contributors))

      AlbumService.updateAlbum(this.album.id, formData).then(res => {
        const id = res.body.id
        if(this.isNeededToRelease) {
          let accepted = true
          _.each(this.collaborators, (collaborator) => {
            if (collaborator.status != 'accepted') {
              accepted = false
            }
          })
          if (accepted) {
            this.releaseAlbum(id)
          } else {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$router.push({ path: '/albums' })
          }
        } else {
          if(this.album.promote) {
            this.repostAlbum(id)
          } else {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$router.push({ path: '/albums' })
          }
        }
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    releaseAlbum (id) {
      AlbumService.releaseAlbum(id).then(res => {
        if (this.album.promote) {
          this.repostAlbum(id)
        } else {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$router.push({ path: '/albums' })
          // this.$store.dispatch('navigator/setParams', { album_id: id })
          // this.$router.push({ path: '/album/' + id })
        }
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    saveAndFinish(users) {
      this.isNeededToRelease = false
      this.uploadAlbum()
    },
  },

  mounted () {
    const vm = this
    $.getJSON('../../static/cities.json', function (data) {
      vm.locations = data
    })
  }
}
