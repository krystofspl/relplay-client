import Vue from 'vue'
import Vuex from 'vuex'

import { tempData } from './temp_data.js'

Vue.use(Vuex)

// Initial state
const state = {
  data: tempData,
  player: {
    state: 'paused',
    nowPlaying: 375,
    playlist: [104, 375, 550, 600],
    progress: 55
  },
  view: {
    mainPanelView: 'AlbumArts',
    rightPanelView: 'DefaultRight',
    components: {
      TopPanel: {
        links: ['AlbumArts', 'GenresArtistsGraph', 'ArtistsArtistsGraph']
      },
      TrackInfo: {
        displayedFields: ['title', 'artist.name', 'album.name', 'album.year', 'album.albumArt']
      }
    }
  }
}

const getters = {
  getNowPlayingId: (state) => {
    return state.player.nowPlaying
  },
  getNowPlayingTrack: (state) => {
    return state.data.tracks.find(track => track.id === state.player.nowPlaying)
  },
  getPlayerState: (state) => {
    return state.player.state
  },
  getPlaylist: (state) => {
    return state.player.playlist
  },
  getPlaylistTracks: (state) => {
    return state.player.playlist.map(id => {
      return state.data.tracks.find(track => track.id === id)
    })
  }
}

const mutations = {
  SWITCH_MAIN_PANEL_VIEW (state, component) {
    state.view.mainPanelView = component
  },
  SWITCH_RIGHT_PANEL_VIEW (state, component) {
    state.view.rightPanelView = component
  },
  PLAYER_SWITCH_STATE (state) {
    var playerState = state.player.state
    if (playerState === 'paused') {
      state.player.state = 'playing'
    } else {
      state.player.state = 'paused'
    }
  },
  PLAYER_PREVIOUS (state) {
    var currentPosition = state.player.playlist.indexOf(state.player.nowPlaying)
    var newPosition = currentPosition - 1
    if (newPosition >= 0) {
      state.player.nowPlaying = state.player.playlist[newPosition]
    }
  },
  PLAYER_NEXT (state) {
    var currentPosition = state.player.playlist.indexOf(state.player.nowPlaying)
    var newPosition = currentPosition + 1
    if (newPosition < state.player.playlist.length) {
      state.player.nowPlaying = state.player.playlist[newPosition]
    }
  },
  PLAYER_SET_NOW_PLAYING (state, payload) {
    state.player.nowPlaying = payload.id
  },
  PLAYER_UPDATE_PLAYLIST (state, payload) {
    state.player.playlist = payload.playlist.map(track => {
      return track.id
    })
  }
}

const actions = {
  switchMainPanelView (context, component) {
    context.commit('SWITCH_MAIN_PANEL_VIEW', component)
  },
  switchRightPanelView (context, component) {
    context.commit('SWITCH_RIGHT_PANEL_VIEW', component)
  },
  playerSwitchState (context) {
    context.commit('PLAYER_SWITCH_STATE')
  },
  playerPrevious (context) {
    context.commit('PLAYER_PREVIOUS')
  },
  playerNext (context) {
    context.commit('PLAYER_NEXT')
  },
  playerSetNowPlaying (context, payload) {
    context.commit('PLAYER_SET_NOW_PLAYING', payload)
  },
  playerUpdatePlaylist (context, payload) {
    context.commit('PLAYER_UPDATE_PLAYLIST', payload)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
