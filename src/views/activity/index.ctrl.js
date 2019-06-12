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
        { id: 'reposts', title: 'Reposts' },
        { id: 'commented', title: 'Commented' },
        { id: 'followed', title: 'Followed' }
      ],
      page_index: 1,
      total_pages: 1,
      items_per_page: 8 * 1,
      activities: [],
      isPageReady: false,
    }
  },

  computed: {
    filtered_activities () {
      if (this.active_tab === 'reposts') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'repost' || item.action_type === 'unrepost'
        })
      }

      if (this.active_tab === 'commented') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'comment'
        })
      }

      if (this.active_tab === 'followed') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'follow' || item.action_type === 'unfollow'
        })
      }

      if (this.active_tab === 'released') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'release'
        })
      }

      if (this.active_tab === 'played') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'play'
        })
      }

      return this.activities
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'activity', tab: '' })
    this.loadActivities()
  },

  methods: {
    // filterSelected (index) {
    //   $('#filter_selector .btn__content').html(this.tabs[index].name + '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>')
    //   this.active_tab = this.tabs[index].id
    // },

    loadActivities() {
      console.log('loadActivities')
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        'page': this.page_index,
        'per_page': this.items_per_page
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
      this.active_tab = tab
    }
  },

  mounted () {
  }
}
