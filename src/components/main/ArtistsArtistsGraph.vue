<template>
  <div id="artists-artists-graph">
    <graph-canvas :graph-data="graphData"></graph-canvas>
  </div>
</template>

<script>
import GraphCanvas from './GraphCanvas.vue'
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import { mapGetters, mapActions } from 'vuex'
var _ = require('lodash')

export default {
  data: function () {
    return {
      graphData: {
        graph: null,
        graphContainer: 'artists-artists-graph',
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
    ...mapGetters(['getNowPlayingTrack']),
    ...mapActions(['addArtistRelation', 'deleteArtistRelation']),
    fetchGraphData: function (callback) {
      this.$http.get(this.$store.state.settings.global.backendUrl + 'graphs/artists-artists-graph?artist=').then(function (results) {
        // Initialize the data structures
        this.graphData.nodes = []
        this.graphData.edges = []
        var resultsArr = results.body

        // Computed entity ids from the returned set of edges
        var artistsFromQuery = _.uniq(_.castArray(resultsArr).map(result => result.artist))

        // Real objects from vuex store
        var artists = _.compact(_.castArray(artistsFromQuery.map(id => this.getArtist(id))))

        // Graph representations for the entities
        var newGraphData = {
          artists: artists.map(a => {
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

        this.graphData.nodes = _.concat(this.graphData.nodes, newGraphData.artists)

        results.body.forEach(res => {
          res.rels.forEach(rel => {
            this.graphData.edges.push({from: res.artist, to: rel})
          })
        })

        callback()
      })
    },
    graphOptions: function () {
      var self = this
      return {
        locales: {
          custom: {
            back: self.$t('components.ArtistsArtistsGraph.back'),
            edit: self.$t('components.ArtistsArtistsGraph.edit'),
            addEdge: self.$t('components.ArtistsArtistsGraph.addEdge'),
            editEdge: self.$t('components.ArtistsArtistsGraph.editEdge'),
            edgeDescription: self.$t('components.ArtistsArtistsGraph.edgeDescription'),
            editEdgeDescription: self.$t('components.ArtistsArtistsGraph.editEdgeDescription'),
            del: self.$t('components.ArtistsArtistsGraph.deleteEdge')
          }
        },
        locale: 'custom',
        manipulation: {
          enabled: true,
          initiallyActive: false,
          addNode: false,
          // TODO add db action
          editEdge: false,
          addEdge: function (data, callback) {
            // TODO? check if from==to, that relationship wouldn't make sense
            self.addArtistRelation({
              edge: data,
              callback: function (err, obj) {
                if (err) {
                  callback
                  return
                }
                callback(data)
              }
            })
          },
          deleteEdge: function (data, callback) {
            var confirm = window.confirm(self.$t('components.ArtistsArtistsGraph.deleteConfirm'))
            if (confirm) {
              var edge = self.$children[0].$data.graphDataSet.edges.get(data.edges[0])
              self.deleteArtistRelation({
                edge: edge,
                callback: function (err, obj) {
                  if (err) {
                    callback()
                    return
                  }
                  callback(data)
                }
              })
            } else {
              callback()
            }
          }
        }
      }
    },
    nowPlayingHook: function () {
      // Do nothing
    }
  }
}
</script>

<style lang="sass">
#artists-artists-graph
  height: 100%
  width: 100%
    position: absolute
    top: 0
    left: 0
  .vis-close
    position: absolute
    top: 0
    right: 0
    width: 20px
    height: 20px
    background: red
    cursor: pointer
    &:hover
      background: white
  .vis-manipulation, .vis-edit-mode
    position: absolute
    top: 0
    left: 0
    width: 170px
    .vis-none
      .vis-label
        color: #FFF
    .vis-label
      padding: 7px
      background: #666
      border-bottom: 1px solid #000
      cursor: pointer
      &:hover
        background: #777
</style>
