import cookiePolicyTab from './components/cookie_policy_tab'
import copyrightPolicyTab from './components/copyright_policy_tab'
import privacyChoiceTab from './components/privacy_choice_tab'
import privacyPolicyTab from './components/privacy_policy_tab'
import termsOfUseTab from './components/terms_of_use_tab'
import trademarkGuidelineTab from './components/trademark_guideline_tab'
import trademarkPolicyTab from './components/trademark_policy_tab'

export default {
  components: {
    cookiePolicyTab,
    copyrightPolicyTab,
    privacyChoiceTab,
    privacyPolicyTab,
    termsOfUseTab,
    trademarkGuidelineTab,
    trademarkPolicyTab
  },

  data () {
    return {
      tabs: [
        { id: 'terms_of_use', title: 'Terms of Use' },
        { id: 'privacy_policy', title: 'Privacy Policy' },
        { id: 'privacy_choice', title: 'Privacy Choices' },
        { id: 'copyright_policy', title: 'Copyright Policy (DMCA)' },
        { id: 'trademark_policy', title: 'Trademark Policy' },
        { id: 'trademark_guideline', title: 'Trademark Guidelines' },
        { id: 'cookie_policy', title: 'Cookie Policy' }
      ],
      currentTab: 'terms_of_use',
      isPageReady: false
    }
  },

  computed: {},

  // watch: {
  //   '$route' (toPath, fromPath) {
  //     console.log('list watch')
  //     console.log(toPath)
  //     console.log(fromPath)
  //   }
  // },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'terms', tab: this.currentTab })
    this.onTab(this.currentTab)
  },

  methods: {
    onTab (tab) {
      this.currentTab = tab
    }
  },

  mounted () {}
}
