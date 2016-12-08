<template>
  <div id="artists-album-details">
    <div class="filters">
      <input type="text" name="artistNameFilter" v-model="artistNameFilter" :placeholder="$t('components.AlbumDetails.artistName')">

      <input type="text" name="albumNameFilter" v-model="albumNameFilter" :placeholder="$t('components.AlbumDetails.albumTitle')">

      {{ $t('components.AlbumDetails.inInbox') }}
      <select v-model="albumInboxFilter">
        <option :value="{inInbox: 'both'}">-</option>
        <option :value="{inInbox: true}">Yes</option>
        <option :value="{inInbox: false}">No</option>
      </select>

      {{ $t('components.ArtistsAlbumArts.sortBy') }} <select v-model="albumSort">
        <option :value="{sortBy: 'titleAsc'}">Title asc</option>
        <option :value="{sortBy: 'titleDesc'}">Title desc</option>
      </select>
    </div>
    <artists-panel :artists="artists()" :selectedArtistId="selectedArtistId"></artists-panel>
    <div class="album-details-wrapper">
      <album-details v-for="album in albums()" :album-id="album.id"></album-details>
    </div>
  </div>
</template>

<script>
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { mapGetters } from 'vuex'
import AlbumArts from './AlbumArts.vue'
import AlbumDetails from '../misc/AlbumDetails.vue'
import ArtistsPanel from './ArtistsPanel.vue'
var _ = require('lodash')

export default {
  data: function () {
    return {
      selectedArtistId: -1,
      albumNameFilter: '',
      albumInboxFilter: {
        inInbox: 'both'
      },
      artistNameFilter: '',
      albumSort: {
        sortBy: 'titleAsc'
      }
    }
  },
  components: {
    AlbumArts,
    AlbumDetails,
    ArtistsPanel
  },
  methods: {
    ...mapGetters('getArtists', 'getAlbums'),
    albums: function () {
      var albumsData = []
      var self = this
      if (this.selectedArtistId === -1) {
        albumsData = _.values(this.$store.state.data.albums)
      } else {
        albumsData = this.getAlbumsForArtist(this.selectedArtistId)
      }
      return albumsData.filter(album => {
        var nameCondition = new RegExp(self.albumNameFilter, 'i')
        var inboxCondition = (album.inInbox === (self.albumInboxFilter.inInbox))
        return album.title.match(nameCondition) && ((self.albumInboxFilter.inInbox === 'both') ? true : inboxCondition)
      }).sort((a, b) => {
        var sortResult = null
        switch (self.albumSort.sortBy) {
          case 'titleAsc':
            sortResult = a.title.localeCompare(b.title)
            break
          case 'titleDesc':
            sortResult = b.title.localeCompare(a.title)
            break
          default:
            sortResult = a.title.localeCompare(b.title)
        }
        return sortResult
      })
    },
    artists: function () {
      var self = this
      return _.values(self.$store.state.data.artists).sort((a, b) => {
        return a.name.localeCompare(b.name)
      }).filter(artist => {
        return artist.name.match(new RegExp(self.artistNameFilter, 'i'))
      })
    }
  },
  mixins: [artistGetters],
  computed: {
    selectedArtistId: function () {
      return this.$store.state.view.components.ArtistsAlbumDetails.selectedArtist
    }
  }
}
</script>

<style lang="sass">
$filters-height: 22px
$filters-padding: 5px
$panel-height: calc(100% - #{$filters-height} - 2 * #{$filters-padding})
#artists-album-details
  height: 100%
  overflow: hidden
  .filters
    height: $filters-height
    width: 100%
    float: left
    background: #666
    padding: $filters-padding
    border-bottom: 1px solid #000
  .artists-panel
    height: $panel-height
    width: 20%
    float: left
    overflow: hidden
    overflow-y: auto
  .album-details-wrapper
    height: $panel-height
    width: 80%
    float: left
    overflow: hidden
    overflow-y: auto
    .album-details
      background: #666
      border-bottom: 1px solid #000
      padding: 7px
      overflow: hidden
      &:after
        content: " "
        display: block
        height: 0
        clear: both
      .col-right
</style>
