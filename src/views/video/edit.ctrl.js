import MeService from '@/services/me'
import StreamService from '@/services/stream'
import { StreamViewPrices, StreamViewersLimits } from '@/helper'

export default {
  data() {
    return {
      active_tab: 'edit',
      tabs: [
        { id: 'info', title: 'Intro', path: '/info' },
        { id: 'edit', title: 'Details', path: '/edit' },
        { id: 'manage', title: 'Live Stream', path: '' },
      ],
      stream: null,
      view_prices: StreamViewPrices,
      viewers_limits: StreamViewersLimits,
      users: [],
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
    // console.log('video/edit', this.currentStream)

    this.$store.dispatch('navigator/goNextState', {
      page: 'broadcast',
      tab: 'edit',
    })

    this.isPageReady = false
    this.$store.dispatch('error/showLoadingActivity', true)

    this.cloneStream(this.currentStream)
    console.log(this.currentStream, this.stream)

    var params = {
      stripe_connected: true,
      page: 1,
      per_page: 30,
    }
    Promise.all([MeService.mutualUsers(params)])
      .then((values) => {
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
      this.stream['account_ids'] = []
      ;(stream.account_ids || []).forEach((id) => {
        const account_id = parseInt(id)
        if (account_id !== this.currentUser.id) {
          this.stream.account_ids.push(account_id)
        }
      })
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
