<template>
  <div id="genres-albums-graph">
    <graph-canvas :graph-data="graphData"></graph-canvas>
    <!-- <graph-canvas :graph-data="graphData" v-if="graphData.nodes.length"></graph-canvas>
    <div v-else style="width: 100%; text-align: center; margin: 10px">
      {{ $t('components.Graph.noData') }}
    </div> -->
  </div>
</template>

<script>
import GraphCanvas from './GraphCanvas.vue'
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import { genreGetters } from '../../mixins/getters/genreGetters.js'
import { mapGetters, mapActions } from 'vuex'
var _ = require('lodash')

export default {
  data: function () {
    return {
      graphData: {
        graph: null,
        graphContainer: 'genres-albums-graph',
        graphInitialized: false,
        nodes: [],
        edges: []
      }
    }
  },
  components: {
    GraphCanvas
  },
  mixins: [artistGetters, albumGetters, genreGetters, trackGetters],
  methods: {
    ...mapGetters(['getNowPlayingTrack']),
    ...mapActions(['addArtistRelation', 'deleteArtistRelation']),
    fetchGraphData: function (callback) {
      var self = this
      this.$http.get(this.$store.state.settings.global.backendUrl + 'graphs/genres-albums-graph').then(function (results) {
        // Initialize the data structures
        this.graphData.nodes = []
        this.graphData.edges = []
        var resultsArr = results.body

        // Computed entity ids from the returned set of edges
        var genresFromQuery = _.uniq(_.castArray(resultsArr).map(result => result.genre))
        var albumsFromQuery = _.uniq(_.flatten(_.castArray(resultsArr).map(result => result.rels)))
        // Real objects from vuex store
        var genres = _.compact(_.castArray(genresFromQuery.map(id => this.getGenre(id))))
        var albums = _.compact(_.castArray(albumsFromQuery.map(id => this.getAlbum(id))))
        // Graph representations for the entities
        var newGraphData = {
          genres: genres.map(g => {
            return {
              id: g.id,
              type: 'genre',
              label: g.title,
              shape: 'dot',
              color: g.color,
              size: 20,
              font: {size: 18, color: 'red'}
            }
          }),
          albums: albums.map(a => {
            return {
              id: a.id,
              type: 'album',
              label: a.title.split(/((?:\w+ ){3})/g).filter(Boolean).join('\n'),
              // shape: 'square',
              shape: 'image',
              image: self.getAlbumArtImgPath(a.id),
              size: 30,
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
          })
        }

        this.graphData.nodes = _.concat(this.graphData.nodes, newGraphData.genres)
        this.graphData.nodes = _.concat(this.graphData.nodes, newGraphData.albums)

        results.body.forEach(res => {
          if (res.parentGenre) {
            this.graphData.edges.push({from: res.genre, to: res.parentGenre})
          }
          res.rels.forEach(rel => {
            this.graphData.edges.push({from: res.genre, to: rel})
          })
        })

        callback()
      })
    },
    graphOptions: function () {
      return {}
    },
    nowPlayingHook: function () {
      // Do nothing
    }
  }
}
</script>

<style lang="sass">
#genres-albums-graph
  height: 100%
  width: 100%
  position: absolute
  top: 0
  left: 0
</style>
