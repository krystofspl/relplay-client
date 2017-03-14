import Vue from 'vue'
import Vuex from 'vuex'
var _ = require('lodash')

Vue.use(Vuex)

// Initial state
const state = {
  data: {
    albumArts: {},
    albums: {},
    artists: {},
    genres: {},
    labels: {},
    tracks: {}
  },
  player: {
    state: 'paused',
    nowPlaying: null,
    playlist: [],
    progress: 0,
    progressRequest: null,
    autoPlaylist: {
      // state is one of active, inactive, waiting
      state: 'inactive',
      usedTrackIds: [],
      newTracks: []
    }
  },
  view: {
    mainPanelView: 'ArtistsAlbumArts',
    rightPanelView: 'DefaultRight',
    showInfoPanel: false,
    infoPanelMsg: '',
    components: {
      FiltersArtistsAlbums: {
        filteredAlbumIds: [],
        filteredArtistIds: [],
        albumNameFilter: '',
        artistNameFilter: '',
        albumInboxFilter: 'both',
        labelsFilter: [],
        albumSort: 'titleAsc'
      },
      ArtistsAlbumArts: {
        selectedArtist: -1
      },
      ArtistsAlbumDetails: {
        selectedArtist: -1
      },
      Modal: {
        showModal: false,
        modalAction: 'showAlbum',
        modalEntities: {
          albumId: null,
          genreId: null,
          entityId: null,
          entityType: null
        }
      },
      TopPanel: {
        links: ['ArtistsAlbumArts', 'ArtistsAlbumDetails', 'GenresAlbumsGraph', 'ArtistAlbumsGraph', 'ArtistsArtistsGraph', 'AlbumsAlbumsGraph', 'LabelsGraph', 'Settings']
      },
      TrackInfo: {
        displayedFields: ['title', 'artist.name', 'album.name', 'album.year', 'labels', 'album.albumArt']
      }
    }
  },
  settings: {
    global: {
      backendUrl: 'http://192.168.1.8:8079/'
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
  getPlayerProgress: (state) => {
    return state.player.progress
  },
  getPlayerProgressRequest: (state) => {
    return state.player.progressRequest
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
  },
  getGenres: (state) => {
    return state.data.genres
  },
  getLabels: (state) => {
    return state.data.labels
  }
}

const mutations = {
  ADD_ALBUM_ART (state, payload) {
    Vue.set(state.data.albumArts, payload.albumId, payload.albumArt)
  },
  SET_INITIAL_DATA (state, payload) {
    for (let i = 0; i < payload.artists.length; i++) {
      Vue.set(state.data.artists, payload.artists[i].id, payload.artists[i])
      Vue.set(state.view.components.FiltersArtistsAlbums.filteredArtistIds, i, payload.artists[i].id)
    }
    for (let i = 0; i < payload.albums.length; i++) {
      Vue.set(state.data.albums, payload.albums[i].id, payload.albums[i])
      Vue.set(state.view.components.FiltersArtistsAlbums.filteredAlbumIds, i, payload.albums[i].id)
    }
    for (let i = 0; i < payload.tracks.length; i++) {
      Vue.set(state.data.tracks, payload.tracks[i].id, payload.tracks[i])
    }
    for (let i = 0; i < payload.genres.length; i++) {
      Vue.set(state.data.genres, payload.genres[i].id, payload.genres[i])
    }
    for (let i = 0; i < payload.labels.length; i++) {
      Vue.set(state.data.labels, payload.labels[i].id, payload.labels[i])
    }
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
  PLAYER_SET_STATE (state, payload) {
    state.player.state = payload.state
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
  PLAYER_SET_PROGRESS (state, payload) {
    state.player.progress = payload.progress
  },
  PLAYER_SET_PROGRESS_REQUEST (state, payload) {
    state.player.progressRequest = payload.progress
  },
  PLAYER_CONFIRM_PROGRESS_REQUEST (state) {
    state.player.progressRequest = null
  },
  PLAYER_UPDATE_PLAYLIST (state, payload) {
    state.player.playlist = payload
  },
  SET_SELECTED_ARTIST (state, payload) {
    state.view.components.ArtistsAlbumDetails.selectedArtist = payload
    state.view.components.ArtistsAlbumArts.selectedArtist = payload
  },
  SHOW_INFO_PANEL: function (state, show) {
    state.view.showInfoPanel = show
  },
  SET_INFO_PANEL_MSG: function (state, msg) {
    state.view.infoPanelMsg = msg
  },
  SHOW_MODAL: function (state) {
    state.view.components.Modal.showModal = true
  },
  HIDE_MODAL: function (state) {
    state.view.components.Modal.showModal = false
  },
  SET_MODAL_ACTION: function (state, payload) {
    state.view.components.Modal.modalAction = payload
  },
  TOGGLE_MODAL_ACTION: function (state, action) {
    // action is Array(2) with two actions to toggle between
    var modal = state.view.components.Modal
    if (modal.modalAction === action[0]) {
      modal.modalAction = action[1]
    } else {
      modal.modalAction = action[0]
    }
  },
  SET_MODAL_ENTITY: function (state, payload) {
    // TODO just use entity
    if (payload.albumId) {
      state.view.components.Modal.modalEntities.albumId = payload.albumId
    }
    if (payload.genreId) {
      state.view.components.Modal.modalEntities.genreId = payload.genreId
    }
    if (payload.entityId) {
      state.view.components.Modal.modalEntities.entityId = payload.entityId
    }
    if (payload.entityType) {
      state.view.components.Modal.modalEntities.entityType = payload.entityType
    }
  },
  UPDATE_ALBUM (state, payload) {
    Vue.set(state.data.albums, payload.id, payload)
  },
  UPDATE_GENRE (state, payload) {
    Vue.set(state.data.genres, payload.id, payload)
  },
  DELETE_GENRE (state, payload) {
    Vue.delete(state.data.genres, payload.id)
  },
  ADD_NEW_LABELS (state, payload) {
    for (let i = 0; i < payload.labels.length; i++) {
      Vue.set(state.data.labels, payload.labels[i].id, payload.labels[i])
    }
  },
  UPDATE_TRACK (state, payload) {
    Vue.set(state.data.tracks, payload.id, payload)
  },
  UPDATE_ARTIST_ALBUM_FILTERS (state, payload) {
    var keys = Object.keys(payload)
    for (let i = 0; i < keys.length; i++) {
      var key = keys[i]
      Vue.set(state.view.components.FiltersArtistsAlbums, key, payload[key])
    }
  },
  SET_AUTO_PLAYLIST_STATE (state, payload) {
    state.player.autoPlaylist.state = payload.state
  },
  SET_AUTO_PLAYLIST_NEW_TRACKS (state, payload) {
    state.player.autoPlaylist.newTracks = payload.trackIds
  },
  STOP_AUTO_PLAYLIST (state) {
    state.player.autoPlaylist.usedTrackIds = []
    state.player.autoPlaylist.newTracks = []
    state.player.autoPlaylist.state = 'inactive'
  },
  UPDATE_AUTO_PLAYLIST_USED_TRACK_IDS (state, payload) {
    var oldList = state.player.autoPlaylist.usedTrackIds
    var newList = _.uniq(_.concat(oldList, payload.usedTrackIds))
    state.player.autoPlaylist.usedTrackIds = newList
  }
}

const actions = {
  setInitialData (context) {
    context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.fetchingData'))
    context.dispatch('showInfoPanel')
    return new Promise((resolve, reject) => {
      // TODO async/await? needs a special babel plugin
      var payload = {artists: [], albums: [], tracks: [], genres: [], labels: []}
      Vue.http.get(state.settings.global.backendUrl + 'artists').then(function (result) {
        payload.artists = result.body || []
        Vue.http.get(state.settings.global.backendUrl + 'albums').then(function (result) {
          payload.albums = result.body || []
          Vue.http.get(state.settings.global.backendUrl + 'tracks').then(function (result) {
            payload.tracks = result.body || []
            Vue.http.get(state.settings.global.backendUrl + 'genres').then(function (result) {
              payload.genres = result.body || []
              Vue.http.get(state.settings.global.backendUrl + 'labels').then(
                function (result) {
                  payload.labels = result.body || []
                  context.commit('SET_INITIAL_DATA', payload)
                  resolve()
                })
            })
          })
        })
      })
    }).then(() => {
      context.dispatch('hideInfoPanel')
      // context.dispatch('loadAlbumArts')
    })
  },
  loadAlbumArts (context) {
    Object.values(context.state.data.albums).forEach((album) => {
      var albumId = album.id
      Vue.http.get(context.state.settings.global.backendUrl + 'album-arts/' + albumId)
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
  playerSetState (context, payload) {
    context.commit('PLAYER_SET_STATE', payload)
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
  playerSetProgress (context, payload) {
    context.commit('PLAYER_SET_PROGRESS', payload)
  },
  playerSetProgressRequest (context, payload) {
    context.commit('PLAYER_SET_PROGRESS_REQUEST', payload)
  },
  playerConfirmProgressRequest (context, payload) {
    context.commit('PLAYER_CONFIRM_PROGRESS_REQUEST')
  },
  playerUpdatePlaylist (context, payload) {
    context.commit('PLAYER_UPDATE_PLAYLIST', payload.playlist)
  },
  setSelectedArtist (context, payload) {
    context.commit('SET_SELECTED_ARTIST', payload)
  },
  showInfoPanel (context) {
    context.commit('SHOW_INFO_PANEL', true)
    setTimeout(function () {
      context.dispatch('hideInfoPanel')
    }, 6000)
  },
  hideInfoPanel (context) {
    context.commit('SHOW_INFO_PANEL', false)
  },
  setInfoPanelMsg (context, msg) {
    context.commit('SET_INFO_PANEL_MSG', msg)
  },
  showModal: function (context) {
    context.commit('SHOW_MODAL')
  },
  hideModal: function (context) {
    context.commit('HIDE_MODAL')
  },
  setModalAction: function (context, action) {
    context.commit('SET_MODAL_ACTION', action)
  },
  toggleModalAction: function (context, action) {
    context.commit('TOGGLE_MODAL_ACTION', action)
  },
  setModalEntity: function (context, payload) {
    context.commit('SET_MODAL_ENTITY', payload)
  },
  updateAlbum (context, payload) {
    var callback = payload.callback
    var albumId = payload.id
    delete payload.id

    Vue.http.patch(context.state.settings.global.backendUrl + 'albums/' + albumId, payload)
    .then((response) => {
      if (response.ok) {
        context.commit('UPDATE_ALBUM', response.body)
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.updateAlbumSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.updateAlbumErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  createGenre (context, payload) {
    var callback = payload.callback

    Vue.http.post(context.state.settings.global.backendUrl + 'genres/', payload)
    .then(response => {
      if (response.ok) {
        // Normally would use 201 + get from Location header, but there seems to be a bug in vue-resource, headers are empty
        context.commit('UPDATE_GENRE', response.body)
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.updateGenreSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.updateGenreErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  updateGenre (context, payload) {
    var callback = payload.callback
    var genreId = payload.id
    delete payload.id

    Vue.http.patch(context.state.settings.global.backendUrl + 'genres/' + genreId, payload)
    .then(response => {
      if (response.ok) {
        context.commit('UPDATE_GENRE', response.body)
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.updateGenreSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.updateGenreErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  deleteGenre (context, payload) {
    var callback = payload.callback
    var genreId = payload.id
    delete payload.id

    Vue.http.delete(context.state.settings.global.backendUrl + 'genres/' + genreId, payload)
    .then(response => {
      if (response.ok) {
        context.commit('DELETE_GENRE', {id: genreId})
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteGenreSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, {id: genreId})
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteGenreErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  addNewLabels (context, payload) {
    var callback = payload.callback
    var newLabels = payload.labels

    if (!newLabels || !newLabels.length) {
      callback('No new labels supplied.', [])
      return
    }

    Vue.http.post(context.state.settings.global.backendUrl + 'labels/', newLabels).then(response => {
      if (response.ok) {
        context.commit('ADD_NEW_LABELS', {labels: response.body})
        callback(null, response.body)
      }
    }, err => {
      console.log(err)
      callback(err, null)
    })
  },
  addAlbumRelation (context, payload) {
    var callback = payload.callback
    Vue.http.post(context.state.settings.global.backendUrl + 'relationships/album-similarity', payload)
    .then(response => {
      if (response.ok) {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.addArtistRelationSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      } else {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.addArtistRelationErr'))
        context.dispatch('showInfoPanel')
        callback(response.statusText, null)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.addArtistRelationErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  deleteAlbumRelation (context, payload) {
    var callback = payload.callback
    var start = payload.start
    var end = payload.end
    Vue.http.delete(context.state.settings.global.backendUrl + 'relationships/album-similarity/' + start + '/' + end, null)
    .then(response => {
      if (response.ok) {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteArtistRelationSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      } else {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteArtistRelationErr'))
        context.dispatch('showInfoPanel')
        callback(response.statusText, null)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteArtistRelationErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  addArtistRelation (context, payload) {
    var callback = payload.callback
    Vue.http.post(context.state.settings.global.backendUrl + 'relationships/artist-similarity', payload)
    .then(response => {
      if (response.ok) {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.addArtistRelationSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      } else {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.addArtistRelationErr'))
        context.dispatch('showInfoPanel')
        callback(response.statusText, null)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.addArtistRelationErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  deleteArtistRelation (context, payload) {
    var callback = payload.callback
    var start = payload.start
    var end = payload.end
    Vue.http.delete(context.state.settings.global.backendUrl + 'relationships/artist-similarity/' + start + '/' + end, null)
    .then(response => {
      if (response.ok) {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteArtistRelationSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      } else {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteArtistRelationErr'))
        context.dispatch('showInfoPanel')
        callback(response.statusText, null)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteArtistRelationErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  addLabelParentRelation (context, payload) {
    var callback = payload.callback
    var start = payload.start
    var end = payload.end
    Vue.http.post(context.state.settings.global.backendUrl + 'relationships/labels-parent/' + start + '/' + end, null)
    .then(response => {
      if (response.ok) {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.addArtistRelationSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      } else {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.addArtistRelationErr'))
        context.dispatch('showInfoPanel')
        callback(response.statusText, null)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.addArtistRelationErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  deleteLabelParentRelation (context, payload) {
    var callback = payload.callback
    var start = payload.start
    var end = payload.end
    Vue.http.delete(context.state.settings.global.backendUrl + 'relationships/labels-parent/' + start + '/' + end, null)
    .then(response => {
      if (response.ok) {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteArtistRelationSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      } else {
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteArtistRelationErr'))
        context.dispatch('showInfoPanel')
        callback(response.statusText, null)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.deleteArtistRelationErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  updateTrack (context, payload) {
    var callback = payload.callback
    var trackId = payload.id
    delete payload.id

    Vue.http.patch(context.state.settings.global.backendUrl + 'tracks/' + trackId, payload)
    .then((response) => {
      if (response.ok) {
        context.commit('UPDATE_TRACK', response.body)
        context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.updateTrackSuccess'))
        context.dispatch('showInfoPanel')
        callback(null, response.body)
      }
    }, (err) => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.updateTrackErr'))
      context.dispatch('showInfoPanel')
      callback(err, null)
    })
  },
  updateArtistAlbumFilters (context, payload) {
    context.commit('UPDATE_ARTIST_ALBUM_FILTERS', payload)
  },
  // Payload has optional seed array
  toggleAutoPlaylistState (context, payload) {
    var autoPlaylistState = context.state.player.autoPlaylist.state
    if (autoPlaylistState === 'inactive') {
      var seed = (payload && payload.seedTrackIds) ? payload.seedTrackIds : []
      context.dispatch('getAutoPlaylistData', { seedTrackIds: seed })
    } else {
      context.dispatch('stopAutoPlaylist')
    }
  },
  getAutoPlaylistData (context, payload) {
    var seedTrackIds = _.castArray(payload.seedTrackIds)
    context.dispatch('updateAutoPlaylistUsedTrackIds', { usedTrackIds: seedTrackIds })
    context.commit('SET_AUTO_PLAYLIST_STATE', { state: 'waiting' })
    // Send request, when done save to store and set state to active
    Vue.http.post(state.settings.global.backendUrl + 'playlists/generator', { seedTrackIds: seedTrackIds, usedTrackIds: state.player.autoPlaylist.usedTrackIds })
    .then(response => {
      console.log(response)
      if (response.ok) {
        context.commit('SET_AUTO_PLAYLIST_NEW_TRACKS', { trackIds: response.body })
        context.dispatch('updateAutoPlaylistUsedTrackIds', { usedTrackIds: response.body })
      }
      context.commit('SET_AUTO_PLAYLIST_STATE', { state: 'active' })
    }, err => {
      console.log(err)
      context.dispatch('setInfoPanelMsg', Vue.t('infoPanel.fetchAutoPlaylistDataErr'))
      context.dispatch('showInfoPanel')
      context.commit('SET_AUTO_PLAYLIST_STATE', { state: 'inactive' })
    })
  },
  stopAutoPlaylist (context) {
    context.commit('STOP_AUTO_PLAYLIST')
  },
  updateAutoPlaylistUsedTrackIds (context, payload) {
    context.commit('UPDATE_AUTO_PLAYLIST_USED_TRACK_IDS', payload)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
