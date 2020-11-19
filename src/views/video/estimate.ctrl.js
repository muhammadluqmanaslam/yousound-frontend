export default {
  data() {
    return {
      active_tab: 'info',
      isPageReady: true,
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },

    isStreamRunning() {
      return !this._.isNil(this.currentUser.stream)
    },

    tabs() {
      return this.isStreamRunning
        ? [
            { id: 'info', title: 'Info & Pricing' },
            { id: 'edit', title: 'Broadcast Details', path: '/edit' },
            { id: 'manage', title: 'Live Stream', disabled: true },
          ]
        : [
            { id: 'info', title: 'Info & Pricing' },
            { id: 'create', title: 'Broadcast Details', path: '/create' },
            { id: 'manage', title: 'Live Stream', path: '', disabled: true },
          ]
    },
  },

  methods: {
    onTab(tab) {
      if (tab.id === this.active_tab) return

      this.$router.push({
        path: `/user/${this.currentUser.slug}/video${tab.path}`,
      })
    },
  },
}
