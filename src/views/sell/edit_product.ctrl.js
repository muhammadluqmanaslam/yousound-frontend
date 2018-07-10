import _ from 'lodash'
import CategoryService from '@/services/category'
import ProductService from '@/services/product'
import ProfileService from '@/services/profile'
import UserService from '@/services/user'
import { CollaboratorProfitShareTypes } from '@/helper'

export default {
  components: {
  },

  data () {
    return {
      product_categories: [],
      destinations: [],
      prod_id: '',
      product_image1: null,
      product_image1_url: null,
      product_image2: null,
      product_image2_url: null,
      product_image3: null,
      product_image3_url: null,
      product: null,
      users: [],
      collaborators_confirm_dialog: false,
      isPageReady: false
    }
  },

  computed: {
    isAvailableToUpdateProduct () {
      var isAvailable = this.product.name &&
                        this.product.category &&
                        this.product_image1_url
      if (this.product.variants.length) {
        for (let index in this.product.variants) {
          const variant = this.product.variants[index]
          isAvailable = isAvailable && (variant.name.length && (parseFloat(variant.quantity) > 0) && (parseFloat(variant.price) > 0))
        }
        if (this.product.shipments.length) {
          for (let index in this.product.shipments) {
            const shipment = this.product.shipments[index]
            isAvailable = isAvailable && (shipment.country.length && (parseFloat(shipment.shipment_alone_price) > 0) && (parseFloat(shipment.shipment_with_price) > 0))
          }
        } else {
          isAvailable = false
        }
      } else {
        isAvailable = false
      }
      return isAvailable
    },

    isEditable () {
      return ['privated', 'published', 'collaborated'].indexOf(this.product.status) == -1
    },

    artists() {
      return _.filter(this.users, (item) => { return item.user_type === 'artist' })
    },

    creator_share () {
      return 100 - _.sumBy(this.product.collaborators, 'user_share')
    },

    profit_share_types () {
      return CollaboratorProfitShareTypes
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', {page: 'sell', tab: 'products', action: 'edit_product'})

    if (this.$store.state.auth.user && ['artist', 'brand', 'label'].indexOf(this.$store.state.auth.user.user_type) > -1) {
      this.prod_id = this.$route.params.id
      const params = {
        filter: 'artist',
        page: 1,
        per_page: 30
      }
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        CategoryService.getCategories(),
        // UserService.searchUsers(params),
        ProfileService.getItems(this.$store.state.auth.user.id, 'followings', params),
        ProductService.getProduct(this.prod_id)
      ]).then(values => {
        for(let index in values[0].body) {
          const item = values[0].body[index]
          const category = {
            id: item.id,
            name: item.name,
            description: item.description
          }
          this.product_categories.push(category)
        }

        this.users = values[1].body.users

        this.product = values[2].body
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

        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(reason => {
        console.log(reason)
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', reason)
      })
    } else {
      this.$router.push({ path: '/'})
    }
  },

  methods: {
    imageChanged (index, e) {
      if (index === 'product_image1') {
        this.product_image1 = e.target.files[0]
      } else if (index === 'product_image2') {
        this.product_image2 = e.target.files[0]
      } else {
        this.product_image3 = e.target.files[0]
      }
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        // document.getElementById(index).src = event.target.result
        if (index === 'product_image1') {
          this.product_image1_url = event.target.result
        } else if (index === 'product_image2') {
          this.product_image2_url = event.target.result
        } else {
          this.product_image3_url = event.target.result
        }
      }, false)
      reader.readAsDataURL(e.target.files[0])
      this.$forceUpdate()
    },

    addVariant () {
      this.product.variants.push({
        name: '',
        quantity: '',
        price: ''
      })
    },

    deleteVariant (index) {
      if (this.product.variants.length > 1) {
        this.product.variants.splice(index, 1)
      }
    },

    addShipment () {
      this.product.shipments.push({
        country: '',
        shipment_alone_price: '',
        shipment_with_price: ''
      })
    },

    deleteShipment (index) {
      if (this.product.shipments.length > 1) {
        this.product.shipments.splice(index, 1)
      }
    },

    learnMore () {
    },

    addCollaborator () {
      this.product.collaborators.push({
        user_id: '',
        user_share: 5,
        status: 'pending'
      })
    },

    deleteCollaborator (index) {
      this.product.collaborators.splice(index, 1)
    },

    showCollaboratorsConfirmDialog () {
      this.collaborators_confirm_dialog = true
    },

    hideCollaboratorsConfirmDialog () {
      this.collaborators_confirm_dialog = false
    },

    beforeSaveProduct () {
      if (this.product.status == 'pending') {
        this.showCollaboratorsConfirmDialog()
      } else {
        this.saveProduct()
      }
    },

    saveProduct () {
      const total_collaborators_share = _.sumBy(this.product.collaborators, 'user_share')
      if (total_collaborators_share >= 100) {
        this.$store.dispatch('error/showErrorToast', ['Total share shoud be less than 100'])
        return
      }

      this.$store.dispatch('error/showLoadingActivity', true)
      const formData = new FormData()
      formData.append('shop_product[name]', this.product.name)
      formData.append('shop_product[description]', this.product.description)
      formData.append('shop_product[stock_status]', this.product.stock_status)
      if (this.product.category.id) {
        formData.append('shop_product[category_id]', this.product.category.id)
      } else {
        formData.append('shop_product[category_id]', this.product.category)
      }
      formData.append('shop_product[price]', Math.round(this.product.price * 100))
      for (let index in this.product.variants) {
        this.product.variants[index].price = Math.round(this.product.variants[index].price * 100)
      }
      formData.append('shop_product[variants]', JSON.stringify(this.product.variants))
      for (let index in this.product.shipments) {
        this.product.shipments[index].shipment_alone_price = Math.round(this.product.shipments[index].shipment_alone_price * 100)
        this.product.shipments[index].shipment_with_price = Math.round(this.product.shipments[index].shipment_with_price * 100)
      }
      formData.append('shop_product[shipments]', JSON.stringify(this.product.shipments))
      if (this.product_image1) {
        formData.append('shop_product[cover1]', this.product_image1)
      } else {
        if (this.product_image1_url === null) {
          formData.append('shop_product[cover1]', null)
        }
      }
      if (this.product_image2) {
        formData.append('shop_product[cover2]', this.product_image2)
      } else {
        if (this.product_image2_url === null) {
          formData.append('shop_product[cover2]', null)
        }
      }
      if (this.product_image3) {
        formData.append('shop_product[cover3]', this.product_image3)
      } else {
        if (this.product_image3_url === null) {
          formData.append('shop_product[cover3]', null)
        }
      }
      formData.append('shop_product[collaborators]', JSON.stringify(this.product.collaborators))
      formData.append('shop_product[creator_recoup_cost]', Math.round(this.product.creator_recoup_cost * 100))

      ProductService.updateProduct(this.product.id, formData).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$router.push({ path: '/sell#products' })
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    cancelToSaveProduct () {
      this.$router.push({ path: '/sell#products' })
    },

    deleteProductImage (index) {
      if (index === 'product_image1') {
        this.product_image1 = null
        this.product_image1_url = null
      } else if (index === 'product_image2') {
        this.product_image2 = null
        this.product_image2_url = null
      } else {
        this.product_image3 = null
        this.product_image3_url = null
      }
    }
  },


  mounted () {
    const vm = this;
    $.getJSON('../../static/countries.json', function (json) {
        const countries = json.countries
        for(let index in countries) {
          const country = {
            iso: countries[index]['iso_2'],
            name: countries[index]['name']
          }
          vm.destinations.push(country)
        }
    });
  }
}
