import _ from 'lodash'
import Vue from 'vue'

const state = {
  toggleActivity: false,
  settings: {},
  genres: [],
  product_categories: [],
  public_relations_user: {},
  sideBarMini: false,
  sideBarWidth: 280,
  countries: [],
  cities: [],
  activation: {
    current: 1,
    accountCategory: 'creator',
  },
  onboarding: {
    current: 1,
    accountCategory: '',
    accountType: '',
    username: '',
    profileImage: '',
    fullName: '',
    email: '',
    password: '',
    ageRange: '',
    country: '',
    city: '',
    socialChannel: '',
    socialHandle: '',
  },
  globalSMSactive: false,
  windowsWidth: null,
  plansData: [
    {
      title: "Basic",
      list: ["1 account", "Ad-free music & video", "Upload 1 hour per video *", `Charge up to <b>$100</b> per repost`, "Basic analytics"],
      active: false,
      price: "10",
      id: "basic",
      stripePriceId: process.env.BASIC_PRICE_ID,
    },
    {
      title: "Creators",
      list: [
        `<b>All features for everyone +</b>`,
        "User-centric subscription share",
        "Keep 100% of sales",
        "SMS text your followers*",
        "Unlimited uploads",
        "Batch audio uploads",
        "Collaborative payment splits",
        "Live video pay-per-view",
        "Live video exclusive content",
      ],
      active: true,
      price: "30",
      id: "plus",
      stripePriceId: process.env.PLUS_PRICE_ID,
    },
    {
      title: "Advanced",
      list: [
        `<b>All features for creators +</b>`,
        "Advanced analytics",
        [
          "Content performance",
          "Listeners/buyers by country",
          "External traffic location",
          "Average listening/watch time",
          "Page views",
          "Watching/listening now",
          "Product conversion %",
          "Repost request data",
        ],
      ],
      active: false,
      price: "100",
      id: "pro",
      stripePriceId: process.env.PRO_PRICE_ID,
    },
  ],
}

const getters = {
  isiOS: () => {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return true
    }
  },
  isAndroid: () => {
    let useragent = navigator.userAgent.toLowerCase();
    let isAndroid = useragent.indexOf("android") > -1;
    if (isAndroid) {
      return true
    }
  },
  getWindowsWidth: (state) => state.windowsWidth,
  onMobileStrict: (state) => {
    const { windowsWidth } = state
    if (windowsWidth < 768) {
      return true
    }
    return false
  },
  onTabletStrict: (state) => {
    const { windowsWidth } = state
    if (windowsWidth > 767 && windowsWidth < 1024) {
      return true
    }
    return false
  },
  onTabletAndAbove: (state) => {
    const { windowsWidth } = state
    if (windowsWidth > 767) {
      return true
    }
    return false
  },
  onTabletAndBelow: (state) => {
    const { windowsWidth } = state
    if (windowsWidth <= 1024) {
      return true
    }
    return false
  },
  globalSMSactive: (state) => state.globalSMSactive,
  tabs: () => {
    const tabs = [
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
            title: 'Upload',
            id: 'upload',
            icon: require('@/assets/direct_upload.svg'),
            path: 'UploadIndex',
            allowedUser: ['artist'],
          },
          {
            title: 'Discover',
            id: 'music',
            icon: require('@/assets/ic_wave.svg'),
            path: 'DiscoverIndex',
          },
          {
            title: 'Collection',
            id: 'collection',
            icon: require('@/assets/ic_collection.svg'),
            path: 'CollectionIndex',
          },
          // {
          //   title: 'Activity',
          //   id: 'activity',
          //   icon: require('../../../static/images/ic_alarm.svg'),
          //   path: 'ActivityIndex',
          // },
          // {
          //   title: 'Feed',
          //   id: 'feed',
          //   icon: require('../../../static/images/home.svg'),
          //   path: 'Feed',
          // },
          {
            title: 'Messages',
            id: 'notifications',
            icon: require('../../../static/images/messages.svg'),
            path: 'NotificationIndex',
          },
          {
            title: 'Cart',
            id: 'cart',
            icon: require('../../../static/images/cart.svg'),
            path: 'Cart',
          },
          // {
          //   title: 'Sales',
          //   id: 'sales',
          //   icon: 'local_shipping',
          //   path: 'Sell',
          //   allowedUser: ['artist'],
          // },
          // {
          //   title: 'Manage',
          //   id: 'manage',
          //   icon: 'video_library',
          //   path: 'ManageIndex',
          // },
        ],
      },
    ]

    return tabs
  },
  accordions: () => {
    const accordions = [
      {
        title: 'How much does it cost?',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      },
      {
        title: 'How often do I pay for my repost price?',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      },
      {
        title: 'Can I change my price any time?',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      },
      {
        title: 'How many followers should I have?',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      },
      {
        title: 'How long do my accepted reposts last for ?',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      },
      {
        title: 'How much should I charge?',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      },
    ]

    return accordions
  },
  disabledLiveVideo: (state) => {
    return _.get(state.settings, 'disable_live_video', false)
  },
  disabledVerification: (state) => {
    return _.get(state.settings, 'disable_verification', false)
  },
  digitalCategoryIds: (state) => {
    // return _.chain(state.product_categories).find((c) => (c.name === 'Digital Product')).get('id', null).value()
    return _.chain(state.product_categories)
      .filter((c) => c.is_digital)
      .map('id')
      .value()
  },
  reminderTracksCount: (state) => {
    return _.get(state.settings, 'reminder_tracks_count', 5)
  },
  onboardingStages: (state, getters) => {
    if (state.onboarding.accountCategory === 'listener') {
      return getters.onboardingListenerStages
    } else if (state.onboarding.accountCategory === 'creator') {
      return getters.onboardingCreatorStages
    } else {
      return [{
        title: 'What Are You?',
        stage: 1,
      }]
    }
  },
  onboardingListenerStages() {
    const stages = [
      {
        title: 'What Are You?',
        stage: 1,
      },
      {
        title: 'Profile Image',
        stage: 2,
      },
      {
        title: 'Account Info',
        stage: 3,
      },
      {
        title: 'Age & Location',
        stage: 4,
      },
      {
        title: 'Check Email',
        stage: 5,
      },
    ]
    return stages
  },
  onboardingCreatorStages() {
    const stages = [
      {
        title: 'What Are You?',
        stage: 1,
      },
      {
        title: 'Artist or Brand',
        stage: 2,
      },
      {
        title: 'Profile Image',
        stage: 3,
      },
      {
        title: 'Account Info',
        stage: 4,
      },
      {
        title: 'Age & Location',
        stage: 5,
      },
      {
        title: 'Let\'s get verified',
        stage: 6,
      },
      {
        title: 'Plans',
        stage: 7,
        hideStage: true,
        allowFullPage: true,
      },
      {
        title: 'Check Email',
        stage: 8,
        hideStagerBar: true,
      },
    ]
    return stages
  },
  onboardingCurrentStage(state, getters) {
    const current = getters.onboardingStages.find((stage) => stage.stage === state.onboarding.current) || {}

    return current
  },
  activationStages: (state, getters) => {
    if (state.activation.accountCategory === 'listener') {
      return getters.activationListenerStages
    } else if (state.activation.accountCategory === 'creator') {
      return getters.activationCreatorStages
    } else {
      return [{
        title: 'Your account is activated!',
        stage: 1,
      }]
    }
  },
  activationListenerStages() {
    const stages = [
      {
        title: 'Profile Image',
        stage: 2,
      },
      {
        title: 'Account Info',
        stage: 3,
      },
      {
        title: 'Age & Location',
        stage: 4,
      },
      {
        title: 'Check Email',
        stage: 5,
      },
    ]
    return stages
  },
  activationCreatorStages() {
    const stages = [
      {
        stage: 1,
        title: 'Your account is activated!',
        subtitle: 'Lets get you familiar <br /> with YouSound',
        color: '#F3452E',
        cta1: {
          title: 'Let\'s go!',
          action: 'next',
          color: '#000000',
        },
        cta2: {
          title: 'Skip',
          action: 'Dashboard',
          color: 'transparent',
        },
        image: require('../../assets/activate1.svg'),
      },
      {
        stage: 2,
        title: 'What is <br> YouSound?',
        subtitle: 'YouSound is a platform for artists & brands to easily share their content, build community & make a livable income',
        color: '#3971DE',
        image: require('../../assets/activate2.svg'),
      },
      {
        stage: 3,
        title: 'Upload all of your content',
        subtitle: 'YouSound is powered by verified creators that can upload all of their music, videos, products & broadcast live.',
        color: '#BF9D45',
        image: require('../../assets/activate3.svg'),
      },
      {
        stage: 4,
        title: 'User-centric streaming',
        subtitle: '<b>10k</b> combined streams from <b>5,000</b> users on other platforms earns <b class="highlight">$25</b>. On YouSound 10 creators can earn <b class="highlight">$2,500</b> per month.',
        color: '#323343',
        image: require('../../assets/activate4.svg'),
      },
      {
        stage: 5,
        title: 'Connect direct <br /> with SMS text',
        subtitle: 'When people follow you they can opt-in to get SMS texts. Bypass the algorithms & contact your valued supporters directly.',
        color: '#474CB5',
        image: require('../../assets/activate5.svg'),
      },
      {
        stage: 6,
        title: 'Get paid <br /> to share',
        subtitle: 'You can send & receive direct messages requesting to share content.  Subscribers can set their price to earn money.',
        color: '#439846',
        image: require('../../assets/activate6.svg'),
      },
      {
        stage: 7,
        title: 'Join the <br /> creative revival',
        subtitle: 'Tell your fans to subscribe & make sure you choose a plan to unlock all of the PRO features',
        color: '#D8EDF0',
        cta1: {
          title: 'Choose subscription',
          action: '',
          color: '#FF472E',
        },
        cta2: {
          title: 'Not yet, take me to the app',
          action: '',
          color: '#FF472E',
        },
        image: require('../../assets/activate7.svg'),
        isDark: true,
      },
    ]
    return stages
  },
  activationCurrentStage(state, getters) {
    const current = getters.activationStages.find((stage) => stage.stage === state.activation.current) || {}

    return current
  },
}

const actions = {
  toggleGlobalSMS({ commit }, status) {
    commit('toggleGlobalSMS', status)
  },
  toggleActivityPopup({ commit }, status) {
    commit('toggleActivityPopup', status)
  },
  setSettings({ commit }, settings) {
    commit('setSettings', settings)
  },

  setGenres({ commit }, genres) {
    commit('setGenres', genres)
  },

  setProductCategories({ commit }, categories) {
    commit('setProductCategories', categories)
  },

  setPublicRelationsUser({ commit }, user) {
    commit('setPublicRelationsUser', user)
  },
  toggleSideBarMini({ commit }, status) {
    commit('toggleSideBarMini', status)
  },
  getCountries({ commit }, data) {
    return Vue.http.get("https://countriesnow.space/api/v0.1/countries")
      .then((response) => commit('setCountries', response.data.data))
      .catch((err) => err)
  },
  getCities(context, country) {
    const getCountry = context.state.countries.find(c => c.country === country)
    context.commit('setCities', getCountry.cities)
  },
  nextOnboardingStage({ commit }, stage) {
    commit('gotoNextOnboarding', stage)
  },
  prevOnboardingStage({ commit }, stage) {
    commit('gotoPrevOnboarding', stage)
  },
  nextActivationStage({ commit }, stage) {
    commit('gotoNextActivation', stage)
  },
  prevActivationStage({ commit }, stage) {
    commit('gotoPrevActivation', stage)
  },
  setWindowsWidth({ commit }, width) {
    commit('setWindowsWidth', width)
  },
}

const mutations = {
  setSettings(state, settings) {
    state.settings = settings
  },

  setGenres(state, genres) {
    state.genres = genres
  },

  setProductCategories(state, categories) {
    state.product_categories = categories
  },

  setPublicRelationsUser(state, user) {
    state.public_relations_user = user
  },

  toggleSideBarMini(state, status) {
    state.sideBarMini = status
  },
  setCountries(state, data) {
    state.countries = data
  },
  setCities(state, data) {
    state.cities = data
  },
  gotoNextOnboarding(state, stage) {
    state.onboarding.current = stage
  },
  gotoPrevOnboarding(state, stage) {
    state.onboarding.current = stage
  },
  updateOnboarding(state, options) {
    const optionKeys = Object.keys(options)

    // find in onboarding, keys that are being updated
    for (let i = 0; i < optionKeys.length; i++) {
      const element = optionKeys[i];

      if (Object.hasOwnProperty.call(state.onboarding, element)) {
        state.onboarding[element] = options[element]
      }
    }
  },
  gotoNextActivation(state, stage) {
    state.activation.current = stage
  },
  gotoPrevActivation(state, stage) {
    state.activation.current = stage
  },
  updateActivation(state, options) {
    const optionKeys = Object.keys(options)

    // find in activation, keys that are being updated
    for (let i = 0; i < optionKeys.length; i++) {
      const element = optionKeys[i];

      if (Object.hasOwnProperty.call(state.activation, element)) {
        state.activation[element] = options[element]
      }
    }
    console.log(state.activation)
  },
  toggleGlobalSMS(state, status) {
    state.globalSMSactive = status
  },
  toggleActivityPopup(state, status) {
    state.toggleActivity = status
  },
  setWindowsWidth(state, width) {
    state.windowsWidth = width
  },
}

export default {
  namespaced: true,
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  actions,
  mutations,
}
