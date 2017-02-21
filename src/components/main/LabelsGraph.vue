<template>
  <div id="labels-graph">
    <graph-canvas :graph-data="graphData" ref="graphCanvas"></graph-canvas>
  </div>
</template>

<script>
import GraphCanvas from './GraphCanvas.vue'
import { labelGetters } from '../../mixins/getters/labelGetters.js'
import { mapGetters, mapActions } from 'vuex'
var _ = require('lodash')

export default {
  data: function () {
    return {
      graphData: {
        graph: null,
        graphContainer: 'labels-graph',
        graphInitialized: false,
        nodes: [],
        edges: []
      }
    }
  },
  components: {
    GraphCanvas
  },
  mixins: [labelGetters],
  methods: {
    ...mapActions(['addLabelParentRelation', 'deleteLabelParentRelation']),
    graphInitCondition: function () {
      // Needs at least one label to be displayed
      return (Object.keys(this.$store.state.data.labels).length > 0)
    },
    fetchGraphData: function (callback) {
      var self = this
      this.$http.get(this.$store.state.settings.global.backendUrl + 'graphs/labels-graph').then(function (results) {
        // Initialize the data structures
        this.graphData.nodes = []
        this.graphData.edges = []

        // Real objects from vuex store
        var labels = Object.values(self.getLabels)
        // Graph representations for the entities
        var newGraphData = {
          labels: labels.map(l => {
            return {
              id: l.id,
              type: 'label',
              label: l.title,
              shape: 'dot',
              color: 'red',
              size: 20,
              font: {size: 18, color: 'red'}
            }
          })
        }

        this.graphData.nodes = _.concat(this.graphData.nodes, newGraphData.labels)

        results.body.forEach(res => {
          this.graphData.edges.push({from: res.from, to: res.to})
        })

        callback()
      })
    },
    graphOptions: function () {
      var self = this
      return {
        locales: {
          custom: {
            back: self.$t('components.LabelsGraph.back'),
            edit: self.$t('components.LabelsGraph.edit'),
            addEdge: self.$t('components.LabelsGraph.addEdge'),
            editEdge: self.$t('components.LabelsGraph.editEdge'),
            edgeDescription: self.$t('components.LabelsGraph.edgeDescription'),
            editEdgeDescription: self.$t('components.LabelsGraph.editEdgeDescription'),
            del: self.$t('components.LabelsGraph.deleteEdge')
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
            self.addLabelParentRelation({
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
            var confirm = window.confirm(self.$t('components.ArtistsArtistsGraph.deleteConfirm'))
            if (confirm) {
              // Persist in DB
              var edge = self.$refs.graphCanvas.$data.graphDataSet.edges.get(data.edges[0])
              self.deleteLabelParentRelation({
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
        }
      }
    },
    nowPlayingHook: function () {
      // Do nothing
    }
  },
  computed: {
    ...mapGetters(['getLabels'])
  }
}
</script>

<style lang="sass">
#labels-graph
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
