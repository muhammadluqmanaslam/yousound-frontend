const state = {}

const getters = {
  hasGoBackCTA: (state) => {
      // pass route name
    return ['DiscoverIndex']
  },
}

const actions = {}

const mutations = {}

export default {
  namespaced: true,
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  actions,
  mutations,
}
