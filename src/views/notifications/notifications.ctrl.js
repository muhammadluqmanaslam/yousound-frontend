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
      page_index: 1,
      total_pages: 1,
      items_per_page: 8 * 1,
      filter: 'all',
      filters: [
        { id: 'all', name: 'All Activity' },
        { id: 'reposts', name: 'Reposts' },
        { id: 'commented', name: 'Commented' },
        { id: 'followed', name: 'Followed' },
        { id: 'played', name: 'Played' }
      ],
      activities: [],
      isPageReady: false,
    }
  },

  computed: {
    filtered_activities () {
      if (this.filter === 'reposts') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'repost' || item.action_type === 'unrepost'
        })
      }

      if (this.filter === 'commented') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'comment'
        })
      }

      if (this.filter === 'followed') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'follow' || item.action_type === 'unfollow'
        })
      }

      if (this.filter === 'released') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'release'
        })
      }

      if (this.filter === 'played') {
        return _.filter(this.activities, (item) => {
          return item.action_type === 'play'
        })
      }

      return this.activities
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'notifications', tab: '' })
    this.loadActivities()
  },

  methods: {
    filterSelected (index) {
      $('#filter_selector .btn__content').html(this.filters[index].name + '<i class="material-icons icon icon--right theme--dark">keyboard_arrow_down</i>')
      this.filter = this.filters[index].id
    },

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
        if (e.status === 401) {
        } else {
          this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
        }
      })
    },

    loadMore () {
      this.page_index += 1
      this.loadActivities()
    }
  },

  mounted () {
  }
}
