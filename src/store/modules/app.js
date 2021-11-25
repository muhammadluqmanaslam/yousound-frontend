import _ from 'lodash'

const state = {
  settings: {},
  genres: [],
  product_categories: [],
  public_relations_user: {},
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
            path: this.username,
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
            icon: 'notifications',
            path: 'NotificationIndex',
          },
          {
            title: 'Cart',
            id: 'cart',
            icon: 'shopping_cart',
            path: 'Cart',
          },
          {
            title: 'Sales',
            id: 'sales',
            icon: 'local_shipping',
            path: 'Sell',
            allowedUser: ['artist'],
          },
          {
            title: 'Upload',
            id: 'upload',
            icon: 'file_upload',
            path: 'UploadIndex',
            allowedUser: ['artist'],
          },
          {
            title: 'Manage',
            id: 'manage',
            icon: 'video_library',
            path: 'ManageIndex',
          },
        ],
      },
      {
        name: 'Discover',
        items: [
          {
            title: 'Video',
            id: 'video',
            icon: 'live_tv',
            path: 'VideoIndex',
          },
          {
            title: 'Music',
            id: 'music',
            icon: 'library_music',
            path: 'AlbumIndex',
          },
          {
            title: 'Shop',
            id: 'shop',
            icon: 'shopping_bag',
            path: 'ProductIndex',
          },
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
}

const actions = {
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
}

export default {
  namespaced: true,
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  actions,
  mutations,
}
