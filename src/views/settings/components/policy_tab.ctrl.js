import AuthService from '@/services/auth'
import UserService from '@/services/user'

import paymentModal from '@/components/paymentmodal'

export default {
  components: {
    paymentModal,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },

    textAreaHeight: {
      type: Number,
      required: false,
    },

    updateUser: {
      type: Function,
      required: true,
    },

    isSaveAllMode: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {}
  },

  created() {},

  methods: {
    saveAllMode() {
      this.saveReturnPolicy()
      this.saveShippingPolicy()
      this.saveSizeChart()
      this.savePrivacyPolicy()
    },
    saveReturnPolicy() {
      const params = {
        user: {
          return_policy: this.user.return_policy,
        },
      }
      this.updateUser(params)
    },

    saveShippingPolicy() {
      const params = {
        user: {
          shipping_policy: this.user.shipping_policy,
        },
      }
      this.updateUser(params)
    },

    saveSizeChart() {
      const params = {
        user: {
          size_chart: this.user.size_chart,
        },
      }
      this.updateUser(params)
    },

    savePrivacyPolicy() {
      const params = {
        user: {
          privacy_policy: this.user.privacy_policy,
        },
      }
      this.updateUser(params)
    },
  },
}
