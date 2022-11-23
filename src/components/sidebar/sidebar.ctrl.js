import sideAudioPlayer from '@/components/sideAudioPlayer'
import sideAudioPlaceholder from '@/components/sideAudioPlaceholder'
import shareModal from '@/components/sharemodal'
import searchInput from '@/components/searchInput'
import {mapGetters, mapState} from 'vuex'
import AuthService from '@/services/auth'

export default {
  components: {
    sideAudioPlayer,
    sideAudioPlaceholder,
    shareModal,
    searchInput,
  },
  data() {
    return {
      mini: false,
      customActive: '',
      selectedTab: 1,
      searchActive: false,
      showRegisterModal: false,
      tabs: [
        {
          name: '',
          items: [
            {
              title: 'You',
              id: 'you',
              icon: 'circle',
              directPath: true,
              path: 'dashboard',
            },
            {
              title: 'Feed',
              id: 'feed',
              icon: 'home',
              path: 'Feed',
            },
            {
              title: 'Messages',
              id: 'notifications',
              icon: 'mode_comment',
              path: 'NotificationIndex',
            },
            {
              title: 'Cart',
              id: 'cart',
              icon: 'shopping_cart',
              path: 'Cart',
            },
            {
              title: 'Discover',
              id: 'music',
              icon: 'library_music',
              path: 'DiscoverIndex',
            },
            // {
            //   title: 'Sales',
            //   id: 'sales',
            //   icon: 'local_shipping',
            //   path: 'Sell',
            // },
            // {
            //   title: 'Upload',
            //   id: 'upload',
            //   icon: 'file_upload',
            //   path: 'UploadIndex',
            // },
            // {
            //   title: 'Manage',
            //   id: 'manage',
            //   icon: 'video_library',
            //   path: 'ManageIndex',
            // },
          ],
        },
        // {
        //   name: 'Discover',
        //   items: [
        //     {
        //       title: 'Video',
        //       id: 'video',
        //       icon: 'live_tv',
        //       path: 'VideoIndex',
        //     },
        //     {
        //       title: 'Music',
        //       id: 'music',
        //       icon: 'library_music',
        //       path: 'AlbumIndex',
        //     },
        //     {
        //       title: 'Shop',
        //       id: 'shop',
        //       icon: 'shopping_bag',
        //       path: 'ProductIndex',
        //     },
        //   ],
        // },
      ],
    }
  },
  watch: {
    mini(val) {
        // inform store of Mini's update
      this.$store.dispatch('app/toggleSideBarMini', val)
    },
    onMobile(val) {
      // trigger mini on mobile or screen width reduction
      if (!val) {
        this.mini = false
      } else {
        this.mini = true
      }
    },
    isAuthenticated: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.tabs = this.allTabs
        } else if (val) {
          this.tabs = this.allTabs

          // reset username
          this.setUsername()
        }
      },
    },
  },
  methods: {
    customActiveTab(subMenu) {
      let path = subMenu.path

      const currentRouteName = this.$route.name;
      const dashboardInherits = [
        'Dashboard',
        'Sell',
      ]

      const discoverInherits = [
        'AlbumIndex',
        'VideoIndex',
        'ProductIndex',
      ]

      // customization for Dashboard
      if (subMenu.path == 'dashboard' && dashboardInherits.includes(currentRouteName)) {
        path = 'Dashboard'

        return true
      }

      // customization for DiscoverIndex
      if (subMenu.path == 'DiscoverIndex' && discoverInherits.includes(currentRouteName)) {
        path = 'DiscoverIndex'
        return true
      }

      // return default config
      const active = this.$route.name === path;
      return active
    },
    menuAction(subMenu) {
      // redundant
      if (subMenu.id === 'activity') {
        // const status = this.$store.state.app.toggleActivity;

        // this.$store.dispatch('app/toggleActivityPopup', !status)
      } else if (subMenu.directPath) {
        this.$router.push(`/${subMenu.path}`)
      } else {
        this.$router.push({ name: subMenu.path })
      }
    },
    setUsername() {
        // this.tabs.forEach((parent) =>
        //   parent.items.forEach((item) => {
        //     if (item.id === 'you') {
        //       // item.path = this.username
        //       item.title = this.username.toUpperCase()
        //     }
        //   })
        // )
    },

    verifyUser(subMenu) {
      if (!(subMenu.id === 'music' || subMenu.id === 'subscribe')) {
        this.showRegisterModal = true
        this.$router.push({name: 'DiscoverIndex'})
      }
    },

    async isCreatorVerified() {
      if (AuthService.isAuthenticated()) {
        await AuthService.checkTokenValidation().then((response) => {
          if (response.body !== false) {
            AuthService.setUser(response.body)
          }
        })
      }
    },
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated',
      allTabs: 'app/tabs',
    }),
    ...mapState({
      sideBarWidth: state => state.app.sideBarWidth,
    }),
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    currentUser() {
      return this.$store.state.auth.user
    },
    username() {
      return this.$store.state.auth.user.slug
    },
    badge() {
      return this.$store.state.activity.badge
    },
  },
  mounted() {
    if (this.currentUser != null) {
      if ((this.currentUser.plan === "pro" && this.currentUser.creator_verified !== true) || this.currentUser.plan !== "pro") {
        this.tabs[0].items[0].path = "settings"
      }
      this.setUsername()
      if (this.onMobile) {
        this.mini = true
      }
    }
  },

  async created() {
    if (this.currentUser != null) {
      await this.isCreatorVerified()
      if (!this.currentUser.creator_verified) {
        this.tabs[0].items = this.tabs[0].items.filter(tab => tab.id !== "upload")
      }
    }
  },
}
