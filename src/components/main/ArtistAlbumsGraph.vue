<template>
  <div id="artist-albums-graph">
    <graph-canvas :graph-data="graphData"></graph-canvas>
  </div>
</template>

<script>
import GraphCanvas from './GraphCanvas.vue'
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
var _ = require('lodash')

export default {
  data: function () {
    return {
      graphData: {
        graph: null,
        graphContainer: 'artist-albums-graph',
        graphInitialized: false,
        nodes: [],
        edges: []
      }
    }
  },
  components: {
    GraphCanvas
  },
  mixins: [artistGetters, albumGetters, trackGetters],
  methods: {
    fetchGraphData: function (callback) {
      var selectedArtist = this.getArtistForTrack(this.$store.state.player.nowPlaying).id || null
      this.$http.get(this.$store.state.settings.global.backendUrl + 'graphs/artist-albums-graph?artist=' + selectedArtist).then(function (results) {
        this.$set(this.graphData, 'nodes', [])
        console.log(results)
        var resultsArr = results.body
        var albumsFromQuery = _.uniq(_.castArray(resultsArr).map(result => result.album))
        var artistFromQuery = _.uniq(_.castArray(resultsArr).map(result => result.artist))[0] || selectedArtist
        var secondaryArtistsFromQuery = _.uniq(_.castArray(resultsArr).map(result => result.artist2))
        var artist = this.getArtist(artistFromQuery)
        var secondaryArtists = _.compact(_.castArray(secondaryArtistsFromQuery.map(id => this.getArtist(id))))
        var albums = _.compact(_.castArray(albumsFromQuery.map(id => this.getAlbum(id))))

        artist.label = artist.name
        artist.shape = 'circle'

        secondaryArtists.forEach(a => { a.label = a.name; a.shape = 'circle'; a.color = 'red'; a.mass = 5 })
        albums.forEach(a => { a.label = a.title; a.shape = 'square' })

        this.$set(this.graphData, 'nodes', _.concat(this.graphData.nodes, artist))
        this.$set(this.graphData, 'nodes', _.concat(this.graphData.nodes, secondaryArtists))
        this.$set(this.graphData, 'nodes', _.concat(this.graphData.nodes, albums))
        results.body.forEach(res => {
          if (!res.artist2) {
            this.graphData.edges.push({from: res.artist, to: res.album})
          } else {
            this.graphData.edges.push({from: res.artist, to: res.album})
            this.graphData.edges.push({from: res.artist2, to: res.album})
          }
        })
        // TODO edges
        callback()
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
