import _ from 'lodash'
import { MediaLiveInputTypes, MediaLiveInputCodecs, MediaLiveInputResolutions, MediaLiveInputMaximumBitrates } from '@/helper'

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
  }
}
