import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import store from './vuex/store'
import App from './App.vue'

var locales = {
  en: {
    components: {
      AlbumArts: {
        noAlbums: 'There are no albums available for the selected criteria.'
      },
      AlbumDetails: {
        modalHeader: 'Album Details',
        albumTitle: 'Album title',
        artistName: 'Artist',
        mainArtist: 'Main artist',
        artists: 'Other artists',
        year: 'Year',
        added: 'Added',
        inInbox: 'Is in inbox?',
        inboxWarning: 'This album is in inbox.',
        inboxAdd: 'Move to library'
      },
      ArtistsAlbumArts: {
        name: 'Album Arts',
        sortBy: 'Sort by'
      },
      ArtistsPanel: {
        all: 'All'
      },
      GenresArtistsGraph: {
        name: 'Genres/Artists'
      },
      ArtistAlbumsGraph: {
        name: 'One Artist/Albums'
      },
      ArtistsArtistsGraph: {
        name: 'Artists/Aritsts'
      },
      PlayingTrack: {
        nothingPlaing: 'Nothing playing now'
      },
      Playlist: {
        playlist: 'Playlist'
      },
      TrackInfo: {
        nowPlaying: 'Now playing'
      }
    },
    views: {

    }
  }
}

Vue.use(VueI18n)
Vue.config.lang = 'en'
Object.keys(locales).forEach(function (lang) {
  Vue.locale(lang, locales[lang])
})

Vue.use(VueResource)
Vue.use(Vuex)

// Initialize the app only after the data has been fetched
store.dispatch('setInitialData').then(() => {
  var vue = new Vue({
    store,
    el: '#app',
    components: {
      App
    }
  })

  window.vue = vue
})
