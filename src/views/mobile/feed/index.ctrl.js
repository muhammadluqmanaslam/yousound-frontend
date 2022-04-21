import AuthService from '@/services/auth'
import SearchService from '@/services/search'
import UserService from '@/services/user'
import CommentService from '@/services/comment'
import MeService from "@/services/me";
import StreamService from '@/services/stream'

import trackCard from '@/components/trackcard'
import productCard from '@/components/productcard'
import timeline from '../components/timeline/timeline'
import contentTopHeader from '@/components/contentTopHeader'
import postThought from '@/components/thought'
import TabNav from '../components/tab_nav.vue'
import UserTag from '@/components/user_tag'
import AttachPicker from '@/views/video/components/attach_picker'

export default {
  components: {
    trackCard,
    productCard,
    timeline,
    contentTopHeader,
    postThought,
    TabNav,
    UserTag,
    AttachPicker,
  },

  data() {
    return {
      allAttachments: [],
      truncAttachment: [],
      show_attach_picker: false,
      stream_assoc: {},
      activeTab: '',
      thought: '',
      allowAttachmentReply: false,
      thoughtMaxChar: 300,
      isPostThoughtActive: false,
      activeDiscover: 'any',
      tabs: [
        { id: 'any', title: 'All' },
        { id: 'uploaded', title: 'Music' },
        { id: 'video', title: 'Video' },
        { id: 'merch', title: 'Products' },
        { id: '', title: 'Thought' },
        // { id: 'reposted', title: 'Reposts' },
        // { id: 'playlist', title: 'Playlists' },
      ],
      show_help_dialog: false,
      init_PostThought: false,
      page_index: 1,
      total_pages: 1,
      items_per_page: 10,
      users: [],
      isPageReady: false,
    }
  },

  computed: {
    attachUser() {
      switch (this.stream_assoc.type) {
        case 'ShopProduct':
          return this.stream_assoc.value.merchant.username;
        default:
          return this.stream_assoc.value.user.username;
      }
    },
    attachCover() {
      switch (this.stream_assoc.type) {
        case 'ShopProduct':
          return this.stream_assoc.value.covers[0].cover.thumb.url
        case 'Album':
        case 'Video':
          return this.stream_assoc.value.cover.thumb.url
        default:
          break;
      }
    },
    charCount() {
      return this.thought.length
    },
    currentUser() {
      return this.$store.state.auth.user
    },
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },

  watch: {
    $route(toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      this.setTab(tab)
    },
    users(val) {
      console.log(val)
    }
  },

  created() {
    this.getAttachments();

    if (!this.currentUser) {
      AuthService.clearTokenAndUserInfo()
      this.$router.push({ path: '/login' })
      return
    }

    // if (this.currentUser.data['stream_page_visited'] !== 1) {
    //   this.openHelpDialog()
    // }

    const tab = this.$route.hash.substr(1)
    this.setTab(tab)
  },

  methods: {
    removeAttach() {
      this.stream_assoc = {}
    },
    selectAttachment(assoc) {
      this.stream_assoc = {
        type: this.getAttachmentType(assoc),
        value: assoc
      }

      console.log(this.stream_assoc)
    },
    closeAttachPicker() {
      this.show_attach_picker = false;
      this.$emit("input", this.stream_assoc);
    },
    getBGUrl(attachment) {
      if (attachment.merchant && Object.keys(attachment.merchant).length) {
        return attachment.covers[0].cover.thumb.url;
      } else {
        return attachment.cover.thumb.url;
      }
    },
    getCustomClass(attachment) {
      if (attachment.album_type && attachment.album_type === 'album') {
        return "attach_album"
      } else if (attachment.video_type) {
        return "attach_video"
      } else if (attachment.merchant && Object.keys(attachment.merchant).length) {
        return "attach_product"
      }
    },
    getAttachmentType(attachment) {
      if (attachment.album_type && attachment.album_type === 'album') {
        return "Album"
      } else if (attachment.video_type) {
        return "Video"
      } else if (attachment.merchant && Object.keys(attachment.merchant).length) {
        return "ShopProduct"
      }
    },
    shuffleData(arr) {
      // let arr = [1,2,3]
      let newArr = []
      let allIdx = arr.length-1, currentIdx

      while(allIdx > -1) {
        currentIdx = Math.floor(Math.random() * arr.length)
        newArr[allIdx] = arr[currentIdx]
        allIdx--
      }

      return newArr
    },
    getAttachments() {
      const vid_params = {
        genre_id: 0,
        only_follows: false,
        page: 1,
        per_page: 10,
      }

      Promise.all([
        MeService.videoAttachAlbums(),
        MeService.videoAttachProducts(),
        StreamService.getStreams(vid_params) // take further appro. look at data from backend
      ])
      .then((values)=> {
        // flatten all array values into one and shuffle data
        this.allAttachments = this.shuffleData(values.map((result) => {
          // detect videos streams
          if (Array.isArray(result.body.streams)) return result.body.streams
          return result.body
        }).flat())

        this.truncAttachment = this.allAttachments.slice(0,12)
      }).catch((error) => {
        console.log(error)
        console.log(error.message)
      })
    },
    closePostThought() {
      this.init_PostThought = false;
    },
    tabClicked(data) {
        this.activeDiscover = data.id
        this.activeTab = data.id
        console.log(data);
    },
    postThoughtActive() {
      // trigger child component (post thought) modal
      // this.$refs.postThought.initPostThought()
      this.isPostThoughtActive = true;
    },
    isActiveTab(tab) {
      return this.activeTab === tab
    },
    loadFeeds(filter) {
      this.$store.dispatch('error/showLoadingActivity', true)
      const params = {
        filter: filter,
        page: this.page_index,
        per_page: this.items_per_page,
      }
      SearchService.searchStreamV2(params)
        .then((response) => {
          this.users = this.users.concat(response.body.users)
          this.page_index = response.body.pagination.current_page
          this.total_pages = response.body.pagination.total_pages

          this.isPageReady = true
          this.$store.dispatch('error/showLoadingActivity', false)
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    loadMore() {
      this.page_index += 1
      this.loadFeeds(this.activeTab)
    },

    openHelpDialog() {
      this.show_help_dialog = true
    },

    closeHelpDialog() {
      console.log(1);
      this.show_help_dialog = false
      const params = {
        user: {
          stream_page_visited: 1,
        },
      }
    },

    onTab(tab) {
      this.$router.push({
        path: this.$route.path,
        hash: tab,
      })
    },

    setTab(tab) {
      if (!tab) {
        tab = 'any'
      }

      this.isPageReady = false
      this.users = []
      this.page_index = 1
      this.activeTab = tab
      this.$store.dispatch('navigator/goNextState', { page: 'feed', tab: tab })
      this.loadFeeds(tab)
    },
  },

  mounted() {},
}
