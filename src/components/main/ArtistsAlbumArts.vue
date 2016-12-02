<template>
  <div id="artists-album-arts">
    <artists-panel :artists="artists" :selectedArtistId="selectedArtistId"></artists-panel>
    <album-arts :albums="albums"></album-arts>
  </div>
</template>

<script>
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { mapGetters } from 'vuex'
import AlbumArts from './AlbumArts.vue'
import ArtistsPanel from './ArtistsPanel.vue'
var _ = require('lodash')

export default {
  data: function () {
    return {
      selectedArtistId: -1
    }
  },
  components: {
    AlbumArts,
    ArtistsPanel
  },
  methods: {
    ...mapGetters('getArtists', 'getAlbums')
  },
  mixins: [artistGetters],
  computed: {
    artists: function () {
      var self = this
      return _.values(self.$store.state.data.artists).sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    },
    albums: function () {
      if (this.selectedArtistId === -1) {
        return this.$store.state.data.albums
      } else {
        return this.getAlbumsForArtist(this.selectedArtistId)
      }
    },
    selectedArtistId: function () {
      return this.$store.state.view.components.ArtistsAlbumArts.selectedArtist
    }
  }
}
</script>

<style lang="sass" scoped>
#artists-album-arts
  height: 100%
  .artists-panel
    width: 20%
    float: left
  .album-arts
    width: 80%
    float: left

</style>
