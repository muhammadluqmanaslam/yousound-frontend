import ActivityService from '@/services/activity'
import AlbumService from '@/services/album'
import activityItem from '@/components/activityitem'

export default {
  components: {
    activityItem
  },

  data () {
    return {
      tabs: [
        {
          id: 'reposted_by',
          title: 'Reposted By'
        },
        {
          id: 'downloaded_by',
          title: 'Downloaded By'
        },
        {
          id: 'played_by',
          title: 'Played By'
        }
      ],
      currentTab: null,
      slug: null,
      album: null,
      activities: [],
      isPageReady: false
    }
  },

  computed: {
  },

  watch: {
    '$route' (toPath, fromPath) {
      const tab = toPath.hash.substr(1)
      const slug = toPath.params.slug
      this.init(slug, tab)
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'album_stats', tab: this.currentTab })
    const slug = this.$route.params.slug
    const tab = this.$route.hash.substr(1)
    this.init(slug, tab)
  },

  methods: {
    init (slug, tab) {
      // this.currentTab = tab || 'reposted_by'
      // let apis = null
      // switch (this.currentTab) {
      //   case 'reposted_by':
      //     apis = [
      //       AlbumService.getAlbum(slug),
      //       ActivityService.repostedBy(slug)
      //     ]
      //     break
      //   case 'downloaded_by':
      //     apis = [
      //       AlbumService.getAlbum(slug),
      //       ActivityService.downloadedBy(slug)
      //     ]
      //     break
      //   case 'played_by':
      //     apis = [
      //       AlbumService.getAlbum(slug),
      //       ActivityService.playedBy(slug)
      //     ]
      //     break
      // }
      // this.isPageReady = false
      // this.$store.dispatch('error/showLoadingActivity', true)
      // Promise.all(apis).then(values => {
      //   this.album = values[0].body
      //   this.activities = values[1].body.activities
      //   this.isPageReady = true
      //   this.$store.dispatch('error/showLoadingActivity', false)
      // }).catch(reason => {
      //   this.$store.dispatch('error/showLoadingActivity', false)
      // })

      this.currentTab = tab || 'reposted_by'
      const params = { action_type: 'repost'}
      switch (this.currentTab) {
        case 'reposted_by':
          params['action_type'] = 'repost'
          break
        case 'downloaded_by':
          params['action_type'] = 'download'
          break
        case 'played_by':
          params['action_type'] = 'play'
          break
      }

      this.isPageReady = false
      this.$store.dispatch('error/showLoadingActivity', true)
      Promise.all([
        AlbumService.getAlbum(slug),
        ActivityService.getAlbumActivities(slug, params)
      ]).then(values => {
        this.album = values[0].body
        this.activities = values[1].body.activities
        this.isPageReady = true
        this.$store.dispatch('error/showLoadingActivity', false)
      }).catch(reason => {
        this.$store.dispatch('error/showLoadingActivity', false)
      })
    },

    onTab (tab) {
      if (tab != this.currentTab) {
        this.$router.push({
          path: this.$route.path,
          hash: tab
        })
      }
    }
  },

  mounted () {
  }
}
