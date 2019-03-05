/* global $:true */

import communityGuidelinesTab from './components/community_guidelines_tab'
import cookiePolicyTab from './components/cookie_policy_tab'
import copyrightPolicyTab from './components/copyright_policy_tab'
import privacyChoiceTab from './components/privacy_choice_tab'
import privacyPolicyTab from './components/privacy_policy_tab'
import termsOfUseTab from './components/terms_of_use_tab'
import gdprTab from './components/gdpr_tab'
import trademarkPolicyTab from './components/trademark_policy_tab'
import SampleClearanceTab from './components/sample_clearance_tab'

export default {
  components: {
    communityGuidelinesTab,
    cookiePolicyTab,
    copyrightPolicyTab,
    privacyChoiceTab,
    privacyPolicyTab,
    termsOfUseTab,
    gdprTab,
    trademarkPolicyTab,
    SampleClearanceTab
  },

  data () {
    return {
      tabs: [
        { id: 'terms_of_use', title: 'Terms of Service' },
        { id: 'community_guidelines', title: 'Community Guidlines' },
        { id: 'privacy_policy', title: 'Privacy Policy' },
        { id: 'privacy_choice', title: 'Privacy Choices' },
        { id: 'copyright_policy', title: 'Copyright Policy (DMCA)' },
        { id: 'trademark_policy', title: 'Trademark Policy' },
        { id: 'gdpr', title: 'GDPR' },
        { id: 'cookie_policy', title: 'Cookie Policy' },
        { id: 'sample_clearance', title: 'Sample Clearance License' }
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
      this.$nextTick(() => { $(window).scrollTop(0) })
    }
  },

  mounted () {}
}
