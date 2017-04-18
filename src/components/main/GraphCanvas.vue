<template>
  <div class="graph-canvas">
    <div v-if="loading" style="width: 100%; text-align: center">
      <icon name="spinner" spin scale="3"></icon>
    </div>

    <div v-if="graphInitErr" style="width: 100%; text-align: center; margin: 10px">
      {{ $t('components.Graph.noData') }}
    </div>
    <div v-else class="graph"></div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/spinner'
var deepMerge = require('deepmerge')

export default {
  name: 'GraphCanvas',
  data: function () {
    return {
      graphInitErr: false,
      loading: false,
      graphDataSet: {
        nodes: {},
        edges: {}
      }
    }
  },
  props: ['graph-data'],
  components: {
    Icon
  },
  methods: {
    tryInitGraph: function () {
      if (this.$parent.graphInitCondition()) {
        this.graphInitErr = false
        this.initGraph(() => {
          require('vue').nextTick(this.resizeGraph)
        })
      } else {
        this.graphInitErr = true
      }
    },
    initGraph: function (callback) {
      console.log('Initializing graph')
      // this.$set(this.graphData, 'graphInitialized', true)
      var vis = require('vis')
      var self = this

      // self.loading = true
      this.$parent.fetchGraphData(function () {
        var nodes = new vis.DataSet(self.graphData.nodes)
        var edges = new vis.DataSet(self.graphData.edges)
        self.$set(self, 'graphDataSet', { nodes: nodes, edges: edges })
        var container = document.getElementById(self.graphData.graphContainer).getElementsByClassName('graph')[0]
        var data = {
          nodes: nodes,
          edges: edges
        }
        var options = {
          autoResize: true,
          layout: {
            improvedLayout: true
          },
          edges: {
            smooth: true
          },
          physics: {
            enabled: true,
            /* barnesHut: {
              centralGravity: 1,
              springLength: 100,
              springConstant: 0.01,
              damping: 0.5,
              avoidOverlap: 1
            }, */
            repulsion: {
              nodeDistance: 150,
              centralGravity: 0.5,
              springLength: 120,
              springConstant: 0.05,
              damping: 0.05
            },
            solver: 'repulsion',
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
        if (typeof self.$parent.graphOptions === 'function') {
          options = deepMerge(options, self.$parent.graphOptions())
        }
        var network = new vis.Network(container, data, options)
        network.on('doubleClick', function (params) {
          var node = self.graphDataSet.nodes.get(params.nodes[0])
          switch (node.type) {
            case 'artist':
              self.$store.state.view.components.ArtistsAlbumDetails.selectedArtist = node.id
              self.$store.state.view.mainPanelView = 'ArtistsAlbumDetails'
              break
            case 'album':
              break
            default:
              break
          }
        })
        network.once('stabilizationIterationsDone', function () {
          // TODO behaves weird with multiple graphs
          // self.loading = false
        })
        self.$set(self.graphData, 'graph', network)
        if (typeof callback !== 'undefined') {
          callback()
        }
      })
    },
    resizeGraph: function () {
      var graphContainer = document.getElementById(this.graphData.graphContainer).getElementsByClassName('graph')[0]
      graphContainer.style.height = document.body.scrollHeight - 130 + 'px'
      if (this.graphData.graph) {
        this.graphData.graph.redraw()
        this.graphData.graph.fit()
      }
    },
    updateGraphData: function () {
      // TODO not in use currently, initializng every time instead, fix
      /* var self = this
      this.$parent.fetchGraphData(function () {
        console.log(self.graphData.edges)
        self.graphDataSet.nodes.clear()
        self.graphDataSet.edges.clear()
        self.graphDataSet.nodes.add(self.graphData.edges)
        self.graphDataSet.nodes.add(self.graphData.nodes)
      }) */
    }
  },
  computed: {
    nowPlayingId: function () {
      return this.$store.getters.getNowPlayingId
    }
  },
  created: function () {
    // if (!this.graphInitialized) this.initGraph()
    var self = this
    self.tryInitGraph()
    var poll = setInterval(function () {
      if (this.graphInitErr) {
        self.tryInitGraph()
      } else {
        clearInterval(poll)
      }
    }.bind(this), 1000)
  },
  watch: {
    nowPlayingId: function () {
      // TODO find out why updateGraphData() doesnt work and fix it
      this.$parent.nowPlayingHook()
    }
  }
}
</script>

<style lang="sass" scoped>
#graph-canvas
  height: 100%
#graph
  width: 100%
  height: 100%
</style>
