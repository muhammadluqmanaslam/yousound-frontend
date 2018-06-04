import _ from 'lodash'
import AuthService from  '@/services/auth'
import StreamService from  '@/services/stream'

import paymentModal from '@/components/paymentmodal'

import {
  MediaLiveInputTypes,
  MediaLiveInputCodecs,
  MediaLiveInputResolutions,
  MediaLiveInputMaximumBitrates,
  StreamHourlyPrice} from '@/helper'

export default {
  components: {
    paymentModal
  },

  data () {
    return {
      hours: [],
      hour: 1,
      terms: false,
      stream: {
        name: '',
        description: '',
        ml_input_type: 'RTMP_PUSH',
        ml_input_codec: 'AVC',
        ml_input_resolution: 'HD',
        ml_input_maximum_bitrate: 'MAX_10_MBPS'
      },
      show_payment_dialog: false,
      isPageReady: false
    }
  },

  computed: {
    MediaLiveInputTypes () {
      return MediaLiveInputTypes
    },

    MediaLiveInputCodecs () {
      return MediaLiveInputCodecs
    },

    MediaLiveInputResolutions () {
      return MediaLiveInputResolutions
    },

    MediaLiveInputMaximumBitrates () {
      return MediaLiveInputMaximumBitrates
    },

    streamCost () {
      return this.hour * StreamHourlyPrice
    },

    currentUser () {
      return this.$store.state.auth.user
    }
  },

  // watch: {
  //   '$route' (toPath, fromPath) {
  //   }
  // },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'video', tab: '' })
    if (this.currentUser.enabled_live_video_free) {
      this.hours.push({
        id: 1,
        name: '1hour / FREE'
      })
    } else {
      for (let i = 1; i <= 12; i++) {
        this.hours.push({
          id: i,
          name: `${i}hours / $${i * StreamHourlyPrice / 100}`
        })
      }
    }
  },

  methods: {
    openPaymentDialog () {
      this.$validator.validateAll().then(response => {
        if (response === true) {
          if (this.currentUser.enabled_live_video_free || this.currentUser.balance_amount >= this.streamCost) {
            this.submit()
          } else {
            this.show_payment_dialog = true
          }
        } else {
          this.$store.dispatch('error/showErrorToast', [this.errors.items[0].msg])
        }
      }).catch(e => {
        console.log('error', e)
      })
    },

    closePaymentDialog () {
      this.show_payment_dialog = false
    },

    deposit (token) {
      const params = {
        payment_token: token.id,
        amount: StreamHourlyPrice
      }
      PaymentService.makeDeposit(params).then(response => {
        AuthService.setUser(response.body)
        this.submit()
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    submit () {
      this.$validator.validateAll().then(response => {
        if (response === true) {
          let params = {
            stream: this.stream
          }
          params.stream.valid_period = this.hour * 3600
          this.$store.dispatch('error/showLoadingActivity', true)
          StreamService.createStream(params).then(response => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('auth/setStream', response.body)
            this.$router.push({ path: `/user/${this.$store.state.auth.user.slug}/video` })
          }).catch(e => {
            this.$store.dispatch('error/showLoadingActivity', false)
            this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
          })
        } else {
          this.$store.dispatch('error/showErrorToast', [this.errors.items[0].msg])
        }
      }).catch(e => {
        console.log('error', e)
      })
    },
  }
}
