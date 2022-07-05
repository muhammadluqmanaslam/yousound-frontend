/* global $:true */

import _ from 'lodash'
import CategoryService from '@/services/category'
// import UserService from '@/services/user'
import ProductService from '@/services/product'
import MeService from '@/services/me'
import { CollaboratorProfitShareTypes } from '@/helper'
import digitalUploader from './components/digital_uploader'
import contentTopHeader from '@/components/contentTopHeader'
import topbarNotification from '@/components/topbarNotification'
import policyTab from '@/views/settings/components/policy_tab'
import UserService from '@/services/user'

export default {
  components: {
    digitalUploader,
    contentTopHeader,
    topbarNotification,
    policyTab,
  },

  data() {
    return {
      user: {},
      topBarContent: 'Connect your Stripe account to start accepting payments',
      showPolicyActive: false,
      product_categories: [],
      destinations: [
        {
          value: 'United States',
          name: 'United States',
        },
        // {
        //   value: 'EE',
        //   name: "Int'l Flat Rate",
        // },
        {
          value: 'Canada',
          name: 'Canada',
        },
        {
          value: 'United Kingdom',
          name: 'United Kingdom',
        },
        {
          value: 'Australia',
          name: 'Australia',
        },
        {
          value: 'France',
          name: 'France',
        },
        {
          value: 'Germany',
          name: 'Germany',
        },
        {
          value: 'Japan',
          name: 'Japan',
        },
      ],
      countries: [],
      states: [],
      digital_content_category_ids: [],
      digital_content: {
        file: null,
      },
      product: {
        name: '',
        description: '',
        stock_status: 'active',
        show_status: 'show_all',
        category: '',
        price: null,
        tax_percent: 0,
        is_vat: false,
        seller_location: '',
        variants: [
          {
            name: '',
            quantity: '',
            price: '',
          },
        ],
        shipments: [
          {
            country: '',
            shipment_alone_price: '',
            shipment_with_price: '',
          },
        ],
        image1: null,
        image2: null,
        image3: null,
        collaborators: [],
        creator_recoup_cost: 0,
      },
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

    isAvailableToAddProduct() {
      var isAvailable =
        this.product.name && this.product.category && this.product.image1
      if (this.product.variants.length) {
        for (let index in this.product.variants) {
          const variant = this.product.variants[index]
          isAvailable =
            isAvailable &&
            variant.name.length &&
            (this.isDigitalProduct || parseFloat(variant.quantity) > 0) &&
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

    creator_share() {
      return 100 - _.sumBy(this.product.collaborators, 'user_share')
    },

    profit_share_types() {
      let profitShare = [];
      for (let i = 1; i <= 100; i += 1) {
        profitShare.push(i)
      }
      return profitShare
    },
  },

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'sell',
      tab: 'products',
      action: 'add_product',
    })
    for (let i = 10; i <= 100; i += 10) {
      this.profit_share_types.push({
        id: i,
        name: i + '%',
      })
    }
    if (
      this.$store.state.auth.user &&
      ['artist', 'brand', 'label'].indexOf(
        this.$store.state.auth.user.user_type
      ) > -1
    ) {
      var params = {
        stripe_connected: true,
        page: 1,
        per_page: 30,
      }
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        // CategoryService.getCategories(),
        // UserService.searchUsers(params)
        MeService.mutualUsers(params),
        CategoryService.getCategories(),
      ])
        .then((values) => {
          this.product_categories = values[1].body
          this.digital_content_category_ids = this.$store.getters[
            'app/digitalCategoryIds'
          ]
          this.$store.dispatch('app/setProductCategories', values[1].body)
          this.users = values[0].body.users
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
    updateUser(params) {
      this.$store.dispatch('error/showLoadingActivity', true)
      UserService.updateUserInfo(this.currentUser.id, params)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showSuccessToast', ['Saved'])
          AuthService.setUser(response.body)
        })
        .catch((e) => {
          const errors = e.body.errors
            ? _.map(e.body.errors, (msg) => `Email ${msg.detail}`)
            : [e.body]
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', errors)
        })
    },
    imageChanged(index, e) {
      if (index === 'product_image1') {
        this.product.image1 = e.target.files[0]
      } else if (index === 'product_image2') {
        this.product.image2 = e.target.files[0]
      } else {
        this.product.image3 = e.target.files[0]
      }
      var reader = new FileReader()
      reader.addEventListener(
        'load',
        (event) => {
          // document.getElementById(index).src = event.target.result
          $('#' + index).css(
            'background-image',
            'url(' + event.target.result + ')'
          )
        },
        false
      )
      reader.readAsDataURL(e.target.files[0])
    },

    addVariant() {
      this.product.variants.push({
        name: '',
        quantity: '',
        price: '',
      })
    },

    deleteVariant(index) {
      if (this.product.variants.length > 1) {
        this.product.variants.splice(index, 1)
      }
    },

    addShipment() {
      this.product.shipments.push({
        country: '',
        shipment_alone_price: '',
        shipment_with_price: '',
      })
    },

    deleteShipment(index) {
      if (this.product.shipments.length > 1) {
        this.product.shipments.splice(index, 1)
      }
    },

    onChangeProductCategory(category_id) {
      // console.log('onChangeProductCategory', category_id, this.product.category)
      if (
        !this.isDigitalProduct &&
        this.digital_content_category_ids.indexOf(category_id) > -1
      ) {
        this.product_variants = this.product.variants
        this.product.variants = [
          {
            name: 'Zip File',
            quantity: '',
            price: '',
          },
        ]
      } else if (
        this.isDigitalProduct &&
        this.digital_content_category_ids.indexOf(category_id) === -1
      ) {
        this.product.variants = this.product_variants
      }
    },

    changeTaxPercent(locationName) {
      this.product.tax_percent = 0
      if (this.product.is_vat) {
        const country = _.find(this.countries, (c) => c.name === locationName)
        this.product.tax_percent = _.get(country, 'rate', 0)
      } else {
        const state = _.find(this.states, (s) => s.name === locationName)
        this.product.tax_percent = _.get(state, 'rate', 0)
      }
    },

    resetTaxPercent(value) {
      this.product.tax_percent = 0
      this.product.seller_location = ''
    },

    learnMore() {},

    addCollaborator() {
      this.product.collaborators.push({
        user_id: '',
        user_share: 5,
      })
    },

    deleteCollaborator(index) {
      this.product.collaborators.splice(index, 1)
    },

    showCollaboratorsConfirmDialog() {
      this.collaborators_confirm_dialog = true
    },

    hideCollaboratorsConfirmDialog() {
      this.collaborators_confirm_dialog = false
    },

    beforeSaveProduct() {
      this.showCollaboratorsConfirmDialog()
    },

    saveProduct() {
      this.hideCollaboratorsConfirmDialog()
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
      formData.append(
        'shop_product[price]',
        Math.round(this.product.price * 100)
      )
      let variants = []
      for (let index in this.product.variants) {
        variants.push({
          ...this.product.variants[index],
          price: this.product.variants[index].price * 100,
        })
      }
      formData.append('shop_product[variants]', JSON.stringify(variants))
      for (let index in this.product.shipments) {
        this.product.shipments[index].shipment_alone_price = Math.round(
          this.product.shipments[index].shipment_alone_price * 100
        )
        this.product.shipments[index].shipment_with_price = Math.round(
          this.product.shipments[index].shipment_with_price * 100
        )
      }
      formData.append(
        'shop_product[shipments]',
        JSON.stringify(this.product.shipments)
      )
      formData.append('shop_product[cover1]', this.product.image1)
      formData.append('shop_product[cover2]', this.product.image2)
      formData.append('shop_product[cover3]', this.product.image3)
      formData.append(
        'shop_product[collaborators]',
        JSON.stringify(this.product.collaborators)
      )
      formData.append(
        'shop_product[creator_recoup_cost]',
        Math.round(this.product.creator_recoup_cost * 100)
      )

      formData.append(
        'shop_product[tax_percent]',
        _.get(this.product, 'tax_percent', 0)
      )
      formData.append(
        'shop_product[is_vat]',
        _.get(this.product, 'is_vat', false)
      )
      formData.append(
        'shop_product[seller_location]',
        _.get(this.product, 'seller_location', '')
      )

      if (this.isDigitalProduct) {
        formData.append(
          'shop_product[digital_content]',
          this.digital_content.file
        )
        formData.append(
          'shop_product[digital_content_name]',
          this.digital_content.file.name
        )
      }

      ProductService.addProduct(formData)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          if (this.product.collaborators.length > 0) {
            this.$store.dispatch('navigator/setParams', {
              product_id: response.body.id,
            })
            this.$router.push({ name: 'ManageIndex', params: {activeInnerFilter: 'products', activeInnerTab: 'pending'  } })
          } else {
            this.$router.push({ path: '/sell#products' })
          }
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    cancelToSaveProduct() {
      this.$router.push({ path: '/sell#products' })
    },

    deleteProductImage(index) {
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
    },
  },

  mounted() {
    const vm = this

    $.getJSON('../../static/countries.json', function (json) {
      const countries = json.countries
      for (let index in countries) {
        const country = {
          value: countries[index]['name'],
          name: countries[index]['name'],
        }
        if (!vm.destinations.find((c) => c.value === country.value)) {
          vm.destinations.push(country)
        }
      }
      vm.countries = _.filter(countries, (c) => c['rate'] !== false)
    })

    $.getJSON('../../static/states.json', function (data) {
      vm.states = data
    })
  },
}
