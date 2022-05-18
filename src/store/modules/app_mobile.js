const state = {
  mobileHeaderOptions: {
    hideUser: false,
    showMenu: '',
    leftAltIcon: '',
    rightAltIcon: '/static/images/graph-bar.svg',
    centerImg: '/static/images/nav_logo_primary.png',
    menuImg: '',
    closeCallBack: {},
  },
  mobileFooterOptions: {
    showFooter: true,
  },
  albumPrevRoute: '' || 'DiscoverIndex', // fallback,
}

const getters = {
  hideGoBackCTA: (state) => {
      // pass route name
    return ['DiscoverIndex']
  },
}

const actions = {
  setMobileHeaderOptions({commit}, options) {
    commit('toggleMobileHeaderOptions', options)
  },
  setMobileFooterOptions({commit}, options) {
    commit('toggleMobileFooterOptions', options)
  },
}

const mutations = {
  setAlbumPrevRoute(state, route) {
    state.albumPrevRoute = route
  },
  toggleMobileHeaderOptions(state, options) {
    const optionKeys = Object.keys(options)

    // find in mobileHeaderOptions, keys that are being updated
    for (let i = 0; i < optionKeys.length; i++) {
      const element = optionKeys[i];
      if (Object.hasOwnProperty.call(state.mobileHeaderOptions, element)) {
        state.mobileHeaderOptions[element] = options[element]
      }
    }
  },
  toggleMobileFooterOptions(state, options) {
    const optionKeys = Object.keys(options)

    // find in mobileFooterHeaderOptions, keys that are being updated
    for (let i = 0; i < optionKeys.length; i++) {
      const element = optionKeys[i];
      if (Object.hasOwnProperty.call(state.mobileFooterOptions, element)) {
        state.mobileFooterOptions[element] = options[element]
      }
    }
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
