import StreamService from '@/services/stream'
import { StreamViewPrices, StreamViewersLimits } from '@/helper'

export default {
  data() {
    return {
      active_tab: 'edit',
      tabs: [
        { id: 'info', title: 'Info & Pricing', path: '/info' },
        { id: 'edit', title: 'Broadcast Details', path: '/edit' },
        { id: 'manage', title: 'Live Stream', path: '' },
      ],
      stream: null,
      view_prices: StreamViewPrices,
      viewers_limits: StreamViewersLimits,
      isPageReady: false,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    currentStream() {
      return this.currentUser.stream
    },

    stream_cover_url() {
      return this._.get(this.currentStream, 'cover.url', '')
    },
  },

  // watch: {
  //   currentStream(val) {
  //     console.log('currentStream', val)
  //   },
  // },

  created() {
    console.log('video/edit', this.currentStream)
    this.cloneStream(this.currentStream)
  },

  methods: {
    onTab(tab) {
      if (tab.id === this.active_tab) return

      this.$router.push({
        path: `/user/${this.currentUser.slug}/video${tab.path}`,
      })
    },

    cloneStream(stream) {
      console.log('cloneStream', stream)
      this.stream = this._.pick(stream, [
        'id',
        'name',
        'viewers_limit',
        'view_price',
        'genre',
      ])
      this.isPageReady = true
    },

    submit() {
      this.$validator
        .validateAll()
        .then((response) => {
          if (response === true) {
            // const formData = new FormData()
            // formData.append('stream[name]', this.stream.name)
            // formData.append('stream[view_price]', this.stream.view_price)
            // formData.append('stream[viwers_limit]', this.stream.viewers_limit)
            // formData.append('stream[genre_id]', this.stream.genre_id)
            // formData.append('stream[cover]', this.stream.cover)

            const params = {
              stream: {
                name: this.stream.name,
                view_price: this.stream.view_price,
                viewers_limit: this.stream.viewers_limit,
              },
            }

            this.$store.dispatch('error/showLoadingActivity', true)
            // StreamService.createStream(formData)
            StreamService.updateStream(this.stream.id, params)
              .then((response) => {
                this.$store.dispatch('error/showLoadingActivity', false)
                this.$store.dispatch('auth/setStream', response.body)
                // this.$router.push({
                //   path: `/user/${this.currentUser.slug}/video`,
                // })
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
