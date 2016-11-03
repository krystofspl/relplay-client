import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Initial state
const state = {
  view: {
    mainPanelView: 'AlbumArts'
  }
}

const mutations = {
  SWITCH_MAIN_PANEL_VIEW (state, component) {
    state.view.mainPanelView = component
  }
}

const actions = {
  switchMainPanelView (context, component) {
    context.commit('SWITCH_MAIN_PANEL_VIEW', component)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
