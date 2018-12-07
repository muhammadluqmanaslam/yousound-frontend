import _ from 'lodash'
import AuthService from  '@/services/auth'
import StreamService from  '@/services/stream'

import paymentModal from '@/components/paymentmodal'

import {
  MediaLiveInputTypes,
  MediaLiveInputCodecs,
  MediaLiveInputResolutions,
  MediaLiveInputMaximumBitrates,
  Filter,
  StreamHourlyPrice
} from '@/helper'

export default {
  components: {
    paymentModal
  },

  data () {
    return {
      periods: [],
      period: 3600,
      terms: false,
      view_prices: [
        { id: 0, name: 'No' },
        { id: 100, name: '$1' },
        { id: 500, name: '$5' },
        { id: 1000, name: '$10' },
        { id: 2000, name: '$20' },
        { id: 5000, name: '$50' },
        { id: 10000, name: '$100' },
        { id: 25000, name: '$250' },
        { id: 50000, name: '$500' },
        { id: 100000, name: '$1,000' },
        { id: 250000, name: '$2,500' },
        { id: 500000, name: '$5,000' },
        { id: 1000000, name: '$10,000' },
      ],
      genres: [],
      stream: {
        name: '',
        description: '',
        view_price: 0,
        cover: null,
        ml_input_type: 'RTMP_PUSH',
        ml_input_codec: 'AVC',
        ml_input_resolution: 'HD',
        ml_input_maximum_bitrate: 'MAX_10_MBPS'
      },
      stream_cover_url: null,
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
      return Math.round(this.period * StreamHourlyPrice / 3600)
    },

    profileUrl () {
      return window.location.origin + '/' + this.currentUser.slug
    },

    // isValidate () {
    //   return !!this.stream_cover_url
    // },

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
    // this.genres = _.flatMap(this.$store.state.app.genres, 'children')
    this.genres = this.$store.state.app.genres
    if (this.currentUser.enabled_live_video_free) {
      this.periods.push({
        id: 1,
        name: '1hour / FREE'
      })
    } else {
      if (this.currentUser.stream_rolled_time > 0) {
        this.periods.push({
          id: this.currentUser.stream_rolled_time,
          name: `${Filter.timeInHours(this.currentUser.stream_rolled_time)} / Rolled Over Time`
        })
        this.period = this.currentUser.stream_rolled_time
      }
      for (let i = 1; i <= 24; i++) {
        this.periods.push({
          id: i * 3600,
          name: `${i}hours / $${i * StreamHourlyPrice / 100}`
        })
      }
    }
  },

  methods: {
    openPaymentDialog () {
      this.$validator.validateAll().then(response => {
        if (response === true) {
          if (this.currentUser.enabled_live_video_free) {
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
      if (token) {
        const params = {
          payment_token: token.id,
          amount: this.streamCost
          // amount: StreamHourlyPrice
        }
        PaymentService.makeDeposit(params).then(response => {
          AuthService.setUser(response.body)
          this.submit()
        }).catch(e => {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        })
      } else {
        this.submit()
      }
    },

    imageChanged (e) {
      if (e.target.files.length > 0) {
        this.stream.cover = e.target.files[0]
        var reader = new FileReader()
        reader.addEventListener('load', (event) => {
          this.stream_cover_url = event.target.result
        }, false)
        reader.readAsDataURL(this.stream.cover)
      } else {
        this.stream.cover = null
        this.stream_cover_url = null
      }
    },

    submit () {
      this.$validator.validateAll().then(response => {
        if (response === true) {
          const formData = new FormData()
          formData.append('stream[name]', this.stream.name)
          formData.append('stream[description]', this.stream.description)
          formData.append('stream[genre_id]', this.stream.genre_id)
          formData.append('stream[view_price]', this.stream.view_price)
          formData.append('stream[valid_period]', this.period)
          formData.append('stream[cover]', this.stream.cover)

          this.$store.dispatch('error/showLoadingActivity', true)
          StreamService.createStream(formData).then(response => {
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
