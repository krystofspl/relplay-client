<template>
  <div id="main-panel">    
    <keep-alive>
      <component :is="$root.state.mainPanelView"></component>
    </keep-alive>
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

.component-fade-enter-active, .component-fade-leave-active 
  transition: opacity .2s ease

.component-fade-enter, .component-fade-leave-active 
  opacity: 0
</style>
