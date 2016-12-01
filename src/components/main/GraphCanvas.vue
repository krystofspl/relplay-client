<template>
  <div class="graph-canvas">
    <div v-if="loading">
      <icon name="spinner" spin scale="3"></icon>
    </div>
    <div class="graph"></div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/spinner'

export default {
  name: 'GraphCanvas',
  data: function () {
    return {
      loading: true,
      graphDataSet: {}
    }
  },
  props: ['graph-data'],
  components: {
    Icon
  },
  methods: {
    initGraph: function () {
      this.$set(this.graphData, 'graphInitialized', true)
      var vis = require('vis')
      var self = this

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
          autoResize: true
        }
        self.$set(self.graphData, 'graph', new vis.Network(container, data, options))
        self.loading = false
      })
    },
    resizeGraph: function () {
      var graphContainer = document.getElementById(this.graphData.graphContainer).getElementsByClassName('graph')[0]
      var mainPanel = document.getElementById('main-panel')
      graphContainer.style.height = mainPanel.clientHeight + 'px'
      graphContainer.style.width = mainPanel.clientWidth + 'px'
      if (this.graphData.graph) {
        this.graphData.graph.redraw()
        this.graphData.graph.fit()
      }
    },
    updateGraphData: function () {
      var self = this
      this.$parent.fetchGraphData(function () {
        // TODO doesnt work well
        self.graphDataSet.nodes.clear()
        self.graphDataSet.edges.clear()
        self.graphDataSet.nodes.add(self.graphData.nodes)
        self.graphDataSet.edges.add(self.graphData.edges)
      })
    }
  },
  computed: {
    nowPlayingId: function () {
      return this.$store.getters.getNowPlayingId
    }
  },
  created: function () {
    if (!this.graphData.graphInitialized) { this.initGraph() }
    var Vue = require('vue')
    Vue.nextTick(this.resizeGraph)
  },
  watch: {
    nowPlayingId: function () {
      this.updateGraphData()
    }
  }
}
</script>

<style lang="sass" scoped>
#graph-canvas
#graph
  width: 400px
  height: 400px
</style>
