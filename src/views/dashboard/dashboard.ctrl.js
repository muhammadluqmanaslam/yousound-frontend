import contentTopHeader from '@/components/contentTopHeader'
import dashboardNav from '@/components/dashboardnav'
import chart from 'vue-apexcharts'

export default {
  components: {
    contentTopHeader,
    dashboardNav,
    chart,
  },
  data() {
    return {
      activeTab: 'overview',
      activeInnerTab: 'earnings',
      activeChart: '',
      selectedInnerTab: {},
      selectedChart: {},
      daysFilter: 0,
      tabs: [
        { id: 'overview', title: 'Overview'},
        { id: 'music', title: 'Music'},
        { id: 'videos', title: 'Videos'},
        { id: 'products', title: 'Products'},
        { id: 'repostRequests', title: 'Repost Requests'},
        { id: 'topCreator', title: 'Top 10 Creators'},
      ],
      innerTabs: [
        {
          parent: 'overview',
          tabs: [
            {
              id: 'earnings',
              title: 'Earnings',
              value: 1000,
              size: 'custom',
              breakdown: [
                {
                  title: 'All',
                  value: 'all',
                  series: [{
                    name: 'series-1',
                    data: [0, 10, 45, 50, 80, 60, 70, 45, 10, 0, 0, 0],
                  }],
                },
                {
                  title: 'Sales',
                  value: 'sales',
                  series: [{
                    name: 'series-1',
                    data: [30, 40, 45, 50, 49, 60, 70, 81, 0, 0, 0, 0],
                  }],
                },
                {
                  title: 'Donations',
                  value: 'donations',
                  series: [{
                    name: 'series-1',
                    data: [30, 40, 45, 50, 70, 81, 49, 60, 0, 0],
                  }],
                },
                {
                  title: 'Repost Request',
                  value: 'repostRequest',
                  series: [{
                    name: 'series-1',
                    data: [30, 40, 0, 50, 49, 60, 70, 81, 0, 0, 0, 0],
                  }],
                },
              ],
            },
            { id: 'followers', title: 'Followers', value: 2000, size: 'custom' },
            { id: 'shares', title: 'Shares', value: 3000, size: 'custom' },
            { id: 'comments', title: 'Comments', value: 4000, size: 'custom' },
            { id: 'reposts', title: 'Reposts', value: 5000, size: 'custom' },
            { id: 'subscriptionRevenue', title: 'Subscription Revenue', value: 6000, size: 4 },
            { id: 'subscribersList', title: 'Subscribers List', value: 7000, size: 4 },
            { id: 'adRevenue', title: 'Ad Revenue', value: 8000, size: 4 },
          ],
        },
        {
          parent: 'music',
          header: 'Plays',
          tabs: [
            {
              id: 'listening',
              title: 'Listening Now',
              value: 1000,
              size: 'custom',
              breakdown: null,
            },
            { id: 'followers', title: 'Followers', value: 2000, size: 'custom' },
            { id: 'shares', title: 'Shares', value: 3000, size: 'custom' },
            { id: 'comments', title: 'Comments', value: 4000, size: 'custom' },
            { id: 'reposts', title: 'Reposts', value: 5000, size: 'custom' },
            { id: 'subscriptionRevenue', title: 'Subscription Revenue', value: 6000, size: 4 },
            { id: 'subscribersList', title: 'Subscribers List', value: 7000, size: 4 },
            { id: 'adRevenue', title: 'Ad Revenue', value: 8000, size: 4 },
          ],
        },
        {
          parent: 'videos',
          header: 'Watching Now',
          tabs: [
            {
              id: 'watching',
              title: 'watching Now',
              value: 28392,
              size: 'custom',
              breakdown: null,
            },
            {
              id: 'views',
              title: 'Views',
              value: 12000,
              size: 'custom',
              breakdown: [
                {
                  title: 'All',
                  value: 'all',
                  series: [{
                    name: 'series-1',
                    data: [10, 30, 45, 70, 80, 60, 30, 45, 10, 0, 0, 0],
                  }],
                },
              ],
            },
            { id: 'pageViews',
              title: 'Page Views',
              value: 13000,
              size: 'custom',
              breakdown: [
                {
                  title: 'All',
                  value: 'all',
                  series: [{
                    name: 'series-1',
                    data: [20, 30, 45, 70, 80, 60, 30, 45, 10, 0, 0, 0],
                  }],
                },
              ] },
            { id: 'avgWatchTime',
              title: 'Average Watch Time',
              value: '2:59',
              size: 'custom',
              breakdown: null,
            },
            { id: 'uploads',
              title: 'Uploads',
              value: 20,
              size: 'custom',
              breakdown: [
                {
                  title: 'All',
                  value: 'all',
                  series: [{
                    name: 'series-1',
                    data: [40, 30, 45, 70, 80, 60, 30, 45, 10, 0, 0, 0],
                  }],
                },
              ] },
            { id: 'avgCompletionRate',
              title: 'Average Completion Rate',
              value: '30%',
              size: 'custom',
              breakdown: null,
            },
            { id: 'shares',
              title: 'Shares',
              value: 345678932,
              size: 'custom',
              breakdown: [
                {
                  title: 'All',
                  value: 'all',
                  series: [{
                    name: 'series-1',
                    data: [60, 30, 45, 70, 80, 60, 30, 45, 10, 0, 0, 0],
                  }],
                },
              ] },
            { id: 'reposts',
              title: 'Reposts',
              value: 43456554345,
              size: 'custom',
              breakdown: [
                {
                  title: 'All',
                  value: 'all',
                  series: [{
                    name: 'series-1',
                    data: [70, 30, 45, 70, 80, 60, 30, 45, 10, 0, 0, 0],
                  }],
                },
              ] },
            { id: 'comments',
              title: 'Comments',
              value: 18000,
              size: 'custom',
              breakdown: [
                {
                  title: 'All',
                  value: 'all',
                  series: [{
                    name: 'series-1',
                    data: [80, 30, 45, 70, 80, 60, 30, 45, 10, 0, 0, 0],
                  }],
                },
              ] },
            { id: 'hides',
              title: 'Hides',
              value: 420,
              size: 'custom',
              breakdown: [
                {
                  title: 'All',
                  value: 'all',
                  series: [{
                    name: 'series-1',
                    data: [0, 30, 45, 70, 80, 60, 30, 45, 10, 0, 0, 0],
                  }],
                },
              ] },
          ],
        },
      ],
      tabFilterOptions: [
        {
          title: 'All Time', value: 0,
        },
        {
          title: 'Today', value: 1,
        },
        {
          title: 'Month', value: 2,
        },
        {
          title: 'Year', value: 3,
        },
      ],
      chartOptions: {
        chart: {
          id: 'own-id',
          zoom: {
            enabled: false,
          },
        },
        xaxis: {
          type: 'category',
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
      },
      pieSeries: [44, 55, 41, 17, 15],
      pieChartOptions: {
        chart: {
          type: 'donut',
        },
        labels: ["Country A", "Country B", "Country C", "Country D", "Country E"],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 100,
            },
            legend: {
              position: 'bottom',
            },
          },
        }],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: !false,
          position: 'bottom',
        },
        plotOptions: {
          pie: {
            customScale: 0.7,
            donut: {
              size: '80%',
            },
          },
        },
      },
      summaryTabs: [
        {
          parent: 'overview',
          tabs: null,
        },
        {
          parent: 'music',
          tabs: [
            {
              header: 'Top Albums',
              avatarType: 'square',
              data: [],
            },
            {
              header: 'Plays by Countries',
              type: 'pie',
              data: [],
            },
            {
              header: 'Top Listeners',
              avatarType: 'round',
              data: [],
            },
          ],
        },
        {
          parent: 'videos',
          tabs: [
            {
              header: 'Top Videos',
              avatarType: 'square',
              data: [],
            },
            {
              header: 'Plays by Countries',
              type: 'pie',
              data: [],
            },
            {
              header: 'Top Viewers',
              avatarType: 'round',
              data: [],
            },
          ],
        },
        {
          parent: 'products',
          tabs: [
            {
              header: 'Top Products',
              data: [],
            },
            {
              header: 'Top Countriess',
              data: [],
            },
            {
              header: 'Top Customers',
              data: [],
            },
          ],
          headers: [
            {
              text: 'External Traffic Source',
              align: 'left',
              sortable: false,
              value: 'name',
            },
            {
              text: 'Visits',
              align: 'left',
              sortable: false,
              value: 'visits',
            },
            {
              text: 'New Visitors',
              align: 'left',
              sortable: false,
              value: 'newVisitors',
            },
            {
              text: 'Product Page Visited',
              align: 'left',
              sortable: false,
              value: 'videoPageVisited',
            },
          ],
        },
        {
          parent: 'repostRequests',
          tabs: null,
          headers: [
            {
              text: 'Content you reposted',
              align: 'left',
              sortable: false,
              value: 'contentReposted',
            },
            {
              text: 'Reposted By',
              align: 'left',
              sortable: false,
              value: 'repostedBy',
            },
            {
              text: 'Plays/View',
              align: 'left',
              sortable: false,
              value: 'playView',
            },
            {
              text: 'User Reached',
              align: 'left',
              sortable: false,
              value: 'albumPageVisited',
            },
            {
              text: 'You Received',
              align: 'left',
              sortable: false,
              value: 'amountReceived',
            },
          ],
        },
        {
          parent: 'topCreator',
          tabs: null,
          headers: [
            {
              text: 'Top 10 Creators',
              align: 'left',
              sortable: false,
              value: 'name',
            },
            {
              text: "You’ve played/viewed",
              align: 'left',
              sortable: false,
              value: 'visits',
            },
            {
              text: 'Subscription Share',
              align: 'left',
              sortable: false,
              value: 'subscriptionShare',
            },
            {
              text: 'Album Page Visited',
              align: 'left',
              sortable: false,
              value: 'albumPageVisited',
            },
          ],
        },
      ],
      headers: [
        {
          text: 'External Traffic Source',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Visits',
          align: 'left',
          sortable: false,
          value: 'visits',
        },
        {
          text: 'New Visitors',
          align: 'left',
          sortable: false,
          value: 'newVisitors',
        },
        {
          text: 'Album Page Visited',
          align: 'left',
          sortable: false,
          value: 'albumPageVisited',
        },
      ],
      desserts: [
        {
          name: 'google.com',
          visits: 159000,
          newVisitors: '40%',
          albumPageVisited: '1000',
        },
        {
          name: 'google.com',
          visits: 237000,
          newVisitors: '40%',
          albumPageVisited: '1000',
        },
        {
          name: 'google.com',
          visits: 262000,
          newVisitors: '60%',
          albumPageVisited: '7000',
        },
        {
          name: 'google.com',
          visits: 305000,
          newVisitors: '40%',
          albumPageVisited: '8000',
        },
        {
          name: 'google.com',
          visits: 356000,
          newVisitors: '30%',
          albumPageVisited: '16000',
        },
        {
          name: 'google.com',
          visits: 375000,
          newVisitors: '00%',
          albumPageVisited: '0000',
        },
        {
          name: 'google.com',
          visits: 392000,
          newVisitors: '100%',
          albumPageVisited: '2000',
        },
        {
          name: 'google.com',
          visits: 408000,
          newVisitors: '60%',
          albumPageVisited: '45000',
        },
        {
          name: 'google.com',
          visits: 452000,
          newVisitors: '40%',
          albumPageVisited: '22000',
        },
        {
          name: 'google.com',
          visits: 518000,
          newVisitors: '10%',
          albumPageVisited: '6000',
        },
      ],
    }
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
    showChartHeader() {
      return ['overview', 'products']
    },
  },

  watch: {
    activeTab(val) {
      // find and select first index of breakdown on menu change
      const inner = this.innerTabs.find((inner) => inner.parent === val)
      const action = inner.tabs[0]

      this.activeInnerTab = action.id
      if (action.breakdown) {
        this.selectedChart = action.breakdown[0] || null
        this.activeChart = action.breakdown[0].value
      } else {
        this.selectedChart = action.breakdown
        this.activeChart = 'all'
      }
      this.setChartDetails(action)
    },
  },

  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },
    isActiveInnerTab(tab) {
      return this.activeInnerTab === tab
    },
    isActiveChart(tab) {
      return this.activeChart === tab
    },
    setInnerMenuTabs(filter) {
      const selected = this.tabs.find((f) => f.id === filter)
      this.activeTab = selected.id
    },
    getInnerTab() {
      const inner = this.innerTabs.find((inner) => inner.parent === this.activeTab)
      return inner.tabs
    },
    setActiveChart(tab) {
      this.selectedChart = tab
      if (tab == null) return
      this.activeChart = tab.value
    },
    setChartDetails(action) {
      this.activeInnerTab = action.id
      this.selectedInnerTab = action

      // For Menus that do not have further inner tab selection
      if (this.showChartHeader.indexOf(this.activeTab) < 0) {
        // Just select first item in breakdown series
        if (action.breakdown) {
          this.setActiveChart(action.breakdown[0])
        } else {
          this.setActiveChart(action.breakdown)
        }
      }

      // this.setActiveChart(action.breakdown[0])
    },
    getsummaryTabs() {
      const tab = this.activeTab
      const col = this.summaryTabs.find((col) => col.parent === tab)

      return col.tabs || null
    },
  },

  created() {
    // device inital chart
    // change default from activeInnerTab: '' above
    const innerTab = this.getInnerTab()
    const initSelection = innerTab.find((f) => f.id === this.activeInnerTab)
    this.setChartDetails(initSelection)

    this.selectedChart = this.selectedInnerTab.breakdown[0]
    this.activeChart = this.selectedInnerTab.breakdown[0].value
  },
}
