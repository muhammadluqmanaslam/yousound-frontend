import _ from 'lodash'
import AuthService from '@/services/auth'
import GenreService from '@/services/genre'
import UserService from '@/services/user'

export default {
  props: {
    dismiss: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      genres: [],
      parent: null,
      parent_index: 0,
      show_selector_view: true,
      isPageReady: true,
    }
  },

  computed: {
    genre: {
      get: function () {
        return this.$store.getters['genreSelector/genre']
      },

      set: function (newValue) {
        this.$store.dispatch('genreSelector/setGenres', [newValue])
      },
    },
  },

  created() {
    // console.log('genreSelector', this.genre)
    this.genres = _.cloneDeep(this.$store.state.app.genres)

    _.each(this.genres, (pg) => {
      pg.value = false
    })

    _.each(this.genres, (pg) => {
      _.each(pg.children, (cg) => {
        if (cg.id == this.genre.id) {
          pg.value = true
        }
      })
    })
  },

  methods: {
    checkChildGenre(parent, child) {
      // console.log('checkChildGenre', parent, child)
      _.each(this.genres, (pg) => {
        pg.value = false
      })

      parent.value = true

      this.genre = child
    },

    selectParent(parent, index) {
      this.show_selector_view = false
      this.parent = parent
      this.parent_index = index
    },

    groupChildrenByRegion(parent) {
      return _.groupBy(parent.children, 'region')
    },
  },
}
