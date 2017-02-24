<template>
  <div class="filters-artists-albums">
    <input type="text" name="artistNameFilter" v-model="artistNameFilter" :placeholder="$t('components.AlbumDetails.artistName')">

    <input type="text" name="albumNameFilter" v-model="albumNameFilter" :placeholder="$t('components.AlbumDetails.albumTitle')">

    <a href="#" @click="setModalAction('filtersArtistsAlbumsMore'); showModal()">More</a>
    <span v-if="areResultsFiltered">(results are filtered)</span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { artistGetters } from '../../mixins/getters/artistGetters.js'
var _ = require('lodash')

export default {
  props: ['selectedArtistId'],
  mixins: [artistGetters],
  methods: {
    ...mapActions(['setModalAction', 'showModal']),
    updateStoreFilteredIds: function () {
      var self = this
      // Update album IDs
      var albumsData = []
      if (this.selectedArtistId === -1) {
        albumsData = _.values(this.$store.state.data.albums)
      } else {
        albumsData = this.getAlbumsForArtist(this.selectedArtistId)
      }
      var albumIds = albumsData.filter(album => {
        var nameCondition = new RegExp(self.albumNameFilter, 'i')
        var inboxCondition = (album.inInbox === (self.albumInboxFilter))
        var labelsCondition = _.intersection(album.labels, self.labelsFilter.map(l => l.id)).length === self.labelsFilter.length
        return album.title.match(nameCondition) && ((self.albumInboxFilter === 'both') ? true : inboxCondition) && labelsCondition
      }).sort((a, b) => {
        var sortResult = null
        switch (self.albumSort) {
          case 'titleAsc':
            sortResult = a.title.localeCompare(b.title)
            break
          case 'titleDesc':
            sortResult = b.title.localeCompare(a.title)
            break
          case 'yearAsc':
            sortResult = a.year - b.year
            break
          case 'yearDesc':
            sortResult = b.year - a.year
            break
          default:
            sortResult = a.title.localeCompare(b.title)
        }
        return sortResult
      }).map(album => album.id)
      this.$store.dispatch('updateArtistAlbumFilters', { filteredAlbumIds: albumIds })

      // Update artist IDs
      var artistIds = _.values(self.$store.state.data.artists).sort((a, b) => {
        return a.name.localeCompare(b.name)
      }).filter(artist => {
        return artist.name.match(new RegExp(self.artistNameFilter, 'i'))
      }).map(artist => artist.id)
      this.$store.dispatch('updateArtistAlbumFilters', { filteredArtistIds: artistIds })
    }
  },
  computed: {
    areResultsFiltered: function () {
      return this.$store.state.view.components.FiltersArtistsAlbums.filteredAlbumIds.length < Object.keys(this.$store.state.data.albums).length
    },
    artistNameFilter: {
      get () {
        return this.$store.state.view.components.FiltersArtistsAlbums.artistNameFilter
      },
      set (value) {
        this.$store.dispatch('updateArtistAlbumFilters', { artistNameFilter: value })
      }
    },
    albumNameFilter: {
      get () {
        return this.$store.state.view.components.FiltersArtistsAlbums.albumNameFilter
      },
      set (value) {
        this.$store.dispatch('updateArtistAlbumFilters', { albumNameFilter: value })
      }
    },
    labelsFilter: {
      get () {
        return this.$store.state.view.components.FiltersArtistsAlbums.labelsFilter
      },
      set (value) {
        this.$store.dispatch('updateArtistAlbumFilters', { labelsFilter: value })
      }
    },
    albumInboxFilter: {
      get () {
        return this.$store.state.view.components.FiltersArtistsAlbums.albumInboxFilter
      },
      set (value) {
        this.$store.dispatch('updateArtistAlbumFilters', { albumInboxFilter: value })
      }
    },
    albumSort: {
      get () {
        return this.$store.state.view.components.FiltersArtistsAlbums.albumSort
      },
      set (value) {
        this.$store.dispatch('updateArtistAlbumFilters', { albumSort: value })
      }
    },
    allFilters: function () {
      // Including date.now because of compound values caching
      // https://github.com/vuejs/vue/issues/844
      this.artistNameFilter
      this.albumNameFilter
      this.albumInboxFilter
      this.labelsFilter
      this.selectedArtistId
      this.albumSort
      return Date.now()
    }
  },
  watch: {
    allFilters () {
      // If some filter changes, update filtered arrays
      this.updateStoreFilteredIds()
    }
  },
  created: function () {
    // Initialize filtered arrays
    this.updateStoreFilteredIds()
  }
}
</script>