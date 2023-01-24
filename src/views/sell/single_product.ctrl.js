/* global $:true */

import _ from 'lodash'
// import CategoryService from '@/services/category'
// import UserService from '@/services/user'
import ProfileService from '@/services/profile'
import ProductService from '@/services/product'
import MeService from '@/services/me'
import CommentService from '@/services/comment'
import { CollaboratorProfitShareTypes } from '@/helper'
import digitalUploader from './components/digital_uploader'
import contentTopHeader from '@/components/contentTopHeader'
import accordion from '@/components/accordion'
import ItemService from '@/services/item'
import UserService from '@/services/user'
import Comments from '@/components/comments'
import UserTag from '@/components/user_tag'
import ShareModal from '@/components/sharemodal'
import UserFollowBtn from "@/components/userFollowBtn";
import { mapGetters } from 'vuex'
import productCard from "@/components/productcard";

export default {
  components: {
    digitalUploader,
    contentTopHeader,
    accordion,
    Comments,
    UserTag,
    ShareModal,
    UserFollowBtn,
    productCard,
  },

  data() {
    return {
      products: {},
      share_dialog: false,
      info_dialog: false,
      info_active_tab:1, 
      option: '',
      selectedCover: null,
      product_categories: [],
      countries: [],
      states: [],
      digital_content_category_ids: [],
      digital_content: {
        file: null,
      },
      prod_id: '',
      product_image1: null,
      product_image1_url: null,
      product_image2: null,
      product_image2_url: null,
      product_image3: null,
      product_image3_url: null,
      product: {},
      product_variants: [
        {
          name: '',
          quantity: '',
          price: '',
        },
      ],
      users: [],
      collaborators_confirm_dialog: false,
      isPageReady: false,
      buttonHover: false,
      comments: [],
      commentTableType: "ShopProduct",
      comment_pagination: {
        count: 0,
        current_page: 0,
        per_page: 5,
        total_count: 0,
        total_pages: 0,
      },
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
    }),
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    commentsCount() {
      if (this.comment_pagination.total_count > 0) {
        return this.comment_pagination.total_count
      } else {
        return 'No'
      }
    },

    hasMoreComments() {
      return (
        this.comment_pagination.current_page <
        this.comment_pagination.total_pages
      )
    },
    followButtonText() {
      if (this.user.is_following) {
        return this.buttonHover ? 'Unfollow' : 'Following'
      }
      return 'Follow'
    },
    user() {
      if (this.product.slug) {
        return this.product.user
      } else {
        return this.product.merchant
      }
    },
    currentUser() {
      return this.$store.state.auth.user
    },
    accordions() {
      const policies = [
        {
          title: 'Size & Fit',
          content: this.product.merchant.size_chart,
        },
        {
          title: 'Shipping Policy',
          content: this.product.merchant.shipping_policy,
        },
        {
          title: 'Return Policy',
          content: this.product.merchant.return_policy,
        },
        {
          title: 'Privacy Policy',
          content: this.product.merchant.privacy_policy,
        },
      ]

      return policies
    },
    options() {
      var options = []
      for (let index in this.product.variants) {
        const variant = this.product.variants[index]
        if (this.isDigitalProduct || variant.quantity > 0) {
          const option = {
            id: variant.id,
            name: variant.name,
          }
          options.push(option)
        }
      }

      console.log(options)
      return options
    },
    isDigitalProduct() {
      return (
                this.digital_content_category_ids.indexOf(this.product.category) > -1
      )
    },

    isAvailableToUpdateProduct() {
      var isAvailable =
                this.product.name && this.product.category && this.product_image1_url
      if (this.product.variants.length) {
        for (let index in this.product.variants) {
          const variant = this.product.variants[index]
          isAvailable =
                        isAvailable &&
                        variant.name.length &&
                        (this.isDigitalProduct || parseFloat(variant.quantity) >= 0) &&
                        parseFloat(variant.price) > 0
        }
        if (this.isDigitalProduct) {
          isAvailable = isAvailable && this.digital_content.file
        } else {
          if (this.product.shipments.length) {
            for (let index in this.product.shipments) {
              const shipment = this.product.shipments[index]
              isAvailable =
                                isAvailable &&
                                shipment.country.length &&
                                parseFloat(shipment.shipment_alone_price) > 0 &&
                                parseFloat(shipment.shipment_with_price) >= 0
            }
          } else {
            isAvailable = false
          }
        }
      } else {
        isAvailable = false
      }
      return isAvailable
    },

    isEditable() {
      return (
                ['privated', 'published', 'collaborated'].indexOf(
                    this.product.status
                ) === -1
      )
    },

    creator_share() {
      return 100 - _.sumBy(this.product.collaborators, 'user_share')
    },

    profit_share_types() {
      return CollaboratorProfitShareTypes
    },

    productCategoryName() {
      return _.get(
          _.find(
              this.product_categories,
              (pc) => pc.id === this.product.category
          ),
          'name',
          ''
      )
    },
    covers() {
      let imgs = this.product.covers || []
      let covers = []
      imgs.forEach((img) => {
        if (img.cover.url) {
          covers.push(img.cover.url)
        }
      })

      // imgs = [
      //   'https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/125/523b9cda-b1a7-4cf0-9fe2-619c63a15f34.jpg',
      //   'https://d19mruzykfu6hg.cloudfront.net/uploads/album/cover/42/b5fe3a4c-4221-402d-ab22-4b1a52e474ac.jpg',
      //   'https://d19mruzykfu6hg.cloudfront.net/uploads/album/cover/33/73c40199-a5ac-463e-9154-09581f92c987.jpg',
      // ]

      // return imgs
      return covers
    },
    initImgSelection() {
      console.log(this.covers)
      return this.covers[0]
    },
  },
  created() {
    // if (
    //         this.$store.state.auth.user &&
    //         ['artist', 'brand', 'label'].indexOf(
    //             this.$store.state.auth.user.user_type
    //         ) > -1
    //     ) {
    this.prod_id = this.$route.params.id
            // const params = {
            //   filter: 'artist',
            //   page: 1,
            //   per_page: 30,
            // }
    var params = {
      stripe_connected: true,
      page: 1,
      per_page: 30,
    }
    this.isPageReady = false
    this.$store.dispatch('error/showLoadingActivity', true)
    Promise.all([
                // CategoryService.getCategories(),
                // UserService.searchUsers(params),
                // ProfileService.getItems(
                //   this.$store.state.auth.user.id,
                //   'followings',
                //   params
                // ),
      MeService.mutualUsers(params),
      ProductService.getProduct(this.prod_id),
    ])
        .then((values) => {
          this.product_categories = this.$store.state.app.product_categories
          this.digital_content_category_ids = this.$store.getters[
                'app/digitalCategoryIds'
            ]

          this.users = values[0].body.users

          this.product = values[1].body
          console.log(this.product)
          this.product.category = _.get(this.product, 'category.id', '')
          this.product.creator_recoup_cost /= 100
          this.product_image1_url = this.product.covers[0].cover.url
          this.product_image2_url = this.product.covers[1].cover.url
          this.product_image3_url = this.product.covers[2].cover.url
          this.product.price /= 100
          for (let index in this.product.variants) {
            this.product.variants[index].price /= 100
          }
          for (let index in this.product.shipments) {
            this.product.shipments[index].shipment_alone_price /= 100
            this.product.shipments[index].shipment_with_price /= 100
          }

          if (this.product.digital_content_url) {
            this.digital_content.file = {
              name: this.product.digital_content_name,
            }
          }

          this.isPageReady = true
          this.$store.dispatch('error/showLoadingActivity', false)

          MeService.mutualUsers({ ...params, per_page: -1 }).then(
                (response) => (this.users = response.body.users)
            )
          this.loadMoreComments()
          let params = { statuses: "published, collaborated", stock_statuses: "active", user_statuses: "accepted" }
          ProfileService.getItems(this.product.merchant.id, 'merch', params).then((resp) => {
            this.products = resp.body.products.filter(p => p.id !== this.prod_id).slice(0, 4)
          }).catch((exception) => {
            console.log(exception)
          })
        })
        .catch((reason) => {
          console.log(reason)
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', reason)
        })
    // } else {
    //   this.$router.push({ path: '/' })
    // }
  },
  watch: {
    initImgSelection: {
      handler(newVal, oldVal) {
        this.selectedCover = newVal
      },
      immediate: true,
    },
    $route(to, from) {
      console.log("asdfasdfsdf===comments")
      this.loadMoreComments()
    },
  },
  methods: {
    reRenderComments() {
      this.comment_pagination.current_page = 0
      this.comment_pagination.per_page = 5
      this.comments = []
      this.loadMoreComments()
    },

    closeShareDialog() {
      this.share_dialog = false
    },
    repostProduct() {
      ProductService.repostProduct(this.product.id)
        .then((response) => {
          this.$store.dispatch("error/showSuccessToast", [
            "You just reposted " + this.product.name,
          ]);
        })
        .catch((e) => {
          this.$store.dispatch(
            "error/showErrorToast",
            e.body.errors || [e.body]
          );
        });
    },

    addToCollections() {
      ProductService.addIntoCollection(this.product.id)
      .then((resp) => {
        this.$store.dispatch("error/showSuccessToast", [
          "You just added " + this.product.name + " in your wishlist.",
        ]);
      })
      .catch((e) => {
        this.$store.dispatch(
          "error/showErrorToast",
          e.body.errors || [e.body]
        );
      })
    },

    afterFollow(isfollowing) {
      if (isfollowing === "unfollow") {
        this.product.merchant.is_following = false
      } else if (isfollowing === "follow") {
        this.product.merchant.is_following = true
      }
    },
    addToCart() {
      if (this.option === '' || this.option === null) {
        this.$store.dispatch('error/showErrorToast', [
          'Please select valid variant.',
        ])
      } else {
        let pageTrack = ''
        if (this.$store.state.streamPlayer.frame_mode === 'full') {
          const streamId = _.get(
            this.$store.state.streamPlayer.stream,
            'id',
            ''
          )
          if (streamId !== '') {
            pageTrack = 'Stream: ' + streamId
          }
        }
        const params = {
          product_variant_id: this.option,
          quantity: 1,
          page_track: pageTrack,
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
      }
    },
    changeFeaturedImage(img) {
      if (this.selectedCover == null) {
        this.selectedCover = this.initImgSelection
      } else {
        this.selectedCover = img
      }
    },
    loadMoreComments() {
      const params = {
        commentable_type: 'ShopProduct',
        commentable_id: this.product.id,
        page: this.comment_pagination.current_page + 1,
        per_page: this.comment_pagination.per_page,
      }
      CommentService.getComments(params)
        .then((response) => {
          this.comments = this.comments.concat(response.body.comments)
          this.comment_pagination = response.body.pagination
        })
        .catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
  mounted() {},
}
