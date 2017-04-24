<template>
  <div id="multi-graph">
    <div class="refresh-button" @click="refreshAction()">
      <icon scale="2" name="refresh"></icon>
    </div>
    <graph-canvas :graph-data="graphData" ref="graphCanvas"></graph-canvas>
  </div>
</template>

<script>
import GraphCanvas from './GraphCanvas.vue'
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { labelGetters } from '../../mixins/getters/labelGetters.js'
import { genreGetters } from '../../mixins/getters/genreGetters.js'
import { mapGetters, mapActions } from 'vuex'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/refresh'
var _ = require('lodash')

export default {
  data: function () {
    return {
      graphData: {
        graph: null,
        graphContainer: 'multi-graph',
        graphInitialized: false,
        nodes: [],
        edges: []
      }
    }
  },
  components: {
    GraphCanvas,
    Icon
  },
  mixins: [artistGetters, albumGetters, genreGetters, labelGetters],
  methods: {
    ...mapActions(['addLabelParentRelation', 'deleteLabelParentRelation']),
    refreshAction: function () {
      this.$refs.graphCanvas.tryInitGraph()
    },
    graphInitCondition: function () {
      // Needs at least one label to be displayed
      return (Object.keys(this.$store.state.data.labels).length > 0)
    },
    fetchGraphData: function (callback) {
      var self = this
      this.$http.get(this.$store.state.settings.global.backendUrl + 'graphs/multi-graph').then(function (results) {
        results = results.body
        // Initialize the data structures
        this.graphData.nodes = []
        this.graphData.edges = []

        var collectNodes = (results, entityName) => {
          var entityIds = []
          entityIds = _.concat(entityIds, _.map(_.filter(results, o => { return o.fromType === entityName }), o => o.from))
          entityIds = _.concat(entityIds, _.map(_.filter(results, o => { return o.toType === entityName }), o => o.to))
          return _.uniq(entityIds)
        }

        // Add Artist nodes
        var entityIds = collectNodes(results, 'Artist')
        entityIds.forEach(id => {
          var currentEntity = self.getArtist(id)
          var newNode = {
            id: id,
            type: 'artist',
            label: currentEntity.name,
            shape: 'dot',
            color: 'red',
            size: 20,
            font: {size: 18, color: 'red'}
          }
          self.graphData.nodes.push(newNode)
        })

        // Add Album nodes
        entityIds = collectNodes(results, 'Album')
        entityIds.forEach(id => {
          var currentEntity = self.getAlbum(id)
          var newNode = {
            id: id,
            type: 'album',
            label: currentEntity.title.split(/((?:\w+ ){3})/g).filter(Boolean).join('\n'),
            shape: 'image',
            image: self.getAlbumArtImgPath(currentEntity.id),
            color: {
              border: '#000',
              background: '#666'
            },
            size: 35,
            font: {size: 18, color: 'red'},
            shapeProperties: {
              useBorderWithImage: true
            }
          }
          self.graphData.nodes.push(newNode)
        })

        // Add Genre nodes
        entityIds = collectNodes(results, 'Genre')
        entityIds.forEach(id => {
          var currentEntity = self.getGenre(id)
          var newNode = {
            id: id,
            type: 'genre',
            label: currentEntity.title,
            shape: 'triangle',
            color: currentEntity.color,
            size: 40,
            font: {size: 20, color: currentEntity.color}
          }
          self.graphData.nodes.push(newNode)
        })

        // Add Label nodes
        entityIds = collectNodes(results, 'Label')
        entityIds.forEach(id => {
          var currentEntity = self.getLabel(id)
          var newNode = {
            id: id,
            type: 'label',
            label: currentEntity.title,
            shape: 'dot',
            color: 'green',
            size: 20,
            font: {size: 18, color: 'red'}
          }
          self.graphData.nodes.push(newNode)
        })

        // Add relationships
        results.forEach(result => {
          var edgeColor = 'red'
          var edgeWidth = 1
          if (result.relType === 'SIMILAR_TO') {
            edgeColor = 'black'
            edgeWidth = '1.5'
          }
          var edge = {
            from: result.from,
            to: result.to,
            type: result.relType,
            color: edgeColor,
            width: edgeWidth,
            arrows: {
              to: (result.relType === 'HAS_PARENT_GENRE')
            }
          }
          self.graphData.edges.push(edge)
        })
        self.graphData.nodes = _.uniqWith(self.graphData.nodes, _.isEqual)
        self.graphData.edges = _.uniqWith(self.graphData.edges, _.isEqual)
        callback()
      })
    },
    graphOptions: function () {
      return {
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
#multi-graph
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
  .refresh-button
    position: absolute
    top: 10px
    right: 10px
    z-index: 5000
    display: inline
    color: #999
    &:hover
      color: #FFF
</style>
