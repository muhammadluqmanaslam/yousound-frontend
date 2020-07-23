import _ from 'lodash'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import AuthService from '@/services/auth'
import GenreService from '@/services/genre'
import PresetService from '@/services/preset'
import UserService from '@/services/user'
import { Filter, MyEvents } from '@/helper'

export default {
  mixins: [onClickOutside],

  data() {
    return {
      genres: [],
      parent: null,
      parent_index: 0,
      presets: [],
      preset_name: '',
      show_selector_view: true,
      show_load_genre_confirm_dialog: false,
      show_load_genre_dialog: false,
      isPageReady: true,
    }
  },

  // created() {
  //   this.isPageReady = false
  //   this.$store.dispatch('error/showLoadingActivity', true)
  //   GenreService.getGenres2().then(response => {
  //     this.genres = response.body
  //     let hiddenGenres = _.keyBy(this.$store.state.auth.user.hidden_genres, 'id')
  //     _.each(this.genres, (genre) => {
  //       // genre.value = !!hiddenGenres[genre.id]
  //       // if (genre.value) {
  //       //   _.each(genre.children, (g) => { g.value = true })
  //       // } else {
  //       //   _.each(genre.children, (g) => { g.value = !!hiddenGenres[g.id] })
  //       // }
  //       _.each(genre.children, (g) => { g.value = !hiddenGenres[g.id] })
  //     })
  //     // it stores only child genres statuses
  //     _.each(this.genres, (genre) => {
  //       if (!_.countBy(genre.children, 'value')['false']) {
  //         genre.value = true
  //       }
  //     })
  //     this.isPageReady = true
  //     this.$store.dispatch('error/showLoadingActivity', false)
  //     this.$forceUpdate()
  //   }).catch(e => {
  //     this.$store.dispatch('error/showLoadingActivity', false)
  //   })
  // },

  created() {
    this.loadGenre()
  },

  methods: {
    loadGenre() {
      this.genres = _.cloneDeep(this.$store.state.app.genres)
      let hiddenGenres = _.keyBy(
        this.$store.state.auth.user.hidden_genres,
        'id'
      )

      _.each(this.genres, (genre) => {
        _.each(genre.children, (g) => {
          g.value = !hiddenGenres[g.id]
        })
      })

      // it stores only child genres statuses
      _.each(this.genres, (genre) => {
        if (!_.countBy(genre.children, 'value')['false']) {
          genre.value = true
        }
      })

      this.$forceUpdate()
    },

    openLoadGenreConfirmDialog() {
      this.preset_name = ''
      this.show_load_genre_confirm_dialog = true
    },

    closeLoadGenreConfirmDialog() {
      this.show_load_genre_confirm_dialog = false
      this.openLoadGenreDialog()
    },

    openLoadGenreDialog() {
      this.$store.dispatch('error/showLoadingActivity', true)
      PresetService.getPresets().then((response) => {
        this.presets = response.body
        this.show_load_genre_dialog = true
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    closeLoadGenreDialog() {
      this.show_load_genre_dialog = false
    },

    savePreset() {
      this.preset_name = this.preset_name.trim()
      if (this.preset_name == '') {
        this.$store.dispatch('error/showErrorToast', [
          'Please enter preset name',
        ])
        return
      }

      this.$store.dispatch('error/showLoadingActivity', true)
      PresetService.createPreset({
        name: this.preset_name,
      }).then((response) => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.closeLoadGenreConfirmDialog()
      })
    },

    loadPreset(presetId) {
      PresetService.loadPreset(presetId).then((response) => {
        AuthService.setUser(response.body)
        this.loadGenre()
        this.closeLoadGenreDialog()
      })
    },

    removePreset(presetId) {
      PresetService.deletePreset(presetId).then((response) => {
        _.remove(this.presets, (preset) => {
          return preset.id == presetId
        })
        const arr = this.presets.slice()
        this.presets = arr
      })
    },

    checkParentGenre(parent, value) {
      _.each(parent.children, (g) => {
        g.value = !parent.value
      })
      // this.genres = this.genres.slice()
      if (!(value == null || value == undefined)) {
        parent.value = !parent.value
      }
      this.$forceUpdate()
    },

    checkChildGenre(parent, child) {
      if (child.value) {
        if (parent.value) {
          parent.value = false
          // this.genres = this.genres.slice()
        }
      } else {
        if (_.countBy(parent.children, 'value')['false'] == 1) {
          parent.value = true
          // this.genres = this.genres.slice()
        }
      }
      this.$forceUpdate()
    },

    getSelectedChildrenCount(parent) {
      const c = _.countBy(parent.children, 'value')['true']
      return c > 0 ? c : 0
    },

    selectParent(parent, index) {
      this.show_selector_view = false
      this.parent = parent
      this.parent_index = index
    },

    saveGenreFilters() {
      let is_genres_selected = false
      let genre_ids = []
      _.each(this.genres, (parent) => {
        // _.chain(parent.children).filter((child) => (chid.value)).map('id').value()
        _.each(parent.children, (child) => {
          if (!child.value) {
            genre_ids.push(child.id)
          }

          if (child.value && !is_genres_selected) {
            is_genres_selected = true
          }
        })
      })

      if (!is_genres_selected) {
        this.$store.dispatch('error/showErrorToast', [
          'Please select at least 1 genre',
        ])
        return
      }

      const userId = this.$store.state.auth.user.id
      const params = {
        genre_ids: genre_ids.join(','),
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.hiddenUserGenres(userId, params)
        .then((res) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', ['Saved'])
          UserService.getUserInfo(userId).then((response) =>
            AuthService.setUser(response.body)
          )
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
}
