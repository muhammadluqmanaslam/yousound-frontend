import _ from 'lodash'
import { MediaLiveInputTypes, MediaLiveInputCodecs, MediaLiveInputResolutions, MediaLiveInputMaximumBitrates } from '@/helper'

import StreamService from  '@/services/stream'

export default {
  components: {
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
    }
  },

  // watch: {
  //   '$route' (toPath, fromPath) {
  //   }
  // },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'video', tab: '' })
    for (let i = 1; i <= 12; i++) {
      this.hours.push({
        id: i,
        name: `${i}hours / $${i * 5}`
      })
    }
  },

  methods: {
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
