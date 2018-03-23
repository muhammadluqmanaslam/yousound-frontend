import _ from 'lodash'
import moment from 'moment'
import promoteModal from '@/components/promotemodal'
import trackUploader from '@/components/trackuploader'
import AlbumService from '@/services/album'
import GenreService from '@/services/genre'
import ProductService from '@/services/product'
import ProfileService from '@/services/profile'
import UserService from '@/services/user'
import { CollaboratorRoleTypes } from '@/helper'

export default {
  components: {
    trackUploader,
    promoteModal
  },

  data () {
    return {
      isNeededToRelease: false,
      showPromoteMessage: false,
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
      collaborators_confirm_dialog: false,
      isPageReady: false,
    }
  },

  computed: {
    isAvailableToEditAlbum () {
      // return this.album.tracks.length && this.album.name.length && this.album_image_url && this.selected_product
      return this.album.tracks.length && this.album.name.length && this.album_image_url && this.genre.length
    },

    artists() {
      return _.filter(this.users, (item) => { return item.user_type === 'artist' })
    },

    role_types() {
      return CollaboratorRoleTypes
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'album_edit', tab: '' })
    if (this.$store.state.auth.user) {
      if (this.$store.state.auth.user.user_type !== 'artist') {
        this.$router.push({ path: '/'})
      } else {
        const params = {
          'page': 1,
          'per_page': 30
        }
        this.isPageReady = false
        this.$store.dispatch('error/showLoadingActivity', true)
        this.slug = this.$route.params.slug
        Promise.all([
          GenreService.getGenres2(),
          ProductService.getProducts({
            statuses: 'published, collaborated',
            stock_statuses: 'active',
            user_statuses: 'accepted'
          }),
          AlbumService.getAlbum(this.slug),
          // UserService.searchUsers(params)
          ProfileService.getItems(this.$store.state.auth.user.id, 'followings', params)
        ]).then(values => {
          this.genres = _.flatMap(values[0].body, 'children')
          this.products = values[1].body
          this.users = values[3].body.users

          this.album = values[2].body
          this.album_image_url = this.album.cover.url
          if (this.album.released_at) {
            this.album.released_at = moment(this.album.released_at).format('YYYY-MM-DD')
          } else {
            this.album.released_at = moment().format('YYYY-MM-DD')
          }
          if (this.album.genres.length > 0) {
            this.genre = this.album.genres[0].id
          }
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
    imageChanged (e) {
      this.album_image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        this.album_image_url = event.target.result
      }, false)
      reader.readAsDataURL(this.album_image)
      this.$forceUpdate()
    },

    learnMore () {
    },

    addCollaborator () {
      this.collaborators.push({
        user_id: '',
        user_role: '',
        status: 'pending'
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

    showCollaboratorsConfirmDialog () {
      this.collaborators_confirm_dialog = true
    },

    hideCollaboratorsConfirmDialog () {
      this.collaborators_confirm_dialog = false
    },

    beforeReleaseNow () {
      if (this.album.status == 'pending') {
        this.showCollaboratorsConfirmDialog()
      } else {
        this.releaseNow()
      }
    },

    releaseNow () {
      this.hideCollaboratorsConfirmDialog()
      this.isNeededToRelease = true
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
      const genre_ids = this.genre
      const product_ids = this.selected_product
      const formData = new FormData()
      formData.append('album[name]', this.album.name)
      formData.append('album[description]', this.album.description)
      formData.append('album[released_at]', this.album.released_at)
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
        if(this.album.promote) {
          this.repostAlbum(id)
        } else {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$router.push({ path: '/albums' })
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
  }
}
