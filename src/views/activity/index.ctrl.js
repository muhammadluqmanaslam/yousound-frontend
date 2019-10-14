import _ from 'lodash'
// import { mapGetters } from 'vuex'
import ActivityService from '@/services/activity'
import activityItem from '@/components/activityitem'

export default {
  components: {
    activityItem
  },

  data () {
    return {
      active_tab: 'any',
      tabs: [
        { id: 'any', title: 'Everything' },
        { id: 'repost', title: 'Reposts' },
        { id: 'comment', title: 'Commented' },
        { id: 'follow', title: 'Followed' }
      ],
      page_index: 1,
      total_pages: 1,
      items_per_page: 8 * 1,
      activities: [],
      isPageReady: false,
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },

  methods: {
    // filterSelected (index) {
    //   $('#filter_selector .btn__content').html(this.tabs[index].name + '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>')
    //   this.active_tab = this.tabs[index].id
    // },

    isActiveTab(tab) {
      return this.active_tab == tab
    },

    loadActivities() {
      console.log('loadActivities')
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        page: this.page_index,
        per_page: this.items_per_page,
        action_types: this.active_tab
      }
      ActivityService.getActivities(params).then(response => {
        this.activities = this.activities.concat(response.body.activities)
        this.page_index = response.body.pagination.current_page
        this.total_pages = response.body.pagination.total_pages
        this.$store.dispatch('error/showLoadingActivity', false)
        this.isPageReady = true
      }).catch(e => {
        this.$store.dispatch('error/showLoadingActivity', false)
        this.isPageReady = true
        this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
      })
    },

    loadMore() {
      this.page_index += 1
      this.loadActivities()
    },

    onTab(tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab
      })
    },

    setTab(tab) {
      if (!tab)
        tab = 'any'

      this.active_tab = tab
      this.page_index = 1
      this.total_pages = 1
      this.activities = []
      this.$store.dispatch('navigator/goNextState', { page: 'activity', tab: tab })
      this.$nextTick(() => {
        this.loadActivities(this.activeTab, 1)
      })
    }
  },

  watch: {
    '$route' (toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    }
  },

  created () {
    const tab = this.$route.hash.substr(1)
    this.setTab(tab)
  }
}
