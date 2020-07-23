import _ from 'lodash'
import AdminService from '@/services/admin'
import SettingService from '@/services/setting'

export default {
  components: {},

  data() {
    return {
      settings: {
        disable_sign_up: false,
        disable_live_video: false,
        disable_verification: false,
        disable_merch_upload: false,
      },
      message: '',
      isPageReady: false,
    }
  },

  computed: {},

  methods: {
    loadSettings() {
      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      SettingService.getSettings()
        .then((response) => {
          this.isPageReady = true
          this.$store.dispatch('error/showLoadingActivity', false)
          _.assignIn(this.settings, response.body)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    updateSetting(key) {
      const params = {
        key: key,
        value: (!this.settings[key]).toString(),
      }
      console.log(params)
      SettingService.updateSetting(params).then((response) => {
        this.settings[key] = !this.settings[key]
        // console.log(key, this.settings.disable_sign_up, this.settings[key])
      })
    },

    sendGlobalMessage() {
      this.message = this.message.trim()
      if (this.message == '') return

      const params = {
        message: this.message,
      }
      AdminService.sendGlobalMessage(params).then((response) => {
        this.message = ''
      })
    },
  },

  created() {
    this.loadSettings()
  },

  mounted() {},
}
