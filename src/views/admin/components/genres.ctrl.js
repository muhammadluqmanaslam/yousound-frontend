import GenreService from '@/services/genre'

export default {
  components: {},

  data () {
    return {
      genre_headers: [
        { text: 'Subgenre', value: 'name', align: 'left' }
      ],
      genre_category: '',
      genres: [],
      genre: {},
      genre_search: '',
      pagination: {
        sortBy: 'name',
        descending: false,
        rowsPerPage: 100,
        // page: 1,
        // totalItems: 0
      },
      per_page_options: [100],
      isPageReady: false
    }
  },

  computed: {
    genre_categories () {
      var genre_categories = []
        genre_categories.push({id:'main', name: 'Main Category', children:[]})
        genre_categories.push({id:'', name: 'All', children:[]})
        genre_categories = genre_categories.concat(this.genres)
        return genre_categories
    },

    filtered_genres () {
      if (this.genre_category === '') {
        var genres = []
        for (let index in this.genres) {
          const genre = this.genres[index]
          if (genre.children.length) {
            genres = genres.concat(genre.children)
          }
        }
        return genres
      } else if (this.genre_category === 'main') {
        return this.genres
      } else {
        for (let index in this.genres) {
          const genre = this.genres[index]
          if (genre.id === this.genre_category) {
            return genre.children
          }
        }
      }
    }
  },

  created () {
    // console.log('admin / users created')
    this.loadGenres(false)
  },

  methods: {
    loadGenres (reload) {
      if (!reload) {
        this.$store.dispatch('error/showLoadingActivity', true)        
        this.isPageReady = false
      }
      GenreService.getGenres2().then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.isPageReady = true
        // this.genres.push({id:'main', name: 'Main Category', children:[]})
        // this.genres.push({id:'', name: 'All', children:[]})
        this.genres = response.body
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.isPageReady = true
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    addGenre () {
      const params = new FormData()
      if (this.genre_search.length) {
        console.log(params)
        params.append('genre[name]', this.genre_search)
        if (this.genre_category !== '' && this.genre_category !== 'main') {
          params.append('genre[ancestry]', this.genre_category)
        }
      } else {
        this.$store.dispatch('error/showErrorToast', ['Please input genre name.'])
      }
      GenreService.addGenre2(params).then(response => {
        this.genre_search = ''
        this.loadGenres(true)
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    updateGenre (genre) {
      const params = new FormData()
      if (genre.name.length) {
        params.append('genre[name]', genre.name)
      } else {
        this.$store.dispatch('error/showErrorToast', ['Please input genre name.'])
      }
      GenreService.updateGenre2(genre.id, params).then(response => {
        console.log(response)
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    deleteGenre (genre) {
      GenreService.deleteGenres2(genre.id).then(response => {
        if (this.genre_category === 'main') {
          _.remove(this.genres, (item) => { return item.id === genre.id })
          const arr = this.genres.slice()
          this.genres = arr;
        } else {
          this.loadGenres(true)
        }
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
  }
}
