import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueResource from 'vue-resource'
import App from './App.vue'

var locales = {
  en: {
    components: {
      AlbumArts: {
        noAlbums: 'There are no albums available for the selected criteria.'
      },
      AlbumsAlbumsGraph: {
        back: 'Back',
        edit: 'Edit similarity',
        name: 'Albums/Albums',
        addEdge: 'Connect similar albums',
        editEdge: 'Edit edge',
        edgeDescription: 'Click on an album and drag to another one to enter similarity.',
        editEdgeDescription: 'Drag the edge\'s endpoint to another node to change it.',
        deleteEdge: 'Delete edge',
        deleteConfirm: 'Are you sure you want to delete this relationship?'
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
      ArtistsAlbumDetails: {
        name: 'Artists/Albums'
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
        back: 'Back',
        edit: 'Edit similarity',
        name: 'Artists/Aritsts',
        addEdge: 'Connect similar artists',
        editEdge: 'Edit edge',
        edgeDescription: 'Click on an artist and drag to another one to enter similarity.',
        editEdgeDescription: 'Drag the edge\'s endpoint to another node to change it.',
        deleteEdge: 'Delete edge',
        deleteConfirm: 'Are you sure you want to delete this relationship?'
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

    },
    infoPanel: {
      updateAlbumSuccess: 'The album was updated successfully.',
      updateAlbumErr: 'There was an error when updating the album.',
      addArtistRelationSuccess: 'The relationship was successfully saved.',
      addArtistRelationErr: 'There was an error when adding the relationship.',
      deleteArtistRelationSuccess: 'The relationship was successfully deleted.',
      deleteArtistRelationErr: 'There was an error when deleting the relationship.'
    }
  }
}

Vue.use(VueI18n)
Vue.config.lang = 'en'
Object.keys(locales).forEach(function (lang) {
  Vue.locale(lang, locales[lang])
})

Vue.use(VueResource)
import store from './vuex/store'

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
