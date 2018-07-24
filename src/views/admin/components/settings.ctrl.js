import _ from 'lodash'
import SettingService from '@/services/setting'

export default {
  components: {
  },

  data () {
    return {
      settings: {
        disable_sign_up: false,
        disable_live_video: false,
        disable_merch_upload: false
      },
      isPageReady: false
    }
  },

  computed: {
  },

  created () {
    this.loadSettings()
  },

  methods: {
    loadSettings () {
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      SettingService.getSettings().then(response => {
        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
        _.assignIn(this.settings, response.body)
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    updateSetting (key) {
      const params = {
        key: key,
        value: (!this.settings[key]).toString()
      }
      console.log(params)
      SettingService.updateSetting(params).then(response => {
        this.settings[key] = !this.settings[key]
        // console.log(key, this.settings.disable_sign_up, this.settings[key])
      })
    }
  },

  mounted () {
  }
}
