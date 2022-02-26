// import Login from '../login'
// import ArtistRegister from '../register_by_artist'
// import AttendeeRegister from '../register_by_attendee'
// import BrandRegister from '../register_by_brand'
// import LabelRegister from '../register_by_label'
// import RegisterAs from '@/views/auth/register_as'
import ListenerRegister from '../register_by_listener'
import InviteRegister from '@/views/auth/register_by_invited'
import UserTag from '@/components/user_tag'

// import ArtistRegister from '@/views/auth/register_by_artist'
// import LabelRegister from '@/views/auth/register_by_label'
// import BrandRegister from '@/views/auth/register_by_brand'

export default {
  components: {
    // Login,
    // ArtistRegister,
    // AttendeeRegister,
    // BrandRegister,
    // LabelRegister,
    // RegisterAs,
    ListenerRegister,
    InviteRegister,
    UserTag,
  },

  data() {
    return {
      sideLists: [],
      register_success: false,
      activeTab: 'everyone',
      inviter: {},
      inviter2: {
        id: 46,
        slug: 'ruckazoid',
        username: 'ruckazoid',
        display_name: 'RUCKAZOID',
        user_type: 'artist',
        avatar: {
          'url': 'https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/46/2c6737ff-37a1-4f37-b982-c5c082484baa.gif',
          'thumb': {
            'url': 'https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/46/thumb_2c6737ff-37a1-4f37-b982-c5c082484baa.gif'
          },
        },
        status: 'active',
        stripe_connected: true,
      },
      inviteMode: false,
    }
  },
  watch: {
    activeTab(val) {
      switch (val) {
        case 'everyone':
          this.sideLists = this.everyOneContent
          break
        case 'artistBrand':
          this.sideLists = this.artistBrand
          break

        default:
          break
      }
    },
  },
  methods: {
    setInviteMode(data) {
      this.activeTab = 'artistBrand'
      this.inviter = data
      this.inviteMode = true
    },
  },
  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    onMediumScreen() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    everyOneContent() {
      const sideContent = [
        {
          title: 'Create Playlists.',
          content: 'Discover music from a world of verified artists.',
        },
        {
          title: 'Shop Artists & Brands.',
          content: 'Get exclusive drops and products.',
        },
        {
          title: 'Build Your Community.',
          content: 'Chat & comment on live videos, albums and products.',
        },
        {
          title: 'Get Paid to Share.',
          content: 'Make money sharing your favorite albums, videos, and products.',
        },
      ]
      return sideContent
    },
    artistBrand() {
      const sideContent = [
        {
          title: 'Multiple Revenue Streams.',
          content: 'Get paid from video/music streams & products.',
        },
        {
          title: 'Sell Digital & Physical.',
          content: 'Keep 90% of your digital & physical sales.',
        },
        {
          title: 'Share Your Albums & Videos.',
          content: 'Upload videos, albums & broadcast live.',
        },
        {
          title: 'Collaborate With Creators.',
          content: 'Receive direct payouts from sales, add recoups & splits.',
        },
      ]
      return sideContent
    },

  },
  created() {
    console.log(this.$route)
  },
}
