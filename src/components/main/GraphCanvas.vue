<template>
  <div class="graph-canvas">
    <div class="graph" v-once></div>
  </div>
</template>

<script>
export default {
  name: 'GraphCanvas',
  props: ['graph-data'],
  methods: {
    initGraph: function () {
      this.$set(this.graphData, 'graphInitialized', true)
      var vis = require('vis')
      var self = this
      this.$parent.fetchGraphData(function () {
        var nodes = new vis.DataSet(self.graphData.nodes)
        var edges = new vis.DataSet(self.graphData.edges)
        var container = document.getElementById(self.graphData.graphContainer).getElementsByClassName('graph')[0]
        var data = {
          nodes: nodes,
          edges: edges
        }
        var options = {
          autoResize: true
        }
        self.$set(self.graphData, 'graph', new vis.Network(container, data, options))
      })
    },
    resizeGraph: function () {
      var graphContainer = document.getElementById(this.graphData.graphContainer).getElementsByClassName('graph')[0]
      var mainPanel = document.getElementById('main-panel')
      graphContainer.style.height = mainPanel.clientHeight + 'px'
      graphContainer.style.width = mainPanel.clientWidth + 'px'
      this.graphData.graph.redraw()
      this.graphData.graph.fit()
    }
  },
  computed: {
    nowPlayingId: function () {
      return this.$store.getters.getNowPlayingTrack
    }
  },
  mounted: function () {
    if (!this.graphData.graphInitialized) { this.initGraph() }
    var Vue = require('vue')
    Vue.nextTick(this.resizeGraph)
  },
  watch: {
    nowPlayingId: function () {
      var vis = require('vis')
      var self = this
      this.$parent.fetchGraphData(function () {
        var nodes = new vis.DataSet(self.graphData.nodes)
        var edges = new vis.DataSet(self.graphData.edges)
        var data = {
          nodes: nodes,
          edges: edges
        }
        self.graphData.graph.setData(data)
      })
      this.resizeGraph()
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
