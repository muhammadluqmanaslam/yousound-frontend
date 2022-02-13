import _ from 'lodash'
// import { mapGetters } from 'vuex'
import ActivityService from '@/services/activity'
import activityItem from '@/components/activityitem'
import InvitationService from '@/services/invitation'
import contentTopHeader from '@/components/contentTopHeader'
import userTag from '@/components/user_tag'

export default {
  components: {
    activityItem,
    contentTopHeader,
    userTag,
  },

  data() {
    return {
      loading: true,
      show_invite_dialog: false,
      link_copied: false,
      youLogo: require('../../../static/images/nav_logo_white_mini.png'),
      active_tab: 'any',
      tabs: [
        { id: 'any', title: 'Everything' },
        { id: 'repost', title: 'Reposts' },
        { id: 'comment', title: 'Commented' },
        { id: 'follow', title: 'Followed' },
      ],
      page_index: 1,
      total_pages: 1,
      items_per_page: 8 * 1,
      activities: [],
      isPageReady: false,
    }
  },

  watch: {
    show_invite_dialog(val) {
      if (val === true) {
        this.link_copied = false
      }
    },
    activities(val) {
      console.log('activities:', val)
    },
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },

  methods: {
    isActiveTab(tab) {
      return this.active_tab == tab
    },

    loadActivities() {
      this.loading = true
      const params = {
        page: this.page_index,
        per_page: this.items_per_page,
        action_types: this.active_tab,
      }

      console.log('params:', params)
      ActivityService.getActivities(params)
        .then((response) => {
          console.log(response)
          this.activities = this.activities.concat(response.body.activities)
          this.page_index = response.body.pagination.current_page
          this.total_pages = response.body.pagination.total_pages
          this.loading = false
          this.isPageReady = true
        })
        .catch((e) => {
          this.loading = false
          this.isPageReady = true
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
    loadMore() {
      this.page_index += 1
      this.loadActivities()
    },
    setTab(tab) {
      if (!tab) {
        tab = 'any'
      }
      this.page_index = 1
      this.total_pages = 1
      // this.activities = []
      this.$store.dispatch('navigator/goNextState', {
        page: 'activity',
        tab: tab,
      })
      this.$nextTick(() => {
        this.loadActivities(this.activeTab, 1)
      })
    },
    createInvitation() {
      InvitationService.createInvitation()
        .then((res) => {
          // console.log('createInvitation', res.body)
          this.$copyText(res.body.url)
          this.link_copied = true
        })
        .catch((err) => console.log(err))
    },
  },

  created() {
    const tab = this.$route.hash.substr(1)
    this.setTab(tab)
  },
}
