import _ from 'lodash'
import PaymentService from  '@/services/payment'
import StreamService from  '@/services/stream'
import UserService from '@/services/user'

import paymentModal from '@/components/paymentmodal'

import {
  MediaLiveInputTypes,
  MediaLiveInputCodecs,
  MediaLiveInputResolutions,
  MediaLiveInputMaximumBitrates,
  MyEvents,
  StreamHourlyPrice} from '@/helper'

export default {
  components: {
    paymentModal
  },

  data () {
    return {
      // stream: {
      //   name: '',
      //   description: '',
      //   ml_input_type: 'RTMP_PUSH',
      //   ml_input_codec: 'AVC',
      //   ml_input_resolution: 'HD',
      //   ml_input_maximum_bitrate: 'MAX_10_MBPS'
      // },
      // show_payment_dialog: false,
      // show_deposit_dialog: false,
      show_stream_delete_confirm_dialog: false,
      timer: null,
      isPageReady: false
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    },

    isRunning () {
      return _.get(this.currentUser, 'stream.status', '') === 'running'
      // return false
    },

    streamUrl () {
      const url = _.get(this.currentUser, 'stream.ml_input_dest_1_url', '')
      const pos = url.lastIndexOf('/')
      if (pos == -1) {
        return url
      } else {
        return url.substr(0, pos)
      }
    },

    streamKey () {
      const url = _.get(this.currentUser, 'stream.ml_input_dest_1_url', '')
      const pos = url.lastIndexOf('/')
      if (pos == -1) {
        return url
      } else {
        return url.substr(pos + 1)
      }
    },

    profileUrl () {
      return `${window.location.origin}/${this.currentUser.slug}`
    },

    StreamHourlyPrice () {
      return StreamHourlyPrice
    },

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
    }
  },

  // watch: {
  //   '$route' (toPath, fromPath) {
  //   }
  // },

  created () {
    UserService.getUserInfo(this.currentUser.id).then(response => {
      this.$store.dispatch('auth/setStream', response.body.stream)
      const stream_status = _.get(response.body, 'stream.status', '')

      if (stream_status === '') {
        this.$router.push({ path: `/user/${this.currentUser.slug}/video/create` })
      } else if (stream_status === 'deleted') {
        this.$router.push({ path: `/user/${this.currentUser.slug}/video/delete` })
      } else {
        const vm = this
        if (!this.isRunning) {
          this.timer = setInterval(function(){ vm.getStream() }, 10000)
        }
        this.$store.dispatch('navigator/goNextState', { page: 'video', tab: '' })
      }
    })
  },

  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  methods: {
    // openPaymentDialog () {
    //   this.closeDepositDialog()
    //   this.show_payment_dialog = true
    // },

    // closePaymentDialog () {
    //   this.show_payment_dialog = false
    // },

    // openDepositDialog () {
    //   if (this.currentUser.enabled_live_video_free || this.currentUser.balance_amount >= StreamHourlyPrice * 80) {
    //     this.$router.push({ path: `/user/${this.currentUser.slug}/video/create` })
    //   } else {
    //     this.show_deposit_dialog = true
    //   }
    // },

    // closeDepositDialog () {
    //   this.show_deposit_dialog = false
    // },

    openStreamDeleteConfirmDialog () {
      this.show_stream_delete_confirm_dialog = true
    },

    closeStreamDeleteConfirmDialog () {
      this.show_stream_delete_confirm_dialog = false
    },

    deposit (token) {
      const params = {
        payment_token: token.id,
        amount: StreamHourlyPrice
      }
      PaymentService.makeDeposit(params).then(response => {
        AuthService.setUser(response.body)
        this.$router.push({ path: `/user/${this.currentUser.slug}/video/create` })
      }).catch(e => {
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    isStreaming () {
      // return _.get(this.currentUser.stream, 'status', '') === 'started' &&
      return (_.get(this.$store.state.videoPlayer.user, 'slug', '') !== this.currentUser.slug || !this.$store.getters['videoPlayer/hasFrame'])
    },

    viewStream () {
      if (this.isStreaming()) {
        this.$store.dispatch('videoPlayer/setUser', this.currentUser)
        this.$root.$emit(MyEvents.VIDEO_PLAYER_INIT)
      }
    },

    getStream () {
      StreamService.getStream(this.currentUser.stream.id).then(response => {
        if (response.body.status === 'running') {
          this.$store.dispatch('auth/setStream', response.body)
          if (this.timer) {
            clearInterval(this.timer)
          }
        }
      }).catch(e => {
        console.log('getStream', e)
      })
    },

    // startStream () {
    //   this.$store.dispatch('error/showLoadingActivity', true)
    //   StreamService.startStream(this.currentUser.stream.id).then(response => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.$store.dispatch('auth/setStream', response.body)
    //   }).catch(e => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
    //   })
    // },

    // stopStream () {
    //   this.$store.dispatch('error/showLoadingActivity', true)
    //   StreamService.stopStream(this.currentUser.stream.id).then(response => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.$store.dispatch('auth/setStream', response.body)
    //   }).catch(e => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
    //   })
    // },

    deleteStream () {
      this.closeStreamDeleteConfirmDialog()
      this.$store.dispatch('error/showLoadingActivity', true)
      StreamService.deleteStream(this.currentUser.stream.id).then(response => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('auth/setStream', response.body)
        this.$router.push({ path: '/' })
        // this.$router.push({ path: `/user/${this.currentUser.slug}/video/create` })
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    }
  }
}
