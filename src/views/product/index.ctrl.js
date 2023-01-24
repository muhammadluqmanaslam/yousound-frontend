/* global $:true */

import _ from 'lodash'
import AuthService from '@/services/auth'
import ItemService from '@/services/item'
import SearchService from '@/services/search'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import ProductService from '@/services/product'
import productCard from '@/components/productcard'
import contentTopHeader from '@/components/contentTopHeader'
import discoverNav from '@/components/discoverNav'
import UserFollowBtn from "@/components/userFollowBtn";
import { MyEvents, Utils } from '@/helper'

const filterArrowDownString =
  '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>'

export default {
  props: {
    isComp: Boolean,
    listLimit: Number,
  },
  components: {
    productCard,
    contentTopHeader,
    discoverNav,
    VueSlickCarousel,
    UserFollowBtn
  },

  data() {
    return {
      slickOptions: {
        infinite:false,
        slidesToShow: 6,
        slidesToScroll: 6,
        dots: false,
        cssEase: 'linear',
        arrows: true,
  //      autoplay: true,
  //      autoplaySpeed: 6000,
        
      },
      activeTab: 'recommended',
      seed: '',
      page_index: 1,
      total_pages: 1,
      items_per_page: 1 * 50,
      categories: [],
      selected_category: null,
      products: [],
      feeds: [],
      isPageReady: false,
      tabs: [
        { id: 'recommended', title: 'Trending' },
        { id: 'new', title: 'New Arrivals' },
      ],
      mainProduct: null,
      viewAllTrending: false,
      trendingProducts: [],
      buttonHover: false,
    }
  },

  computed: {
    followButtonText() {
      if (this.mainProduct.merchant.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user
    },

    filtered_feeds() {
      return this.feeds
    },
  },

  created() {
    this.$root.$on(MyEvents.USER_FOLLOW, this.setFollowingStatus)
    this.$store.dispatch('navigator/goNextState', {
      page: 'product',
      tab: '',
    })
    // this.seed = parseInt(Date.now() * Math.random())
    this.seed = Math.random()
    this.loadFeeds(1)

    // set active tab
    if (this.pageName) {
      this.activeTab = this.pageName
    }

    const paramFilter = this.$route.params.filter || ''
    if (paramFilter) {
      this.activeTab = paramFilter
      this.onTab(this.activeTab)
    }
  },

  beforeDestroy() {
    this.$root.$off(MyEvents.USER_FOLLOW, this.setFollowingStatus)
  },

  methods: {
    setFollowingStatus(userId, isFollowing) {
      if (this.mainProduct.merchant && this.mainProduct.merchant.id === userId) {
        this.mainProduct.merchant.is_following = isFollowing
      }
    },
    addToCart() {
      const params = {
        product_variant_id: this.mainProduct.variants[0].id,
        quantity: 1,
      }
      ItemService.addToCart(params)
        .then((response) => {
          if (response.body.errors) {
            this.$store.dispatch('error/showErrorToast', response.body.errors)
          } else {
            this.$store.dispatch('error/showSuccessToast', [
              'Added successfully to Cart.',
            ])
          }
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    isActiveTab(tab) {
      return this.activeTab === tab
    },

    verifyUser(selectedProduct) {
      if (this.currentUser == null) {
        this.showRegisterModal = true;
      } else {
        this.mainProduct = selectedProduct
      }
    },

    productDisplay(product) {
       if (this.currentUser == null) {
        this.showRegisterModal = true;
      } else {
        this.$router.push({path: `product/${product.id}`})
      }
    },

    addToCollections() {
      ProductService.addIntoCollection(this.mainProduct.id)
      .then((resp) => {
        this.$store.dispatch("error/showSuccessToast", [
          "You just added " + this.mainProduct.name + " in your collections.",
        ]);
      })
      .catch((e) => {
        this.$store.dispatch(
          "error/showErrorToast",
          e.body.errors || [e.body]
        );
      })
    },

    onTab(tab) {
      this.activeTab = tab

      if (this.isComp) {
        this.$router.push({ name: 'ProductIndex', params: { filter: tab } })
      } else {
        this.$router.push({
          path: this.$route.path,
          hash: tab,
        })
      }
    },

    filterVideos(filter) {
      console.log(filter)
    },

    isActiveCategory(category) {
      return _.get(this.selected_category, 'id', 'any') === category.id
    },

    displayAllProduct(category) {
      this.selected_category = category
      this.viewAllTrending = true
    },

    displayAllTrendingProduct() {
      this.trendingProducts = this.products;
      this.viewAllTrending = true
      this.selected_category = null
    },

    loadFeeds(page) {
      const vm = this
      if (page === 1) {
        this.isPageReady = false
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      const genre = _.get(this.selected_genre, 'id', 'any')
      const category = _.get(this.selected_category, 'id', 'any')
      const params = {
        genre: genre,
        category: category,
        page: page,
        per_page: this.items_per_page,
        seed: this.seed,
      }

      SearchService.searchDiscoverPublicUser(params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.products = this.products.concat(response.body.products)

          // this will return a a prop limit if available
          this.products = this.products.slice(0, this.listLimit || this.products.length)
          
          // remove products duplicate
          this.products = _.uniqBy(this.products, 'id')
          this.mainProduct = this.products[0]
          this.trendingProducts = this.products.slice(0, 12)
          // const categories = _.chain(this.products).map('category').keyBy('id').map((v, k) => {return v}).sortBy('name').value()
          this.categories = response.body.categories.map((c) => ({
            id: c,
            name: c,
          }))
          // this.categories = [{ id: 'any', name: 'All' }].concat(categories)

          this.page_index = response.body.pagination.current_page
          this.total_pages = response.body.pagination.total_pages
          this.isPageReady = true
          // if (page === 1) {
          //   Promise.all([
          //     SearchService.searchDiscover(_.extend(params, { page: 2 })),
          //     SearchService.searchDiscover(_.extend(params, { page: 3 })),
          //     SearchService.searchDiscover(_.extend(params, { page: 4 })),
          //   ]).then((values) => {
          //     vm.products = vm.products.concat(
          //       values[0].body.products,
          //       values[1].body.products,
          //       values[2].body.products
          //     )

          //     // this will return a a prop limit if available
          //     vm.products = this.products.slice(0, this.listLimit || this.products.length)

          //     // remove products duplicate
          //     this.products = _.uniqBy(this.products, 'id')

          //     vm.page_index =
          //       values[2].body.pagination.total_pages > 4
          //         ? 4
          //         : values[2].body.pagination.total_pages

          //     vm.isPageReady = true
          //   })
          // }
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          // this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          console.log('discover error', e)
        })
    },

    loadMore() {
      this.loadData(this.pagination.current_page + 1)
    },
    loadMore() {
      // this.page_index += 1
      this.loadFeeds(this.page_index + 1)
    },
  },

  mounted() {},
}
