<template>
  <div id="artist-albums-graph">
    <div class="refresh-button" @click="refreshAction()">
      <icon scale="2" name="refresh"></icon>
    </div>
    <graph-canvas :graph-data="graphData" ref="graphCanvas"></graph-canvas>
  </div>
</template>

<script>
import GraphCanvas from './GraphCanvas.vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/refresh'
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import { mapGetters } from 'vuex'
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
    GraphCanvas,
    Icon
  },
  mixins: [artistGetters, albumGetters, trackGetters],
  methods: {
    ...mapGetters(['getNowPlayingTrack']),
    refreshAction: function () {
      this.$refs.graphCanvas.tryInitGraph()
    },
    graphInitCondition: function () {
      // Needs a "now playing" track to display the artist etc
      return this.getNowPlayingTrack()
    },
    fetchGraphData: function (callback) {
      var self = this
      var selectedArtistId = this.getArtistForTrack(this.getNowPlayingTrack().id).id || null
      this.$http.get(this.$store.state.settings.global.backendUrl + 'graphs/artist-albums-graph?artist=' + selectedArtistId).then(function (results) {
        // Initialize the data structures
        this.graphData.nodes = []
        this.graphData.edges = []
        var resultsArr = results.body

        // Computed entity ids from the returned set of edges
        var albumsFromQuery = _.uniq(_.castArray(resultsArr).map(result => result.album))
        var artistFromQuery = _.castArray(resultsArr).filter(r => { return r.primary })[0].artist
        var secondaryArtistsFromQuery = _.uniq(_.castArray(resultsArr).filter(r => { return !r.primary }).map(result => result.artist))

        // Real objects from vuex store
        var albums = _.compact(_.castArray(albumsFromQuery.map(id => this.getAlbum(id))))
        var artist = this.getArtist(artistFromQuery)
        var secondaryArtists = _.compact(_.castArray(secondaryArtistsFromQuery.map(id => this.getArtist(id))))

        // Graph representations for the entities
        var newGraphData = {
          albums: albums.map(a => {
            return {
              id: a.id,
              type: 'album',
              label: a.title.split(/((?:\w+ ){3})/g).filter(Boolean).join('\n'),
              // shape: 'square',
              shape: 'image',
              image: self.getAlbumArtImgPath(a.id),
              size: 40,
              borderWidth: 1,
              font: {
                size: 16, color: '#FFF'
              },
              color: {
                border: '#000',
                background: '#666'
              },
              shapeProperties: {
                useBorderWithImage: true
              }
            }
          }),
          artist: {
            id: artist.id,
            type: 'artist',
            label: artist.name.split(/((?:\w+ ){4})/g).filter(Boolean).join('\n'),
            shape: 'dot',
            color: {
              border: '#FFF',
              background: 'purple'
            },
            size: 30,
            font: {size: 18, color: 'red'}
          },
          secondaryArtists: secondaryArtists.map(a => {
            return {
              id: a.id,
              type: 'artist',
              label: a.name.split(/((?:\w+ ){4})/g).filter(Boolean).join('\n'),
              shape: 'dot',
              color: 'red',
              size: 20,
              font: {size: 18, color: 'red'}
            }
          })
        }

        this.graphData.nodes = _.concat(this.graphData.nodes, newGraphData.artist)
        this.graphData.nodes = _.concat(this.graphData.nodes, newGraphData.secondaryArtists)
        this.graphData.nodes = _.concat(this.graphData.nodes, newGraphData.albums)

        results.body.forEach(res => {
          this.graphData.edges.push({from: res.artist, to: res.album})
        })

        callback()
      })
    },
    nowPlayingHook: function () {
      this.refreshAction()
    }
  }
}
</script>

<style lang="sass" scoped>
#artist-albums-graph
  .refresh-button
    position: absolute
    top: 10px
    right: 10px
    z-index: 5000
    display: inline
    color: #999
    &:hover
      color: #FFF
</style>
