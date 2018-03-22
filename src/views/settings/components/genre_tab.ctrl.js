import _ from 'lodash'
import AuthService from '@/services/auth'
import GenreService from '@/services/genre'
import UserService from '@/services/user'

export default {
  data () {
    return {
      genres: []
    }
  },

  created () {
    GenreService.getGenres2().then(response => {
      this.genres = response.body
      let hiddenGenres = _.keyBy(this.$store.state.auth.user.hidden_genres, 'id')

      _.each(this.genres, (genre) => {
        // genre.value = !!hiddenGenres[genre.id]
        // if (genre.value) {
        //   _.each(genre.children, (g) => { g.value = true })
        // } else {
        //   _.each(genre.children, (g) => { g.value = !!hiddenGenres[g.id] })
        // }
        _.each(genre.children, (g) => { g.value = !hiddenGenres[g.id] })
      })

      // it stores only child genres statuses
      _.each(this.genres, (genre) => {
        if (!_.countBy(genre.children, 'value')['false']) {
          genre.value = true
        }
      })
    })
  },

  methods: {
    checkParentGenre (parent) {
      _.each(parent.children, (g) => { g.value = !parent.value })
      this.genres = this.genres.slice()
    },

    checkChildGenre (parent, child) {
      if (child.value) {
        if (parent.value) {
          parent.value = false
          this.genres = this.genres.slice()
        }
      } else {
        if (_.countBy(parent.children, 'value')['false'] == 1) {
          parent.value = true
          this.genres = this.genres.slice()
        }
      }
    },

    saveGenreFilters () {
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
        this.$store.dispatch('error/showErrorToast', ['Please select at least 1 genre'])
        return
      }

      const userId = this.$store.state.auth.user.id
      const params = {
        genre_ids: genre_ids.join(',')
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.hiddenUserGenres(userId, params).then(res => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showSuccessToast', ['Saved'])
        UserService.getUserInfo(userId).then(response => AuthService.setUser(response.body))
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (e.status === 401) {
          this.$root.$emit('showLoginModal')
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    }
  }
}
