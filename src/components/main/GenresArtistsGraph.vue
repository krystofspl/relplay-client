<template>
  <div id="genres-artists-graph">
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
        graphContainer: 'genres-artists-graph',
        graphInitialized: false,
        nodes: [
          {id: 1, label: 'Node 1'},
          {id: 2, label: 'Node 2'},
          {id: 3, label: 'Node 3'},
          {id: 4, label: 'Node 4'},
          {id: 5, label: 'Node 5'}
        ],
        edges: [
          {from: 1, to: 3},
          {from: 1, to: 2},
          {from: 2, to: 4},
          {from: 2, to: 5}
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
