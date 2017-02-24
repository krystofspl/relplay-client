<template>
  <div id="artists-album-arts">
    <filters-artists-albums :selectedArtistId="selectedArtistId" class="filters"></filters-artists-albums>
    <artists-panel :artists="artists" :selectedArtistId="selectedArtistId"></artists-panel>
    <album-arts :albums="albums" ref="albumArtsComponent"></album-arts>
  </div>
</template>

<script>
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import AlbumArts from './AlbumArts.vue'
import ArtistsPanel from './ArtistsPanel.vue'
import FiltersArtistsAlbums from '../misc/FiltersArtistsAlbums.vue'

export default {
  data: function () {
    return {
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
  mixins: [artistGetters, albumGetters],
  components: {
    AlbumArts,
    ArtistsPanel,
    FiltersArtistsAlbums
  },
  computed: {
    artists: function () {
      var self = this
      return self.$store.state.view.components.FiltersArtistsAlbums.filteredArtistIds.map(id => self.getArtist(id))
    },
    albums: function () {
      var self = this
      return self.$store.state.view.components.FiltersArtistsAlbums.filteredAlbumIds.map(id => self.getAlbum(id))
    },
    selectedArtistId: function () {
      return this.$store.state.view.components.ArtistsAlbumArts.selectedArtist || -1
    }
  },
  activated: function () {
    // Reset infinite loader, selectedArtistId could've been changed from elsewhere
    this.$refs.albumArtsComponent.$emit('resetInfiniteLoader')
  }
}
</script>

<style lang="sass" scoped>
$filters-height: 22px
$filters-padding: 5px
$panel-height: calc(100% - #{$filters-height} - 2 * #{$filters-padding})
#artists-album-arts
  height: 100%
  overflow: hidden
  .filters
    height: auto
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
  .album-arts
    height: $panel-height
    width: 80%
    float: left
    overflow: hidden
    overflow-y: auto
</style>
