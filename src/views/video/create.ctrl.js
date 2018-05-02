import _ from 'lodash'
import { MediaLiveInputTypes, MediaLiveInputCodecs, MediaLiveInputResolutions, MediaLiveInputMaximumBitrates } from '@/helper'

import StreamService from  '@/services/stream'

export default {
  components: {
  },

  data () {
    return {
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
  },

  methods: {
    submit () {
      this.$validator.validateAll().then(response => {
        if (response === true) {
          this.$store.dispatch('error/showLoadingActivity', true)
          let params = {
            stream: this.stream
          }
          StreamService.createStream(params).then(response => {
            this.$store.dispatch('error/showLoadingActivity', false)
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
