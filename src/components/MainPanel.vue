<template>
  <div id="main-panel">
    <transition name="component-fade" mode="out-in">
      <keep-alive>
          <component :is="this.$store.state.view.mainPanelView"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import AlbumArts from './main/AlbumArts.vue'
import ArtistsArtistsGraph from './main/ArtistsArtistsGraph.vue'
import GenresArtistsGraph from './main/GenresArtistsGraph.vue'

export default {
  components: {
    AlbumArts,
    ArtistsArtistsGraph,
    GenresArtistsGraph
  }
}
</script>

<style lang="sass" scoped>
#main-panel
  height: calc(100% - 130px)
  width: calc(100% - 300px)
  background: green
  position: fixed
  top: 50px
  left: 0
</style>
