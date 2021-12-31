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
      daysFilter: 7,
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
              breakdown: [
                {
                  title: 'All',
                  value: 'all',
                  series: [{
                    name: 'series-1',
                    data: [0, 30, 45, 70, 80, 60, 30, 45, 10, 0, 0, 0],
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
      ],
      tabFilterOptions: [
        {
          title: 'All Time', value: 0,
        },
        {
          title: 'Last 2 Days', value: 2,
        },
        {
          title: 'Last 7 Days', value: 7,
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
          value: 'name',
        },
        {
          text: 'New Visitors',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Album Page Visited',
          align: 'left',
          sortable: false,
          value: 'name',
        },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%'
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%'
        }
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
      this.selectedInnerTab = inner
      this.selectedChart = inner.tabs[0].breakdown[0]
      this.activeInnerTab = inner.tabs[0].id
      this.activeChart = inner.tabs[0].breakdown[0].value
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
      this.activeChart = tab.value
      this.selectedChart = tab
    },
    getChartDetails(action) {
      this.activeInnerTab = action.id
      this.selectedInnerTab = action

      // For Menus that do not have further inner tab selection
      if (this.showChartHeader.indexOf(this.activeTab) < 0) {
        this.setActiveChart(action.breakdown[0])
      }
    },
  },

  created() {
    // device inital chart
    // change default from activeInnerTab: '' above
    const innerTab = this.getInnerTab()
    const initSelection = innerTab.find((f) => f.id === this.activeInnerTab)
    this.getChartDetails(initSelection)

    this.selectedChart = this.selectedInnerTab.breakdown[0]
    this.activeChart = this.selectedInnerTab.breakdown[0].value
  },
}
