import _, { add } from 'lodash'
import AddressService from '@/services/address'
import AuthService from '@/services/auth'
import UserService from '@/services/user'
import { Countries, States } from '@/helper'

export default {
  props: {
    actionRight: {
      type: Boolean,
      default: false,
    },
    editDialog: {
      type: Boolean,
      default: false,
    },
    header: {
      type: String,
      default: 'Add or change your default shipping address for all of the physical orders you place',
    },
  },
  data() {
    return {
      countries: Countries,
      states: States,
      shipping_address: {
        id: '',
        first_name: '',
        last_name: '',
        street_address: '',
        address_line: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
      },
      isPageReady: false,
    }
  },

  computed: {
    isCountryUS() {
      return this.shipping_address.country === 'United States'
    },
    strippedAddress() {
      const addr = this.shipping_address
      let stripped = {}
      stripped.lineOne = addr.first_name + ' ' + addr.last_name
      stripped.lineTwo = addr.address_line
      stripped.lineThree = addr.city + ' ' + addr.state
      stripped.lineFour = addr.postcode
      stripped.lineFive = addr.country

      return stripped
      // return Object.values(stripped).join("\r\n")
    },
  },

  created() {
    this.resetShippingAddress()
  },

  methods: {
    resetShippingAddress() {
      const address = this.$store.state.auth.user.default_address
      if (address) {
        this.shipping_address.id = address.id
        this.shipping_address.first_name = address.first_name
        this.shipping_address.last_name = address.last_name
        this.shipping_address.street_address = address.street_1
        this.shipping_address.address_line = address.street_2
        this.shipping_address.city = address.city
        this.shipping_address.state = address.state
        this.shipping_address.postcode = address.postcode
        this.shipping_address.country = address.country
      }
    },

    submit() {
      this.$validator
        .validateAll()
        .then((response) => {
          if (response === true) {
            this.saveShippingAddress()
          } else {
            this.$store.dispatch(
              'error/showErrorToast',
              this.errors.items.map((item) => item.msg)
            )
          }
        })
        .catch((e) => {
          console.log('validate error', e)
        })
    },

    saveShippingAddress() {
      const userId = this.$store.state.auth.user.id
      const params = {
        shop_address: {
          first_name: this.shipping_address.first_name,
          last_name: this.shipping_address.last_name,
          street_1: this.shipping_address.street_address,
          street_2: this.shipping_address.address_line,
          city: this.shipping_address.city,
          state: this.shipping_address.state,
          country: this.shipping_address.country,
          postcode: this.shipping_address.postcode,
          set_default: 1,
        },
      }
      this.$store.dispatch('error/showLoadingActivity', true)
      if (this.shipping_address.id === '') {
        AddressService.addAddress(params)
          .then((response) => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showSuccessToast', ['Saved'])
            UserService.getUserInfo(userId).then((response) =>
              AuthService.setUser(response.body)
            )
          })
          .catch((e) => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      } else {
        AddressService.updateAddress(this.shipping_address.id, params)
          .then((response) => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showSuccessToast', ['Saved'])
            UserService.getUserInfo(userId).then((response) =>
              AuthService.setUser(response.body)
            )
          })
          .catch((e) => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      }
    },
  },
}
