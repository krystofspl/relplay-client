<template>
  <div id="artists-artists-graph">
    <graph-canvas :graph-data="graphData"></graph-canvas>
  </div>
</template>

<script>
import GraphCanvas from './GraphCanvas.vue'
export default {
  data: function () {
    return {
      graphData: {
        graph: null,
        graphContainer: 'artists-artists-graph',
        graphInitialized: false,
        nodes: [
          {id: 1, label: 'Node 1'},
          {id: 2, label: 'Node 2'},
          {id: 3, label: 'Node 3'}
        ],
        edges: [
          {from: 1, to: 3},
          {from: 1, to: 2}
        ]
      }
    }
  },
  components: {
    GraphCanvas
  }
}
</script>

<style lang="sass" scoped>

</style>
