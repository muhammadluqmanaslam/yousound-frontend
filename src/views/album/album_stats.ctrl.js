import ProductService from '@/services/product'
import AlbumService from '@/services/album'

export default {
  components: {
  },

  data () {
    return {
      tabs: [
        {
          id: 'repostedby',
          title: 'Reposted By'
        },
        {
          id: 'downloadedby',
          title: 'Downloaded By'
        },
        {
          id: 'playedby',
          title: 'Played By'
        }
      ],
      products: [],
      active: null,
      slug: null,
      order_detail: null,
      album: null
    }
  },

  computed: {
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'album_stats', tab: ''})
    this.slug = this.$route.params.slug
    this.active = this.$store.state.album.stats
    this.getAlbum(this.slug)
  },

  methods: {
    getAlbum (slug) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const vm = this
      AlbumService.getAlbum(slug).then(response => {
        this.album = response.body
        this.loadData(this.active)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    loadData (filter) {
      ProductService.getProducts({
        statuses: 'published, collaborated',
        stock_statuses: 'active',
        user_statuses: 'accepted'
      }).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.products = response.body
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    loadProducts () {
    },

    followUser (user) {
      UserService.followUser(user.id).then(response => {
        this.$store.dispatch('error/showSuccessToast', ['You just followed ' + user.display_name])
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  },

  mounted () {
    const vm = this;
    $('.tabs__wrapper ul li').click(function () {
      var c = $(this).find('a:first').attr('href')
      console.log(c, vm.active)
      setTimeout(function(){
        vm.loadData(c)
      }, 200);
    })
  }
}
