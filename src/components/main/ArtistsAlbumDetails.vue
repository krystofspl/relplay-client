<template>
  <div id="artists-album-details">
    <filters-artists-albums :selectedArtistId="selectedArtistId" class="filters"></filters-artists-albums>
    <artists-panel :artists="artists" :selectedArtistId="selectedArtistId"></artists-panel>
    <album-details-list :albums="albums" ref="albumDetailsListComponent"></album-details-list>
  </div>
</template>

<script>
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import AlbumDetailsList from './AlbumDetailsList.vue'
import ArtistsPanel from './ArtistsPanel.vue'
import FiltersArtistsAlbums from '../misc/FiltersArtistsAlbums.vue'

export default {
  data: function () {
    return {}
  },
  mixins: [artistGetters, albumGetters],
  components: {
    AlbumDetailsList,
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
      return this.$store.state.view.components.ArtistsAlbumDetails.selectedArtist || -1
    }
  },
  activated: function () {
    // Reset infinite loader, selectedArtistId could've been changed from elsewhere
    this.$refs.albumDetailsListComponent.$emit('resetInfiniteLoader')
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
  .album-details-list
    height: $panel-height
    width: 80%
    float: left
    overflow: hidden
    overflow-y: auto
</style>
