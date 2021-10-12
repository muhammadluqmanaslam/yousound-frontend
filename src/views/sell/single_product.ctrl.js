/* global $:true */

import _ from 'lodash'
// import CategoryService from '@/services/category'
// import ProfileService from '@/services/profile'
// import UserService from '@/services/user'
import ProductService from '@/services/product'
import MeService from '@/services/me'
import { CollaboratorProfitShareTypes } from '@/helper'
import digitalUploader from './components/digital_uploader'
import contentTopHeader from '@/components/contentTopHeader'
import accordion from '@/components/accordion'

export default {
  components: {
    digitalUploader,
    contentTopHeader,
    accordion,
  },

  data() {
    return {
      selectedCover: null,
      accordions: [
        {
          title: 'Size & Fit',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
        {
          title: 'Shipping & Returns',
          content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
        },
      ],
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
    }
  },

  computed: {
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
      imgs = imgs.map((img) => img.cover.url)

      imgs = [
        'https://d19mruzykfu6hg.cloudfront.net/uploads/shop_product_cover/cover/125/523b9cda-b1a7-4cf0-9fe2-619c63a15f34.jpg',
        'https://d19mruzykfu6hg.cloudfront.net/uploads/album/cover/42/b5fe3a4c-4221-402d-ab22-4b1a52e474ac.jpg',
        'https://d19mruzykfu6hg.cloudfront.net/uploads/album/cover/33/73c40199-a5ac-463e-9154-09581f92c987.jpg',
      ]

      return imgs
    },
    initImgSelection() {
      console.log(this.covers)
      return this.covers[0]
    },
  },

  created() {
    if (
            this.$store.state.auth.user &&
            ['artist', 'brand', 'label'].indexOf(
                this.$store.state.auth.user.user_type
            ) > -1
        ) {
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

                  console.log(this.product);
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
                })
                .catch((reason) => {
                  console.log(reason)
                  this.$store.dispatch('error/showLoadingActivity', false)
                  this.$store.dispatch('error/showErrorToast', reason)
                })
    } else {
      this.$router.push({ path: '/' })
    }
  },

  methods: {
    selectCover(img) {
      this.selectedCover = img
    },
  },
  mounted() {
    // select first cover picture on load
    this.selectedCover = this.initImgSelection
  },
}
