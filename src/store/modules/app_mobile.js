const state = {
  mobileHeaderOptions: {
    showGoBack: true,
    hideUser: false,
    showMenu: '',
    leftAltIcon: '',
    rightAltIcon: '/static/images/graph-bar.svg',
    centerImg: '/static/images/nav_logo_primary.png',
    menuImg: '',
    closeCallBack: {},
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
    // console.log(options);
    commit('toggleMobileHeaderOptions', options)
  },
}

const mutations = {
  setAlbumPrevRoute(state, route) {
    state.albumPrevRoute = route
  },
  toggleMobileHeaderOptions(state, options) {
    console.log('options', options);
    const optionKeys = Object.keys(options)

    // find in mobileHeaderOptions, keys that are being updated
    for (let i = 0; i < optionKeys.length; i++) {
      const element = optionKeys[i];
      if (Object.hasOwnProperty.call(state.mobileHeaderOptions, element)) {
        state.mobileHeaderOptions[element] = options[element]
      }
    }

    console.log('new', state.mobileHeaderOptions);
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
