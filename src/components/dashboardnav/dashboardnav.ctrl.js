
import contentTopHeader from '@/components/contentTopHeader'
import AuthService from '@/services/auth'
import { MyEvents } from '@/helper'

export default {
  props: {
    name: String,
  },
  components: {
    contentTopHeader,
  },
  data() {
    return {
      activeTab: '',
      daysFilter: 7,
      tabs: [
        { id: 'dashboard', title: 'Dashboard', pathName: 'Dashboard', icon: require('../../../static/images/edit-curves.svg') },
          { id: 'activity', title: 'Activity', pathName: 'ActivityIndex', icon: require('../../../static/images/grid-interface.svg') },
        { id: 'sales', title: 'Sales', pathName: 'Sell', icon: require('../../../static/images/delivery.svg') },
        { id: 'manage', title: 'Manage', pathName: 'ManageIndex', icon: require('../../../static/images/file-copies.svg') },
        { id: 'payments', title: 'Payments', pathName: 'PaymentIndex', icon: require('../../../static/images/credit-card.svg') },
        { id: 'settings', title: 'Settings', pathName: 'UserSettings', icon: require('../../../static/images/settings-gear.svg') },
      ],
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },

  methods: {
    isActiveTab(tab) {
      return this.name === tab
    },
    isActiveInnerTab(tab) {
      return this.activeInnerTab === tab
    },
    signOut() {
      AuthService.signout()
      this.$router.push({ path: '/login' })
      this.$root.$emit(MyEvents.AUTH_SIGNOUT)
    },
    setTab(pathName) {
      this.$router.push({ name: pathName })
    },
  },

  created() {
    this.activeTab = this.name
  },
}
