import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Initial state
const state = {
  data: {
    tracks: {},
    albums: {},
    artists: {},
    albumArts: {}
  },
  player: {
    state: 'paused',
    nowPlaying: 242,
    playlist: [242],
    progress: 55
  },
  view: {
    mainPanelView: 'ArtistsAlbumArts',
    rightPanelView: 'DefaultRight',
    components: {
      ArtistsAlbumArts: {
        selectedArtist: -1
      },
      TopPanel: {
        links: ['ArtistsAlbumArts', 'GenresArtistsGraph', 'ArtistAlbumsGraph', 'ArtistsArtistsGraph']
      },
      TrackInfo: {
        displayedFields: ['title', 'artist.name', 'album.name', 'album.year', 'album.albumArt']
      }
    }
  },
  settings: {
    global: {
      backendUrl: 'http://localhost:8079/'
    }
  }
}

const getters = {
  getNowPlayingId: (state) => {
    return state.player.nowPlaying
  },
  getNowPlayingTrack: (state) => {
    return state.data.tracks[state.player.nowPlaying]
  },
  getPlayerState: (state) => {
    return state.player.state
  },
  getPlaylist: (state) => {
    return state.player.playlist
  },
  getPlaylistTracks: (state) => {
    return state.player.playlist.map(id => {
      return state.data.tracks[id]
    })
  },
  getAlbums: (state) => {
    return state.data.albums
  },
  getArtists: (state) => {
    return state.data.artists
  },
  getAlbumArt: (albumId) => {
    return state.data.albumArts[albumId]
  }
}

const mutations = {
  ADD_ALBUM_ART (state, payload) {
    Vue.set(state.data.albumArts, payload.albumId, payload.albumArt)
  },
  SET_INITIAL_DATA (state, payload) {
    payload.artists.forEach(res => {
      Vue.set(state.data.artists, res.id, res)
    })
    payload.albums.forEach(res => {
      Vue.set(state.data.albums, res.id, res)
    })
    payload.tracks.forEach(res => {
      Vue.set(state.data.tracks, res.id, res)
    })
  },
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
  },
  SET_SELECTED_ARTIST (state, payload) {
    state.view.components.ArtistsAlbumArts.selectedArtist = payload
  },
  UPDATE_ALBUM (state, payload) {
    Vue.set(state.data.albums, payload.id, payload)
  }
}

const actions = {
  setInitialData (context) {
    return new Promise((resolve, reject) => {
      // TODO async/await? needs a special babel plugin
      var payload = {artists: [], albums: [], tracks: []}
      Vue.http.get(state.settings.global.backendUrl + 'artists').then(function (result) {
        payload.artists = result.body
        Vue.http.get(state.settings.global.backendUrl + 'albums').then(function (result) {
          payload.albums = result.body
          Vue.http.get(state.settings.global.backendUrl + 'tracks').then(function (result) {
            payload.tracks = result.body
            context.commit('SET_INITIAL_DATA', payload)
            resolve()
          })
        })
      })
    }).then(() => {
      context.dispatch('loadAlbumArts')
    })
  },
  loadAlbumArts (context) {
    Object.values(context.state.data.albums).forEach((album) => {
      var albumId = album.id
      Vue.http.get(context.state.settings.global.backendUrl + 'album-art/' + albumId)
        .then((response) => {
          if (response.ok) {
            response.blob().then((b) => {
              context.commit('ADD_ALBUM_ART', { albumArt: b, albumId: albumId })
            })
          }
        }, (err) => {
          console.log(err)
        })
    })
  },
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
  },
  setSelectedArtist (context, payload) {
    context.commit('SET_SELECTED_ARTIST', payload)
  },
  updateAlbum (context, payload) {
    var callback = payload.callback
    var albumId = payload.id
    console.log(Object.values(payload))
    if (Object.keys(payload).length <= 2) {
      // Only id and callback are present, return
      callback('Nothing has changed.', null)
      return
    }
    Vue.http.post(context.state.settings.global.backendUrl + 'albums/' + albumId, payload)
    .then((response) => {
      if (response.ok) {
        context.commit('UPDATE_ALBUM', response.body)
        callback(null, response.body)
      }
    }, (err) => {
      console.log(err)
      callback(err, null)
    })
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
