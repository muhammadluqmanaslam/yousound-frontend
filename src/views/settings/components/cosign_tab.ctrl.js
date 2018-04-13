import _ from 'lodash'
import UserService from '@/services/user'

export default {
  data () {
    return {
      users: [],
      isPageRedy: false
    }
  },

  created () {
    this.isPageReady = true
    // this.$store.dispatch('error/showLoadingActivity', true)
  },

  methods: {
    coSigned () {
      console.log('co-signed')
    }
  }
}