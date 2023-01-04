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
      // genres: [],
      parent: null,
      region: {},
      parent_index: 0,
      inputDropdown: false,
      show_selector_view: true,
      isPageReady: true,
      selectDemoItems: ['Vuetify', 'Programming'],
      demoItems: [
        'Programming',
        'Design',
        'Vue',
        'Vuetify',
      ],
      selectedMainGenresIds: [],
      selectedSubgenresIds: [],
      subGenresName: [],
      loading: false,
    }
  },

  // created() {
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

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth
    },

    genres() {
      const genres = _.cloneDeep(this.$store.state.app.genres)
      let hiddenGenres = _.keyBy(this.currentUser.hidden_genres, 'id')

      _.each(genres, (genre) => {
        _.each(genre.children, (g) => {
          g.value = !hiddenGenres[g.id]
        })
      })

      // it stores only child genres statuses
      _.each(genres, (genre) => {
        if (!_.countBy(genre.children, 'value')['false']) {
          genre.value = true
        }
      })

      if (this.subGenresName.length === 0) {
        genres.forEach(genre => {
          genre.children.forEach(child => {
            this.subGenresName.push(child.name.toLowerCase())
            if (this.selectedSubgenresIds.includes(child.id)) {
              if (!(this.selectedMainGenresIds.includes(genre.id))) {
                this.selectedMainGenresIds.push(genre.id)
              }
            }
          })
        })
      }

      return genres
    },
  },

  created() {
    this.selectedSubgenresIds = this.currentUser.user.hidden_genres.map(genre => genre.id)
    // this.genres = _.cloneDeep(this.$store.state.app.genres)
    // let hiddenGenres = _.keyBy(this.$store.state.auth.user.hidden_genres, 'id')
    // _.each(this.genres, (genre) => {
    //   _.each(genre.children, (g) => {
    //     g.value = !hiddenGenres[g.id]
    //   })
    // })
    // // it stores only child genres statuses
    // _.each(this.genres, (genre) => {
    //   if (!_.countBy(genre.children, 'value')['false']) {
    //     genre.value = true
    //   }
    // })
  },

  methods: {
    selectParentGenre(parent) {
      if (this.selectedMainGenresIds.includes(parent.id)) {
        this.selectedMainGenresIds = this.selectedMainGenresIds.filter(genre => genre !== parent.id)
        const childIds = parent.children.map(child => child.id)
        this.selectedSubgenresIds = this.selectedSubgenresIds.filter(subgenre => !childIds.includes(subgenre))
      } else {
        this.selectedMainGenresIds.push(parent.id)
        for (let i = 0; i < parent.children.length; i++) {
          if (!(this.selectedSubgenresIds.includes(parent.children[i].id))) {
            this.selectedSubgenresIds.push(parent.children[i].id)
          }
        }
      }
      console.log("main genres ", this.selectedMainGenresIds)
      console.log("Sub genres", this.selectedSubgenresIds)
    },

    selectSubGenre(child, parent) {
      if (event.target.checked === true) {
        if (!(this.selectedMainGenresIds.includes(parent.id))) {
          this.selectedMainGenresIds.push(parent.id)
        }
        this.selectedSubgenresIds.push(child.id)
      } else {
        if (this.selectedSubgenresIds.includes(child.id)) {
          const index = this.selectedSubgenresIds.indexOf(child.id)
          this.selectedSubgenresIds.splice(index, 1)
          // remove select state from parent if no child is present.
          const child_ids = parent.children.map(child => child.id)
          const removeParent = child_ids.filter(child => this.selectedSubgenresIds.includes(child)).length === 0
          if (removeParent) {
            const parentIndex = this.selectedMainGenresIds.indexOf(parent.id)
            this.selectedMainGenresIds.splice(parentIndex, 1)
          }
        }
      }
      console.log("selected subgenres", this.selectedSubgenresIds)
    },

    checkParentGenre(parent, value) {
      _.each(parent.children, (g) => {
        if (event.target.checked) {
          if (!(this.selectedMainGenresIds.includes(parent.id))) {
            this.selectedMainGenresIds.push(parent.id)
          }
          if (!(this.selectedSubgenresIds.includes(g.id))) {
            this.selectedSubgenresIds.push(g.id)
          }
        } else {
          if (this.selectedSubgenresIds.includes(g.id)) {
            const index = this.selectedSubgenresIds.indexOf(g.id)
            this.selectedSubgenresIds.splice(index, 1)
            // remove select state from parent if no child is present.
            const child_ids = parent.children.map(child => child.id)
            const removeParent = child_ids.filter(child => this.selectedSubgenresIds.includes(child)).length === 0
            if (removeParent) {
              const parentIndex = this.selectedMainGenresIds.indexOf(parent.id)
              this.selectedMainGenresIds.splice(parentIndex, 1)
            }
          }
        }
      })
      this.$forceUpdate()
    },

    checkRegionGenre(parent, region) {
      const key = `${parent.id}-${region}`
      // console.log('checkRegionGenre', region, this.region[key])
      _.each(parent.children, (g) => {
        if (g.region == region) {
          g.value = !this.region[key]
        }
      })
      if (_.countBy(parent.children, 'value')['false'] > 0) {
        parent.value = false
      } else {
        parent.value = true
      }
      this.$forceUpdate()
    },

    filterRecords() {
      var value = event.target.value;

      if (event.key !== 'Backspace') {
        this.subGenresName = this.subGenresName.filter((item) => {
          return value.toLowerCase().split(' ').every(v => item.toLowerCase().includes(v))
        })
        console.log("this.subGenres ", this.subGenresName)
      } else {
        this.genres.forEach(genre => {
          genre.children.forEach(child => {
            this.subGenresName.push(child.name.toLowerCase())
          })
          this.subGenresName = this.subGenresName.filter((item) => {
            return value.toLowerCase().split(' ').every(v => item.toLowerCase().includes(v))
          })
        })
      }
    },

    checkChildGenre(parent, child) {
      if (event.target.checked) {
        if (_.countBy(parent.children, 'value')['false'] == 1) {
          parent.value = true
          // this.genres = this.genres.slice()
        }
        // checking subgenre
        if (!(this.selectedMainGenresIds.includes(parent.id))) {
          this.selectedMainGenresIds.push(parent.id)
        }
        this.selectedSubgenresIds.push(child.id)
      } else {
        if (this.selectedSubgenresIds.includes(child.id)) {
          const index = this.selectedSubgenresIds.indexOf(child.id)
          this.selectedSubgenresIds.splice(index, 1)
          // remove select state from parent if no child is present.
          const child_ids = parent.children.map(child => child.id)
          const removeParent = child_ids.filter(child => this.selectedSubgenresIds.includes(child)).length === 0
          if (removeParent) {
            const parentIndex = this.selectedMainGenresIds.indexOf(parent.id)
            this.selectedMainGenresIds.splice(parentIndex, 1)
          }
        }
      }

      console.log("selected subgenres", this.selectedSubgenresIds)
      this.$forceUpdate()
    },

    getSelectedChildrenCount(parent) {
      let c = 0
      if (this.show_selector_view) {
        c = _.countBy(parent.children, 'value')['true']
      } else {
        parent.children.map(child => {
          if (this.selectedSubgenresIds.includes(child.id)) {
            c = c + 1
          }
        })
      }
      return c
    },

    groupChildrenByRegion(parent) {
      const group = _.groupBy(parent.children, 'region')
      _.forEach(group, (values, k) => {
        let key = `${parent.id}-${k}`
        if (typeof this.region[key] !== undefined) {
          this.region[key] = true
          if (_.countBy(values, 'value')['false'] > 0) {
            this.region[key] = false
          }
        }
      })
      return group
    },

    selectParent(parent, index) {
      this.show_selector_view = false
      this.parent = parent
      this.parent_index = index
    },

    saveGenreFilters() {
      this.loading = true
      this.$store.dispatch('error/showLoadingActivity', true)
      this.$store.dispatch('auth/setGenreIds', this.selectedSubgenresIds.join(','))
      const userId = this.$store.state.auth.user.id
      const params = {
        genre_ids: this.selectedSubgenresIds.join(','),
      }
      UserService.hiddenUserGenres(userId, params)
        .then((res) => {
          this.loading = false
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', ['Genres Saved successfully.'])
          UserService.getUserInfo(userId).then((response) =>
            AuthService.setUser(response.body)
          )
          this.dismiss()
          this.$router.push({path: '/music/discover'})
        })
        .catch((e) => {
          this.loading = false
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
}
