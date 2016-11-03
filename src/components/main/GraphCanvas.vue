<template>
  <div class="graph-canvas">
    <div v-on:click="resizeGraph()">{{ graphData.graphContainer }}
    {{ graphData.graphInitialized }}</div>
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
      var nodes = new vis.DataSet(this.graphData.nodes)
      var edges = new vis.DataSet(this.graphData.edges)
      var container = document.getElementById(this.graphData.graphContainer).getElementsByClassName('graph')[0]
      var data = {
        nodes: nodes,
        edges: edges
      }
      var options = {
        autoResize: true
      }
      this.$set(this.graphData, 'graph', new vis.Network(container, data, options))
    },
    resizeGraph: function () {
      var graphContainer = document.getElementById(this.graphData.graphContainer).getElementsByClassName('graph')[0]
      var mainPanel = document.getElementById('main-panel')
      graphContainer.style.height = mainPanel.clientHeight + 'px'
      graphContainer.style.width = mainPanel.clientWidth + 'px'
      this.graphData.graph.redraw()
      this.graphData.graph.fit()
    },
    fetchGraphData: function () {
      /*
      this.$http.get('/api/events').success(function(theseEvents) {
      this.$data.events = theseEvents; // You don't need to use $set here

      }).error(function(error) {

      });
      */
    }
  },
  mounted: function () {
    if (!this.graphData.graphInitialized) { this.initGraph() }
    var Vue = require('vue')
    Vue.nextTick(this.resizeGraph)
  }
}
</script>

<style lang="sass" scoped>
#graph-canvas
#graph
  width: 400px
  height: 400px
</style>
