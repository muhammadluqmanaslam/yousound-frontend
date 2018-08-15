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
      product: {
        name: '',
        description: '',
        stock_status: 'active',
        show_status: 'show_all',
        category: '',
        price: null,
        variants: [
          {
            name: '',
            quantity: '',
            price: ''
          }
        ],
        shipments: [
          {
            country: '',
            shipment_alone_price: '',
            shipment_with_price: ''
          }
        ],
        image1: null,
        image2: null,
        image3: null,
        collaborators: [],
        creator_recoup_cost: 0
      },
      users: [],
      collaborators_confirm_dialog: false,
      isPageReady: false
    }
  },

  computed: {
    isAvailableToAddProduct () {
      var isAvailable = this.product.name &&
                        this.product.category &&
                        this.product.image1
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

    artists () {
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
    this.$store.dispatch('navigator/goNextState', { page: 'sell', tab: 'products', action: 'add_product' })
    for (let i = 10; i <= 100; i+=10) {
      this.profit_share_types.push({
        id: i,
        name: i + '%'
      })
    }
    if (this.$store.state.auth.user && ['artist', 'brand', 'label'].indexOf(this.$store.state.auth.user.user_type) > -1) {
      var params = {
        'page': 1,
        'per_page': 30
      }
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        CategoryService.getCategories(),
        // UserService.searchUsers(params)
        ProfileService.getItems(this.$store.state.auth.user.id, 'followings', params)
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
        this.product.image1 = e.target.files[0]
      } else if (index === 'product_image2') {
        this.product.image2 = e.target.files[0]
      } else {
        this.product.image3 = e.target.files[0]
      }
      var reader = new FileReader()
      reader.addEventListener('load', (event) => {
        // document.getElementById(index).src = event.target.result
        $('#' + index).css('background-image', 'url(' + event.target.result + ')')
      }, false)
      reader.readAsDataURL(e.target.files[0])
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
        user_share: 5
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
      this.showCollaboratorsConfirmDialog()
    },

    saveProduct () {
      this.$store.dispatch('error/showLoadingActivity', true)
      const formData = new FormData()
      formData.append('shop_product[name]', this.product.name)
      formData.append('shop_product[description]', this.product.description)
      formData.append('shop_product[stock_status]', this.product.stock_status)
      if (this.product.show_status === 'show_only_stream') {
        formData.append('shop_product[show_status]', this.product.show_status)
      } else {
        formData.append('shop_product[show_status]', 'show_all')
      }
      formData.append('shop_product[category_id]', this.product.category)
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
      formData.append('shop_product[cover1]', this.product.image1)
      formData.append('shop_product[cover2]', this.product.image2)
      formData.append('shop_product[cover3]', this.product.image3)
      formData.append('shop_product[collaborators]', JSON.stringify(this.product.collaborators))
      formData.append('shop_product[creator_recoup_cost]', Math.round(this.product.creator_recoup_cost * 100))

      ProductService.addProduct(formData).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        if (this.product.collaborators.length > 0) {
          this.$store.dispatch('navigator/setParams', { product_id: response.body.id })
          this.$router.push({ path: '/sell#pendings' })
        } else {
          this.$router.push({ path: '/sell#products' })
        }
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
        this.product.image1 = null
        $('#product_image1').css('background-image', 'none') 
      } else if (index === 'product_image2') {
        this.product.image2 = null
        $('#product_image2').css('background-image', 'none') 
      } else {
        this.product.image3 = null
        $('#product_image3').css('background-image', 'none') 
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
