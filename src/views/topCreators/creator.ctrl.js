import dashboardNav from '@/components/dashboardnav'
import TrackingService from '@/services/tracking'

export default {
    components: {
      dashboardNav,
    },
  
    data() {
      return {
        showDownloadModal: false,
        pageReady: false,
        top_creators: [],
      }
    },

    methods: {
     async getDashboardStats() {
        await TrackingService.getDashboardStats()
          .then((response) => {
            this.top_creators = response.body
          })
          .catch((exception) => {
            console.log(exception)
          })
      },
    },

    async created() {
      await this.getDashboardStats()
      this.pageReady = true
    },
}