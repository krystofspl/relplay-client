<template>
  <div id="albums-albums-graph">
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
        graphContainer: 'albums-albums-graph',
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
    ...mapActions(['addAlbumRelation', 'deleteAlbumRelation']),
    fetchGraphData: function (callback) {
      var self = this
      this.$http.get(this.$store.state.settings.global.backendUrl + 'graphs/albums-albums-graph').then(function (results) {
        // Initialize the data structures
        this.graphData.nodes = []
        this.graphData.edges = []
        var resultsArr = results.body

        // Computed entity ids from the returned set of edges
        var albumsFromQuery = _.uniq(_.castArray(resultsArr).map(result => result.album))

        // Real objects from vuex store
        var albums = _.compact(_.castArray(albumsFromQuery.map(id => this.getAlbum(id))))

        // Graph representations for the entities
        var newGraphData = {
          albums: albums.map(a => {
            return {
              id: a.id,
              type: 'album',
              label: a.title.split(/((?:\w+ ){4})/g).filter(Boolean).join('\n'),
              shape: 'image',
              image: self.getAlbumArtImgPath(a.id),
              size: 40,
              borderWidth: 1,
              font: {
                size: 16, color: '#FFF'
              },
              color: {
                border: 'orange',
                background: '#666'
              },
              shapeProperties: {
                useBorderWithImage: true
              }
            }
          })
        }

        this.graphData.nodes = _.concat(this.graphData.nodes, newGraphData.albums)

        results.body.forEach(res => {
          res.rels.forEach(rel => {
            this.graphData.edges.push({from: res.album, to: rel, color: 'orange'})
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
            back: self.$t('components.AlbumsAlbumsGraph.back'),
            edit: self.$t('components.AlbumsAlbumsGraph.edit'),
            addEdge: self.$t('components.AlbumsAlbumsGraph.addEdge'),
            editEdge: self.$t('components.AlbumsAlbumsGraph.editEdge'),
            edgeDescription: self.$t('components.AlbumsAlbumsGraph.edgeDescription'),
            editEdgeDescription: self.$t('components.AlbumsAlbumsGraph.editEdgeDescription'),
            del: self.$t('components.AlbumsAlbumsGraph.deleteEdge')
          }
        },
        locale: 'custom',
        manipulation: {
          enabled: true,
          initiallyActive: false,
          addNode: false,
          editEdge: false,
          addEdge: function (data, callback) {
            // TODO? check if from==to, that relationship wouldn't make sense
            // Persist in DB
            self.addAlbumRelation({
              start: data.from,
              end: data.to,
              callback: function (err, obj) {
                if (err) {
                  callback()
                  return
                }
                callback(data)
              }
            })
          },
          deleteEdge: function (data, callback) {
            var confirm = window.confirm(self.$t('components.AlbumsAlbumsGraph.deleteConfirm'))
            if (confirm) {
              // Persist in DB
              var edge = self.$children[0].$data.graphDataSet.edges.get(data.edges[0])
              self.deleteAlbumRelation({
                start: edge.from,
                end: edge.to,
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
        },
        physics: {
          barnesHut: {
            centralGravity: 0.3,
            springLength: 20,
            springConstant: 0.01,
            damping: 0.1,
            avoidOverlap: 1
          },
          maxVelocity: 30,
          minVelocity: 5,
          timestep: 0.88,
          adaptiveTimestep: true,
          stabilization: {
            enabled: true,
            iterations: 5,
            updateInterval: 1
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
#albums-albums-graph
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
