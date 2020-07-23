/* global $:true */

import teamTab from './components/team_tab'
import productTab from './components/product_tab'
import timelineTab from './components/timeline_tab'
import successTab from './components/success_tab'
import opportunityTab from './components/opportunity_tab'
import featuresTab from './components/features_tab'

export default {
  components: {
    teamTab,
    productTab,
    timelineTab,
    successTab,
    opportunityTab,
    featuresTab,
  },

  data() {
    return {
      tabs: [
        { id: 'team', title: 'Team' },
        { id: 'product', title: 'Product' },
        { id: 'timeline', title: 'Timeline' },
        { id: 'success', title: 'Success' },
        { id: 'opportunity', title: 'Opportunity' },
        { id: 'features', title: 'Features' },
      ],
      active_tab: 'team',
      isPageReady: false,
    }
  },

  methods: {
    onTab(tab) {
      this.active_tab = tab
      this.$nextTick(() => {
        $(window).scrollTop(0)
      })
    },
  },

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'overview',
      tab: this.active_tab,
    })
    this.onTab(this.active_tab)
  },
}
