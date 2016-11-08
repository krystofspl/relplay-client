import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Initial state
const state = {
  player: {
    state: 'paused',
    nowPlaying: {
      trackName: 'nowplayingtest'
    }
  },
  view: {
    mainPanelView: 'AlbumArts',
    rightPanelView: 'DefaultRight',
    components: {
      TopPanel: {
        links: ['AlbumArts', 'GenresArtistsGraph', 'ArtistsArtistsGraph']
      },
      TrackInfo: {
        displayedFields: ['trackName', 'artistName', 'albumName', 'year', 'albumArt']
      }
    }
  }
}

const mutations = {
  SWITCH_MAIN_PANEL_VIEW (state, component) {
    state.view.mainPanelView = component
  },
  SWITCH_RIGHT_PANEL_VIEW (state, component) {
    state.view.rightPanelView = component
  },
  SWITCH_PLAYER_STATE (state) {
    if (state.player.state === 'paused') {
      state.player.state = 'playing'
    } else {
      state.player.state = 'paused'
    }
  },
  PLAYER_PREVIOUS (state) {},
  PLAYER_NEXT (state) {}
}

const actions = {
  switchMainPanelView (context, component) {
    context.commit('SWITCH_MAIN_PANEL_VIEW', component)
  },
  switchRightPanelView (context, component) {
    context.commit('SWITCH_RIGHT_PANEL_VIEW', component)
  },
  switchPlayerState (context) {
    context.commit('SWITCH_PLAYER_STATE')
  },
  playerPrevious (context) {
    context.commit('PLAYER_PREVIOUS')
  },
  playerNext (context) {
    context.commit('PLAYER_NEXT')
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
