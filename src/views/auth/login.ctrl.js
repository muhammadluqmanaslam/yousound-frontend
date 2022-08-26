import ActivityService from '@/services/activity.js'
import AuthService from '@/services/auth.js'
import { mapGetters } from 'vuex'
import PlaylistService from '@/services/playlist'

import { MyEvents } from '@/helper'

import LoginInput from "./loginInput"

export default {
  components: {
    LoginInput
  },

  data() {
    return {
      remember: false,
    }
  },

  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
}
