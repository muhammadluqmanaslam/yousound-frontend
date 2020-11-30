import _ from 'lodash'
import { mixin as onClickOutside } from 'vue-on-click-outside'
import AuthService from '@/services/auth'
import PaymentService from '@/services/payment'
import StreamService from '@/services/stream'
import UserService from '@/services/user'

import Attach from './components/attach'
import PaymentModal from '@/components/paymentmodal'

import {
  MediaLiveInputTypes,
  MediaLiveInputCodecs,
  MediaLiveInputResolutions,
  MediaLiveInputMaximumBitrates,
  MyEvents,
  // StreamHourlyPrice,
  StreamViewersLimits,
  StreamCosts,
} from '@/helper'

const ActionCable = require('actioncable')

export default {
  components: {
    Attach,
    PaymentModal,
  },

  mixins: [onClickOutside],

  data() {
    return {
      active_tab: 'manage',
      tabs: [
        { id: 'info', title: 'Info & Pricing', path: '/info' },
        { id: 'edit', title: 'Info', path: '/edit' },
        { id: 'manage', title: 'Live Stream', path: '' },
      ],
      // stream: {
      //   name: '',
      //   description: '',
      //   ml_input_type: 'RTMP_PUSH',
      //   ml_input_codec: 'AVC',
      //   ml_input_resolution: 'HD',
      //   ml_input_maximum_bitrate: 'MAX_10_MBPS'
      // },
      // show_deposit_dialog: false,
      show_stream_delete_confirm_dialog: false,
      show_create_failed_dialog: false,
      show_add_more_time_dialog: false,
      show_payment_dialog: false,
      show_view_stream_button: false,
      stream_assoc: {
        type: 'Album',
        value: null,
      },
      viewers_limits: StreamViewersLimits,
      costs: StreamCosts,
      streamCost: 1000,
      viewers_limit: 0,
      searchGuests: null,
      guests: [],
      selected_guests: [],
      // periods: [],
      // period: 3600,
      remainingFirstCheck: {
        time: 300,
        checked: false,
      },
      remainingSecondCheck: {
        time: 60,
        checked: false,
      },
      creatingInterval: null,
      remainingInterval: null,
      remainingSeconds: 0,
      broadcastSeconds: 0,
      active_viewers: 0,
      total_viewers: 0,
      cable: null,
      stream_subscription: null,
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    isRunning() {
      return _.get(this.currentUser, 'stream.status', '') === 'running'
      // return false
    },

    streamUrl() {
      return _.get(this.currentUser, 'stream.ml_input_dest_1_url', '')
    },

    streamKey() {
      return _.get(this.currentUser, 'stream.ml_input_id', '')
    },

    profileUrl() {
      return `${window.location.origin}/${this.currentUser.slug}`
    },

    // streamCost() {
    //   return Math.round((this.period * StreamHourlyPrice) / 3600)
    // },

    MediaLiveInputTypes() {
      return MediaLiveInputTypes
    },

    MediaLiveInputCodecs() {
      return MediaLiveInputCodecs
    },

    MediaLiveInputResolutions() {
      return MediaLiveInputResolutions
    },

    MediaLiveInputMaximumBitrates() {
      return MediaLiveInputMaximumBitrates
    },
  },

  watch: {
    searchGuests(val) {
      val && this.querySelections(val)
    },
  },

  created() {
    // for (let i = 1; i <= 24; i++) {
    //   this.periods.push({
    //     id: i * 3600,
    //     name: `${i}hours / $${(i * StreamHourlyPrice) / 100}`,
    //   })
    // }

    this.isPageReady = false
    this.$store.dispatch('error/showLoadingActivity', true)
    UserService.getUserInfo(this.currentUser.id)
      .then((response) => {
        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)

        AuthService.setUser(response.body)
        this.$store.dispatch('auth/setStream', response.body.stream)
        this.stream_assoc = {
          type: _.get(response.body, 'stream.assoc_type', 'Album'),
          value: _.get(response.body, 'stream.assoc'),
        }
        if (this.stream_assoc.type === '') {
          this.stream_assoc.type = 'Album'
        }
        // console.log('stream_assoc', this.stream_assoc)

        const stream_status = _.get(response.body, 'stream.status', '')
        if (stream_status === '') {
          this.$router.push({
            path: `/user/${this.currentUser.slug}/video/info`,
          })
        } else if (['deleted', 'inactive'].indexOf(stream_status) > -1) {
          this.$router.push({
            path: `/user/${this.currentUser.slug}/video/delete`,
          })
        } else {
          const vm = this
          // if (!this.isRunning) {
          //   this.creatingInterval = setInterval(function () {
          //     vm.getStream()
          //   }, 10000)
          // }
          this.remainingSeconds = response.body.stream.remaining_seconds
          this.broadcastSeconds = _.get(
            response.body,
            'stream.broadcast_seconds',
            0
          )
          this.remainingInterval = setInterval(function () {
            vm.refresh()
          }, 1000)
          this.$store.dispatch('navigator/goNextState', {
            page: 'broadcast',
            tab: '',
          })

          this.viewers_limit = this.currentUser.stream.viewers_limit
          // this.selected_guests = ['e0e54729-a1d6-4d8c-8a76-6fc207e6c210']
          // this.guests = _.cloneDeep(this.currentUser.stream.guests)
          this.guests = _.map(this.currentUser.stream.guests, (u) => ({
            id: u.id,
            name: u.username,
          }))
          this.selected_guests = _.map(this.currentUser.stream.guests, 'id')

          if (this.currentUser.stream.notified) {
            this.show_view_stream_button = true
          }

          this.stream_subscription = this.cable.subscriptions.create(
            {
              channel: 'StreamCreatorsChannel',
              stream_id: vm.currentUser.stream.id,
            },
            {
              connected: () => {
                console.log('connected to StreamCreatorsChannel')
              },
              received: (data) => {
                console.log('stream_subscription')
                console.log(data)
                if (data.notified) {
                  console.log('signal comming')
                  vm.show_view_stream_button = true
                }
                if (data.active_viewers_size >= 0) {
                  vm.active_viewers = data.active_viewers_size
                }
                if (data.total_viewers_size >= 0) {
                  vm.total_viewers = data.total_viewers_size
                }
                if (data.remaining_seconds >= 0) {
                  this.remainingSeconds = data.remaining_seconds
                }
              },
              disconnected: () => {
                console.log('disconnected to StreamCreatorsChannel :(')
              },
            }
          )
        }
      })
      .catch((e) => {
        // console.log(e)
        this.$store.dispatch('error/showLoadingActivity', false)
      })

    this.cable = ActionCable.createConsumer(
      `${process.env.SOCKET_BASE_URL}?token=${this.$store.state.auth.token}`
    )
  },

  beforeDestroy() {
    if (this.creatingInterval) {
      clearInterval(this.creatingInterval)
    }

    if (this.remainingInterval) {
      clearInterval(this.remainingInterval)
    }

    if (this.stream_subscription) {
      this.stream_subscription.unsubscribe()
      this.stream_subscription = null
    }
  },

  methods: {
    onTab(tab) {
      if (tab.id === this.active_tab) return

      this.$router.push({
        path: `/user/${this.currentUser.slug}/video${tab.path}`,
      })
    },

    querySelections(v) {
      var params = {
        page: 1,
        per_page: 10,
      }
      if (v.length) {
        params['q'] = v
      }
      UserService.searchUsers(params)
        .then((response) => {
          this.guests = _.map(response.body.users, (u) => ({
            id: u.id,
            name: u.username,
          }))
        })
        .catch((e) => {
          console.log('querySelections error', e.body.errors || [e.body])
        })
    },

    saveViewersLimit(value) {
      if (value === this.viewers_limit) return

      const params = {
        stream: {
          viewers_limit: value,
        },
      }
      StreamService.updateStream(this.currentUser.stream.id, params)
    },

    saveGuests(values) {
      const params = {
        stream: {
          guests_ids: values.join(','),
        },
      }
      StreamService.updateStream(this.currentUser.stream.id, params)
    },

    saveAttach() {
      console.log('saveAttach', this.stream_assoc)
      let params
      if (this.stream_assoc.value && this.stream_assoc.value.id > 0) {
        params = {
          stream: {
            assoc_type: this.stream_assoc.type,
            assoc_id: this.stream_assoc.value.id,
          },
        }
      } else {
        params = {
          stream: {
            assoc_type: '',
            assoc_id: 0,
          },
        }
      }
      StreamService.updateStream(this.currentUser.stream.id, params)
    },

    addMoreTime() {
      const params = {
        stream: {
          extend_period: this.period,
        },
      }
      StreamService.updateStream(this.currentUser.stream.id, params)
        .then((response) => {
          this.$store.dispatch('auth/setStream', response.body)
          this.remainingSeconds = response.body.remaining_seconds
        })
        .catch((e) => {
          console.log('saveViewersLimit', e.body.errors || [e.body])
        })
    },

    // openDepositDialog() {
    //   if (this.currentUser.enabled_live_video_free || this.currentUser.balance_amount >= StreamHourlyPrice * 80) {
    //     this.$router.push({ path: `/user/${this.currentUser.slug}/video/create` })
    //   } else {
    //     this.show_deposit_dialog = true
    //   }
    // },
    // closeDepositDialog() {
    //   this.show_deposit_dialog = false
    // },

    openStreamDeleteConfirmDialog() {
      this.show_stream_delete_confirm_dialog = true
    },

    closeStreamDeleteConfirmDialog() {
      this.show_stream_delete_confirm_dialog = false
    },

    openCreateFailedDialog() {
      this.show_create_failed_dialog = true
    },

    closeCreateFailedDialog() {
      this.show_create_failed_dialog = false
      this.$router.push({ path: '/' })
    },

    openAddMoreTimeDialog() {
      this.show_add_more_time_dialog = true
    },

    closeAddMoreTimeDialog() {
      this.show_add_more_time_dialog = false
    },

    openPaymentDialog() {
      this.closeAddMoreTimeDialog()
      this.show_payment_dialog = true
      // this.addMoreTime()
    },

    closePaymentDialog() {
      this.show_payment_dialog = false
    },

    deposit(token) {
      if (token) {
        const params = {
          payment_token: token.id,
          amount: this.streamCost,
        }
        PaymentService.makeDeposit(params)
        // PaymentService.makeDeposit(params)
        //   .then(() => {
        //     this.addMoreTime()
        //   })
        //   .catch((e) => {
        //     this.$store.dispatch(
        //       'error/showErrorToast',
        //       e.body.errors || [e.body]
        //     )
        //   })
      }
    },

    refresh() {
      this.remainingSeconds -= 1
      this.broadcastSeconds += 1
      if (!this.currentUser.enabled_live_video_free) {
        if (
          !this.remainingSecondCheck.checked &&
          this.remainingSeconds < this.remainingSecondCheck.time
        ) {
          this.remainingSecondCheck.checked = true
          this.remainingFirstCheck.checked = true
          this.openAddMoreTimeDialog()
        } else if (
          !this.remainingFirstCheck.checked &&
          this.remainingSeconds < this.remainingFirstCheck.time
        ) {
          this.remainingFirstCheck.checked = true
          this.openAddMoreTimeDialog()
        }

        if (this.remainingSeconds <= 0) {
          if (this.remainingInterval) {
            clearInterval(this.remainingInterval)
          }
          this.$store.dispatch('error/showErrorToast', [
            'Time is up and live stream is about to stop!!!',
          ])
          this.deleteStream()
        }
      }
      // else {
      //   if (!this.show_view_stream_button) {
      //     Vue.http.get(this.currentUser.stream.mp_channel_1_ep_1_url).then(response => {
      //       this.show_view_stream_button = true
      //       // StreamService.notifyStream(this.currentUser.stream.id)
      //     })
      //   }
      // }
    },

    isStreaming() {
      // return _.get(this.currentUser.stream, 'status', '') === 'started' &&
      return (
        _.get(this.$store.state.videoPlayer.user, 'slug', '') !==
          this.currentUser.slug || !this.$store.getters['videoPlayer/hasFrame']
      )
    },

    viewStream() {
      if (this.isStreaming()) {
        UserService.getUserInfo(this.currentUser.id).then((response) => {
          AuthService.setUser(response.body)

          this.$store.dispatch('videoPlayer/setStream', this.currentUser.stream)
          this.$root.$emit(MyEvents.VIDEO_PLAYER_INIT)
        })
      }
    },

    getStream() {
      const vm = this
      StreamService.getStream(this.currentUser.stream.id)
        .then((response) => {
          switch (response.body.status) {
            case 'running':
              this.$store.dispatch('auth/setStream', response.body)
              if (this.creatingInterval) {
                clearInterval(this.creatingInterval)
                this.remainingSeconds = response.body.remaining_seconds
                this.remainingInterval = setInterval(function () {
                  vm.refresh()
                }, 1000)
              }
              break
            case 'inactive':
            case 'deleted':
              if (this.creatingInterval) {
                clearInterval(this.creatingInterval)
              }
              this.openCreateFailedDialog()
              break
          }
        })
        .catch((e) => {
          console.log('getStream Error', e)
          // if (this.creatingInterval) {
          //   clearInterval(this.creatingInterval)
          // }
          // this.openCreateFailedDialog()
        })
    },

    // startStream() {
    //   this.$store.dispatch('error/showLoadingActivity', true)
    //   StreamService.startStream(this.currentUser.stream.id).then(response => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.$store.dispatch('auth/setStream', response.body)
    //   }).catch(e => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
    //   })
    // },

    // stopStream() {
    //   this.$store.dispatch('error/showLoadingActivity', true)
    //   StreamService.stopStream(this.currentUser.stream.id).then(response => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.$store.dispatch('auth/setStream', response.body)
    //   }).catch(e => {
    //     this.$store.dispatch('error/showLoadingActivity', false)
    //     this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
    //   })
    // },

    deleteStream() {
      this.closeStreamDeleteConfirmDialog()
      this.$store.dispatch('error/showLoadingActivity', true)
      StreamService.deleteStream(this.currentUser.stream.id)
        .then((response) => {
          // / close the video player if watching own live video
          if (
            _.get(this.$store.state.videoPlayer.stream, 'id') ===
            this.currentUser.stream.id
          ) {
            this.$root.$emit(MyEvents.VIDEO_PLAYER_SHUTDOWN)
          }
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('auth/setStream', response.body)
          this.$router.push({ path: '/' })
          // this.$router.push({ path: `/user/${this.currentUser.slug}/video/create` })
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },
}
