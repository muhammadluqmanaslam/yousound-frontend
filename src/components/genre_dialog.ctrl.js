import _ from 'lodash'
import AuthService from '@/services/auth'
import GenreService from '@/services/genre'
import UserService from '@/services/user'

export default {
  props: {
    dismiss: {
      type: Function,
      required: true
    },
  },

  data () {
    return {
      genres: [],
      parent: null,
      parent_index: 0,
      show_selector_view: true,
      isPageReady: true
    }
  },

  // created () {
  //   this.isPageReady = false
  //   this.$store.dispatch('error/showLoadingActivity', true)
  //   GenreService.getGenres2().then(response => {
  //     this.genres = response.body
  //     _.each(this.genres, (genre) => {
  //       _.each(genre.children, (g) => { g.value = false })
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

  created () {
    this.genres = _.cloneDeep(this.$store.state.app.genres)
    let hiddenGenres = _.keyBy(this.$store.state.auth.user.hidden_genres, 'id')

    _.each(this.genres, (genre) => {
      _.each(genre.children, (g) => { g.value = !hiddenGenres[g.id] })
    })

    // it stores only child genres statuses
    _.each(this.genres, (genre) => {
      if (!_.countBy(genre.children, 'value')['false']) {
        genre.value = true
      }
    })
  },

  methods: {
    checkParentGenre (parent, value) {
      _.each(parent.children, (g) => { g.value = !parent.value })
      // this.genres = this.genres.slice()
      if (!(value == null || value == undefined)) {
        parent.value = !parent.value
      }
      this.$forceUpdate()
    },

    checkChildGenre (parent, child) {
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

    getSelectedChildrenCount (parent) {
      const c = _.countBy(parent.children, 'value')['true']
      return c > 0 ? c : 0
    },

    selectParent (parent, index) {
      this.show_selector_view = false
      this.parent = parent
      this.parent_index = index
    },

    saveGenreFilters () {
      let is_genres_selected = false
      let genre_ids = []
      _.each(this.genres, (parent) => {
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
        this.$store.dispatch('error/showErrorToast', ['Please select at least 1 genre'])
        return
      }

      this.$store.dispatch('auth/setGenreIds', genre_ids.join(','))

      const userId = this.$store.state.auth.user.id
      const params = {
        genre_ids: genre_ids.join(',')
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.hiddenUserGenres(userId, params).then(res => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Saved'])
        UserService.getUserInfo(userId).then(response => AuthService.setUser(response.body))
        this.dismiss()
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  }
}
