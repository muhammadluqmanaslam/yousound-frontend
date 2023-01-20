import * as UpChunk from '@mux/upchunk'
import AuthService from '@/services/auth'
import MeService from '@/services/me'
import PaymentService from '@/services/payment'
import VideoService from '@/services/video'
import UserService from '@/services/user'
import AlbumService from '@/services/album'
import ProductService from '@/services/product'
import Attach from './components/attach'
import PaymentModal from '@/components/paymentmodal'
import DigitalUploader from './components/digital_uploader'
import contentTopHeader from '@/components/contentTopHeader'
import dragFileUploader from '@/components/dragFileUploader'
import topbarNotification from '@/components/topbarNotification'
import BannerUpload from '../BannerUpload'
import IconImage from '../../assets/video-icon.svg'
import BannerImage from '../../assets/music-drop.gif'

import {
  VideoGenres,
  VideoTypes,
  Filter,
  // StreamHourlyPrice,
  StreamViewPrices,
  StreamViewersLimits,
  StreamCosts,
} from '@/helper'

export default {
  components: {
    BannerUpload ,
    Attach,
    PaymentModal,
    DigitalUploader,
    contentTopHeader,
    dragFileUploader,
    topbarNotification,
  },

  data() {
    return {
      loading: false,
      iconImage: IconImage,
      bannerImage: BannerImage,
      topBarContent: 'Connect your Stripe account to start accepting payments',
      activeTab: 'video',
      tabs: [
        { id: 'upload', title: 'Upload', isParent: true, path: 'UploadIndex' },
        { id: 'music', title: 'Music', path: 'UploadAlbum' },
        { id: 'video', title: 'Video', path: 'VideoUpload' },
        { id: 'product', title: 'Product', path: 'AddProduct' },
        { id: 'live', title: 'Broadcast Live', path: 'CreateLive' },
      ],
      submitLoading: false,
      albums: [],
      products: [],
      VideoTypes: VideoTypes,
      video_type: VideoTypes.UPLOADED,
      terms: false,
      view_prices: StreamViewPrices,
      viewers_limits: StreamViewersLimits,
      costs: StreamCosts,
      streamCost: 1000,
      profit_share_types: [],
      duration: 100,
      // periods: [],
      // period: 3600,
      // genres: [],
      video: {},
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
        id: null,
        type: null
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
      videoFile: null,
      video_upload_successfully: false,
      videoUrl: null,
      genre_name: null,
      selectedStream: null,
    }
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    mergedAttachmentItems() {
      const combined = [...this.albums, ...this.products]
      console.log('combined: ', combined);
      return combined
    },
    videoFileName() {
      return this.videoFile[0].name || null
    },
    currentUser() {
      return this.$store.state.auth.user
    },

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
  created() {
    if (this.onMobile) {
      this.$router.push({name: "UploadIndex"})
    }

    this.getAttachmentItems()

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
    chooseAssoc(item) {
      this.stream_assoc.id = item.id
      if (item.album_type === 'album') {
        this.stream_assoc.type = 'Album'
      } else {
        this.stream_assoc.type = 'ShopProduct'
      }
    },

    isActiveTab(tab) {
      return this.activeTab === tab
    },
    onTab(tab) {
      if (tab.path) {
        this.$router.push({name: tab.path})
      }
    },
    getAttachmentItems() {
      Promise.all([
        AlbumService.getAlbums({
          statuses: 'published, collaborated',
          user_statuses: 'accepted',
        }),
        ProductService.getProducts({
          statuses: 'published, collaborated',
          stock_statuses: 'active',
          user_statuses: 'accepted',
        }),
      ])
        .then((values) => {
          this.albums = values[0].body
          this.products = values[1].body
        })
        .catch((reason) => {
          console.log(reason)
          // this.$store.dispatch('error/showErrorToast', [reason])
        })
    },

    async pickedFile(file) {
      const video = await this.validateDuration(file)
      UserService.uploadStreamLimit(this.currentUser.id).then((response) => {
        if (response.status == 200) {
          const duration = video.duration/60
          const plan = this.currentUser.plan
          const video_duration_limit = plan === "pro" ? 180 : 120

          if (duration > video_duration_limit) {
            this.videoFile = null;
            this.$store.dispatch('error/showErrorToast', [
              `You cannot upload file which have more than ${video_duration_limit} minutes duration`,
            ])
          } else {
            this.videoFile = file
          }
        }
      }).catch((e) => {
        this.videoFile = null
        this.$store.dispatch('error/showErrorToast', [
          `Your stream limit has been exceeded.`,
        ])
      })

    },

    async validateDuration(file) {
      return new Promise((resolve, reject) => {
        try {
          let video = document.createElement('video')
          video.preload = 'metadata'

          video.onloadedmetadata = async function () {
            resolve(this)
          }

          video.onerror = function () {
            reject("Invalid video. Please select a video file.")
          }

          video.src = window.URL.createObjectURL(file[0])
        } catch (e) {
          reject(e)
        }
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

    onCopy: function (e) {
      this.$store.dispatch("error/showSuccessToast", [
        "You just copied: " + e.text,
      ]);
      // alert('You just copied: ' + e.text)
    },

    onError: function (e) {
      this.$store.dispatch("error/showErrorToast", ["Failed to copy link"]);
      // alert('Failed to copy link')
    },

    submit() {
      this.$validator
        .validateAll()
        .then((response) => {
          if (response === true) {
            this.loading = true
            this.submitLoading = true;

            const formData = new FormData()
            formData.append('stream[name]', this.stream.name)
            formData.append('stream[description]', this.stream.description)
            formData.append('stream[genre_id]', this.stream.genre_id)
            formData.append('stream[view_price]', this.stream.view_price)
            formData.append('stream[valid_period]', this.period)
            formData.append('stream[cover]', this.stream.cover)
            formData.append('stream[viewers_limit]', this.stream.viewers_limit)
            formData.append('stream[duration]', this.duration)

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
            if (this.stream_assoc.id && this.selectedStream) {
              formData.append('stream[assoc_type]', this.stream_assoc.type)
              formData.append('stream[assoc_id]', this.stream_assoc.id)
            }

            this.$store.dispatch('error/showLoadingActivity', true)
            VideoService.createVideo(formData)
              .then((response) => {
                this.genre_name = response.body.genre.name
                this.video = response.body

                const upload_url = this.video.upload_url

                const upload = UpChunk.createUpload({
                  endpoint: upload_url,
                  file: this.videoFile[0],
                  chunkSize: 5120, // Uploads the file in ~5mb chunks
                })

                upload.on('error', (err) => {
                  this.loading = false
                  this.$store.dispatch('error/showLoadingActivity', false)
                  console.error('💥', err.detail)
                })

                upload.on('progress', (progress) => {
                  this.$store.commit(
                    'error/setProgressBarValue',
                    parseInt(progress.detail)
                  )
                })

                upload.on('success', () => {
                  this.loading = false
                  this.video_upload_successfully = true
                  this.$store.dispatch('error/showLoadingActivity', false)
                  console.log("Wrap it up, we're done here. 👋")
                  this.videoUrl = window.location.origin + `/video/${this.video.id}/show`
                  // this.$router.push({ path: `/video/${this.video.id}/show` })
                })
              })
              .catch((e) => {
                this.loading = false
                console.log(e)
                console.log(e.message)
                this.$store.dispatch('error/showLoadingActivity', false)
                this.$store.dispatch(
                  'error/showErrorToast',
                  e.message || e.body.errors || [e.body]
                )

                this.submitLoading = false
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
    deleteAttachedVideo() {
      // remove prev. emmited video file
      this.videoFile = null

      // delete uploaded file form input in child component
      this.$nextTick(() => this.$refs.dragFileUploader.deleteAttachedVideo())
    },
  },
}
