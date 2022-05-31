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
  onboarding: {
    current: 1,
    accountCategory: 'listener',
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
}

const getters = {
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
            title: 'Discover',
            id: 'music',
            icon: require('../../../static/images/search.svg'),
            path: 'DiscoverIndex',
          },
          {
            title: 'Activity',
            id: 'activity',
            icon: require('../../../static/images/ic_alarm.svg'),
            path: 'ActivityIndex',
          },
          {
            title: 'Feed',
            id: 'feed',
            icon: require('../../../static/images/home.svg'),
            path: 'Feed',
          },
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
          //   title: 'Upload',
          //   id: 'upload',
          //   icon: 'file_upload',
          //   path: 'UploadIndex',
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
      return getters.listenerStages
    } else if (state.onboarding.accountCategory === 'creator') {
      return getters.creatorStages
    } else {
      return [{
        title: 'What Are You?',
        stage: 1,
      }]
    }
  },
  listenerStages() {
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
  creatorStages() {
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
        title: 'Check Email',
        stage: 7,
      },
    ]
    return stages
  },
  currentStage(state, getters) {
    const current = getters.onboardingStages.find((stage) => stage.stage === state.onboarding.current) || {}

    return current
  },
}

const actions = {
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
}

const mutations = {
  toggleActivityPopup(state, status) {
    state.toggleActivity = status
  },
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
    console.log(options)
    const optionKeys = Object.keys(options)

    // find in onboarding, keys that are being updated
    for (let i = 0; i < optionKeys.length; i++) {
      const element = optionKeys[i];

      if (Object.hasOwnProperty.call(state.onboarding, element)) {
        state.onboarding[element] = options[element]
      }
    }
    console.log(state.onboarding)
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
