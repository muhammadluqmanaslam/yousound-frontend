import * as UpChunk from '@mux/upchunk'
import AuthService from '@/services/auth'
import MeService from '@/services/me'
import PaymentService from '@/services/payment'
import StreamService from '@/services/stream'
import UserService from '@/services/user'
import Attach from './components/attach'
import PaymentModal from '@/components/paymentmodal'
import DigitalUploader from './components/digital_uploader'
import contentTopHeader from '@/components/contentTopHeader'
import videoEstimate from '@/views/video/estimate'

import {
  VideoGenres,
  VideoTypes,
  MediaLiveInputTypes,
  MediaLiveInputCodecs,
  MediaLiveInputResolutions,
  MediaLiveInputMaximumBitrates,
  Filter,
  // StreamHourlyPrice,
  StreamViewPrices,
  StreamViewersLimits,
  StreamCosts,
} from '@/helper'

export default {
  components: {
    Attach,
    PaymentModal,
    DigitalUploader,
    contentTopHeader,
    videoEstimate,
  },

  data() {
    return {
      activeView: 'intro',
      active_tab: 'create',
      tabs: [
        { id: 'info', title: 'Intro', path: '/info' },
        { id: 'create', title: 'Setup' },
        { id: 'manage', title: 'Live Stream', disabled: true },
      ],
      VideoTypes: VideoTypes,
      video_type: VideoTypes.LIVE,
      terms: false,
      view_prices: StreamViewPrices,
      viewers_limits: StreamViewersLimits,
      costs: StreamCosts,
      streamCost: 1000,
      profit_share_types: [],
      // periods: [],
      // period: 3600,
      // genres: [],
      stream: {
        name: '',
        description: '',
        view_price: 0,
        viewers_limit: 0,
        cover: null,
        ml_input_type: 'RTMP_PUSH',
        ml_input_codec: 'AVC',
        ml_input_resolution: 'HD',
        ml_input_maximum_bitrate: 'MAX_10_MBPS',
        collaborators: [],
        account_ids: [],
        creator_recoup_cost: 0,
      },
      stream_cover_url: null,
      stream_assoc: {
        type: 'Album',
        value: null,
      },
      digital_content: {
        file: null,
      },
      show_payment_dialog: false,
      show_stripe_connect_dialog: false,
      show_help_dialog: false,
      show_attach_picker: false,
      show_collaborators_dialog: false,
      users: [],
      friends: [],
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

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

    // isValidate() {
    //   return !!this.stream_cover_url
    // },

    // streamCost() {
    //   return Math.round((this.period * StreamHourlyPrice) / 3600)
    // },

    profileUrl() {
      return window.location.origin + '/' + this.currentUser.slug
    },

    genres() {
      return this._.filter(
        this.$store.state.app.genres,
        (g) => VideoGenres.indexOf(g.name) > -1
      ).map((g) => ({ id: g.id, name: g.name }))
    },

    profiles() {
      return this.friends.slice()
    },

    stream_view_price() {
      return Filter.formatNumber(this.stream.view_price)
    },

    creator_share() {
      return 100 - this._.sumBy(this.stream.collaborators, 'user_share')
    },
  },

  // watch: {
  //   '$route' (toPath, fromPath) {
  //   }
  // },

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'broadcast',
      tab: 'create',
    })

    if (!this.currentUser.stripe_connected) {
      this.openStripeConnectDialog()
    } else {
      // if (this.currentUser.data['video_page_visited'] !== 1) {
      //   this.openHelpDialog()
      // }

      // this.genres = _.flatMap(this.$store.state.app.genres, 'children')
      // this.genres = this.$store.state.app.genres
      // VideoGenres.forEach((vg) => {
      //   const g = this._.find(this.$store.state.app.genres, { name: vg })
      //   if (g) {
      //     this.genres.push({ id: g.id, name: g.name })
      //   } else {
      //     console.log('VideoGenres', vg)
      //   }
      // })

      for (let i = 1; i <= 100; i++) {
        this.profit_share_types.push(i)
      }

      var params = {
        stripe_connected: true,
        page: 1,
        per_page: 30,
      }

      var friendsParams = {
        page: 1,
        per_page: 30,
      }

      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        MeService.mutualUsers(params),
        MeService.mutualUsers(friendsParams),
      ])
        .then((values) => {
          this.product_categories = this.$store.state.app.product_categories
          this.digital_content_category_ids = this.$store.getters[
            'app/digitalCategoryIds'
          ]

          this.users = values[0].body.users
          this.friends = values[1].body.users
          this.isPageReady = true
          this.$store.dispatch('error/showLoadingActivity', false)

          MeService.mutualUsers({ ...params, per_page: -1 }).then(
            (response) => {
              this.users = response.body.users
            }
          )

          MeService.mutualUsers({ ...friendsParams, per_page: -1 }).then(
            (response) => {
              this.friends = response.body.users
            }
          )
        })
        .catch((reason) => {
          console.log(reason)
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch('error/showErrorToast', reason)
        })

      if (this.currentUser.enabled_live_video_free) {
        this.periods.push({
          id: 1,
          name: '1hour / FREE',
        })
      } else {
        // if (this.currentUser.stream_rolled_time > 0) {
        //   this.periods.push({
        //     id: this.currentUser.stream_rolled_time,
        //     name: `${Filter.timeInHours(
        //       this.currentUser.stream_rolled_time
        //     )} / Remaining Unpaid Time`,
        //   })
        //   this.period = this.currentUser.stream_rolled_time
        // }

        // for (let i = 1; i <= 24; i++) {
        //   this.periods.push({
        //     id: i * 3600,
        //     name: `${i}hours / $${(i * StreamHourlyPrice) / 100}`,
        //   })
        // }
        // this.period = 3600

        if (this.currentUser.stream_rolled_cost > 0) {
          this.costs.unshift({
            value: 0,
            name: `$${Filter.formatNumber(
              this.currentUser.stream_rolled_cost
            )} - Remaining Cost`,
          })
          this.streamCost = 0
        }
      }
    }
  },

  methods: {
    gotoNextView(view) {
      this.activeView = view
    },
    onTab(tab) {
      if (tab.id === this.active_tab) return

      this.$router.push({
        path: `/user/${this.currentUser.slug}/video${tab.path}`,
      })
    },

    openHelpDialog() {
      this.show_help_dialog = true
    },

    closeHelpDialog() {
      this.show_help_dialog = false
      const params = {
        user: {
          video_page_visited: 1,
        },
      }
      UserService.updateUserInfo(this.currentUser.id, params).then(
        (response) => {
          AuthService.setUser(response.body)
          this.$store.dispatch('auth/setUser', response.body)
        }
      )
    },

    openStripeConnectDialog() {
      this.show_stripe_connect_dialog = true
    },

    closeStripeConnectDialog() {
      this.show_stripe_connect_dialog = false
      this.$router.push({ path: '/settings#bank-details' })
    },

    openCollaboratorsDialog() {
      this.show_collaborators_dialog = true
    },

    closeCollaboratorsDialog() {
      this.show_collaborators_dialog = false
    },

    addCollaborator() {
      this.stream.collaborators.push({
        user_id: '',
        user_share: 5,
      })
    },

    deleteCollaborator(index) {
      this.stream.collaborators.splice(index, 1)
    },

    openPaymentDialog() {
      this.$validator
        .validateAll()
        .then((response) => {
          if (response === true) {
            if (
              this.currentUser.enabled_live_video_free ||
              this.streamCost === 0
            ) {
              this.submit()
            } else {
              this.show_payment_dialog = true
            }
          } else {
            this.$store.dispatch('error/showErrorToast', [
              this.errors.items[0].msg,
            ])
          }
        })
        .catch((e) => {
          console.log('error', e)
        })
    },

    closePaymentDialog() {
      this.show_payment_dialog = false
    },

    deposit(token) {
      if (token) {
        const params = {
          payment_token: token.id,
          amount: this.streamCost,
          // amount: StreamHourlyPrice
        }
        PaymentService.makeDeposit(params)
          .then(() => {
            this.submit()
          })
          .catch((e) => {
            this.$store.dispatch(
              'error/showErrorToast',
              e.body.errors || [e.body]
            )
          })
      } else {
        this.submit()
      }
    },

    imageChanged(e) {
      if (e.target.files.length > 0) {
        this.stream.cover = e.target.files[0]
        var reader = new FileReader()
        reader.addEventListener(
          'load',
          (event) => {
            this.stream_cover_url = event.target.result
          },
          false
        )
        reader.readAsDataURL(this.stream.cover)
      } else {
        this.stream.cover = null
        this.stream_cover_url = null
      }
    },

    submit() {
      this.$validator
        .validateAll()
        .then((response) => {
          if (response === true) {
            const formData = new FormData()
            formData.append('stream[name]', this.stream.name)
            formData.append('stream[description]', this.stream.description)
            formData.append('stream[genre_id]', this.stream.genre_id)
            formData.append('stream[view_price]', this.stream.view_price)
            formData.append('stream[valid_period]', this.period)
            formData.append('stream[cover]', this.stream.cover)
            formData.append('stream[viewers_limit]', this.stream.viewers_limit)

            if (this.digital_content.file) {
              formData.append(
                'stream[digital_content]',
                this.digital_content.file
              )

              formData.append(
                'stream[digital_content_name]',
                this.digital_content.file.name
              )
            }

            formData.append(
              'stream[account_ids]',
              this.stream.account_ids.join(',')
            )
            formData.append(
              'stream[collaborators]',
              JSON.stringify(this.stream.collaborators)
            )
            formData.append(
              'stream[creator_recoup_cost]',
              Math.round(this.stream.creator_recoup_cost * 100)
            )

            if (this.stream_assoc.value) {
              formData.append('stream[assoc_type]', this.stream_assoc.type)
              formData.append('stream[assoc_id]', this.stream_assoc.value.id)
            }

            this.$store.dispatch('error/showLoadingActivity', true)
            StreamService.createStream(formData)
              .then((response) => {
                this.$store.dispatch('error/showLoadingActivity', false)
                this.$store.dispatch('auth/setStream', response.body)
                this.$router.push({
                  path: `/user/${this.currentUser.slug}/video`,
                })
              })
              .catch((e) => {
                this.$store.dispatch('error/showLoadingActivity', false)
                this.$store.dispatch(
                  'error/showErrorToast',
                  e.body.errors || [e.body]
                )
              })
          } else {
            this.$store.dispatch('error/showErrorToast', [
              this.errors.items[0].msg,
            ])
          }
        })
        .catch((e) => {
          console.log('error', e)
        })
    },
  },
}
