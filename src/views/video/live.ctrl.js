import contentTopHeader from '@/components/contentTopHeader'
import paymentModal from '@/components/paymentmodal'
import BannerUpload from '../BannerUpload'
import IconImage from '../../assets/broadcase-icon.svg'
import BannerImage from '../../assets/live-drop.gif'

export default {
  components: {
    paymentModal,
    contentTopHeader,
    BannerUpload
  },

  props: {},

  data() {
    return {
      iconImage: IconImage,
      bannerImage: BannerImage,
      hour: 1,
      showPaymentModal: false,
      selected: {
        plan: {},
        hour: null,
      },
      plans: [
        {
          title: 'Basic',
          viewersLimit: 100,
          price: 10,
          benefits: [
            '100 concurrent viewer limit',
            // 'Unused time rolls over',
          ],
          id: 'basic',
          selectedHour: 1,
        },
        {
          title: 'Plus',
          viewersLimit: 500,
          price: 40,
          benefits: [
            '500 concurrent viewer limit',
            // 'Unused time rolls over',
          ],
          id: 'plus',
          selectedHour: 1,
        },
        {
          title: 'Pro',
          viewersLimit: 1000,
          price: 75,
          benefits: [
            '1,000 concurrent viewer limit',
            // 'Unused time rolls over',
          ],
          id: 'pro',
          selectedHour: 1,
        },
      ],
      activeTab: 'live',
      tabs: [
        { id: 'upload', title: 'Upload', isParent: true, path: 'UploadIndex' },
        { id: 'music', title: 'Music', path: 'UploadAlbum' },
        { id: 'video', title: 'Video', path: 'VideoUpload' },
        { id: 'product', title: 'Product', path: 'AddProduct' },
        { id: 'live', title: 'Broadcast Live', path: 'CreateLive' },
      ],
      learnMoreActive: false,
    }
  },

  computed: {
    hasFree_stream_seconds() {
      return this.currentUser.free_stream_seconds !== undefined && this.currentUser.free_stream_seconds > 0
    },
    currentUser() {
      let user = this.$store.state.auth.user
      // user.free_stream_seconds = 0 // test
      return user
    },
    hours() {
      const num = Array.from({ length: 24 }, (_, i) => ({ value: i + 1, title: i + 1 + ' Hour' }))
      return num
    },
    payable() {
      const payable = this.selected.plan.price * this.selected.plan.selectedHour
      return payable
    },
  },

  created() { },

  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },
    onTab(tab) {
      if (tab.path) {
        this.$router.push({name: tab.path})
      }
    },
    getPayable(plan) {
      this.selected.plan = plan
      this.openPaymentDialog()
    },
    openPaymentDialog() {
      this.showPaymentModal = true
    },

    closePaymentDialog() {
      this.showPaymentModal = false
    },

    proceedToUpload() {
      this.$router.push({ name: "VideoCreate" })
    },
  },

  mounted() {
    console.log(this.user)
  },
}
