/* global $:true */

import _ from 'lodash'
import moment from 'moment'

import genreSingleSelector from '@/components/genre_single_selector'
import promoteModal from '@/components/promotemodal'
import sampleLicenseDialog from './components/sample_license_dialog'
import trackUploader from '@/components/trackuploader'

import AlbumService from '@/services/album'
import MeService from '@/services/me'
import ProductService from '@/services/product'
import ProfileService from '@/services/profile'

// import UserService from '@/services/user'
import { CollaboratorRoleTypes } from '@/helper'

export default {
  components: {
    genreSingleSelector,
    promoteModal,
    sampleLicenseDialog,
    trackUploader,
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
      potential_collaborators: [],
      potential_contributors: [],
      collaborators: [],
      contributors: [],
      samplings: [],
      // sampling: {},
      artists: [],
      selected_product: null,
      album: null,
      album_image: null,
      album_image_url: null,
      genre: '',
      sampling_min_id: 0,
      slug: null,
      show_collaborators_confirm_dialog: false,
      show_genre_selector_dialog: false,
      show_sample_clearance_license_modal: false,
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    isAvailableToEditAlbum() {
      // console.log('isAvailableToUploadAlbum', this.album.tracks)
      const failed_track = _.find(
        this.album.tracks,
        (track) => track.status !== 2
      )
      const has_failed_track = !!failed_track
      let isSamplingsGood = true
      let sampling_track_id = 0
      let sample_track_id = 0
      let sample_album_id = 0
      let sample_user_id = 0
      for (let i = 0; i < this.samplings.length; i++) {
        sampling_track_id = _.get(this.samplings[i], 'sampling_track_id', 0)
        sample_track_id = _.get(this.samplings[i], 'sample_track_id', 0)
        sample_album_id = _.get(
          this.samplings[i],
          'sample_album_id.id',
          this.samplings[i].sample_album_id
        )
        sample_user_id = _.get(
          this.samplings[i],
          'sample_user_id.id',
          this.samplings[i].sample_user_id
        )
        // console.log(i, sampling_track_id, sample_track_id, sample_album_id, sample_user_id)
        if (
          !(
            sampling_track_id > 0 &&
            sample_track_id > 0 &&
            sample_album_id > 0 &&
            sample_user_id > 0
          )
        ) {
          isSamplingsGood = false
          break
        }
      }
      return (
        isSamplingsGood &&
        this.album.tracks.length > 0 &&
        !has_failed_track &&
        this.album.name.length &&
        this.album_image_url &&
        this.$store.state.genreSelector.genres.length > 0
      )
    },

    role_types() {
      return CollaboratorRoleTypes
    },
  },

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'album_edit',
      tab: '',
    })
    if (this.currentUser) {
      if (this.currentUser.user_type !== 'artist') {
        this.$router.push({ path: '/' })
      } else {
        const vm = this
        this.isPageReady = false
        this.$store.dispatch('error/showLoadingActivity', true)
        this.slug = this.$route.params.slug
        Promise.all([
          // UserService.searchUsers(params)
          ProductService.getProducts({
            statuses: 'published, collaborated',
            stock_statuses: 'active',
            user_statuses: 'accepted',
          }),
          AlbumService.getAlbum(this.slug),
          MeService.mutualUsers({
            per_page: -1,
          }),
          ProfileService.getItems(this.currentUser.id, 'sample_followings', {
            per_page: -1,
          }),
        ])
          .then((values) => {
            this.genres = _.flatMap(this.$store.state.app.genres, 'children')
            this.products = values[0].body

            this.potential_collaborators = _.cloneDeep(values[2].body.users)
            this.potential_contributors = _.cloneDeep(values[2].body.users)
            this.potential_contributors.unshift(this.currentUser)
            this.artists = values[3].body.users

            this.album = values[1].body
            this.album_image_url = this.album.cover.url
            if (this.album.released_at) {
              this.album.released_at = moment(this.album.released_at).format(
                'YYYY-MM-DD'
              )
            } else {
              this.album.released_at = moment().format('YYYY-MM-DD')
            }
            this.album.enabled_sample = this.album.enabled_sample.toString()

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
            if (this.album.samplings.length > 0) {
              this.samplings = this.album.samplings
              _.each(this.samplings, (sampling) => {
                let artists = _.cloneDeep(this.artists)
                _.each(artists, (u) => {
                  u.sampling_id = sampling.id
                })
                sampling.artists = artists
              })

              let users_ids = _.chain(this.samplings)
                .map('sample_user_id')
                .uniq()
                .value()
              let fns = _.map(users_ids, (user_id) =>
                AlbumService.getAlbums({
                  statuses: 'published, collaborated',
                  user_statuses: 'accepted',
                  user_id: user_id,
                  enabled_sample: true,
                })
              )
              Promise.all(fns).then((values) => {
                for (let i = 0; i < values.length; i++) {
                  let samplings = _.filter(
                    this.samplings,
                    (s) => s.sample_user_id === users_ids[i]
                  )
                  _.each(samplings, (sampling) => {
                    let albums = values[i].body
                    _.each(albums, (a) => {
                      a.sampling_id = sampling.id
                    })
                    sampling.artist_albums = albums
                    sampling.artist_album_tracks = _.find(
                      albums,
                      (a) => a.id === sampling.sample_album_id
                    ).tracks
                    // console.log('samplings', this.samplings)
                  })
                }

                this.isPageReady = true
                this.$store.dispatch('error/showLoadingActivity', false)
              })
            } else {
              this.isPageReady = true
              this.$store.dispatch('error/showLoadingActivity', false)
            }
            // console.log('album_edit created', this.users)
            setTimeout(function () {
              $('#album_image').css(
                'background-image',
                'url(' + vm.album.cover.url + ')'
              )
            }, 200)
          })
          .catch((reason) => {
            console.log(reason)
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showErrorToast', reason)
            // this.isPageReady = true
          })
      }
    } else {
      this.$router.push({ path: '/' })
    }
  },

  methods: {
    imageChanged(e) {
      this.album_image = e.target.files[0]
      var reader = new FileReader()
      reader.addEventListener(
        'load',
        (event) => {
          this.album_image_url = event.target.result
        },
        false
      )
      reader.readAsDataURL(this.album_image)
      this.$forceUpdate()
    },

    learnMore() {},

    addCollaborator() {
      this.collaborators.push({
        user_id: '',
        user_role: '',
        status: 'pending',
      })
    },

    deleteCollaborator(index) {
      this.collaborators.splice(index, 1)
    },

    addContributor() {
      this.contributors.push({
        user_id: '',
        user_role: '',
      })
    },

    deleteContributor(index) {
      this.contributors.splice(index, 1)
    },

    addSampling() {
      this.sampling_min_id -= 1
      let sampling = {
        id: this.sampling_min_id,
        sampling_track_id: '',
        sample_track_id: '',
        sample_album_id: '',
        sample_user_id: '',
      }
      let artists = _.cloneDeep(this.artists)
      _.each(artists, (u) => {
        u.sampling_id = sampling.id
      })
      sampling.artists = artists
      this.samplings.push(sampling)
    },

    deleteSampling(index) {
      this.samplings.splice(index, 1)
    },

    onChangeSampleArtist(user) {
      // console.log('onChangeSampleArtist', user.sampling_id, user.id, user.display_name)
      AlbumService.getAlbums({
        statuses: 'published, collaborated',
        user_statuses: 'accepted',
        user_id: user.id,
        enabled_sample: true,
      }).then((response) => {
        let sampling = _.find(this.samplings, (s) => s.id === user.sampling_id)
        let albums = response.body
        _.each(albums, (a) => {
          a.sampling_id = user.sampling_id
        })
        sampling.artist_albums = albums
        sampling.artist_album_tracks = []
        sampling.sample_album_id = 0
        sampling.sample_track_id = 0
        this.$forceUpdate()
      })
    },

    onChangeSampleArtistAlbum(album) {
      // console.log('onChangeSampleArtistAlbum', album.sampling_id, album.name)
      let sampling = _.find(this.samplings, (s) => s.id === album.sampling_id)
      sampling.artist_album_tracks = album.tracks
      sampling.sample_track_id = 0
      this.$forceUpdate()
    },

    deleteAlbum() {
      const id = ''
      this.isLoading = true
      AlbumService.deleteAlbum(id)
        .then((res) => {
          this.isLoading = false
          this.$router.push({ path: '/album' })
        })
        .catch((e) => {
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

    openGenreSelectorDialog() {
      this.show_genre_selector_dialog = true
    },

    closeGenreSelectorDialog() {
      this.show_genre_selector_dialog = false
    },

    openSampleClearanceLicenseModal() {
      this.show_sample_clearance_license_modal = true
    },

    closeSampleClearanceLicenseModal() {
      this.show_sample_clearance_license_modal = false
    },

    beforeReleaseNow() {
      if (this.album.status === 'pending') {
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
      for (let index in this.album.tracks) {
        const track = this.album.tracks[index].track
        if (track) {
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
      formData.append(
        'album[is_only_for_live_stream]',
        this.album.is_only_for_live_stream
      )
      formData.append(
        'album[is_content_acapella]',
        this.album.is_content_acapella
      )
      formData.append(
        'album[is_content_instrumental]',
        this.album.is_content_instrumental
      )
      formData.append('album[is_content_stems]', this.album.is_content_stems)
      formData.append('album[is_content_remix]', this.album.is_content_remix)
      formData.append('album[is_content_dj_mix]', this.album.is_content_dj_mix)
      formData.append(
        'album[enabled_sample]',
        this.album.enabled_sample === 'true'
      )
      if (this.album_image) {
        formData.append('album[cover]', this.album_image)
      }
      formData.append('album[track_ids]', track_ids)
      formData.append('album[genre_ids]', genre_ids)
      // #TODO pass null when no selection
      formData.append('album[product_ids]', product_ids)
      formData.append(
        'album[collaborators]',
        JSON.stringify(this.collaborators)
      )
      formData.append('album[contributors]', JSON.stringify(this.contributors))

      let samplings = []
      _.each(this.samplings, (sampling) => {
        let s = {
          sampling_track_id: sampling.sampling_track_id,
          sample_track_id: sampling.sample_track_id,
          sample_album_id: _.get(
            sampling,
            'sample_album_id.id',
            sampling.sample_album_id
          ),
          sample_user_id: _.get(
            sampling,
            'sample_user_id.id',
            sampling.sample_user_id
          ),
        }
        if (sampling.id > 0) {
          s['id'] = sampling.id
        }
        samplings.push(s)
      })
      // console.log('samplings', samplings)
      formData.append('album[samplings]', JSON.stringify(samplings))

      AlbumService.updateAlbum(this.album.id, formData)
        .then((res) => {
          const id = res.body.id
          if (this.isNeededToRelease) {
            let accepted = true
            _.each(this.collaborators, (collaborator) => {
              if (collaborator.status !== 'accepted') {
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
            if (this.album.promote) {
              this.repostAlbum(id)
            } else {
              this.$store.dispatch('error/showLoadingActivity', false)
              this.$router.push({ path: '/albums' })
            }
          }
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    releaseAlbum(id) {
      AlbumService.releaseAlbum(id)
        .then((res) => {
          if (this.album.promote) {
            this.repostAlbum(id)
          } else {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$router.push({ path: '/albums' })
            // this.$store.dispatch('navigator/setParams', { album_id: id })
            // this.$router.push({ path: '/album/' + id })
          }
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    saveAndFinish(users) {
      this.isNeededToRelease = false
      this.uploadAlbum()
    },
  },

  mounted() {
    const vm = this
    $.getJSON('../../static/cities.json', function (data) {
      vm.locations = data
    })
  },
}
