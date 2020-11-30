const durationTable = [
  // [sec, val, step],
  [10, 0, 0],
  [60, 50, 1.0],
  [300, 74, 10.0],
  [600, 84, 30.0],
  [3600, 134, 60.0],
  [7200, 146, 300.0],
  [43200, 186, 900.0],
]

const viewersTable = [
  [0, 0, 0],
  [5000, 50, 100],
  [10000, 60, 500],
  [50000, 100, 1000],
  [100000, 110, 5000],
  [1000000, 200, 10000],
  [10000000, 290, 100000],
]

const MaxDuration = durationTable[durationTable.length - 1][0]
const MaxViewers = viewersTable[viewersTable.length - 1][0]

const editTabs = [
  { id: 'info', title: 'Info & Pricing' },
  { id: 'edit', title: 'Broadcast Details', path: '/edit' },
  { id: 'manage', title: 'Live Stream', path: '' },
]
const createTabs = [
  { id: 'info', title: 'Info & Pricing' },
  { id: 'create', title: 'Broadcast Details', path: '/create' },
  { id: 'manage', title: 'Live Stream', path: '', disabled: true },
]

const STREAM_PER_VIEWER_MINUTE_PRICE = 0.26
const ENCODING_PER_MINUTE_PRICE = 14.0

export default {
  data() {
    return {
      active_tab: 'info',
      duration: 0,
      durationDetail: {
        hour: 0,
        min: 0,
        sec: 0,
      },
      durationMirror: 0,
      durationFlag: false,
      viewers: 0,
      viewersMirror: 0,
      viewersFlag: false,
      percentage: '30',
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

    totalPrice() {
      return (
        ((ENCODING_PER_MINUTE_PRICE +
          (this.viewers *
            STREAM_PER_VIEWER_MINUTE_PRICE *
            parseInt(this.percentage)) /
            100.0) *
          this.duration) /
        60
      )
    },

    tabs() {
      return this.isStreamRunning ? editTabs : createTabs
    },
  },

  created() {
    this.$store.dispatch('navigator/goNextState', {
      page: 'broadcast',
      tab: 'info',
    })
  },

  methods: {
    onTab(tab) {
      if (tab.id === this.active_tab) return

      this.$router.push({
        path: `/user/${this.currentUser.slug}/video${tab.path}`,
      })
    },

    handleDurationDetailChange(e) {
      this.durationFlag = true
      this.duration2detail(
        parseInt(this.durationDetail.hour) * 3600 +
          parseInt(this.durationDetail.min) * 60 +
          parseInt(this.durationDetail.sec)
      )
      this.durationMirror = this.sec2val(this.duration)
      this.$nextTick(() => {
        this.durationFlag = false
      })
    },

    handleDurationMirrorChange(e) {
      // console.log('handleDruationMirroChange', e, this.durationFlag)
      if (!this.durationFlag) {
        this.duration2detail(this.mirror2sec(this.durationMirror))
      }
    },

    duration2detail(val) {
      if (val > MaxDuration) {
        val = MaxDuration
      }
      val = parseInt(val)
      this.duration = val

      const hour = parseInt(val / 3600)
      val = val - hour * 3600
      const min = parseInt(val / 60)
      const sec = val - min * 60
      this.durationDetail = { hour, min, sec }
    },

    mirror2sec(val) {
      const index = this._.findIndex(durationTable, (item) => item[1] > val)
      if (index === 0) {
        return 0
      }
      if (index === -1) {
        return durationTable[durationTable.length - 1][0]
      }
      const preItem = durationTable[index - 1]
      const curItem = durationTable[index]
      return preItem[0] + (val - preItem[1]) * curItem[2]
    },

    sec2val(sec) {
      const index = this._.findIndex(durationTable, (item) => item[0] > sec)
      if (index === 0) {
        return 0
      }
      if (index === -1) {
        return durationTable[durationTable.length - 1][1]
      }
      const preItem = durationTable[index - 1]
      const curItem = durationTable[index]
      return preItem[1] + (sec - preItem[0]) / curItem[2]
    },

    handleViewersMirrorChange() {
      if (!this.viewersFlag) {
        this.viewers = this.mirror2real(this.viewersMirror)
      }
    },

    handleViewersChange() {
      this.viewersFlag = true
      this.viewers = parseInt(this.viewers)
      if (this.viewers < 0) {
        this.viewers = 0
      }
      if (this.viewers > MaxViewers) {
        this.viewers = MaxViewers
      }
      this.viewersMirror = this.real2mirror(this.viewers)
      this.$nextTick(() => {
        this.durationFlag = false
      })
    },

    mirror2real(val) {
      const index = this._.findIndex(viewersTable, (item) => item[1] > val)
      if (index === 0) {
        return 0
      }
      if (index === -1) {
        return viewersTable[viewersTable.length - 1][0]
      }
      const preItem = viewersTable[index - 1]
      const curItem = viewersTable[index]
      return preItem[0] + (val - preItem[1]) * curItem[2]
    },

    real2mirror(val) {
      const index = this._.findIndex(viewersTable, (item) => item[0] > val)
      if (index === 0) {
        return 0
      }
      if (index === -1) {
        return viewersTable[viewersTable.length - 1][1]
      }
      const preItem = viewersTable[index - 1]
      const curItem = viewersTable[index]
      return preItem[1] + (val - preItem[0]) / curItem[2]
    },
  },
}
